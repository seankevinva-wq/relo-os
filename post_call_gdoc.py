#!/usr/bin/env python3
"""
Appends post-call decisions section to the RSG onboarding doc.
Inserts a Call Summary at the beginning and appends a full decisions log.
"""
import json
import urllib.parse
import urllib.request
import urllib.error

TOKEN_FILE = "/home/kevin/sean/google_auth/token.json"
DOC_ID = "1ftQdOu-0pkkYhnEHt-bOFm7XQggmlbvCuVhfKcy1BuE"

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
        return json.loads(r.read())["access_token"]

print("Refreshing token...", flush=True)
access_token = refresh_token(tok)

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

# ── Step 1: Insert call summary at the very top (index 1) ──────────────────
print("Inserting call summary at top...", flush=True)

SUMMARY_TEXT = (
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
    "CALL HAPPENED — MARCH 26, 2026. THIS DOC IS NOW A DECISIONS LOG.\n"
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
    "\n"
    "CALL SUMMARY — March 26, 2026 (74 min)\n"
    "\n"
    "Attendees: Kevin (Jam AI), Jimmy Walsh (RSG), Nick Walsh (RSG), "
    "Kristin Nyce (RSG — Nick's assistant), Bitopan Das (RSG platform), Jam Anderson (Jam AI)\n"
    "\n"
    "KEY DECISIONS — THE SHORT VERSION:\n"
    "  ✓  All 3 modules confirmed (Warm Handoff, After-Hours Phone, Service Windows)\n"
    "  ✓  Emma discloses she is AI — confirmed by Jimmy\n"
    "  ✓  Emma contacts the TRANSFEREE (homeowner), not the moving coordinator\n"
    "  ✓  AI name stays 'Emma' for now — Jimmy wants a company-wide naming vote\n"
    "  ✓  Pricing via Emma: OUT OF SCOPE for Phase 1 — Jimmy killed this\n"
    "  ✓  Auto-confirm = human-in-loop first (Emma tab in portal, log original vs tweaked)\n"
    "  ✓  2 reminders then escalate to human CS (initial + 1 follow-up)\n"
    "  ✓  Dual phone logic: try primary → try secondary (spouse) → human\n"
    "  ✓  New Twilio number (not existing RSG number)\n"
    "  ✓  After-hours routing: vendor calls → Nick, CS/homeowner calls → CS portal tab\n"
    "  ✓  Service window blast: day-before 5–7 PM, day-of 7–8 AM (vendor's timezone)\n"
    "  ✓  Fri→Mon jobs: 3 nudges (Fri evening, Sun, Mon morning)\n"
    "  ✓  5 reply options incl. 'Left message' + 'Custom time'\n"
    "  ✓  No Nick escalation if vendor doesn't reply (dispatch tab shows who's missing)\n"
    "  ✓  Tools: MailChimp + Mandrill for email, no SMS platform yet → fresh Twilio\n"
    "  ✓  API access target: April 6th (Bitopan)\n"
    "\n"
    "ACTION ITEMS:\n"
    "  ☐  Jimmy — research TCPA opt-in compliance for automated SMS\n"
    "  ☐  Jimmy — provide confirmation manual + CS scripts/SOPs for Emma's knowledge base\n"
    "  ☐  Nick + Kristin — document edge cases before April 9th meeting\n"
    "  ☐  Bitopan — API endpoints + webhooks ready by April 6th\n"
    "  ☐  Bitopan — build 'Emma confirmed jobs tab' in portal (human review flow)\n"
    "  ☐  RSG — provide list of vendor phone numbers (for caller ID matching)\n"
    "  ☐  Kevin — have something concrete to demo by April 9th\n"
    "\n"
    "NEXT MEETING: April 9th — same time (8 AM Kevin / 10 AM Nick)\n"
    "\n"
)

insert_top = [{"insertText": {"location": {"index": 1}, "text": SUMMARY_TEXT}}]
api("POST", f"https://docs.googleapis.com/v1/documents/{DOC_ID}:batchUpdate", {"requests": insert_top})

