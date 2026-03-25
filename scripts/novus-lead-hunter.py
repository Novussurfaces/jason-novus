#!/usr/bin/env python3
"""
NOVUS LEAD HUNTER — Autonomous B2B Lead Scraper
Searches DuckDuckGo for Quebec businesses, scrapes their websites for emails,
and outputs blast-ready CSV. Zero paid APIs.

Usage:
    python novus-lead-hunter.py                    # Run all sectors
    python novus-lead-hunter.py --sector gyms      # Run specific sector
    python novus-lead-hunter.py --city Sherbrooke   # Run specific city
"""

import re
import csv
import os
import sys
import time
import argparse
import urllib.request
import urllib.parse
import json
from html.parser import HTMLParser
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
OUTPUT_CSV = os.path.join(PROJECT_DIR, "NOVUS-HUNTED-LEADS.csv")
EXISTING_EMAILS_CSV = os.path.join(SCRIPT_DIR, "email-log.csv")

# ─── SEARCH CONFIG ──────────────────────────────────────────────────────────

CITIES = [
    "Montreal", "Laval", "Quebec City", "Sherbrooke", "Trois-Rivieres",
    "Drummondville", "Gatineau", "Longueuil", "Brossard", "Terrebonne",
    "Saint-Hyacinthe", "Granby", "Victoriaville", "Saguenay", "Levis",
]

SECTORS = {
    "gyms": {
        "queries": ["gym ouverture {city}", "crossfit {city}", "centre entrainement {city}"],
        "type": "gym",
    },
    "restaurants": {
        "queries": ["restaurant ouverture {city} 2025 2026", "microbrasserie {city}"],
        "type": "restaurant",
    },
    "dealers": {
        "queries": ["concessionnaire automobile {city}", "garage mecanique {city}"],
        "type": "contractor",
    },
    "warehouses": {
        "queries": ["entrepot industriel {city}", "usine manufacture {city}"],
        "type": "industrial",
    },
    "construction": {
        "queries": ["entrepreneur general construction {city}", "renovation commerciale {city}"],
        "type": "contractor",
    },
    "property": {
        "queries": ["gestionnaire immobilier commercial {city}", "syndic copropriete {city}"],
        "type": "property_manager",
    },
    "food": {
        "queries": ["usine alimentaire {city} quebec", "transformation alimentaire {city}"],
        "type": "food_processing",
    },
}

# ─── HTML PARSER ────────────────────────────────────────────────────────────

class EmailExtractor(HTMLParser):
    """Extract emails from HTML content."""
    def __init__(self):
        super().__init__()
        self.text = []

    def handle_data(self, data):
        self.text.append(data)

    def get_text(self):
        return " ".join(self.text)


EMAIL_RE = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
EXCLUDE_EMAILS = {
    "example.com", "sentry.io", "sentry-next.wixpress.com", "w3.org",
    "schema.org", "gmail.com", "googlemail.com", "yahoo.com", "hotmail.com",
    "outlook.com", "facebook.com", "twitter.com", "instagram.com",
    "wixpress.com", "squarespace.com", "wordpress.com", "shopify.com",
    "wix.com", "godaddy.com", "email.com", "test.com", "placeholder.com",
    "sentry.wixpress.com", "cloudflare.com",
}


def fetch_url(url, timeout=10):
    """Fetch URL content, return text or None."""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            content_type = resp.headers.get("Content-Type", "")
            if "text/html" not in content_type and "application/json" not in content_type:
                return None
            return resp.read().decode("utf-8", errors="ignore")
    except Exception:
        return None


def extract_emails_from_html(html):
    """Find all email addresses in HTML content."""
    if not html:
        return set()
    emails = set()
    for match in EMAIL_RE.findall(html):
        domain = match.split("@")[1].lower()
        if domain not in EXCLUDE_EMAILS and not domain.endswith(".png") and not domain.endswith(".jpg"):
            emails.add(match.lower())
    return emails


