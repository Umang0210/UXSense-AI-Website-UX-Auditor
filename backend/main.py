"""UXSense AI – Backend API Server."""

import os
import re
import traceback
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import AnalyzeRequest, AuditReport
from scraper import scrape_website
from analyzer import analyze_with_claude

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print("🚀 UXSense AI Backend starting up...")
    yield
    print("👋 UXSense AI Backend shutting down...")


app = FastAPI(
    title="UXSense AI – Website UX Auditor",
    description="Analyze any website URL and get a structured UX audit report.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def validate_url(url: str) -> str:
    """Validate and normalize the input URL."""
    url = url.strip()

    # Add scheme if missing
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    # Basic URL pattern check
    pattern = re.compile(
        r"^https?://"
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"
        r"localhost|"
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
        r"(?::\d+)?"
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )

    if not pattern.match(url):
        raise ValueError(f"Invalid URL: {url}")

    return url


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "UXSense AI Backend"}


@app.post("/analyze", response_model=AuditReport)
async def analyze_website(request: AnalyzeRequest):
    """
    Analyze a website URL and return a structured UX audit report.

    Steps:
    1. Validate the URL
    2. Scrape the website content
    3. Analyze with Claude AI
    4. Return structured audit report
    """
    # Step 1: Validate URL
    try:
        validated_url = validate_url(request.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Step 2: Scrape the website
    try:
        print(f"📡 Scraping: {validated_url}")
        website_content = await scrape_website(validated_url)
        print(f"✅ Scraped successfully. Found {len(website_content.headlines)} headlines, "
              f"{len(website_content.paragraphs)} paragraphs, "
              f"{len(website_content.cta_buttons)} CTAs")
    except Exception as e:
        print(f"❌ Scraping error: {traceback.format_exc()}")
        raise HTTPException(
            status_code=502,
            detail=f"Failed to scrape website: {str(e)}"
        )

    # Step 3: Analyze with Claude
    try:
        print(f"🤖 Sending to Claude for analysis...")
        report = await analyze_with_claude(website_content)
        print(f"✅ Analysis complete. Score: {report.overall_score}/100")
    except RuntimeError as e:
        print(f"❌ Analysis error: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    except Exception as e:
        print(f"❌ Unexpected error: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

    return report


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
