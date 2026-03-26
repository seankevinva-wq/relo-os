#!/usr/bin/env python3
"""
Creates the RSG Phase 1 Onboarding Google Doc using existing OAuth token.
"""
import json
import urllib.parse
import urllib.request
import urllib.error
import sys

TOKEN_FILE = "/home/kevin/sean/google_auth/token.json"

# ── Refresh access token ───────────────────────────────────────────────────
with open(TOKEN_FILE) as f:
    tok = json.load(f)

def refresh_token(tok):
    data = urllib.parse.urlencode({
        "client_id": tok["client_id"],
        "client_secret": tok["client_secret"],
        "refresh_token": tok["refresh_token"],
        "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request(tok["token_uri"], data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req) as r:
        result = json.loads(r.read())
    return result["access_token"]

print("Refreshing token...", flush=True)
access_token = refresh_token(tok)
print("Token refreshed.", flush=True)

def api(method, url, body=None):
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {access_token}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        print("API error:", e.read().decode())
        raise

# ── Create blank doc ───────────────────────────────────────────────────────
print("Creating Google Doc...", flush=True)
doc = api("POST", "https://docs.googleapis.com/v1/documents", {"title": "RSG Phase 1 — Onboarding Call Prep"})
doc_id = doc["documentId"]
print(f"Doc created: https://docs.google.com/document/d/{doc_id}/edit", flush=True)

# ── Build content via batchUpdate ─────────────────────────────────────────
# We insert from the end backwards, OR build a list of insertText + style requests.
# Simpler: build the full text first, track indices, then apply styles.

# We'll use a helper that appends requests
requests = []
_cursor = 1  # doc starts with 1 empty paragraph at index 1

def insert(text):
    global _cursor
    requests.append({"insertText": {"location": {"index": _cursor}, "text": text}})
    _cursor += len(text)

def style_range(start, end, named_style=None, bold=False, font_size=None, color=None, bg=None):
    fields = []
    ts = {}
    ps = {}

    if named_style:
        ps["namedStyleType"] = named_style
        fields.append("paragraphStyle.namedStyleType")

    if bold:
        ts["bold"] = True
        fields.append("textStyle.bold")

    if font_size:
        ts["fontSize"] = {"magnitude": font_size, "unit": "PT"}
        fields.append("textStyle.fontSize")

    if color:
        r, g, b = color
        ts["foregroundColor"] = {"color": {"rgbColor": {"red": r/255, "green": g/255, "blue": b/255}}}
        fields.append("textStyle.foregroundColor")

    if bg:
        r, g, b = bg
        ts["backgroundColor"] = {"color": {"rgbColor": {"red": r/255, "green": g/255, "blue": b/255}}}
        fields.append("textStyle.backgroundColor")

    if ts:
        requests.append({
            "updateTextStyle": {
                "range": {"startIndex": start, "endIndex": end},
                "textStyle": ts,
                "fields": ",".join([f for f in fields if f.startswith("textStyle")]),
            }
        })
    if ps:
        requests.append({
            "updateParagraphStyle": {
                "range": {"startIndex": start, "endIndex": end},
                "paragraphStyle": ps,
                "fields": ",".join([f for f in fields if f.startswith("paragraphStyle")]),
            }
        })

# Track positions for styling
positions = {}

def mark(key):
    positions[key] = _cursor

# ────────────────────────────────
# TITLE
# ────────────────────────────────
mark("title_start")
insert("RSG Phase 1 — Onboarding Call Prep\n")
mark("title_end")

insert("Relo Solutions Group × Jam AI · Reference document for Phase 1 build\n")
mark("subtitle_end")

insert("\n")

# ────────────────────────────────
# SUMMARY BOX
# ────────────────────────────────
mark("sum_head_start")
insert("QUICK SUMMARY — READ THIS FIRST\n")
mark("sum_head_end")

insert(
    "We are building 3 automations for RSG, all powered by an AI persona called Emma. "
    "Emma plugs into RSG's existing admin portal (built by Bitopan) via API. "
    "No mobile app required. No rip-and-replace. Phase 1 is self-contained.\n\n"
    "  • $9,500 one-time build fee\n"
    "  • $750/mo support & hosting retainer\n"
    "  • ~2.5 month payback period\n"
    "  • First automation live in 2 weeks of signing\n\n"
)

mark("modules_head_start")
insert("THE 3 MODULES\n")
mark("modules_head_end")

insert(
    "MODULE 01 — Emma Warm Handoff\n"
    "When a new order is placed, Emma texts the homeowner automatically. She confirms job details, collects missing info "
    "(make/model numbers, images, gate codes, staircase presence), then marks the job confirmed. "
    "Replaces ~700 manual CS calls/month. Expected payback: ~$2,400/mo.\n\n"

    "MODULE 02 — After-Hours AI Phone\n"
    "Emma answers the RSG phone after hours (8 PM – 7 AM). She recognizes the caller's number, pulls their active job, "
    "answers common questions, collects missing info, and texts Nick if escalation is needed. "
    "Eliminates weekend interruptions for Nick.\n\n"

    "MODULE 05 — Service Window Collection\n"
    "Every morning Emma texts all vendors with upcoming jobs: 'Select your window for [job] on [date].' "
    "Vendor replies with a time slot. Window auto-populates into the portal. "
    "Eliminates Nick's daily call routine. Expected payback: ~$1,650/mo.\n\n"
)

# ────────────────────────────────
# KEY PEOPLE
# ────────────────────────────────
mark("people_head_start")
insert("KEY PEOPLE\n")
mark("people_head_end")

insert(
    "Jimmy Walsh (RSG — Founder/CEO)\n"
    "Owner of decisions around brand voice, Emma's tone, escalation rules, budget sign-off. "
    "Go to Jimmy for: approving Emma's message templates, TCPA opt-in confirmation, AI disclosure policy.\n\n"

    "Nick Walsh (RSG — Dispatch & Operations)\n"
    "Day-to-day owner of dispatch and vendor management. The person whose morning routine Modules 05 eliminates. "
    "Go to Nick for: service window options & timing, vendor contact details, escalation preferences, after-hours rules.\n\n"

    "Bitopan Das (RSG — Platform Developer)\n"
    "Built and maintains the RSG admin portal. Your technical counterpart. "
    "Go to Bitopan for: API access, webhooks, endpoint availability, data structure of jobs/vendors, staging environment.\n\n"

    "Jam Anderson (Jam AI — Account Lead)\n"
    "Client relationship owner. Handles proposal, engagement letter, invoicing.\n\n"

    "Kevin Farrugia (Jam AI — Technical Lead)\n"
    "That's you. You build everything. This doc is your reference.\n\n"
)

# ────────────────────────────────
# SECTION A: SYSTEM ACCESS
# ────────────────────────────────
mark("secA_start")
insert("SECTION A — System Access (Bitopan)\n")
mark("secA_end")

insert(
    "These are hard blockers. The build cannot start without them.\n\n"

    "WHAT TO GET TODAY FROM BITOPAN:\n"
    "  ☐  Admin portal URL + login credentials (read/write access)\n"
    "  ☐  API key or auth token with permissions to read/write jobs and vendors\n"
    "  ☐  API documentation or Postman collection\n"
    "  ☐  Webhook support — can Bitopan set up a webhook that fires when a new order is placed?\n"
    "  ☐  Staging/sandbox environment (so we can test without touching live jobs)\n\n"

    "API ENDPOINTS NEEDED — confirm each exists or Bitopan will build it:\n"
    "  • GET /jobs?status=new — list new unconfirmed orders (fallback if no webhook)\n"
    "  • GET /jobs/{id} — full job detail: homeowner name, phone, service types, info checklist\n"
    "  • PATCH /jobs/{id} — update status (e.g. mark 'confirmed'), write collected info back\n"
    "  • GET /vendors — list vendors with territory, phone, service types\n"
    "  • GET /jobs?date_range=next_3_days — jobs needing service windows for morning blast\n"
    "  • PATCH /jobs/{id}/service-window — write confirmed window back into the job\n"
    "  • Webhook: order.placed — fires the instant a client places an order\n\n"

    "QUESTIONS FOR BITOPAN:\n"
    "  Q: Is there a webhook system, or will we need to poll?\n"
    "     → Webhook = Emma reacts instantly. Polling = we hit the API every N minutes. Either works.\n\n"
    "  Q: Is homeowner phone number a required field on every order?\n"
    "     → If optional, Emma can't text those jobs. Need to know the % where it's missing.\n\n"
    "  Q: Do vendor profiles include a mobile phone number?\n"
    "     → Module 05 sends morning SMS to vendors. If email-only, we need to add mobile numbers to profiles.\n\n"
    "  Q: Is there a structured info checklist per job, or is it free-form notes?\n"
    "     → Emma needs field-by-field visibility into what's missing. If already structured, we read it directly.\n\n"
    "  Q: Can we write inbound SMS replies back to a job record via the API?\n"
    "     → When a homeowner replies to Emma's text, that data needs to land on the job.\n\n"
)

# ────────────────────────────────
# SECTION B: MODULE 01
# ────────────────────────────────
mark("secB_start")
insert("SECTION B — Module 01: Emma Warm Handoff\n")
mark("secB_end")

insert(
    "⚠ COMPLIANCE NOTE: Before Emma texts any homeowner, RSG must confirm those homeowners opted in\n"
    "to receive automated texts when placing their order. Confirm with Jimmy. This is non-negotiable.\n\n"

    "PER-SERVICE INFO CHECKLIST — confirm or correct with Jimmy/Bitopan:\n\n"
    "  Piano\n"
    "  → Make, model, approximate weight, dimensions, current floor, destination floor, staircase present?, photos\n\n"
    "  Pool Table\n"
    "  → Size (7/8/9 ft), slate count, current room, destination confirmed, disassembly needed?\n\n"
    "  Appliances (washer/dryer/fridge)\n"
    "  → Make + model, gas or electric dryer, water line present, disconnect only or reconnect too\n\n"
    "  Fitness Equipment\n"
    "  → Type of equipment, brand/model, dimensions if known, reassembly at destination needed\n\n"
    "  TV / AV\n"
    "  → TV size, mount type (drywall/brick/stud), destination wall type, same mount or new mount\n\n"
    "  Chandelier / Light Fixture\n"
    "  → Ceiling height, weight approx, reinstall at destination, electrician needed?\n\n"
    "  Crating / Artwork\n"
    "  → Dimensions, approximate value, fragility level, ISPM wood required (international move?)\n\n"

    "QUESTIONS FOR JIMMY:\n"
    "  Q: Do you have a standard CS script for warm handoff calls we can use as a template?\n\n"
    "  Q: After Emma collects all info, does someone review before the job flips to 'confirmed' — or auto-confirm?\n\n"
    "  Q: How many reminders before escalating to a human if homeowner doesn't respond?\n"
    "     → e.g. T+24hrs first reminder, T+48hrs second, then flag to CS team?\n\n"
    "  Q: Is there anything Emma should never say or commit to without a human? (dates, pricing, exceptions)\n\n"
    "  Q: Should Emma identify herself as AI, or just as 'Emma from Relo Solutions Group'?\n"
    "     → FCC regulations on AI disclosure are evolving. Jimmy should make this call.\n\n"

    "DRAFT INTRO SMS — get Jimmy to approve on the call:\n"
    "  'Hi [First Name], this is Emma from Relo Solutions Group. We're working with [Moving Company]\n"
    "  on your upcoming move and will be handling [service type]. I just need a few quick details —\n"
    "  can you help me with [first question]?'\n\n"
)

# ────────────────────────────────
# SECTION C: MODULE 02
# ────────────────────────────────
mark("secC_start")
insert("SECTION C — Module 02: After-Hours AI Phone\n")
mark("secC_end")

insert(
    "Emma answers the RSG phone between 8 PM – 7 AM. She recognizes caller ID, pulls the job,\n"
    "handles common questions, and texts Nick if it needs a human.\n\n"

    "MOST COMMON AFTER-HOURS CALL TYPES (confirm with Nick):\n"
    "  • Homeowner (known ID): 'What time is the crew coming?' → Emma reads window from job ✓\n"
    "  • Homeowner (known ID): 'Can I confirm my appointment?' → Emma confirms job details ✓\n"
    "  • Homeowner (known ID): Wants to reschedule → Emma collects info, escalates to Nick\n"
    "  • Vendor (known number): 'Customer not calling back, is job still on?' → Emma checks status ✓\n"
    "  • Unknown caller → Emma collects name + reason, escalates\n"
    "  • Anyone with job tomorrow morning → Escalate to Nick immediately\n\n"

    "QUESTIONS FOR NICK / JIMMY:\n"
    "  Q: What is the current RSG after-hours phone number? Keep it or set up a new Twilio line?\n\n"
    "  Q: When Emma can't resolve something, how should she reach Nick — text, call, or email?\n"
    "     → Most likely: a text to Nick's mobile with job ID + caller summary.\n\n"
    "  Q: Are there call types where Emma should always immediately say 'I'll have someone call you tomorrow'?\n"
    "     → e.g. complaints, legal threats, anything involving safety.\n\n"
    "  Q: Voice preference for Emma — any reference, tone, accent?\n"
    "     → Twilio and ElevenLabs offer many options. Jimmy/Jam should pick before launch.\n\n"
)

# ────────────────────────────────
# SECTION D: MODULE 05
# ────────────────────────────────
mark("secD_start")
insert("SECTION D — Module 05: Service Window Collection\n")
mark("secD_end")

insert(
    "What Nick does today (that Emma will replace):\n"
    "  1. Every morning: manually calls each vendor with an upcoming job\n"
    "  2. Gets window (e.g. '8–11am'), manually enters it into the portal\n"
    "  3. Separately notifies the homeowner of the confirmed window\n\n"
    "After Emma: vendors get a morning text, reply with a slot, window auto-updates, homeowner notified. Zero Nick involvement.\n\n"

    "QUESTIONS FOR NICK:\n"
    "  Q: What time do you want Emma to send the morning blast?\n"
    "     → Vendors are tradespeople — 7–8 AM is likely the sweet spot.\n\n"
    "  Q: What are the standard window options? (e.g. 8–11 AM / 11–2 PM / 2–5 PM)\n"
    "     → Fixed options ('Reply 1, 2, or 3') are far more reliable than free-text for parsing.\n\n"
    "  Q: How far out should jobs be included in the blast? Next day only, or next 3 days?\n\n"
    "  Q: If a vendor doesn't reply, how long before re-nudge? And before escalation to Nick?\n"
    "     → e.g. 2 hours → second text. 4 hours → Nick gets alerted.\n\n"
    "  Q: Once a window is confirmed, who gets notified — homeowner only, or also the moving company (e.g. Jade)?\n\n"

    "DRAFT VENDOR SMS — get Nick to approve on the call:\n"
    "  'Hi [Vendor Name] — Emma from Relo Solutions. You have a job on [Date] for [Homeowner]\n"
    "  in [City]. Please reply with your window: 1 for 8–11 AM, 2 for 11–2 PM, 3 for 2–5 PM.'\n\n"
)

# ────────────────────────────────
# SECTION E: INFRASTRUCTURE
# ────────────────────────────────
mark("secE_start")
insert("SECTION E — Infrastructure & Compliance\n")
mark("secE_end")

insert(
    "TECH STACK DECISIONS:\n\n"
    "  SMS platform\n"
    "  → Recommend Twilio (industry standard, easy setup). Does RSG already have an account?\n\n"
    "  AI Phone (Module 02)\n"
    "  → Options: Twilio Voice + LLM, Vapi, Bland AI. Recommend Twilio Voice + GPT-4o for flexibility.\n\n"
    "  AI provider\n"
    "  → GPT-4o for structured data extraction. Confirm no RSG data policy blockers.\n\n"
    "  Hosting\n"
    "  → Railway or Render — simple, covered by the $750/mo retainer.\n\n"
    "  Emma's phone number\n"
    "  → New Twilio number vs forwarding the existing RSG number. Ask Jimmy — same number is cleaner for customers.\n\n"

    "⚠ TCPA COMPLIANCE\n"
    "Automated SMS to consumers (homeowners) requires prior express written consent.\n"
    "Confirm with Jimmy that homeowners opt in to automated texts when placing their order.\n"
    "This must be confirmed before Emma sends a single text.\n\n"

    "⚠ DATA PRIVACY\n"
    "Homeowner names, phone numbers, and job details will pass through the AI API (OpenAI or Anthropic).\n"
    "Confirm RSG has no contractual or compliance restriction on this.\n"
    "If they serve government or military moves, there may be stricter data handling requirements.\n\n"
)

# ────────────────────────────────
# WALK-AWAY CHECKLIST
# ────────────────────────────────
mark("checklist_start")
insert("MUST WALK AWAY WITH TODAY — CHECKLIST\n")
mark("checklist_end")

insert(
    "From Bitopan:\n"
    "  ☐  Admin portal URL + login (read/write)\n"
    "  ☐  API key + docs/Postman collection\n"
    "  ☐  Webhook for new orders confirmed or in-progress\n"
    "  ☐  Homeowner phone: required field? (yes/no)\n"
    "  ☐  Vendor mobile number: on profile? (yes/no)\n"
    "  ☐  Staging environment (or confirmation it'll be created)\n\n"

    "From Jimmy:\n"
    "  ☐  Approved Emma intro SMS (exact wording)\n"
    "  ☐  TCPA opt-in confirmation (yes homeowners opted in)\n"
    "  ☐  AI disclosure decision (does Emma say she's AI?)\n"
    "  ☐  Auto-confirm or manual review after info collected?\n"
    "  ☐  Twilio account or go-ahead to create one\n\n"

    "From Nick:\n"
    "  ☐  Service window options (the exact time slots)\n"
    "  ☐  Morning blast time (what hour Emma sends)\n"
    "  ☐  Vendor non-reply escalation timing\n"
    "  ☐  After-hours escalation preference (text/call/email + Nick's number)\n"
    "  ☐  Approved vendor service window SMS (exact wording)\n"
)

# ── Send batchUpdate ────────────────────────────────────────────────────────
print(f"Sending {len(requests)} formatting requests...", flush=True)

# Split into batches of 50 to avoid request size limits
batch_size = 50
for i in range(0, len(requests), batch_size):
    batch = requests[i:i+batch_size]
    api("POST", f"https://docs.googleapis.com/v1/documents/{doc_id}:batchUpdate", {"requests": batch})

# ── Apply heading styles ────────────────────────────────────────────────────
style_requests = []

def heading(start, end, level=1):
    style_requests.append({
        "updateParagraphStyle": {
            "range": {"startIndex": start, "endIndex": end},
            "paragraphStyle": {"namedStyleType": f"HEADING_{level}"},
            "fields": "namedStyleType",
        }
    })

heading(positions["title_start"], positions["title_end"], 1)
heading(positions["modules_head_start"], positions["modules_head_end"], 2)
heading(positions["people_head_start"], positions["people_head_end"], 2)
heading(positions["secA_start"], positions["secA_end"], 2)
heading(positions["secB_start"], positions["secB_end"], 2)
heading(positions["secC_start"], positions["secC_end"], 2)
heading(positions["secD_start"], positions["secD_end"], 2)
heading(positions["secE_start"], positions["secE_end"], 2)
heading(positions["checklist_start"], positions["checklist_end"], 2)
heading(positions["sum_head_start"], positions["sum_head_end"], 2)

# Bold the module names inline
for label, start_key in []:
    pass  # heading styles cover it

api("POST", f"https://docs.googleapis.com/v1/documents/{doc_id}:batchUpdate", {"requests": style_requests})

# ── Share with Kevin ────────────────────────────────────────────────────────
print("Sharing doc...", flush=True)
share_body = json.dumps({
    "role": "writer",
    "type": "user",
    "emailAddress": "kevinfar@gmail.com",
}).encode()
share_req = urllib.request.Request(
    f"https://www.googleapis.com/drive/v3/files/{doc_id}/permissions?sendNotificationEmail=true",
    data=share_body,
    method="POST",
)
share_req.add_header("Authorization", f"Bearer {access_token}")
share_req.add_header("Content-Type", "application/json")
with urllib.request.urlopen(share_req) as r:
    print("Shared:", json.loads(r.read()).get("role"), flush=True)

print(f"\n✓ Done! Open your doc here:")
print(f"  https://docs.google.com/document/d/{doc_id}/edit")
