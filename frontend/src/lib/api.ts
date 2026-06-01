import axios from "axios";

export interface ScrapeResponse {
  url: string;
  title: string;
  description: string;
  images: string[];
  links: {
    href: string;
    text: string;
  }[];
  emails: string[];
  phones: string[];
  socials: string[];
  metadata: Record<string, string>;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 15000,
});

export async function fetchScrape(query: string): Promise<ScrapeResponse> {
  const response = await api.get("/scrape", {
    params: {
      url: query,
    },
  });

  return response.data as ScrapeResponse;
}
