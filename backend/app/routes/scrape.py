from fastapi import APIRouter, HTTPException, Query
from requests import RequestException

from ..scraper import scrape

router = APIRouter()


@router.get("/scrape")
def scrape_api(url: str = Query(..., description="The website URL to scrape")):
    try:
        return scrape(url)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))
    except RequestException as error:
        raise HTTPException(status_code=502, detail=f"Unable to fetch site: {error}")
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Scrape failed: {error}")
