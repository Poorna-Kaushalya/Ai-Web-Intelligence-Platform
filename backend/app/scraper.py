import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse


def normalize_url(url: str) -> str:
    url = url.strip()
    if not url:
        raise ValueError("URL cannot be empty.")
    if not urlparse(url).scheme:
        url = "https://" + url
    return url


def make_absolute(base_url: str, href: str) -> str:
    if href.startswith("//"):
        href = "https:" + href
    return urljoin(base_url, href)


def extract_emails(text: str) -> list[str]:
    return sorted(set(re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)))


def extract_phones(text: str) -> list[str]:
    raw = re.findall(r"\+?\d[\d\s\-().]{6,}\d", text)
    cleaned = [re.sub(r"[^0-9+]+", "", phone) for phone in raw]
    return sorted(set(phone for phone in cleaned if len(re.sub(r"[^0-9]+", "", phone)) >= 7))


def extract_social_links(anchors: list[BeautifulSoup]) -> list[str]:
    socials = []
    social_domains = ["twitter.com", "linkedin.com", "facebook.com", "instagram.com", "youtube.com", "t.me", "github.com"]
    seen = set()
    for anchor in anchors:
        href = anchor.get("href", "").strip()
        if not href:
            continue
        full_href = make_absolute("https://example.com", href)
        for domain in social_domains:
            if domain in full_href and full_href not in seen:
                seen.add(full_href)
                socials.append(full_href)
                break
    return socials


def scrape(url: str):
    url = normalize_url(url)
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers, timeout=15)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    title = soup.title.string.strip() if soup.title and soup.title.string else "No title"

    description_meta = (
        soup.find("meta", attrs={"name": "description"})
        or soup.find("meta", attrs={"property": "og:description"})
    )
    description = description_meta.get("content", "").strip() if description_meta else ""

    keywords_meta = soup.find("meta", attrs={"name": "keywords"})
    keywords = keywords_meta.get("content", "").strip() if keywords_meta else ""

    paragraphs = [p.get_text(strip=True) for p in soup.find_all("p") if p.get_text(strip=True)]

    images = []
    seen_images = set()
    for image in soup.find_all("img", src=True):
        src = image["src"].strip()
        if not src:
            continue
        full_src = make_absolute(url, src)
        if full_src in seen_images:
            continue
        seen_images.add(full_src)
        images.append(full_src)
        if len(images) >= 12:
            break

    body_text = soup.get_text(separator=" ", strip=True)
    emails = extract_emails(body_text)
    phones = extract_phones(body_text)

    anchors = soup.find_all("a", href=True)
    socials = extract_social_links(anchors)

    links = []
    seen_links = set()
    for anchor in anchors:
        href = anchor["href"].strip()
        if not href:
            continue
        full_href = make_absolute(url, href)
        parsed = urlparse(full_href)
        if parsed.scheme not in {"http", "https"}:
            continue
        if full_href in seen_links:
            continue
        seen_links.add(full_href)
        links.append({
            "href": full_href,
            "text": anchor.get_text(strip=True) or full_href,
        })
        if len(links) >= 30:
            break

    return {
        "url": url,
        "title": title,
        "description": description,
        "paragraphs": paragraphs[:10],
        "images": images,
        "emails": emails,
        "phones": phones,
        "socials": socials,
        "links": links,
        "metadata": {
            "title": title,
            "description": description,
            "keywords": keywords,
        },
    }
