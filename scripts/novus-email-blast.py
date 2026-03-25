#!/usr/bin/env python3
"""
NOVUS EPOXY — Cold Email Blast via Gmail SMTP
Sends personalized Novus-branded HTML emails to leads from NOVUS-EMAIL-READY.csv.

Usage:
    python novus-email-blast.py --dry-run                      # Preview all emails
    python novus-email-blast.py --dry-run --priority S,A       # Preview S+A leads only
    python novus-email-blast.py --batch 5 --priority S         # Send 5 emails to S-tier
    python novus-email-blast.py --batch 10                     # Send 10 emails
    python novus-email-blast.py --batch 10 --delay 45          # 45s between emails
"""

import smtplib
import ssl
import csv
import json
import time
import os
import sys
import argparse
import datetime
import urllib.request
import urllib.parse
import dns.resolver
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

# ─── CONFIG ──────────────────────────────────────────────────────────────────

GMAIL_USER = "gestionnovusepoxy@gmail.com"
GMAIL_PASS = "iwmcjgtpkxdfypgp"
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

TELEGRAM_BOT_TOKEN = "8652131717:AAFC93pdaastVdW-OQcRRo_kWbvOElkHlD4"
TELEGRAM_CHAT_ID = "7562421258"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
LEADS_CSV = os.environ.get("LEADS_CSV", os.path.join(PROJECT_DIR, "NOVUS-EMAIL-READY.csv"))
LOG_CSV = os.path.join(SCRIPT_DIR, "email-log.csv")

DEFAULT_DELAY = 30  # seconds between emails

# ─── EMAIL VALIDATION ─────────────────────────────────────────────────────

_MX_CACHE = {}  # domain -> bool

def validate_email_mx(email: str) -> bool:
    """Check if the email domain has valid MX records (can receive mail)."""
    domain = email.split("@")[-1].lower()
    if domain in _MX_CACHE:
        return _MX_CACHE[domain]
    try:
        answers = dns.resolver.resolve(domain, "MX", lifetime=5)
        valid = len(answers) > 0
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers):
        valid = False
    except Exception:
        # DNS timeout or other — assume valid to avoid false negatives
        valid = True
    _MX_CACHE[domain] = valid
    return valid

# ─── COLORS / BRAND ─────────────────────────────────────────────────────────

BRAND = {
    "bg_dark": "#09090b",
    "bg_card": "#18181b",
    "gold": "#C9A84C",
    "gold_hover": "#D4B75E",
    "text_white": "#fafafa",
    "text_muted": "#a1a1aa",
    "border": "#27272a",
}

# ─── EMAIL TEMPLATE ──────────────────────────────────────────────────────────

TEMPLATE_PATH = os.path.join(SCRIPT_DIR, "email-entreprise.html")

def load_template() -> str:
    """Load the entreprise HTML template once."""
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        return f.read()

_TEMPLATE_CACHE = None

def get_template() -> str:
    global _TEMPLATE_CACHE
    if _TEMPLATE_CACHE is None:
        _TEMPLATE_CACHE = load_template()
    return _TEMPLATE_CACHE


TEMPLATE_CLIENT_PATH = os.path.join(SCRIPT_DIR, "email-client.html")

_CLIENT_TEMPLATE_CACHE = None

def get_client_template() -> str:
    global _CLIENT_TEMPLATE_CACHE
    if _CLIENT_TEMPLATE_CACHE is None:
        with open(TEMPLATE_CLIENT_PATH, "r", encoding="utf-8") as f:
            _CLIENT_TEMPLATE_CACHE = f.read()
    return _CLIENT_TEMPLATE_CACHE


def classify_lead(lead: dict) -> str:
    """Classify a lead as 'entreprise' or 'client' to pick the right template."""
    lead_type = (lead.get("type") or "").lower().strip()
    category = (lead.get("category") or "").lower().strip()
    notes = (lead.get("notes") or "").lower()
    combined = f"{lead_type} {category} {notes}"

    residential_keywords = [
        "designer intérieur", "résidentiel", "maison", "habitation",
        "projets immobiliers luxe", "maisons neuves", "garage résidentiel",
    ]
    for kw in residential_keywords:
        if kw in combined:
            return "client"

    return "entreprise"