# Style the inserted heading
offset = len(SUMMARY_TEXT)
# Find where "CALL SUMMARY" heading starts (after the divider lines)
divider_len = len("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCALL HAPPENED — MARCH 26, 2026. THIS DOC IS NOW A DECISIONS LOG.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n")
summary_heading_start = 1 + divider_len
summary_heading_end = summary_heading_start + len("CALL SUMMARY — March 26, 2026 (74 min)\n")

api("POST", f"https://docs.googleapis.com/v1/documents/{DOC_ID}:batchUpdate", {"requests": [
    {
        "updateParagraphStyle": {
            "range": {"startIndex": summary_heading_start, "endIndex": summary_heading_end},
            "paragraphStyle": {"namedStyleType": "HEADING_1"},
            "fields": "namedStyleType",
        }
    }
]})

# ── Step 2: Append full decisions log at the end ────────────────────────────
print("Fetching doc end index...", flush=True)
doc = api("GET", f"https://docs.googleapis.com/v1/documents/{DOC_ID}")
end_index = doc["body"]["content"][-1]["endIndex"] - 1

requests = []
_cursor = end_index
positions = {}

def insert(text):
    global _cursor
    requests.append({"insertText": {"location": {"index": _cursor}, "text": text}})
    _cursor += len(text)

def mark(key):
    positions[key] = _cursor

insert("\n")
mark("decisions_title_start")
insert("DECISIONS LOG — What Was Decided on the March 26 Call\n")
mark("decisions_title_end")
insert("This section replaces the open questions above with confirmed answers.\n\n")

# ── People update ──
mark("ppl_start")
insert("UPDATED: Key People — Add Kristin Nyce\n")
mark("ppl_end")
insert(
    "Kristin Nyce — RSG, Nick's assistant\n"
    "Day-to-day dispatch operations. Heavily involved in service window details.\n"
    "The person who flagged the 'Left message' option and the evening-before blast timing.\n"
    "Go to Kristin for: operational specifics on Module 05, vendor behavior patterns,\n"
    "customer service workflow edge cases.\n\n"
)

# ── Section A decisions ──
mark("secA_start")
insert("SECTION A UPDATES — System Access (Bitopan)\n")
mark("secA_end")
insert(
    "CONFIRMED:\n"
    "  • API access target date: April 6, 2026\n"
    "    Bitopan is building APIs in parallel with the crew mobile app.\n"
    "    Vendor APIs + webhooks will be ready after mobile app APIs are done + tested.\n\n"
    "  • Email platform in use: MailChimp + Mandrill — already deployed, no changes needed\n\n"
    "  • SMS platform: NONE currently — we set up Twilio from scratch\n\n"
    "  • No existing automations (Zapier, Make, scripts) — clean slate\n\n"
    "STILL OPEN:\n"
    "  ☐  Staging environment — not discussed on the call. Follow up with Bitopan.\n"
    "  ☐  Bitopan to confirm: is homeowner phone a required field? (not answered on call)\n"
    "  ☐  Bitopan to confirm: do vendor profiles have mobile numbers?\n\n"
    "NOTE: Bitopan open to building specific endpoints as needed.\n"
    "Variable naming flexible — take the conversation offline with Bitopan on specifics.\n\n"
)

