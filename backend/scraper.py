"""Website scraping service using Playwright + BeautifulSoup."""

import asyncio
import re
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
from models import WebsiteContent


async def scrape_website(url: str) -> WebsiteContent:
    """
    Scrape a website using Playwright (headless Chromium) and extract
    structured content using BeautifulSoup.
    """
    html_content = ""

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1920, "height": 1080},
        )
        page = await context.new_page()

        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            # Wait a bit for dynamic content to load
            await page.wait_for_timeout(3000)
            html_content = await page.content()
        except Exception as e:
            raise RuntimeError(f"Failed to load website: {str(e)}")
        finally:
            await browser.close()

    return extract_content(url, html_content)


def extract_content(url: str, html: str) -> WebsiteContent:
    """Parse HTML and extract structured content."""
    soup = BeautifulSoup(html, "lxml")

    # Remove script, style, and other non-visible elements
    for tag in soup(["script", "style", "noscript", "iframe", "svg"]):
        tag.decompose()

    # Title
    title = ""
    title_tag = soup.find("title")
    if title_tag:
        title = title_tag.get_text(strip=True)

    # Meta description
    meta_desc = ""
    meta_tag = soup.find("meta", attrs={"name": "description"})
    if meta_tag:
        meta_desc = meta_tag.get("content", "")

    # Headlines (h1-h6)
    headlines = []
    for level in range(1, 7):
        for h in soup.find_all(f"h{level}"):
            text = h.get_text(strip=True)
            if text and len(text) > 2:
                headlines.append(f"H{level}: {text}")

    # Paragraphs
    paragraphs = []
    for p in soup.find_all("p"):
        text = p.get_text(strip=True)
        if text and len(text) > 10:
            paragraphs.append(text)

    # CTA buttons and links styled as buttons
    cta_buttons = []
    # Actual <button> elements
    for btn in soup.find_all("button"):
        text = btn.get_text(strip=True)
        if text and len(text) > 1:
            cta_buttons.append(text)
    # Links with button-like classes
    for a in soup.find_all("a"):
        classes = " ".join(a.get("class", []))
        text = a.get_text(strip=True)
        if text and any(kw in classes.lower() for kw in ["btn", "button", "cta"]):
            cta_buttons.append(text)

    # Images
    images = []
    for img in soup.find_all("img"):
        src = img.get("src", "")
        alt = img.get("alt", "")
        if src:
            images.append({"src": src, "alt": alt})

    # All visible links
    links = []
    for a in soup.find_all("a", href=True):
        text = a.get_text(strip=True)
        href = a["href"]
        if text and href and not href.startswith("#") and not href.startswith("javascript"):
            links.append(f"{text} -> {href}")

    # Raw visible text (truncated for token efficiency)
    raw_text = soup.get_text(separator="\n", strip=True)
    # Clean up excessive whitespace
    raw_text = re.sub(r"\n{3,}", "\n\n", raw_text)
    # Limit to ~4000 characters for token efficiency
    raw_text = raw_text[:4000]

    return WebsiteContent(
        url=url,
        title=title,
        meta_description=meta_desc,
        headlines=headlines[:30],
        paragraphs=paragraphs[:20],
        cta_buttons=cta_buttons[:15],
        images=images[:20],
        links=links[:30],
        raw_text=raw_text,
    )
