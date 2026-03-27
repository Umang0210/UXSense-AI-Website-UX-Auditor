"""Pydantic models for the UXSense AI API."""

from pydantic import BaseModel, HttpUrl
from typing import Optional


class AnalyzeRequest(BaseModel):
    """Request model for the /analyze endpoint."""
    url: str


class WebsiteContent(BaseModel):
    """Structured content extracted from a website."""
    url: str
    title: str = ""
    meta_description: str = ""
    headlines: list[str] = []
    paragraphs: list[str] = []
    cta_buttons: list[str] = []
    images: list[dict] = []  # [{"src": "...", "alt": "..."}]
    links: list[str] = []
    raw_text: str = ""


class AuditIssue(BaseModel):
    """A single UX audit issue."""
    category: str  # Clarity / CTA / Layout / Trust / SEO
    problem: str
    impact: str
    fix: str


class ImprovedVersion(BaseModel):
    """AI-suggested improved version of the website copy."""
    headline: str = ""
    subheadline: str = ""
    cta: str = ""
    sections: list[str] = []


class AuditReport(BaseModel):
    """Complete UX audit report returned by Claude."""
    overall_score: int = 0
    summary: str = ""
    issues: list[AuditIssue] = []
    improved_version: Optional[ImprovedVersion] = None