# ── Section B decisions ──
mark("secB_start")
insert("SECTION B UPDATES — Module 01: Emma Warm Handoff\n")
mark("secB_end")
insert(
    "CONFIRMED:\n"
    "  • Emma contacts the TRANSFEREE (homeowner) — NOT the moving coordinator\n"
    "    Bitopan asked, Jimmy confirmed. This was the key clarification.\n\n"
    "  • Emma discloses she is AI — Jimmy confirmed yes\n"
    "    Draft intro: 'Hi [Name], this is Emma from Relo Solutions Group. I'm an AI assistant\n"
    "    working with [Moving Company] on your upcoming move. I need a few quick details —\n"
    "    can you help me with [first question]?'\n\n"
    "  • Pricing via Emma: OUT OF SCOPE FOR PHASE 1\n"
    "    Jimmy explicitly shut this down: 'I think we're getting off on something that is\n"
    "    really down the road.' Do not build pricing logic in Phase 1.\n\n"
    "  • Auto-confirm = human-in-loop first\n"
    "    Jimmy wants Bitopan to build an 'Emma confirmed jobs tab' in the portal.\n"
    "    Flow: Emma collects info → CS team reviews in tab → human confirms → job flips status.\n"
    "    Log original AI output vs human-tweaked version to improve Emma over time.\n"
    "    Phase 2 goal: once trust is established, flip to auto-confirm.\n\n"
    "  • Reminders: 2 contacts then escalate\n"
    "    Initial contact → 1 reminder → then human CS team takes over.\n\n"
    "  • Dual phone number logic\n"
    "    Many jobs have both spouses' numbers. Flow:\n"
    "    1. Text primary contact\n"
    "    2. If no response → text secondary contact (spouse)\n"
    "    3. If still no response → escalate to human CS\n\n"
    "ACTION ITEMS:\n"
    "  ☐  Jimmy to provide: confirmation manual (the CS roadmap for new staff)\n"
    "  ☐  Jimmy to provide: CS scripts and SOPs → feeds Emma's knowledge base\n"
    "  ☐  AI name TBD: Jimmy wants company-wide vote. 'Emma' is placeholder only.\n\n"
)

# ── Section C decisions ──
mark("secC_start")
insert("SECTION C UPDATES — Module 02: After-Hours AI Phone\n")
mark("secC_end")
insert(
    "CONFIRMED:\n"
    "  • New Twilio number (not existing RSG number) — Kevin recommended, Jimmy agreed\n\n"
    "  • Escalation routing — THE KEY DECISION:\n"
    "    Vendor/service partner calls → TEXT NICK (Nick confirmed)\n"
    "    Homeowner / CS calls → EMAIL or PORTAL TAB for CS team (NOT Nick's phone)\n"
    "    How Emma knows who's who: RSG will provide list of all vendor phone numbers\n"
    "    so Emma can recognize them by caller ID\n\n"
    "  • After-hours call handling — what Emma does:\n"
    "    - Takes summary + transcript (NOT audio WAV files)\n"
    "    - Goes into a portal tab where CS can 'accept' with time/date stamp\n"
    "    - Whoever accepts it owns it — prevents duplicate work across the team\n"
    "    - Bitopan to build Emma portal first; eventually integrate into RSG admin system\n\n"
    "  • Emma acts, not just relays\n"
    "    Example: homeowner asks 'what time is the crew coming?'\n"
    "    Emma shouldn't just say 'I don't know.' She should:\n"
    "    1. Tell homeowner she'll find out\n"
    "    2. Text the vendor asking for their window, include a hyperlink to set it in the portal\n"
    "    3. When vendor responds via the link, it updates the portal\n"
    "    4. Emma then texts the homeowner with the confirmed window\n"
    "    Jimmy: 'Act on it like a normal employee would.'\n\n"
    "  • Emergency calls: take everything initially, learn as we go\n"
    "    Nick's concern about false emergencies acknowledged.\n"
    "    Jimmy: 'Initially we take it all. We're going to learn as we go.'\n"
    "    Emma offers: 'If this is an emergency, I can alert our team. Otherwise I'll\n"
    "    take your details and someone will call you first thing tomorrow.'\n\n"
    "  • Angry callers / AI resistance (Kristin's concern):\n"
    "    Nick: 'If I call a company at midnight and get an AI, I'm not going to be pissed\n"
    "    because I put myself in that situation.'\n"
    "    Agreed: Emma empathizes, takes the info, promises human follow-up. Iterate in prod.\n\n"
    "ADDITIONAL AFTER-HOURS CALL TYPES (Jimmy added):\n"
    "  • West Coast tech calling with additional service authorization request\n"
    "    (e.g. homeowner asking for extra work not on the order at 9 PM)\n"
    "    → Emma collects details, routes to dispatch team\n"
    "  • Vendor calling to confirm job timing / homeowner asking for same\n"
    "    → Emma closes the loop by contacting the other party (see 'Emma acts' above)\n\n"
)

