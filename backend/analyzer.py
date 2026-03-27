"""Mock AI analyzer for UX audit reports (No API Key required)."""

import asyncio
from models import WebsiteContent, AuditReport, AuditIssue, ImprovedVersion


async def analyze_with_claude(content: WebsiteContent) -> AuditReport:
    """
    Simulate AI analysis by returning a structured mock UX audit report.
    This avoids the need for an Anthropic API key during local testing.
    """
    
    print("🤖 Simulating Claude analysis (Mock Mode)...")
    
    # Simulate processing delay to feel like a real AI tool
    await asyncio.sleep(3)
    
    has_headlines = len(content.headlines) > 0
    has_ctas = len(content.cta_buttons) > 0
    
    issues = [
        AuditIssue(
            category="Clarity",
            problem="The main value proposition is buried too far down the page.",
            impact="Visitors might leave before understanding what your product does.",
            fix="Move the core value proposition above the fold and make it the primary H1."
        ),
        AuditIssue(
            category="CTA",
            problem="Primary call-to-action is not visually distinct from other buttons.",
            impact="Users are confused about the primary action they should take.",
            fix="Change the primary CTA color to a highly contrasting accent color."
        ),
        AuditIssue(
            category="Trust",
            problem="Missing social proof and customer testimonials.",
            impact="New users have no reason to trust your service over competitors.",
            fix="Add a 'Trusted by' logo strip and at least 3 customer reviews right below the hero section."
        ),
        AuditIssue(
            category="Readability",
            problem="Paragraphs are too dense without enough whitespace.",
            impact="Users will skim or skip important text blocks.",
            fix="Break long paragraphs into 2-3 shorter sentences. Use bullet points where appropriate."
        )
    ]
    
    if not has_headlines:
        issues.append(
            AuditIssue(
                category="SEO",
                problem="No heading tags found on the page.",
                impact="Search engines cannot understand the page structure, hurting SEO.",
                fix="Implement proper H1-H6 tags with clear, keyword-rich headings."
            )
        )
        
    if not has_ctas:
        issues.append(
            AuditIssue(
                category="Conversion",
                problem="No clear Call to Action (CTA) buttons found.",
                impact="Users don't know what to do next, resulting in a 0% conversion rate.",
                fix="Add a clear, action-oriented CTA button like 'Get Started' or 'Buy Now'."
            )
        )
        
    improved_version = ImprovedVersion(
        headline=f"Unlock Better Conversions for {content.title or 'Your Website'} Instantly",
        subheadline="Stop losing customers to confusing copy. Get a crystal-clear, high-converting layout.",
        cta="Start Free Trial",
        sections=[
            "Hero Section: Clear H1 + Subheader + Email Input",
            "Social Proof: 'Trusted by over 10,000 teams'",
            "Features: 3-column grid focusing on benefits, not just features"
        ]
    )

    return AuditReport(
        overall_score=68,
        summary=f"The website '{content.url}' has a good foundation but lacks clear visual hierarchy and distinct CTAs. Improving the copy clarity and adding social proof could significantly boost conversion rates.",
        issues=issues,
        improved_version=improved_version,
    )