def extract_emails_from_url(url):
    """Fetch a URL and extract emails from it."""
    html = fetch_url(url)
    if not html:
        return set()
    emails = extract_emails_from_html(html)
    # Also check /contact page
    if not emails:
        contact_url = url.rstrip("/") + "/contact"
        html2 = fetch_url(contact_url)
        emails = extract_emails_from_html(html2)
    if not emails:
        contact_url = url.rstrip("/") + "/nous-joindre"
        html2 = fetch_url(contact_url)
        emails = extract_emails_from_html(html2)
    return emails


# ─── DUCKDUCKGO SEARCH ──────────────────────────────────────────────────────

def ddg_search(query, max_results=8):
    """Search DuckDuckGo and return list of {title, url, snippet}."""
    results = []
    try:
        encoded = urllib.parse.quote(query)
        url = f"https://html.duckduckgo.com/html/?q={encoded}"
        html = fetch_url(url, timeout=15)
        if not html:
            return results

        # Parse results from DDG HTML
        # Each result is in <a class="result__a" href="...">title</a>
        # with <a class="result__snippet">snippet</a>
        import re
        links = re.findall(r'class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]+)', html)
        snippets = re.findall(r'class="result__snippet"[^>]*>(.*?)</a>', html, re.DOTALL)

        for i, (link, title) in enumerate(links[:max_results]):
            # DDG wraps URLs in redirect
            if "uddg=" in link:
                actual = urllib.parse.unquote(link.split("uddg=")[1].split("&")[0])
            else:
                actual = link

            snippet = ""
            if i < len(snippets):
                snippet = re.sub(r'<[^>]+>', '', snippets[i]).strip()

            results.append({
                "title": title.strip(),
                "url": actual,
                "snippet": snippet,
            })
    except Exception as e:
        print(f"    [WARN] DDG search failed: {e}")

    return results


# ─── LEAD EXTRACTION ────────────────────────────────────────────────────────

def extract_company_name(title, url):
    """Try to extract company name from search result title."""
    # Remove common suffixes
    name = title.split(" - ")[0].split(" | ")[0].split(" — ")[0].strip()
    if len(name) < 3:
        # Fallback to domain
        from urllib.parse import urlparse
        domain = urlparse(url).netloc.replace("www.", "")
        name = domain.split(".")[0].title()
    return name


def hunt_leads(sector_key, cities=None, existing_emails=None):
    """Hunt leads for a specific sector across cities."""
    if sector_key not in SECTORS:
        print(f"[ERROR] Unknown sector: {sector_key}")
        return []

    sector = SECTORS[sector_key]
    target_cities = cities or CITIES
    existing = existing_emails or set()
    leads = []
    seen_domains = set()

    print(f"\n{'='*60}")
    print(f"  HUNTING: {sector_key.upper()}")
    print(f"  Cities: {len(target_cities)} | Queries: {len(sector['queries'])}")
    print(f"{'='*60}\n")

    for city in target_cities:
        for query_template in sector["queries"]:
            query = query_template.format(city=city)
            print(f"  Searching: {query}")

            results = ddg_search(query)
            time.sleep(1.5)  # Rate limit

            for result in results:
                url = result["url"]
                from urllib.parse import urlparse
                domain = urlparse(url).netloc.replace("www.", "").lower()

                # Skip duplicates and known platforms
                skip_domains = ["facebook.com", "instagram.com", "twitter.com",
                               "youtube.com", "linkedin.com", "yelp.com",
                               "pagesjaunes.ca", "google.com", "tripadvisor",
                               "kijiji.ca", "indeed.com", "jobillico.com"]
                if any(sd in domain for sd in skip_domains):
                    continue
                if domain in seen_domains:
                    continue
                seen_domains.add(domain)

                # Try to get emails
                emails = extract_emails_from_url(url)
                if not emails:
                    continue

                # Filter out already-known emails
                new_emails = {e for e in emails if e not in existing}
                if not new_emails:
                    continue

                email = sorted(new_emails)[0]  # Pick first
                company = extract_company_name(result["title"], url)

                lead = {
                    "company_name": company,
                    "email": email,
                    "city": city,
                    "type": sector["type"],
                    "source": f"hunt-{sector_key}",
                    "url": url,
                    "snippet": result["snippet"][:100],
                }
                leads.append(lead)
                existing.add(email)
                print(f"    FOUND: {company} -> {email}")

    return leads


