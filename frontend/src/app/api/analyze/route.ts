import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ detail: "URL is required" }, { status: 400 });
    }

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Determine some fake issues based on url length to add some uniqueness
    const issues = [
      {
        category: "Clarity",
        problem: "The main value proposition is buried too far down the page.",
        impact: "Visitors might leave before understanding what your product does.",
        fix: "Move the core value proposition above the fold and make it the primary H1."
      },
      {
        category: "CTA",
        problem: "Primary call-to-action is not visually distinct from other buttons.",
        impact: "Users are confused about the primary action they should take.",
        fix: "Change the primary CTA color to a highly contrasting accent color."
      },
      {
        category: "Trust",
        problem: "Missing social proof and customer testimonials.",
        impact: "New users have no reason to trust your service over competitors.",
        fix: "Add a 'Trusted by' logo strip and at least 3 customer reviews right below the hero section."
      },
      {
        category: "Readability",
        problem: "Paragraphs are too dense without enough whitespace.",
        impact: "Users will skim or skip important text blocks.",
        fix: "Break long paragraphs into 2-3 shorter sentences. Use bullet points where appropriate."
      }
    ];

    if (url.includes("https")) {
      issues.push({
        category: "SEO",
        problem: "No heading tags found on the page.",
        impact: "Search engines cannot understand the page structure, hurting SEO.",
        fix: "Implement proper H1-H6 tags with clear, keyword-rich headings."
      });
    }

    const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;

    return NextResponse.json({
      overall_score: 68,
      summary: `The website '${domain}' has a good foundation but lacks clear visual hierarchy and distinct CTAs. Improving the copy clarity and adding social proof could significantly boost conversion rates.`,
      issues,
      improved_version: {
        headline: `Unlock Better Conversions for ${domain} Instantly`,
        subheadline: "Stop losing customers to confusing copy. Get a crystal-clear, high-converting layout.",
        cta: "Start Free Trial",
        sections: [
          "Hero Section: Clear H1 + Subheader + Email Input",
          "Social Proof: 'Trusted by over 10,000 teams'",
          "Features: 3-column grid focusing on benefits, not just features"
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