# ── Section D decisions ──
mark("secD_start")
insert("SECTION D UPDATES — Module 05: Service Window Collection\n")
mark("secD_end")
insert(
    "CONFIRMED — BLAST SCHEDULE (FINALIZED):\n\n"
    "  Standard jobs (not Friday→Monday):\n"
    "  • Message 1: Day BEFORE the job, 5–7 PM vendor's local timezone\n"
    "  • Message 2: Day OF the job, 7–8 AM vendor's local timezone\n"
    "    (Second message should have a more assertive tone — 'we need this now')\n\n"
    "  Friday → Monday jobs (special case):\n"
    "  • Message 1: Friday, 5–7 PM\n"
    "  • Message 2: Sunday (same time, 5–7 PM)\n"
    "  • Message 3: Monday, 7–8 AM\n"
    "  Reason: avoids vendors waiting until Monday morning — builds in a weekend buffer.\n\n"
    "CONFIRMED — 5 REPLY OPTIONS:\n"
    "  1  →  8–11 AM\n"
    "  2  →  11 AM–2 PM\n"
    "  3  →  2–5 PM\n"
    "  4  →  Custom time (for after-5pm requests — some clients demand this)\n"
    "  5  →  Left message — vendor called homeowner, no answer, left voicemail with\n"
    "          intended window. Window is noted but homeowner hasn't confirmed.\n"
    "          (Kristin's addition — common scenario in practice)\n\n"
    "CONFIRMED — ESCALATION:\n"
    "  NO escalation to Nick if vendor doesn't reply after final message.\n"
    "  Kristin: 'I think that is a little excessive. We can look in our dispatch tab\n"
    "  and see who has not put in their windows.'\n"
    "  Dispatch team monitors the tab manually for stragglers.\n\n"
    "CONFIRMED — NOTIFICATION ON WINDOW CONFIRMED:\n"
    "  Corporate/B2B moves: notify BOTH homeowner AND moving company client (e.g. Jade)\n"
    "  COD moves (consumer pays): notify homeowner only\n\n"
    "DRAFT VENDOR SMS — pending final approval:\n"
    "  Message 1 (day before, standard tone):\n"
    "  'Hi [Vendor Name] — Emma from Relo Solutions. You have a job on [Date] for\n"
    "  [Homeowner] in [City] (Job #[ID]). Please reply: 1 for 8–11 AM, 2 for 11–2 PM,\n"
    "  3 for 2–5 PM, 4 for custom time, or 5 if you left a message with the customer.'\n\n"
    "  Message 2 (day of, assertive tone):\n"
    "  'Hi [Vendor Name] — Emma again. We still need your service window for today's job\n"
    "  with [Homeowner] in [City]. Please reply now with your window (1/2/3/4/5).\n"
    "  The customer is waiting.'\n\n"
)

# ── Section F decisions ──
mark("secF_start")
insert("SECTION F UPDATES — Existing Tools Inventory (Confirmed)\n")
mark("secF_end")
insert(
    "  Outbound SMS to homeowners:  NONE — Twilio to be set up fresh\n"
    "  Outbound SMS to vendors:     NONE — Twilio to be set up fresh\n"
    "  Outbound email platform:     MailChimp + Mandrill (already deployed)\n"
    "  Internal comms (team):       Not discussed — follow up\n"
    "  Existing Twilio account:     NO\n"
    "  Any existing automations:    NONE — clean slate\n\n"
)