# ─── MAIN ───────────────────────────────────────────────────────────────────

def load_existing_emails():
    """Load all emails we already have across all CSVs."""
    emails = set()
    for csv_file in [
        os.path.join(SCRIPT_DIR, "email-log.csv"),
        os.path.join(PROJECT_DIR, "NOVUS-EMAIL-READY.csv"),
        os.path.join(PROJECT_DIR, "NOVUS-FRESH-LEADS.csv"),
        os.path.join(PROJECT_DIR, "NOVUS-CRM-MASTER.csv"),
    ]:
        if os.path.exists(csv_file):
            try:
                with open(csv_file, "r", encoding="utf-8-sig") as f:
                    for row in csv.DictReader(f):
                        email = (row.get("email") or "").strip().lower()
                        if email and "@" in email:
                            emails.add(email)
            except Exception:
                pass
    return emails


def main():
    parser = argparse.ArgumentParser(description="Novus Lead Hunter")
    parser.add_argument("--sector", type=str, default=None,
                       help=f"Sector to hunt ({', '.join(SECTORS.keys())})")
    parser.add_argument("--city", type=str, default=None,
                       help="Specific city to target")
    parser.add_argument("--all", action="store_true",
                       help="Hunt all sectors")
    args = parser.parse_args()

    existing = load_existing_emails()
    print(f"\n  Known emails (dedup): {len(existing)}")

    cities = [args.city] if args.city else None
    all_leads = []

    if args.sector:
        all_leads = hunt_leads(args.sector, cities, existing)
    elif args.all or not args.sector:
        for sector_key in SECTORS:
            leads = hunt_leads(sector_key, cities, existing)
            all_leads.extend(leads)

    if not all_leads:
        print("\n  No new leads found. Try different sectors/cities.\n")
        return

    # Write to CSV
    fieldnames = ["id", "company_name", "contact_person", "phone", "email",
                  "address", "city", "region", "type", "score",
                  "potential_value_min", "potential_value_max", "status",
                  "priority", "source", "notes", "next_action", "tier", "category"]

    file_exists = os.path.exists(OUTPUT_CSV)
    start_id = 1
    if file_exists:
        with open(OUTPUT_CSV, "r", encoding="utf-8-sig") as f:
            start_id = sum(1 for _ in csv.DictReader(f)) + 1

    with open(OUTPUT_CSV, "a" if file_exists else "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            w.writeheader()
        for i, lead in enumerate(all_leads):
            w.writerow({
                "id": start_id + i,
                "company_name": lead["company_name"],
                "contact_person": "",
                "phone": "",
                "email": lead["email"],
                "address": "",
                "city": lead["city"],
                "region": "Quebec",
                "type": lead["type"],
                "score": "75",
                "potential_value_min": "",
                "potential_value_max": "",
                "status": "new",
                "priority": "B",
                "source": lead["source"],
                "notes": lead.get("snippet", ""),
                "next_action": "email",
                "tier": "",
                "category": "",
            })

    print(f"\n{'='*60}")
    print(f"  HUNT COMPLETE")
    print(f"  New leads found: {len(all_leads)}")
    print(f"  Saved to: {OUTPUT_CSV}")
    print(f"{'='*60}")
    print(f"\n  To blast these leads:")
    print(f"  LEADS_CSV=NOVUS-HUNTED-LEADS.csv python scripts/novus-email-blast.py --batch 50\n")


if __name__ == "__main__":
    main()