def generate_email_content(lead: dict) -> tuple:
    """Returns (subject, body_html) using the HTML templates with variable substitution."""
    company = lead.get("company_name", "").strip()
    contact = lead.get("contact_person", "").strip()
    city = lead.get("city", "").strip()
    first_name = contact.split()[0] if contact and contact.split() else ""

    bucket = classify_lead(lead)

    if bucket == "client":
        # Residential template
        html = get_client_template()
        subject = f"Plancher \u00e9poxy haut de gamme \u2014 Novus Epoxy"
        # Substitute n8n variables
        # {{ $json.first_name ? ' ' + $json.first_name : '' }}
        html = html.replace(
            "{{ $json.first_name ? ' ' + $json.first_name : '' }}",
            f" {first_name}" if first_name else "",
        )
    else:
        # Entreprise template (default)
        html = get_template()
        subject = f"Rev\u00eatements de plancher pour {company} \u2014 Novus Epoxy" if company else "Rev\u00eatements de plancher haute performance \u2014 Novus Epoxy"

        # URL-encode company name for mailto subject (must be done BEFORE the global replace)
        encoded_company = urllib.parse.quote(company or "Soumission", safe="")
        html = html.replace(
            "Int%C3%A9ress%C3%A9%20%E2%80%94%20{{ $json.company_name }}",
            f"Int%C3%A9ress%C3%A9%20%E2%80%94%20{encoded_company}",
        )
        # Now replace all remaining n8n variables with plain text
        html = html.replace("{{ $json.company_name }}", company or "votre entreprise")
        html = html.replace(
            "{{ $json.first_name ? ' ' + $json.first_name : '' }}",
            f" {first_name}" if first_name else "",
        )
        html = html.replace(
            "{{ $json.city ? ' &#224; ' + $json.city : '' }}",
            f" &#224; {city}" if city else "",
        )

    return subject, html


# ─── LEAD LOADING ────────────────────────────────────────────────────────────