# ── Section G decisions ──
mark("secG_start")
insert("SECTION G UPDATES — Edge Cases (Partial — Nick + Kristin Still Discussing)\n")
mark("secG_end")
insert(
    "RESOLVED ON CALL:\n\n"
    "  Homeowner never responds after reminders\n"
    "  → 2 contacts (initial + 1 reminder), then human CS takes over\n\n"
    "  Order has both spouses' numbers\n"
    "  → Try primary → try secondary → then human. Emma doesn't spam both simultaneously.\n\n"
    "  Caller asks for pricing after hours\n"
    "  → OUT OF SCOPE for Phase 1. Emma says: 'A team member will get back to you.'\n\n"
    "  Caller wants to book a new job after hours\n"
    "  → Emma collects the info, says team will confirm. Jimmy: 'Generally we can fulfill\n"
    "  that request but a team member will be back to you.'\n\n"
    "  Angry caller who doesn't want to talk to AI\n"
    "  → Emma empathizes, takes the info, promises human follow-up by morning.\n"
    "  Nick: this will be refined in production based on real call patterns.\n\n"
    "  West Coast tech calling with additional service auth request\n"
    "  → Emma collects details (what extra service, what job, homeowner name), routes to dispatch\n\n"
    "STILL OPEN (Nick + Kristin to discuss before April 9th):\n"
    "  ☐  Homeowner with NO phone number on file — what does Emma do?\n"
    "  ☐  Vendor replies with 'Can't do this job' — does Emma reassign or flag to Nick?\n"
    "  ☐  Job date changes after window already confirmed — who re-notifies?\n"
    "  ☐  Vendor replies to window blast with free text (not a number)\n"
    "  ☐  Job cancelled after window collected — does Emma notify vendor?\n\n"
)

# ── Section H decisions ──
mark("secH_start")
insert("SECTION H UPDATES — Definition of Done & Next Steps\n")
mark("secH_end")
insert(
    "AGREED TIMELINE:\n"
    "  April 6, 2026  — Bitopan's APIs ready. Kevin begins integration.\n"
    "  April 9, 2026  — Next meeting (same time). Kevin to have something concrete to show.\n"
    "                   Nick + Kristin to have edge cases documented.\n\n"
    "HUMAN-REVIEW PHASE (before full go-live):\n"
    "  Jimmy confirmed: start with human-in-loop. Bitopan to build 'Emma confirmed jobs tab'.\n"
    "  Review period = parallel run. CS team reviews Emma's output before it's actioned.\n"
    "  Go-live criteria = when the team trusts Emma's output enough to reduce manual review.\n\n"
    "OPEN ITEMS FOR APRIL 9TH MEETING:\n"
    "  ☐  Kevin: working demo of at least one module\n"
    "  ☐  Jimmy: confirmation manual + CS scripts delivered\n"
    "  ☐  Jimmy: TCPA research complete\n"
    "  ☐  Nick + Kristin: edge cases documented\n"
    "  ☐  Bitopan: API access available or clear ETA\n"
    "  ☐  RSG: vendor phone number list shared with Kevin\n\n"
)

# ── Send all inserts ────────────────────────────────────────────────────────
print(f"Sending {len(requests)} requests...", flush=True)
batch_size = 50
for i in range(0, len(requests), batch_size):
    api("POST", f"https://docs.googleapis.com/v1/documents/{DOC_ID}:batchUpdate",
        {"requests": requests[i:i+batch_size]})

# ── Apply heading styles ────────────────────────────────────────────────────
style_reqs = []
for key, level in [
    ("decisions_title_start", 1),
    ("ppl_start", 2), ("secA_start", 2), ("secB_start", 2),
    ("secC_start", 2), ("secD_start", 2), ("secF_start", 2),
    ("secG_start", 2), ("secH_start", 2),
]:
    end_key = key.replace("start", "end")
    style_reqs.append({
        "updateParagraphStyle": {
            "range": {"startIndex": positions[key], "endIndex": positions[end_key]},
            "paragraphStyle": {"namedStyleType": f"HEADING_{level}"},
            "fields": "namedStyleType",
        }
    })

api("POST", f"https://docs.googleapis.com/v1/documents/{DOC_ID}:batchUpdate", {"requests": style_reqs})

print(f"\n✓ Done!")
print(f"  https://docs.google.com/document/d/{DOC_ID}/edit")
