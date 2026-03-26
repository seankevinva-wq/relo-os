#!/usr/bin/env python3
"""
Appends sections 3, 4, 5 to the existing RSG onboarding doc.
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

# Get current doc end index
print("Fetching doc...", flush=True)
doc = api("GET", f"https://docs.googleapis.com/v1/documents/{DOC_ID}")
body_content = doc["body"]["content"]
end_index = body_content[-1]["endIndex"] - 1  # insert before final newline

requests = []
_cursor = end_index

def insert(text):
    global _cursor
    requests.append({"insertText": {"location": {"index": _cursor}, "text": text}})
    _cursor += len(text)

positions = {}
def mark(key):
    positions[key] = _cursor

# ────────────────────────────────
# SECTION F: EXISTING TOOLS
# ────────────────────────────────
mark("secF_start")
insert("SECTION F — Existing Tools Inventory\n")
mark("secF_end")

insert(
    "Before building, understand what RSG already uses so we know what we're replacing vs adding to.\n\n"

    "QUESTIONS FOR JIMMY / BITOPAN:\n"
    "  Q: Do you use any SMS tool today for contacting homeowners or vendors?\n"
    "     → e.g. Twilio, SimpleTexting, Podium, manual texting from personal phones?\n"
    "     → If they already have a Twilio account, we reuse it. If personal phones, we're introducing SMS infrastructure from scratch.\n\n"
    "  Q: What email platform does RSG use for outbound emails?\n"
    "     → e.g. Gmail, Outlook, SendGrid, Mailchimp? The Monday morning estimate report and order acknowledgements go out somewhere.\n\n"
    "  Q: How does Nick currently contact vendors — phone call, email, or both?\n"
    "     → If vendors only know RSG via email, SMS cold-blast for Module 05 may need a warm intro first.\n\n"
    "  Q: Is there any existing automation in the portal today? (Zapier, Make, internal scripts?)\n"
    "     → We don't want to duplicate or conflict with anything Bitopan already has running.\n\n"
    "  Q: What does RSG use for internal communication — Slack, Teams, email, group text?\n"
    "     → Relevant for how Emma escalates to Nick and how we notify the team of issues.\n\n"

    "TOOL INVENTORY TABLE — fill in on the call:\n"
    "  Outbound SMS to homeowners:  ________________________\n"
    "  Outbound SMS to vendors:     ________________________\n"
    "  Outbound email platform:     ________________________\n"
    "  Internal comms (team):       ________________________\n"
    "  Existing Twilio account?     YES / NO\n"
    "  Any existing automations?    ________________________\n\n"
)

# ────────────────────────────────
# SECTION G: EDGE CASES
# ────────────────────────────────
mark("secG_start")
insert("SECTION G — Edge Cases to Define Before Building\n")
mark("secG_end")

insert(
    "These are the scenarios that will cause the build to stall if left undefined.\n"
    "Go through each one on the call and write in the agreed behavior.\n\n"

    "MODULE 01 — WARM HANDOFF EDGE CASES:\n\n"

    "  Homeowner has no phone number on file\n"
    "  → Emma can't text. Options: (a) flag to CS team to call manually, (b) skip and wait for homeowner to call in, (c) send email instead\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Homeowner replies with something Emma can't understand\n"
    "  → e.g. 'Call me instead', long angry paragraph, message in another language\n"
    "  → Options: (a) Emma apologizes and flags to CS, (b) Emma asks them to clarify, (c) escalate after 1 unrecognized reply\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Homeowner never responds after all reminders\n"
    "  → After reminder 1, reminder 2, what happens? Does the job stay in limbo or get flagged for human follow-up?\n"
    "  → How many days before the job date does this become urgent?\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Job date changes after Emma already confirmed with homeowner\n"
    "  → Someone in the portal updates the date. Does Emma automatically re-notify the homeowner?\n"
    "  → Or does a human handle date changes manually?\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Order has multiple service types (e.g. piano + appliances)\n"
    "  → Does Emma ask all questions in one message, or one service type at a time?\n"
    "  → What's the max number of questions in a single text before it gets overwhelming?\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "MODULE 02 — AFTER-HOURS PHONE EDGE CASES:\n\n"

    "  Caller ID not recognized (not in the system)\n"
    "  → Emma has no job to pull up. Options: (a) take a message and send to Nick, (b) ask for their name and job reference, (c) give a generic 'call back during business hours' message\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Known homeowner calls but their job is tomorrow morning\n"
    "  → This is urgent. Does Emma wake Nick up, or wait until 7 AM?\n"
    "  → Is there a cutoff (e.g. jobs within 12 hours = always escalate immediately)?\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Homeowner wants to cancel or reschedule\n"
    "  → Emma should never commit to a reschedule without human approval. How does she handle the call?\n"
    "  → Does she say 'I've noted your request, someone will call you first thing tomorrow'?\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Caller is a vendor with an urgent same-day problem\n"
    "  → e.g. 'I can't make it tomorrow, flat tire' at 11 PM\n"
    "  → This needs Nick. Text immediately or wait?\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "MODULE 05 — SERVICE WINDOW EDGE CASES:\n\n"

    "  Vendor doesn't reply to Emma's morning blast\n"
    "  → After how long does Emma re-nudge? After how long does Nick get alerted?\n"
    "  → e.g. No reply by 10 AM → second text. No reply by noon → Nick gets a flag.\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Vendor replies with a window that conflicts with the homeowner's availability\n"
    "  → Who resolves the conflict? Does Emma know what the homeowner's availability is?\n"
    "  → Or is any window the vendor offers automatically accepted?\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Vendor replies with something other than a valid window option\n"
    "  → e.g. 'Can't do this job', free text like 'around 9ish', or no reply at all\n"
    "  → Emma needs to handle 'can't do it' (reassign?) and unclear replies (ask to clarify)\n"
    "  Agreed behavior: ________________________________________________\n\n"

    "  Job gets cancelled after Emma already collected a window\n"
    "  → Does Emma notify the vendor? Or is that always a human call?\n"
    "  Agreed behavior: ________________________________________________\n\n"
)

# ────────────────────────────────
# SECTION H: DEFINITION OF DONE
# ────────────────────────────────
mark("secH_start")
insert("SECTION H — Definition of Done & Go-Live Criteria\n")
mark("secH_end")

insert(
    "This section defines what 'Phase 1 complete' means so everyone agrees before we start.\n"
    "Fill in the blanks together on the call.\n\n"

    "WHAT DOES SUCCESS LOOK LIKE?\n\n"

    "  Module 01 — Emma Warm Handoff\n"
    "  ✓ Emma sends the first text within ___ minutes of a new order being placed\n"
    "  ✓ Emma successfully collects all required info for at least ___% of new orders\n"
    "  ✓ CS team confirms their manual call volume dropped noticeably\n"
    "  Go-live threshold (agreed): ________________________________________________\n\n"

    "  Module 02 — After-Hours Phone\n"
    "  ✓ Emma answers 100% of calls between 8 PM and 7 AM\n"
    "  ✓ Known homeowners can get their job details without calling back during hours\n"
    "  ✓ Nick confirms he stopped receiving after-hours calls on his personal phone\n"
    "  Go-live threshold (agreed): ________________________________________________\n\n"

    "  Module 05 — Service Window Collection\n"
    "  ✓ Emma's morning blast goes out at the agreed time every day\n"
    "  ✓ Vendor replies auto-populate into the portal without Nick touching it\n"
    "  ✓ Nick confirms his morning call routine has been eliminated\n"
    "  Go-live threshold (agreed): ________________________________________________\n\n"

    "PARALLEL RUN PERIOD:\n"
    "  Will the team run Emma alongside the existing manual process for a period before fully switching over?\n"
    "  (Recommended: yes, for 1–2 weeks. Lets you catch issues without risking real jobs.)\n"
    "  Parallel run: YES / NO    Duration: ___________\n\n"

    "WHO SIGNS OFF ON GO-LIVE?\n"
    "  Sign-off person at RSG: ________________________________________________\n"
    "  Sign-off person at Jam AI: ________________________________________________\n\n"

    "WHAT TRIGGERS PHASE 2 SCOPING?\n"
    "  Options: (a) After X weeks of Phase 1 running smoothly, (b) After specific metric is hit,\n"
    "  (c) Fixed date, (d) Jimmy/Nick decide when ready\n"
    "  Agreed trigger: ________________________________________________\n\n"

    "KNOWN RISKS & ASSUMPTIONS:\n"
    "  • Assuming all homeowners have mobile numbers in the portal — to be confirmed with Bitopan\n"
    "  • Assuming vendors have mobile numbers on their profiles — to be confirmed with Bitopan\n"
    "  • Assuming TCPA opt-in exists for homeowners — to be confirmed with Jimmy\n"
    "  • Assuming Bitopan can build/expose a webhook for new orders — to be confirmed\n"
    "  • Assuming vendors will respond to SMS (some may prefer email or phone)\n"
    "  Additional risks identified on call: ________________________________________________\n\n"
)

# ── Send all inserts ────────────────────────────────────────────────────────
print(f"Sending {len(requests)} insert requests...", flush=True)
batch_size = 50
for i in range(0, len(requests), batch_size):
    batch = requests[i:i+batch_size]
    api("POST", f"https://docs.googleapis.com/v1/documents/{DOC_ID}:batchUpdate", {"requests": batch})

# ── Apply heading styles ────────────────────────────────────────────────────
style_requests = []
for key, level in [("secF_start", 2), ("secG_start", 2), ("secH_start", 2)]:
    end_key = key.replace("start", "end")
    style_requests.append({
        "updateParagraphStyle": {
            "range": {"startIndex": positions[key], "endIndex": positions[end_key]},
            "paragraphStyle": {"namedStyleType": f"HEADING_{level}"},
            "fields": "namedStyleType",
        }
    })

api("POST", f"https://docs.googleapis.com/v1/documents/{DOC_ID}:batchUpdate", {"requests": style_requests})
print("Done! Doc updated:")
print(f"  https://docs.google.com/document/d/{DOC_ID}/edit")