def load_leads(csv_path: str) -> list:
    """Load leads from CSV, return list of dicts."""
    leads = []
    with open(csv_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = (row.get("email") or "").strip()
            if email:
                leads.append(row)
    return leads


def load_sent_log(log_path: str) -> set:
    """Load already-sent emails from log CSV. Returns set of email addresses."""
    sent = set()
    if not os.path.exists(log_path):
        return sent
    with open(log_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            email = (row.get("email") or "").strip().lower()
            if email:
                sent.add(email)
    return sent


def log_sent_email(log_path: str, lead: dict, subject: str, status: str):
    """Append a sent email record to the log CSV."""
    file_exists = os.path.exists(log_path)
    fieldnames = ["timestamp", "email", "company_name", "contact_person", "priority", "subject", "status"]
    with open(log_path, "a", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow({
            "timestamp": datetime.datetime.now().isoformat(),
            "email": lead.get("email", ""),
            "company_name": lead.get("company_name", ""),
            "contact_person": lead.get("contact_person", ""),
            "priority": lead.get("priority", ""),
            "subject": subject,
            "status": status,
        })


# ─── TELEGRAM ────────────────────────────────────────────────────────────────

def send_telegram(message: str):
    """Send a Telegram notification."""
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = urllib.parse.urlencode({
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML",
        }).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST")
        req.add_header("Content-Type", "application/x-www-form-urlencoded")
        with urllib.request.urlopen(req, timeout=10) as resp:
            pass
    except Exception as e:
        print(f"  [WARN] Telegram notification failed: {e}")


# ─── SMTP ────────────────────────────────────────────────────────────────────

def create_smtp_connection():
    """Create and return an authenticated SMTP connection."""
    ctx = ssl.create_default_context()
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30)
    server.ehlo()
    server.starttls(context=ctx)
    server.ehlo()
    server.login(GMAIL_USER, GMAIL_PASS)
    return server


def send_email(server, to_email: str, subject: str, html_body: str):
    """Send a single HTML email via the SMTP connection."""
    msg = MIMEMultipart("alternative")
    msg["From"] = formataddr(("Jason Lanthier | Novus Epoxy", GMAIL_USER))
    msg["To"] = to_email
    msg["Subject"] = subject
    msg["Reply-To"] = GMAIL_USER
    msg["X-Mailer"] = "Novus-Pipeline/1.0"

    # Plain-text fallback
    plain = (
        f"Bonjour,\n\n"
        f"Je suis Jason Lanthier, directeur des ventes chez Novus Epoxy.\n"
        f"Nous sommes specialistes en revetements de plancher epoxy et polyurea.\n"
        f"Visitez novusepoxy.ca ou repondez a ce courriel pour une soumission gratuite.\n\n"
        f"Jason Lanthier — Directeur des ventes\n"
        f"581-307-2678\n"
        f"gestionnovusepoxy@gmail.com | novusepoxy.ca"
    )
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    server.sendmail(GMAIL_USER, to_email, msg.as_string())


# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Novus Epoxy — Cold Email Blast via Gmail SMTP",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""\
Examples:
  python novus-email-blast.py --dry-run
  python novus-email-blast.py --dry-run --priority S,A
  python novus-email-blast.py --batch 5 --priority S
  python novus-email-blast.py --batch 10 --delay 45
        """,
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview emails without sending")
    parser.add_argument("--priority", type=str, default=None, help="Comma-separated priority filter (e.g., S,A)")
    parser.add_argument("--batch", type=int, default=None, help="Max number of emails to send in this run")
    parser.add_argument("--delay", type=int, default=DEFAULT_DELAY, help=f"Seconds between emails (default: {DEFAULT_DELAY})")

    args = parser.parse_args()

    # ─── Load data ───────────────────────────────────────────────────────
    if not os.path.exists(LEADS_CSV):
        print(f"[ERROR] Leads CSV not found: {LEADS_CSV}")
        sys.exit(1)

    leads = load_leads(LEADS_CSV)
    print(f"\n{'='*60}")
    print(f"  NOVUS EPOXY — Email Blast")
    print(f"  Leads loaded: {len(leads)}")
    print(f"{'='*60}\n")

    # ─── Priority filter ─────────────────────────────────────────────────
    if args.priority:
        allowed = {p.strip().upper() for p in args.priority.split(",")}
        leads = [l for l in leads if (l.get("priority") or "").strip().upper() in allowed]
        print(f"  Priority filter: {args.priority} -> {len(leads)} leads")

    # ─── Sort by priority (S > A > B > C) then by score descending ──────
    priority_order = {"S": 0, "A": 1, "B": 2, "C": 3}
    leads.sort(key=lambda l: (
        priority_order.get((l.get("priority") or "C").strip().upper(), 9),
        -int(l.get("score") or 0),
    ))

    # ─── Skip already sent ───────────────────────────────────────────────
    sent_emails = load_sent_log(LOG_CSV)
    if sent_emails:
        print(f"  Already sent (in log): {len(sent_emails)}")

    leads = [l for l in leads if l.get("email", "").strip().lower() not in sent_emails]
    print(f"  Leads to process: {len(leads)}")

    # ─── Batch limit ─────────────────────────────────────────────────────
    if args.batch:
        leads = leads[:args.batch]
        print(f"  Batch limit: {args.batch}")

    if not leads:
        print("\n  No leads to process. Exiting.\n")
        return

    print(f"  Mode: {'DRY RUN' if args.dry_run else 'LIVE SEND'}")
    print(f"  Delay: {args.delay}s between emails")
    print(f"\n{'-'*60}\n")

    # ─── SMTP connection (only if live) ──────────────────────────────────
    server = None
    if not args.dry_run:
        print("  Connecting to Gmail SMTP...")
        try:
            server = create_smtp_connection()
            print("  Connected successfully!\n")
        except smtplib.SMTPAuthenticationError as e:
            print(f"\n  [ERROR] SMTP Authentication Failed.")
            print(f"  Gmail rejected the login credentials.")
            print(f"  Error: {e}")
            print(f"\n  *** ACTION REQUIRED ***")
            print(f"  Gmail requires an App Password for SMTP access.")
            print(f"  The account password alone will NOT work unless:")
            print(f"    1. 2-Step Verification is OFF, AND")
            print(f"    2. 'Less secure app access' is ON (deprecated by Google)")
            print(f"\n  To fix this:")
            print(f"    1. Go to https://myaccount.google.com/security")
            print(f"    2. Enable 2-Step Verification")
            print(f"    3. Go to https://myaccount.google.com/apppasswords")
            print(f"    4. Create an App Password for 'Mail'")
            print(f"    5. Replace GMAIL_PASS in this script with the 16-char App Password")
            print(f"\n  You can still use --dry-run to preview emails.\n")
            sys.exit(1)
        except Exception as e:
            print(f"\n  [ERROR] SMTP connection failed: {e}\n")
            sys.exit(1)

    # ─── Process leads ───────────────────────────────────────────────────
    sent_count = 0
    fail_count = 0

    for i, lead in enumerate(leads):
        email = lead.get("email", "").strip()
        company = lead.get("company_name", "N/A")
        priority = lead.get("priority", "?")
        contact = lead.get("contact_person", "")

        subject, html_body = generate_email_content(lead)
        template_type = classify_lead(lead)

        print(f"  [{i+1}/{len(leads)}] {company}")
        print(f"    Email:    {email}")
        print(f"    Priority: {priority} | Template: {template_type}")
        print(f"    Subject:  {subject}")

        # Validate MX before sending or previewing
        if not validate_email_mx(email):
            print(f"    Status:   SKIPPED (dead domain — no MX record)")
            log_sent_email(LOG_CSV, lead, subject, "skipped-bad-mx")
            print()
            continue

        if args.dry_run:
            print(f"    Status:   SKIPPED (dry-run) [MX OK]")
            # In dry-run, save a preview of the first email
            if i == 0:
                preview_path = os.path.join(SCRIPT_DIR, "email-preview.html")
                with open(preview_path, "w", encoding="utf-8") as pf:
                    pf.write(html_body)
                print(f"    Preview:  Saved to {preview_path}")
            print()
            continue

        # LIVE SEND
        try:
            send_email(server, email, subject, html_body)
            sent_count += 1
            status = "sent"
            print(f"    Status:   SENT OK")

            # Log it
            log_sent_email(LOG_CSV, lead, subject, status)

            # Telegram alert
            tg_msg = (
                f"<b>Email Sent</b> [{sent_count}]\n"
                f"<b>To:</b> {company}\n"
                f"<b>Email:</b> {email}\n"
                f"<b>Priority:</b> {priority}\n"
                f"<b>Subject:</b> {subject}"
            )
            send_telegram(tg_msg)

        except Exception as e:
            fail_count += 1
            status = f"failed: {e}"
            print(f"    Status:   FAILED — {e}")
            log_sent_email(LOG_CSV, lead, subject, status)

        print()

        # Rate limit — wait between emails (skip delay after last one)
        if i < len(leads) - 1:
            print(f"    Waiting {args.delay}s before next email...")
            time.sleep(args.delay)

    # ─── Cleanup ─────────────────────────────────────────────────────────
    if server:
        try:
            server.quit()
        except Exception:
            pass

    # ─── Summary ─────────────────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  DONE")
    if args.dry_run:
        print(f"  Mode: DRY RUN — no emails were sent")
        print(f"  Leads previewed: {len(leads)}")
    else:
        print(f"  Emails sent:   {sent_count}")
        print(f"  Emails failed: {fail_count}")
        print(f"  Log file:      {LOG_CSV}")

        # Final Telegram summary
        tg_summary = (
            f"<b>Novus Email Blast Complete</b>\n"
            f"Sent: {sent_count} | Failed: {fail_count}\n"
            f"Total leads processed: {len(leads)}"
        )
        send_telegram(tg_summary)

    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
