// ─── Interfaces ────────────────────────────────────────────────────────────

export type JobStatus =
  | "pending_info"
  | "needs_dispatch"
  | "dispatched"
  | "window_confirmed"
  | "active"
  | "complete"
  | "at_risk"

export type ServiceType =
  | "Piano Prep"
  | "Pool Table"
  | "Chandelier"
  | "Fitness Equipment"
  | "Safe Moving"
  | "Artwork Installation"
  | "Hot Tub"
  | "Gun Safe"

export interface InfoItem {
  id: string
  label: string
  group: string
  collected: boolean
  value?: string
  reminderCount?: number
  lastReminderHrsAgo?: number
}

export interface SMSMessage {
  id: string
  sender: "emma" | "homeowner"
  text: string
  timestamp: string
  isAfterHours?: boolean
}

export interface Job {
  id: string
  homeowner: string
  homeownerPhone: string
  serviceType: ServiceType
  address: string
  city: string
  state: string
  scheduledDate: string
  status: JobStatus
  vendorId: string | null
  infoItems: InfoItem[]
  messages: SMSMessage[]
  techName?: string
  windowConfirmed?: string
  createdAt: string
}

export interface Vendor {
  id: string
  name: string
  markets: string[]
  serviceTypes: ServiceType[]
  tier: 1 | 2 | 3
  qaScore: number
  totalJobs: number
  availabilityStatus: "available" | "busy" | "unavailable"
  distanceMi?: number
  certifications: string[]
  preferredTier: boolean
}

export interface DispatchMatch {
  vendorId: string
  matchScore: number
  distanceMi: number
  reasoning: string[]
}

export interface DispatchRule {
  label: string
  explanation: string
}

export interface AIEvent {
  id: string
  timestamp: string
  channel: "sms" | "phone" | "email"
  contactName: string
  contactRole: "homeowner" | "vendor" | "client" | "unknown"
  jobId: string
  summary: string
  outcome: "resolved" | "awaiting" | "escalated"
  isAfterHours: boolean
  transcript?: { sender: string; text: string }[]
  category: "confirmation" | "info_chase" | "service_window" | "vendor_nudge" | "after_hours" | "client_notification" | "invoice_generated"
  invoicePreview?: {
    invoiceNumber: string
    vendorName: string
    vendorEmail: string
    jobId: string
    serviceDate: string
    serviceType: string
    lineItems: { description: string; amount: number }[]
    total: number
    status: "sent" | "pending"
  }
}

export interface VendorCompliance {
  id: string
  vendorId: string
  vendorName: string
  jobId: string
  serviceDate: string
  invoiceDueDate: string
  status: "submitted" | "on_track" | "overdue_24h" | "overdue_48h" | "warning_issued"
  daysSinceJob: number
  nudges: {
    day: number
    type: string
    message: string
    timestamp: string
    escalated?: boolean
  }[]
}

// ─── Vendors ───────────────────────────────────────────────────────────────

export const VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "Rocky Mountain Services",
    markets: ["NH", "MA", "VT", "ME"],
    serviceTypes: ["Piano Prep", "Pool Table", "Safe Moving"],
    tier: 1,
    qaScore: 4.9,
    totalJobs: 187,
    availabilityStatus: "available",
    distanceMi: 12,
    certifications: ["Piano Technicians Guild", "AMSA Certified"],
    preferredTier: true,
  },
  {
    id: "v2",
    name: "Northeast Specialty Movers",
    markets: ["MA", "CT", "RI"],
    serviceTypes: ["Piano Prep", "Artwork Installation", "Chandelier"],
    tier: 2,
    qaScore: 4.2,
    totalJobs: 94,
    availabilityStatus: "available",
    distanceMi: 34,
    certifications: ["AMSA Certified"],
    preferredTier: false,
  },
  {
    id: "v3",
    name: "Midwest Moving Pros",
    markets: ["IL", "IN", "OH", "WI", "MN"],
    serviceTypes: ["Fitness Equipment", "Piano Prep", "Pool Table"],
    tier: 1,
    qaScore: 4.7,
    totalJobs: 143,
    availabilityStatus: "available",
    distanceMi: 8,
    certifications: ["Piano Technicians Guild", "AMSA Certified"],
    preferredTier: true,
  },
  {
    id: "v4",
    name: "Pacific Coast Specialists",
    markets: ["WA", "OR", "CA", "ID"],
    serviceTypes: ["Piano Prep", "Pool Table", "Chandelier", "Artwork Installation", "Hot Tub"],
    tier: 2,
    qaScore: 4.4,
    totalJobs: 76,
    availabilityStatus: "busy",
    distanceMi: 18,
    certifications: ["AMSA Certified"],
    preferredTier: false,
  },
  {
    id: "v5",
    name: "Lone Star Relocation",
    markets: ["TX", "OK", "NM", "AR"],
    serviceTypes: ["Piano Prep", "Pool Table", "Fitness Equipment", "Gun Safe", "Hot Tub"],
    tier: 1,
    qaScore: 4.8,
    totalJobs: 212,
    availabilityStatus: "available",
    distanceMi: 6,
    certifications: ["Piano Technicians Guild", "AMSA Certified", "ISSA Certified"],
    preferredTier: true,
  },
  {
    id: "v6",
    name: "AllState Specialty Co.",
    markets: ["NH", "MA", "NY", "NJ", "PA", "MD"],
    serviceTypes: ["Pool Table"],
    tier: 3,
    qaScore: 3.8,
    totalJobs: 31,
    availabilityStatus: "available",
    distanceMi: 47,
    certifications: [],
    preferredTier: false,
  },
]

// ─── Jobs ──────────────────────────────────────────────────────────────────

export const JOBS: Job[] = [
  // RSG-2847 — Jennifer Mills — Piano Prep — Manchester NH — pending_info — 6/8 items (HERO)
  {
    id: "RSG-2847",
    homeowner: "Jennifer Mills",
    homeownerPhone: "+1 (603) 555-0182",
    serviceType: "Piano Prep",
    address: "14 Birchwood Drive",
    city: "Manchester",
    state: "NH",
    scheduledDate: "2026-03-04",
    status: "pending_info",
    vendorId: null,
    techName: undefined,
    windowConfirmed: undefined,
    createdAt: "2026-02-24T09:15:00Z",
    infoItems: [
      { id: "i1", label: "Piano make & model", group: "Piano Details", collected: true, value: "Steinway Model B (1994)" },
      { id: "i2", label: "Piano dimensions (HxWxD)", group: "Piano Details", collected: true, value: "57\" × 79\" × 57\"" },
      { id: "i3", label: "Piano weight (approx)", group: "Piano Details", collected: true, value: "~680 lbs" },
      { id: "i4", label: "Grand or upright", group: "Piano Details", collected: true, value: "Grand" },
      { id: "i5", label: "Destination address", group: "Service Location", collected: true, value: "22 Maple Street, Concord NH 03301" },
      { id: "i6", label: "Floor level (origin)", group: "Service Location", collected: true, value: "1st floor, no stairs" },
      { id: "i7", label: "Floor level (destination)", group: "Service Location", collected: false, reminderCount: 2, lastReminderHrsAgo: 6 },
      { id: "i8", label: "Staircase photos", group: "Service Location", collected: false, reminderCount: 1, lastReminderHrsAgo: 18 },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Hi Jennifer! I'm Emma, RSG's AI coordinator. I'm reaching out to help prep for your piano relocation on March 4th. I just need a few quick details — can you confirm the make and model of your piano?", timestamp: "2026-02-24T09:20:00Z" },
      { id: "m2", sender: "homeowner", text: "Hi! Yes, it's a Steinway Model B, 1994.", timestamp: "2026-02-24T11:43:00Z" },
      { id: "m3", sender: "emma", text: "Perfect, thank you! And do you know the approximate dimensions and weight? For a Steinway B it's usually around 79\" wide and 680 lbs — does that sound right?", timestamp: "2026-02-24T11:45:00Z" },
      { id: "m4", sender: "homeowner", text: "Yes that sounds about right. It's a grand, first floor, no stairs here.", timestamp: "2026-02-24T14:22:00Z" },
      { id: "m5", sender: "emma", text: "Great! Last thing — what floor is the destination at 22 Maple St? And if there are any stairs, could you send a quick photo? That helps our team arrive fully prepared.", timestamp: "2026-02-24T14:24:00Z" },
      { id: "m6", sender: "emma", text: "Hey Jennifer, just a friendly follow-up on the destination floor and staircase photo. Our team schedules out 72 hrs in advance — want to lock you in before spots fill!", timestamp: "2026-02-25T10:00:00Z" },
      { id: "m7", sender: "homeowner", text: "Sorry, been busy. I'll try to send the photo tomorrow.", timestamp: "2026-02-25T19:52:00Z" },
      { id: "m8", sender: "emma", text: "No worries at all! I'll send a reminder tomorrow evening so it doesn't slip. You're all set otherwise — everything else is confirmed ✓", timestamp: "2026-02-25T19:54:00Z" },
      { id: "m9", sender: "emma", text: "Hi Jennifer! Just the staircase photo when you get a chance. Once we have that, we're good to go for March 4th 🎹", timestamp: "2026-02-26T22:47:00Z", isAfterHours: true },
      { id: "m10", sender: "homeowner", text: "Oh wow it's late, didn't realize. Will send in the morning!", timestamp: "2026-02-26T22:59:00Z", isAfterHours: true },
      { id: "m11", sender: "emma", text: "Perfect! No rush — I'm always on 😄 You're confirmed for March 4th. I'll send the staircase reminder at 9 AM.", timestamp: "2026-02-26T23:01:00Z", isAfterHours: true },
    ],
  },

  // RSG-2848 — Robert Chen — Pool Table — Boston MA — dispatched — 8/8
  {
    id: "RSG-2848",
    homeowner: "Robert Chen",
    homeownerPhone: "+1 (617) 555-0291",
    serviceType: "Pool Table",
    address: "88 Commonwealth Ave",
    city: "Boston",
    state: "MA",
    scheduledDate: "2026-03-06",
    status: "dispatched",
    vendorId: "v1",
    techName: "Marco T.",
    windowConfirmed: "1:00 PM – 4:00 PM",
    createdAt: "2026-02-22T14:00:00Z",
    infoItems: [
      { id: "i1", label: "Table brand & model", group: "Pool Table Details", collected: true, value: "Brunswick Gold Crown IV, 9-ft" },
      { id: "i2", label: "Table dimensions", group: "Pool Table Details", collected: true, value: "9-foot regulation" },
      { id: "i3", label: "Slate count", group: "Pool Table Details", collected: true, value: "3-piece slate" },
      { id: "i4", label: "Current floor level", group: "Service Location", collected: true, value: "Basement, stair access" },
      { id: "i5", label: "Destination floor", group: "Service Location", collected: true, value: "1st floor game room" },
      { id: "i6", label: "Doorway width (narrowest)", group: "Service Location", collected: true, value: "36 inches" },
      { id: "i7", label: "Preferred service window", group: "Scheduling", collected: true, value: "Afternoons, 1–5 PM" },
      { id: "i8", label: "Contact phone day-of", group: "Scheduling", collected: true, value: "(617) 555-0291" },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Hi Robert! Emma from RSG — confirming your pool table move on March 6th. Just need a few details to send the right crew.", timestamp: "2026-02-22T14:05:00Z" },
      { id: "m2", sender: "homeowner", text: "Sure, it's a Brunswick Gold Crown 9-footer. 3-piece slate, in the basement.", timestamp: "2026-02-22T16:30:00Z" },
      { id: "m3", sender: "emma", text: "Got it! Destination floor and narrowest doorway?", timestamp: "2026-02-22T16:32:00Z" },
      { id: "m4", sender: "homeowner", text: "Going to the first floor game room. Doorways are 36\" — we measured.", timestamp: "2026-02-22T17:15:00Z" },
      { id: "m5", sender: "emma", text: "Perfect. Rocky Mountain Services is dispatched — Marco T. will be there March 6th, 1–4 PM. You'll get a day-before reminder. Text this number with any questions!", timestamp: "2026-02-23T09:10:00Z" },
      { id: "m6", sender: "emma", text: "📤 Client notified — Jade Cogswell (Syracuse Moving & Storage) notified via email: service window confirmed March 6th, 10:00 AM – 1:00 PM.", timestamp: "2026-02-27T09:15:00Z" },
    ],
  },

  // RSG-2849 — Sarah Thompson — Chandelier — Austin TX — window_confirmed
  {
    id: "RSG-2849",
    homeowner: "Sarah Thompson",
    homeownerPhone: "+1 (512) 555-0374",
    serviceType: "Chandelier",
    address: "3201 Barton Hills Dr",
    city: "Austin",
    state: "TX",
    scheduledDate: "2026-03-05",
    status: "window_confirmed",
    vendorId: "v5",
    techName: "Jake L.",
    windowConfirmed: "9:00 AM – 12:00 PM",
    createdAt: "2026-02-20T10:30:00Z",
    infoItems: [
      { id: "i1", label: "Chandelier brand/type", group: "Fixture Details", collected: true, value: "Schonbek Versailles, crystal" },
      { id: "i2", label: "Fixture weight", group: "Fixture Details", collected: true, value: "~180 lbs" },
      { id: "i3", label: "Ceiling height", group: "Service Location", collected: true, value: "22 ft vaulted" },
      { id: "i4", label: "Electrical box spec", group: "Service Location", collected: true, value: "Fan-rated box confirmed" },
      { id: "i5", label: "Preferred window", group: "Scheduling", collected: true, value: "Morning before 1 PM" },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Hi Sarah! RSG here — confirming your chandelier installation March 5th with Lone Star Relocation. Jake L. will arrive 9 AM–12 PM. Reply YES to confirm!", timestamp: "2026-02-25T08:00:00Z" },
      { id: "m2", sender: "homeowner", text: "YES — confirmed! Thank you.", timestamp: "2026-02-25T08:23:00Z" },
      { id: "m3", sender: "emma", text: "Confirmed ✓ You'll receive a reminder the evening before. Jake will text you 30 min before arrival.", timestamp: "2026-02-25T08:25:00Z" },
    ],
  },

  // RSG-2850 — Marcus Davis — Fitness Equipment — Minneapolis MN — pending_info — at_risk
  {
    id: "RSG-2850",
    homeowner: "Marcus Davis",
    homeownerPhone: "+1 (612) 555-0447",
    serviceType: "Fitness Equipment",
    address: "512 Lake Harriet Blvd",
    city: "Minneapolis",
    state: "MN",
    scheduledDate: "2026-03-03",
    status: "at_risk",
    vendorId: null,
    createdAt: "2026-02-21T11:00:00Z",
    infoItems: [
      { id: "i1", label: "Equipment list", group: "Equipment Details", collected: false, reminderCount: 3, lastReminderHrsAgo: 4 },
      { id: "i2", label: "Total weight estimate", group: "Equipment Details", collected: false, reminderCount: 3, lastReminderHrsAgo: 4 },
      { id: "i3", label: "Treadmill brand/model", group: "Equipment Details", collected: true, value: "Life Fitness 95T" },
      { id: "i4", label: "Origin floor", group: "Service Location", collected: true, value: "2nd floor, 14 stairs" },
      { id: "i5", label: "Destination address", group: "Service Location", collected: false, reminderCount: 3, lastReminderHrsAgo: 4 },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Hi Marcus! Emma from RSG — your fitness equipment move is on March 3rd, just 10 days away. Need your equipment list to dispatch the right crew.", timestamp: "2026-02-21T11:05:00Z" },
      { id: "m2", sender: "emma", text: "Hey Marcus — quick follow-up on the equipment list. Can you reply with what's moving? Even a rough list helps!", timestamp: "2026-02-23T09:00:00Z" },
      { id: "m3", sender: "emma", text: "Marcus — your job is March 3rd and we still need the equipment list + destination address to dispatch. This is urgent — please reply today so we can lock in your crew!", timestamp: "2026-02-25T10:00:00Z", isAfterHours: false },
      { id: "m4", sender: "homeowner", text: "Sorry been crazy. I have a treadmill, elliptical, and a rack. Moving to a storage unit on Penn Ave.", timestamp: "2026-02-25T23:14:00Z", isAfterHours: true },
    ],
  },

  // RSG-2851 — Diane Okafor — Chandelier — Seattle WA — needs_dispatch
  {
    id: "RSG-2851",
    homeowner: "Diane Okafor",
    homeownerPhone: "+1 (206) 555-0528",
    serviceType: "Chandelier",
    address: "4411 Queen Anne Ave N",
    city: "Seattle",
    state: "WA",
    scheduledDate: "2026-03-07",
    status: "needs_dispatch",
    vendorId: null,
    createdAt: "2026-02-23T16:00:00Z",
    infoItems: [
      { id: "i1", label: "Chandelier type", group: "Fixture Details", collected: true, value: "Arteriors Drake, 24-light" },
      { id: "i2", label: "Fixture weight", group: "Fixture Details", collected: true, value: "~95 lbs" },
      { id: "i3", label: "Ceiling height", group: "Service Location", collected: true, value: "16 ft cathedral" },
      { id: "i4", label: "Electrical spec", group: "Service Location", collected: true, value: "Standard junction box, upgrading" },
      { id: "i5", label: "Access scaffolding needed", group: "Service Location", collected: true, value: "Yes — 20ft rental needed" },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Hi Diane! All info collected for your chandelier install on March 7th. We're matching you with a Seattle-area specialist now — I'll confirm your vendor within 24 hours!", timestamp: "2026-02-25T14:00:00Z" },
      { id: "m2", sender: "homeowner", text: "Great, thank you!", timestamp: "2026-02-25T14:45:00Z" },
    ],
  },

  // RSG-2852 — Thomas Wright — Piano Prep — Nashville TN — active
  {
    id: "RSG-2852",
    homeowner: "Thomas Wright",
    homeownerPhone: "+1 (615) 555-0619",
    serviceType: "Piano Prep",
    address: "208 Music Row W",
    city: "Nashville",
    state: "TN",
    scheduledDate: "2026-02-27",
    status: "active",
    vendorId: "v5",
    techName: "Dmitri K.",
    windowConfirmed: "10:00 AM – 1:00 PM",
    createdAt: "2026-02-18T08:00:00Z",
    infoItems: [
      { id: "i1", label: "Piano type", group: "Piano Details", collected: true, value: "Yamaha U3 Upright" },
      { id: "i2", label: "Piano weight", group: "Piano Details", collected: true, value: "~530 lbs" },
      { id: "i3", label: "Origin floor", group: "Service Location", collected: true, value: "Ground level, studio" },
      { id: "i4", label: "Destination address", group: "Service Location", collected: true, value: "14 Bluebird Lane, Brentwood TN 37027" },
      { id: "i5", label: "Preferred window", group: "Scheduling", collected: true, value: "Morning, before 2 PM" },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Thomas! Your piano move is TODAY, March 27th. Dmitri from Lone Star arrives 10 AM–1 PM. He'll text 30 min ahead. Reply READY or call this number with any changes.", timestamp: "2026-02-27T07:30:00Z" },
      { id: "m2", sender: "homeowner", text: "Ready! Thank you!", timestamp: "2026-02-27T07:45:00Z" },
      { id: "m3", sender: "emma", text: "📤 Client notified — Jade Cogswell (Syracuse Moving & Storage) notified via email: RSG-2852 is active today, Dmitri K. on-site.", timestamp: "2026-02-27T07:35:00Z" },
    ],
  },

  // RSG-2853 — Linda Park — Pool Table — Chicago IL — complete
  {
    id: "RSG-2853",
    homeowner: "Linda Park",
    homeownerPhone: "+1 (312) 555-0703",
    serviceType: "Pool Table",
    address: "1120 N Lake Shore Dr",
    city: "Chicago",
    state: "IL",
    scheduledDate: "2026-02-22",
    status: "complete",
    vendorId: "v3",
    techName: "Bryan A.",
    windowConfirmed: "2:00 PM – 5:00 PM",
    createdAt: "2026-02-15T10:00:00Z",
    infoItems: [
      { id: "i1", label: "Table model", group: "Pool Table Details", collected: true, value: "Olhausen Sheridan, 8-ft" },
      { id: "i2", label: "Slate count", group: "Pool Table Details", collected: true, value: "1-piece slate" },
      { id: "i3", label: "Floor access", group: "Service Location", collected: true, value: "Elevator building, 3rd floor" },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Linda — Bryan from Midwest Moving Pros completed your pool table move today. Thank you for choosing RSG! We'd love a quick review if you have 60 seconds 🎱", timestamp: "2026-02-22T17:30:00Z" },
      { id: "m2", sender: "homeowner", text: "5 stars! Bryan was fantastic. Table looks perfect.", timestamp: "2026-02-22T18:10:00Z" },
    ],
  },

  // RSG-2854 — Kevin O'Brien — Safe Moving — Portland OR — dispatched
  {
    id: "RSG-2854",
    homeowner: "Kevin O'Brien",
    homeownerPhone: "+1 (503) 555-0814",
    serviceType: "Safe Moving",
    address: "5521 SW Macadam Ave",
    city: "Portland",
    state: "OR",
    scheduledDate: "2026-03-08",
    status: "dispatched",
    vendorId: "v4",
    techName: "Lena M.",
    windowConfirmed: "11:00 AM – 2:00 PM",
    createdAt: "2026-02-24T13:00:00Z",
    infoItems: [
      { id: "i1", label: "Safe brand & model", group: "Safe Details", collected: true, value: "Liberty Presidential 50" },
      { id: "i2", label: "Safe weight", group: "Safe Details", collected: true, value: "~1,540 lbs" },
      { id: "i3", label: "Current location", group: "Service Location", collected: true, value: "Master closet, 2nd floor" },
      { id: "i4", label: "Destination", group: "Service Location", collected: true, value: "Garage, ground floor" },
      { id: "i5", label: "Stairway photos", group: "Service Location", collected: true, value: "3 photos received" },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Kevin — all set! Pacific Coast Specialists will send Lena M. for your Liberty Presidential safe on March 8th, 11 AM–2 PM. That's a serious safe — Lena's moved 40+ of them. See you then!", timestamp: "2026-02-25T15:00:00Z" },
    ],
  },

  // RSG-2855 — Aisha Rahman — Fitness Equipment — Phoenix AZ — pending_info
  {
    id: "RSG-2855",
    homeowner: "Aisha Rahman",
    homeownerPhone: "+1 (602) 555-0925",
    serviceType: "Fitness Equipment",
    address: "890 E Camelback Rd",
    city: "Phoenix",
    state: "AZ",
    scheduledDate: "2026-03-10",
    status: "pending_info",
    vendorId: null,
    createdAt: "2026-02-25T09:00:00Z",
    infoItems: [
      { id: "i1", label: "Equipment list", group: "Equipment Details", collected: true, value: "Peloton Bike+, BowFlex Home Gym, squat rack" },
      { id: "i2", label: "Squat rack weight", group: "Equipment Details", collected: false, reminderCount: 1, lastReminderHrsAgo: 12 },
      { id: "i3", label: "Origin floor", group: "Service Location", collected: true, value: "Garage, ground level" },
      { id: "i4", label: "Destination address", group: "Service Location", collected: true, value: "1204 W Thunderbird Rd, Phoenix AZ" },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Hi Aisha! Emma from RSG. Your fitness equipment move is March 10th. Can you confirm the weight of the squat rack? Most are 200–400 lbs — does that sound right?", timestamp: "2026-02-26T10:00:00Z" },
      { id: "m2", sender: "homeowner", text: "Not sure, it's a Rogue R-3 — I'll check!", timestamp: "2026-02-26T11:30:00Z" },
    ],
  },

  // RSG-2856 — James Nguyen — Piano Prep — Denver CO — needs_dispatch
  {
    id: "RSG-2856",
    homeowner: "James Nguyen",
    homeownerPhone: "+1 (720) 555-0136",
    serviceType: "Piano Prep",
    address: "2255 Canyon Blvd",
    city: "Denver",
    state: "CO",
    scheduledDate: "2026-03-09",
    status: "needs_dispatch",
    vendorId: null,
    createdAt: "2026-02-24T11:00:00Z",
    infoItems: [
      { id: "i1", label: "Piano type", group: "Piano Details", collected: true, value: "Kawai RX-3 Grand" },
      { id: "i2", label: "Piano weight", group: "Piano Details", collected: true, value: "~680 lbs" },
      { id: "i3", label: "Origin floor", group: "Service Location", collected: true, value: "1st floor, sliding door access" },
      { id: "i4", label: "Destination", group: "Service Location", collected: true, value: "3rd floor condo, elevator access" },
      { id: "i5", label: "Elevator dimensions", group: "Service Location", collected: true, value: "48\" × 72\" interior" },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "James — all info collected! Matching you with a Denver-area piano specialist. You'll hear from me within 24 hours with a vendor and time window.", timestamp: "2026-02-26T12:00:00Z" },
    ],
  },

  // RSG-2857 — Priya Sharma — Artwork Installation — Boston MA — window_confirmed
  {
    id: "RSG-2857",
    homeowner: "Priya Sharma",
    homeownerPhone: "+1 (617) 555-0247",
    serviceType: "Artwork Installation",
    address: "200 Boylston St",
    city: "Boston",
    state: "MA",
    scheduledDate: "2026-03-05",
    status: "window_confirmed",
    vendorId: "v2",
    techName: "Elena S.",
    windowConfirmed: "2:00 PM – 5:00 PM",
    createdAt: "2026-02-22T09:30:00Z",
    infoItems: [
      { id: "i1", label: "Number of pieces", group: "Artwork Details", collected: true, value: "7 pieces, mixed media" },
      { id: "i2", label: "Largest piece dimensions", group: "Artwork Details", collected: true, value: "60\" × 84\" canvas" },
      { id: "i3", label: "Wall mounting type", group: "Installation Details", collected: true, value: "Drywall + 2 plaster walls" },
      { id: "i4", label: "Hardware provided", group: "Installation Details", collected: true, value: "All provided by RSG" },
    ],
    messages: [],
  },

  // RSG-2858 — Carlos Mendez — Hot Tub — San Antonio TX — at_risk
  {
    id: "RSG-2858",
    homeowner: "Carlos Mendez",
    homeownerPhone: "+1 (210) 555-0358",
    serviceType: "Hot Tub",
    address: "8832 Jones Maltsberger Rd",
    city: "San Antonio",
    state: "TX",
    scheduledDate: "2026-03-04",
    status: "at_risk",
    vendorId: null,
    createdAt: "2026-02-22T14:30:00Z",
    infoItems: [
      { id: "i1", label: "Hot tub brand/model", group: "Hot Tub Details", collected: true, value: "Jacuzzi J-495, 8-person" },
      { id: "i2", label: "Hot tub weight (empty)", group: "Hot Tub Details", collected: true, value: "~1,100 lbs" },
      { id: "i3", label: "Gate/access width", group: "Service Location", collected: false, reminderCount: 4, lastReminderHrsAgo: 2 },
      { id: "i4", label: "Electrical shutoff location", group: "Service Location", collected: false, reminderCount: 4, lastReminderHrsAgo: 2 },
      { id: "i5", label: "Permit status", group: "Requirements", collected: false, reminderCount: 2, lastReminderHrsAgo: 24 },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Carlos! March 4th is 5 days away and we still need your gate width, electrical shutoff location, and permit status. Without this we can't send a crew. Please reply ASAP!", timestamp: "2026-02-27T08:00:00Z" },
    ],
  },

  // RSG-2859 — Rachel Kim — Piano Prep — Seattle WA — complete
  {
    id: "RSG-2859",
    homeowner: "Rachel Kim",
    homeownerPhone: "+1 (206) 555-0469",
    serviceType: "Piano Prep",
    address: "3300 Eastlake Ave E",
    city: "Seattle",
    state: "WA",
    scheduledDate: "2026-02-25",
    status: "complete",
    vendorId: "v4",
    techName: "Alexei T.",
    windowConfirmed: "9:00 AM – 12:00 PM",
    createdAt: "2026-02-17T10:00:00Z",
    infoItems: [
      { id: "i1", label: "Piano type", group: "Piano Details", collected: true, value: "Baldwin Model M, Baby Grand" },
      { id: "i2", label: "Piano weight", group: "Piano Details", collected: true, value: "~540 lbs" },
    ],
    messages: [],
  },

  // RSG-2860 — David Foster — Pool Table — Houston TX — dispatched
  {
    id: "RSG-2860",
    homeowner: "David Foster",
    homeownerPhone: "+1 (713) 555-0570",
    serviceType: "Pool Table",
    address: "1441 West Loop South",
    city: "Houston",
    state: "TX",
    scheduledDate: "2026-03-11",
    status: "dispatched",
    vendorId: "v5",
    techName: "Ray V.",
    windowConfirmed: "10:00 AM – 1:00 PM",
    createdAt: "2026-02-25T11:00:00Z",
    infoItems: [
      { id: "i1", label: "Table brand", group: "Pool Table Details", collected: true, value: "Diamond Pro-Am, 9-ft" },
      { id: "i2", label: "Slate count", group: "Pool Table Details", collected: true, value: "3-piece slate" },
      { id: "i3", label: "Floor access", group: "Service Location", collected: true, value: "Ground floor, direct entry" },
    ],
    messages: [],
  },

  // RSG-2861 — Nancy Wilson — Gun Safe — Dallas TX — pending_info
  {
    id: "RSG-2861",
    homeowner: "Nancy Wilson",
    homeownerPhone: "+1 (214) 555-0681",
    serviceType: "Gun Safe",
    address: "7600 Preston Rd",
    city: "Dallas",
    state: "TX",
    scheduledDate: "2026-03-12",
    status: "pending_info",
    vendorId: null,
    createdAt: "2026-02-26T08:00:00Z",
    infoItems: [
      { id: "i1", label: "Safe brand/model", group: "Safe Details", collected: true, value: "Fort Knox Defender 6031" },
      { id: "i2", label: "Safe weight", group: "Safe Details", collected: true, value: "~875 lbs" },
      { id: "i3", label: "Current floor", group: "Service Location", collected: false, reminderCount: 1, lastReminderHrsAgo: 8 },
      { id: "i4", label: "Hallway width at narrowest", group: "Service Location", collected: false, reminderCount: 1, lastReminderHrsAgo: 8 },
    ],
    messages: [
      { id: "m1", sender: "emma", text: "Hi Nancy! Confirming your gun safe move on March 12th. Just need your current floor and hallway width — can you reply with those?", timestamp: "2026-02-26T08:05:00Z" },
    ],
  },

  // RSG-2862 — George Adams — Fitness Equipment — Portland OR — window_confirmed
  {
    id: "RSG-2862",
    homeowner: "George Adams",
    homeownerPhone: "+1 (503) 555-0792",
    serviceType: "Fitness Equipment",
    address: "1440 NE Alberta St",
    city: "Portland",
    state: "OR",
    scheduledDate: "2026-03-06",
    status: "window_confirmed",
    vendorId: "v4",
    techName: "Sam R.",
    windowConfirmed: "8:00 AM – 11:00 AM",
    createdAt: "2026-02-23T13:00:00Z",
    infoItems: [
      { id: "i1", label: "Equipment list", group: "Equipment Details", collected: true, value: "Concept2 Rower, Assault Bike, 300lb barbell set, folding squat rack" },
      { id: "i2", label: "Total weight", group: "Equipment Details", collected: true, value: "~650 lbs" },
      { id: "i3", label: "Origin floor", group: "Service Location", collected: true, value: "Garage, ground level" },
      { id: "i4", label: "Destination", group: "Service Location", collected: true, value: "Basement studio, 14 stairs" },
    ],
    messages: [],
  },

  // RSG-2863 — Maria Santos — Artwork Installation — Miami FL — needs_dispatch
  {
    id: "RSG-2863",
    homeowner: "Maria Santos",
    homeownerPhone: "+1 (305) 555-0803",
    serviceType: "Artwork Installation",
    address: "100 Ocean Dr",
    city: "Miami",
    state: "FL",
    scheduledDate: "2026-03-13",
    status: "needs_dispatch",
    vendorId: null,
    createdAt: "2026-02-26T12:00:00Z",
    infoItems: [
      { id: "i1", label: "Artwork pieces", group: "Artwork Details", collected: true, value: "12 pieces, gallery wall" },
      { id: "i2", label: "Wall material", group: "Installation Details", collected: true, value: "Concrete walls" },
      { id: "i3", label: "Anchor type needed", group: "Installation Details", collected: true, value: "Concrete anchors + drywall toggle" },
    ],
    messages: [],
  },
]

// ─── AI Events ─────────────────────────────────────────────────────────────

export const AI_EVENTS: AIEvent[] = [
  {
    id: "ae1",
    timestamp: "2026-02-27T07:30:00Z",
    channel: "sms",
    contactName: "Thomas Wright",
    contactRole: "homeowner",
    jobId: "RSG-2852",
    summary: "Day-of reminder sent for piano move. Homeowner confirmed ready.",
    outcome: "resolved",
    isAfterHours: false,
    category: "confirmation",
    transcript: [
      { sender: "Emma", text: "Thomas! Your piano move is TODAY. Dmitri arrives 10 AM–1 PM. He'll text 30 min ahead." },
      { sender: "Thomas Wright", text: "Ready! Thank you!" },
    ],
  },
  {
    id: "ae2",
    timestamp: "2026-02-27T06:45:00Z",
    channel: "email",
    contactName: "Rocky Mountain Services",
    contactRole: "vendor",
    jobId: "RSG-2848",
    summary: "Invoice reminder sent for RSG-2848 (Boston Pool Table). Submission due by EOD.",
    outcome: "awaiting",
    isAfterHours: false,
    category: "vendor_nudge",
    transcript: [
      { sender: "Emma", text: "Hi Rocky Mountain Services — just a reminder that your invoice for RSG-2848 (Robert Chen, Boston) is due today. Please submit via the portal. Thanks!" },
    ],
  },
  {
    id: "ae3",
    timestamp: "2026-02-27T06:00:00Z",
    channel: "sms",
    contactName: "Carlos Mendez",
    contactRole: "homeowner",
    jobId: "RSG-2858",
    summary: "Urgent follow-up on 3 missing items for hot tub move in 5 days. No response.",
    outcome: "escalated",
    isAfterHours: false,
    category: "info_chase",
    transcript: [
      { sender: "Emma", text: "Carlos! March 4th is 5 days away and we still need your gate width, electrical shutoff, and permit status. Please reply ASAP — our crew can't be dispatched without this." },
    ],
  },
  {
    id: "ae4",
    timestamp: "2026-02-26T23:01:00Z",
    channel: "sms",
    contactName: "Jennifer Mills",
    contactRole: "homeowner",
    jobId: "RSG-2847",
    summary: "After-hours staircase photo reminder. Homeowner acknowledged and will send in AM.",
    outcome: "resolved",
    isAfterHours: true,
    category: "after_hours",
    transcript: [
      { sender: "Emma", text: "Hi Jennifer! Just the staircase photo when you get a chance 🎹" },
      { sender: "Jennifer Mills", text: "Oh wow it's late, didn't realize. Will send in the morning!" },
      { sender: "Emma", text: "Perfect! No rush — I'm always on 😄 You're confirmed for March 4th." },
    ],
  },
  {
    id: "ae5",
    timestamp: "2026-02-26T22:00:00Z",
    channel: "sms",
    contactName: "Marcus Davis",
    contactRole: "homeowner",
    jobId: "RSG-2850",
    summary: "Homeowner responded after hours with equipment list. Partially resolved.",
    outcome: "resolved",
    isAfterHours: true,
    category: "after_hours",
    transcript: [
      { sender: "Marcus Davis", text: "Sorry been crazy. I have a treadmill, elliptical, and a rack. Moving to a storage unit on Penn Ave." },
      { sender: "Emma", text: "Got it! I'll update your file and get a crew matched first thing in the morning. Thanks for responding!" },
    ],
  },
  {
    id: "ae6",
    timestamp: "2026-02-26T21:15:00Z",
    channel: "sms",
    contactName: "Priya Sharma",
    contactRole: "homeowner",
    jobId: "RSG-2857",
    summary: "Service window confirmation sent and received. 2–5 PM window confirmed.",
    outcome: "resolved",
    isAfterHours: true,
    category: "service_window",
    transcript: [
      { sender: "Emma", text: "Hi Priya! Elena S. from Northeast Specialty will arrive March 5th, 2–5 PM. Reply YES to confirm!" },
      { sender: "Priya Sharma", text: "YES! See you then." },
    ],
  },
  {
    id: "ae7",
    timestamp: "2026-02-26T20:30:00Z",
    channel: "email",
    contactName: "Midwest Moving Pros",
    contactRole: "vendor",
    jobId: "RSG-2853",
    summary: "Overdue invoice warning issued. Day 3 notice sent, escalated to Nick.",
    outcome: "escalated",
    isAfterHours: true,
    category: "vendor_nudge",
    transcript: [
      { sender: "Emma", text: "NOTICE: Invoice for RSG-2853 (Linda Park, Chicago) is now 72+ hours overdue. This is your final automated notice. Failure to submit within 24 hours will result in a penalty per your vendor agreement. Escalating to account manager." },
    ],
  },
  {
    id: "ae8",
    timestamp: "2026-02-26T19:45:00Z",
    channel: "sms",
    contactName: "George Adams",
    contactRole: "homeowner",
    jobId: "RSG-2862",
    summary: "Service window confirmed for fitness equipment move. 8–11 AM window locked.",
    outcome: "resolved",
    isAfterHours: true,
    category: "service_window",
    transcript: [
      { sender: "Emma", text: "George! Sam from Pacific Coast arrives March 6th, 8–11 AM. Reply YES to confirm." },
      { sender: "George Adams", text: "YES — perfect timing." },
    ],
  },
  {
    id: "ae9",
    timestamp: "2026-02-26T18:00:00Z",
    channel: "sms",
    contactName: "Aisha Rahman",
    contactRole: "homeowner",
    jobId: "RSG-2855",
    summary: "Follow-up on squat rack weight sent. Homeowner researching.",
    outcome: "awaiting",
    isAfterHours: false,
    category: "info_chase",
    transcript: [
      { sender: "Emma", text: "Hi Aisha! Just the squat rack weight when you get a chance — we're almost ready to dispatch!" },
      { sender: "Aisha Rahman", text: "Looking it up now, the Rogue R-3 is 185 lbs I think." },
    ],
  },
  {
    id: "ae10",
    timestamp: "2026-02-26T15:30:00Z",
    channel: "sms",
    contactName: "James Nguyen",
    contactRole: "homeowner",
    jobId: "RSG-2856",
    summary: "All info collected notification sent. Vendor matching in progress.",
    outcome: "resolved",
    isAfterHours: false,
    category: "confirmation",
    transcript: [
      { sender: "Emma", text: "James — all info collected! Matching you with a Denver-area piano specialist now." },
    ],
  },
  {
    id: "ae11",
    timestamp: "2026-02-26T14:00:00Z",
    channel: "sms",
    contactName: "Diane Okafor",
    contactRole: "homeowner",
    jobId: "RSG-2851",
    summary: "Info collection complete. Notified homeowner vendor matching in progress.",
    outcome: "resolved",
    isAfterHours: false,
    category: "confirmation",
  },
  {
    id: "ae12",
    timestamp: "2026-02-26T11:30:00Z",
    channel: "sms",
    contactName: "Nancy Wilson",
    contactRole: "homeowner",
    jobId: "RSG-2861",
    summary: "Initial outreach for gun safe move. Waiting on floor + hallway details.",
    outcome: "awaiting",
    isAfterHours: false,
    category: "info_chase",
  },
  {
    id: "ae13",
    timestamp: "2026-02-25T23:30:00Z",
    channel: "sms",
    contactName: "Rachel Kim",
    contactRole: "homeowner",
    jobId: "RSG-2859",
    summary: "Post-completion review request sent. 5-star response received.",
    outcome: "resolved",
    isAfterHours: true,
    category: "after_hours",
    transcript: [
      { sender: "Emma", text: "Rachel — Alexei completed your piano move today! How did it go? We'd love a quick rating 🎵" },
      { sender: "Rachel Kim", text: "5 stars! Alexei was amazing. Most careful movers I've ever had." },
    ],
  },
  {
    id: "ae14",
    timestamp: "2026-02-25T22:45:00Z",
    channel: "sms",
    contactName: "Linda Park",
    contactRole: "homeowner",
    jobId: "RSG-2853",
    summary: "Post-completion satisfaction check. Glowing response — 5 stars.",
    outcome: "resolved",
    isAfterHours: true,
    category: "after_hours",
    transcript: [
      { sender: "Emma", text: "Linda! Bryan wrapped up your pool table move today. Happy with everything?" },
      { sender: "Linda Park", text: "5 stars! Bryan was fantastic. Table looks perfect." },
    ],
  },
  {
    id: "ae15",
    timestamp: "2026-02-25T21:00:00Z",
    channel: "phone",
    contactName: "Carlos Mendez",
    contactRole: "homeowner",
    jobId: "RSG-2858",
    summary: "Voicemail left for Carlos — hot tub job at risk of cancellation without info.",
    outcome: "awaiting",
    isAfterHours: true,
    category: "after_hours",
    transcript: [
      { sender: "Emma (Voicemail)", text: "Hi Carlos, this is Emma from Relo Solutions Group. Your hot tub move is on March 4th — just 7 days away — and we still need your gate width and permit info before we can dispatch a crew. Please call us back or reply to our texts. Thank you!" },
    ],
  },
  {
    id: "ae16",
    timestamp: "2026-02-25T15:00:00Z",
    channel: "sms",
    contactName: "Kevin O'Brien",
    contactRole: "homeowner",
    jobId: "RSG-2854",
    summary: "Vendor confirmed, window set. Homeowner notified of Lena M. dispatch.",
    outcome: "resolved",
    isAfterHours: false,
    category: "confirmation",
  },
  {
    id: "ae17",
    timestamp: "2026-02-25T10:30:00Z",
    channel: "email",
    contactName: "Northeast Specialty Movers",
    contactRole: "vendor",
    jobId: "RSG-2857",
    summary: "Vendor onboarded to RSG-2857. Assignment confirmation and job brief sent.",
    outcome: "resolved",
    isAfterHours: false,
    category: "vendor_nudge",
  },
  {
    id: "ae18",
    timestamp: "2026-02-24T22:00:00Z",
    channel: "sms",
    contactName: "Jennifer Mills",
    contactRole: "homeowner",
    jobId: "RSG-2847",
    summary: "After-hours info chase on destination floor level for Jennifer's piano move.",
    outcome: "awaiting",
    isAfterHours: true,
    category: "after_hours",
  },
  {
    id: "ae19",
    timestamp: "2026-02-24T21:30:00Z",
    channel: "sms",
    contactName: "Marcus Davis",
    contactRole: "homeowner",
    jobId: "RSG-2850",
    summary: "Second attempt: equipment list request with urgency flag.",
    outcome: "awaiting",
    isAfterHours: true,
    category: "after_hours",
  },
  {
    id: "ae20",
    timestamp: "2026-02-24T20:15:00Z",
    channel: "email",
    contactName: "AllState Specialty Co.",
    contactRole: "vendor",
    jobId: "RSG-2847",
    summary: "Vendor compliance warning Day 2 — invoice for RSG-2847 not submitted.",
    outcome: "awaiting",
    isAfterHours: true,
    category: "vendor_nudge",
  },

  // ── Service Window Collection SMS Flow (Feature 1) ──────────────────────
  {
    id: "ae_sw1",
    timestamp: "2026-02-27T09:00:00Z",
    channel: "sms",
    contactName: "Marco T.",
    contactRole: "vendor",
    jobId: "RSG-2848",
    summary: "Service window collected from Marco T. — 10 AM–1 PM confirmed for March 6th.",
    outcome: "resolved",
    isAfterHours: false,
    category: "vendor_nudge",
    transcript: [
      { sender: "Emma", text: "Hi Marco! You're scheduled for RSG-2848 (Robert Chen, Boston) on March 6th. Please reply with a 3-hour arrival window so we can notify the homeowner." },
      { sender: "Marco T.", text: "10am-1pm works for me." },
      { sender: "Emma", text: "Confirmed! Homeowner will be notified with your arrival window. See you March 6th!" },
    ],
  },
  {
    id: "ae_sw2",
    timestamp: "2026-02-27T09:10:00Z",
    channel: "sms",
    contactName: "Robert Chen",
    contactRole: "homeowner",
    jobId: "RSG-2848",
    summary: "Homeowner notified of Marco T.'s 10 AM–1 PM window. Confirmed.",
    outcome: "resolved",
    isAfterHours: false,
    category: "service_window",
    transcript: [
      { sender: "Emma", text: "Robert! Your pool table tech Marco will arrive March 6th, 10 AM–1 PM. Reply YES to confirm the window." },
      { sender: "Robert Chen", text: "YES — perfect" },
      { sender: "Emma", text: "Great, you're all set! Marco will text you 30 min before arrival." },
    ],
  },
  {
    id: "ae_sw3",
    timestamp: "2026-02-26T16:00:00Z",
    channel: "sms",
    contactName: "Ray V.",
    contactRole: "vendor",
    jobId: "RSG-2860",
    summary: "Service window collected from Ray V. — 2 PM–5 PM confirmed for March 11th pool table job.",
    outcome: "resolved",
    isAfterHours: false,
    category: "vendor_nudge",
    transcript: [
      { sender: "Emma", text: "Hi Ray! You're scheduled for RSG-2860 (pool table, March 11th). Please reply with a 3-hour arrival window." },
      { sender: "Ray V.", text: "2pm-5pm works for me on the 11th." },
      { sender: "Emma", text: "Confirmed! Homeowner has been notified. See you March 11th!" },
    ],
  },

  // ── Moving Company Client Notifications (Feature 2) ─────────────────────
  {
    id: "ae_cn1",
    timestamp: "2026-02-27T09:15:00Z",
    channel: "email",
    contactName: "Jade Cogswell",
    contactRole: "client",
    jobId: "RSG-2848",
    summary: "Syracuse Moving & Storage notified — RSG-2848 service window confirmed March 6th, 10 AM–1 PM.",
    outcome: "resolved",
    isAfterHours: false,
    category: "client_notification",
    transcript: [
      { sender: "Emma", text: "Hi Jade — just a heads-up that RSG-2848 (Robert Chen, Boston) is confirmed for March 6th, 10:00 AM – 1:00 PM. Marco T. is on-site. No action needed on your end!" },
      { sender: "Jade Cogswell", text: "Thanks! 👍" },
    ],
  },
  {
    id: "ae_cn2",
    timestamp: "2026-02-27T07:35:00Z",
    channel: "email",
    contactName: "Jade Cogswell",
    contactRole: "client",
    jobId: "RSG-2852",
    summary: "Syracuse Moving & Storage notified — RSG-2852 is active today, Dmitri K. on-site.",
    outcome: "resolved",
    isAfterHours: false,
    category: "client_notification",
    transcript: [
      { sender: "Emma", text: "Hi Jade — RSG-2852 (Thomas Wright, Nashville) is active today. Dmitri K. from Lone Star is on-site now. We'll send a completion notification when the job wraps up." },
    ],
  },

  // ── Auto-Invoice Generation (Feature 4) ─────────────────────────────────
  {
    id: "ae_inv1",
    timestamp: "2026-02-27T14:00:00Z",
    channel: "email",
    contactName: "Dmitri K. / Lone Star Relocation",
    contactRole: "vendor",
    jobId: "RSG-2852",
    summary: "Job complete — Emma auto-generated and emailed INV-2852-LSR ($485.00) to Lone Star Relocation.",
    outcome: "resolved",
    isAfterHours: false,
    category: "invoice_generated",
    transcript: [
      { sender: "Emma", text: "RSG-2852 marked complete. Auto-generating invoice INV-2852-LSR for Lone Star Relocation..." },
      { sender: "Emma", text: "Invoice INV-2852-LSR ($485.00) generated and emailed to dmitri@lonestarrelocation.com. Vendor has 72 hours to confirm receipt." },
    ],
    invoicePreview: {
      invoiceNumber: "INV-2852-LSR",
      vendorName: "Lone Star Relocation",
      vendorEmail: "dmitri@lonestarrelocation.com",
      jobId: "RSG-2852",
      serviceDate: "2026-02-27",
      serviceType: "Piano Prep",
      lineItems: [
        { description: "Piano Prep — Yamaha U3 Upright", amount: 380 },
        { description: "Staircase surcharge", amount: 0 },
        { description: "RSG service fee", amount: 105 },
      ],
      total: 485,
      status: "sent",
    },
  },
  {
    id: "ae_inv2",
    timestamp: "2026-02-22T18:30:00Z",
    channel: "email",
    contactName: "Bryan A. / Midwest Moving Pros",
    contactRole: "vendor",
    jobId: "RSG-2853",
    summary: "Job complete — Emma auto-generated and emailed INV-2853-MMP ($520.00) to Midwest Moving Pros.",
    outcome: "resolved",
    isAfterHours: false,
    category: "invoice_generated",
    transcript: [
      { sender: "Emma", text: "RSG-2853 marked complete. Auto-generating invoice INV-2853-MMP for Midwest Moving Pros..." },
      { sender: "Emma", text: "Invoice INV-2853-MMP ($520.00) generated and emailed to bryan@midwestmovingpros.com. Vendor has 72 hours to confirm receipt." },
    ],
    invoicePreview: {
      invoiceNumber: "INV-2853-MMP",
      vendorName: "Midwest Moving Pros",
      vendorEmail: "bryan@midwestmovingpros.com",
      jobId: "RSG-2853",
      serviceDate: "2026-02-22",
      serviceType: "Pool Table",
      lineItems: [
        { description: "Pool Table — Olhausen Sheridan 8-ft", amount: 420 },
        { description: "Elevator building surcharge", amount: 40 },
        { description: "RSG service fee", amount: 60 },
      ],
      total: 520,
      status: "sent",
    },
  },
]

// ─── Dispatch Data ─────────────────────────────────────────────────────────

export const DISPATCH_JOBS = ["RSG-2851", "RSG-2856", "RSG-2863"]

export const DISPATCH_MATCHES: Record<string, DispatchMatch[]> = {
  "RSG-2851": [
    { vendorId: "v4", matchScore: 94, distanceMi: 18, reasoning: ["Primary market (WA)", "Chandelier specialty", "Available", "4.4 QA — good track record", "Scaffolding-capable crew"] },
    { vendorId: "v4", matchScore: 78, distanceMi: 31, reasoning: ["Secondary market match", "General specialty", "Busy but has slot"] },
    { vendorId: "v6", matchScore: 51, distanceMi: 89, reasoning: ["Outside primary market", "No chandelier specialty", "Tier 3 vendor"] },
  ],
  "RSG-2856": [
    { vendorId: "v1", matchScore: 91, distanceMi: 22, reasoning: ["Piano Technicians Guild certified", "Top-tier QA (4.9)", "23 Denver-area jobs", "Tier 1 preferred vendor"] },
    { vendorId: "v3", matchScore: 74, distanceMi: 45, reasoning: ["Piano capable", "Midwest market primary", "4.7 QA", "Further distance"] },
    { vendorId: "v2", matchScore: 55, distanceMi: 62, reasoning: ["Piano capable but outside market", "Medium QA (4.2)", "Not preferred tier"] },
  ],
  "RSG-2863": [
    { vendorId: "v2", matchScore: 87, distanceMi: 14, reasoning: ["Artwork Installation specialty", "Southeast market capable", "AMSA Certified", "Available", "Previous RSG client referral"] },
    { vendorId: "v4", matchScore: 66, distanceMi: 41, reasoning: ["Artwork capable", "West coast primary", "Further from Miami"] },
    { vendorId: "v6", matchScore: 42, distanceMi: 78, reasoning: ["No artwork specialty", "Tier 3 vendor", "No certifications", "Significant distance"] },
  ],
}

export const DISPATCH_RULES: DispatchRule[] = [
  { label: "Market Coverage", explanation: "Vendor's primary market must include the job's state. Out-of-market vendors are penalized 20 points." },
  { label: "Service Type Match", explanation: "Vendor must have the required service type in their capabilities. Non-matching vendors are excluded." },
  { label: "Tier Priority", explanation: "Tier 1 vendors are preferred over Tier 2/3 and receive a +10 point boost in scoring." },
  { label: "QA Score Weighting", explanation: "QA score (1–5) is multiplied by 12 and added to the base match score. Minimum QA of 3.5 required." },
  { label: "Availability Check", explanation: "Vendors marked 'unavailable' are excluded. 'Busy' vendors are included but penalized 15 points." },
]

// ─── Vendor Compliance ─────────────────────────────────────────────────────

export const VENDOR_COMPLIANCE: VendorCompliance[] = [
  {
    id: "vc1",
    vendorId: "v3",
    vendorName: "Midwest Moving Pros",
    jobId: "RSG-2853",
    serviceDate: "2026-02-22",
    invoiceDueDate: "2026-02-25",
    status: "warning_issued",
    daysSinceJob: 5,
    nudges: [
      { day: 0, type: "Auto Thank-You", message: "Hi Midwest Moving Pros — great work on RSG-2853 today! Your invoice is due within 72 hours via the vendor portal.", timestamp: "2026-02-22T18:00:00Z" },
      { day: 1, type: "Friendly Reminder", message: "Just a reminder — invoice for RSG-2853 (Linda Park, Chicago) is due tomorrow. Takes about 2 minutes in the portal!", timestamp: "2026-02-23T09:00:00Z" },
      { day: 2, type: "Second Notice", message: "Invoice for RSG-2853 is now due today. Please submit by end of business to avoid a late fee.", timestamp: "2026-02-24T09:00:00Z" },
      { day: 3, type: "Penalty Warning", message: "NOTICE: Invoice for RSG-2853 is now 72+ hours overdue. Final automated warning — penalty applies tomorrow.", timestamp: "2026-02-25T08:00:00Z", escalated: false },
      { day: 3, type: "Escalated to Nick", message: "Nick — Midwest Moving Pros hasn't submitted for RSG-2853 after 3 automated warnings. This one needs a call.", timestamp: "2026-02-25T09:00:00Z", escalated: true },
    ],
  },
  {
    id: "vc2",
    vendorId: "v1",
    vendorName: "Rocky Mountain Services",
    jobId: "RSG-2848",
    serviceDate: "2026-03-06",
    invoiceDueDate: "2026-03-09",
    status: "on_track",
    daysSinceJob: 0,
    nudges: [],
  },
  {
    id: "vc3",
    vendorId: "v5",
    vendorName: "Lone Star Relocation",
    jobId: "RSG-2849",
    serviceDate: "2026-03-05",
    invoiceDueDate: "2026-03-08",
    status: "on_track",
    daysSinceJob: 0,
    nudges: [],
  },
  {
    id: "vc4",
    vendorId: "v4",
    vendorName: "Pacific Coast Specialists",
    jobId: "RSG-2859",
    serviceDate: "2026-02-25",
    invoiceDueDate: "2026-02-28",
    status: "overdue_24h",
    daysSinceJob: 2,
    nudges: [
      { day: 0, type: "Auto Thank-You", message: "Great work on RSG-2859 (Rachel Kim, Seattle)! Invoice due within 72 hours.", timestamp: "2026-02-25T18:00:00Z" },
      { day: 1, type: "Friendly Reminder", message: "Invoice for RSG-2859 is due tomorrow — quick 2-min submit via the portal.", timestamp: "2026-02-26T09:00:00Z" },
    ],
  },
  {
    id: "vc5",
    vendorId: "v5",
    vendorName: "Lone Star Relocation",
    jobId: "RSG-2852",
    serviceDate: "2026-02-27",
    invoiceDueDate: "2026-03-02",
    status: "on_track",
    daysSinceJob: 0,
    nudges: [],
  },
  {
    id: "vc6",
    vendorId: "v2",
    vendorName: "Northeast Specialty Movers",
    jobId: "RSG-2857",
    serviceDate: "2026-03-05",
    invoiceDueDate: "2026-03-08",
    status: "on_track",
    daysSinceJob: 0,
    nudges: [],
  },
  {
    id: "vc7",
    vendorId: "v3",
    vendorName: "Midwest Moving Pros",
    jobId: "RSG-2862",
    serviceDate: "2026-03-06",
    invoiceDueDate: "2026-03-09",
    status: "on_track",
    daysSinceJob: 0,
    nudges: [],
  },
  {
    id: "vc8",
    vendorId: "v4",
    vendorName: "Pacific Coast Specialists",
    jobId: "RSG-2854",
    serviceDate: "2026-03-08",
    invoiceDueDate: "2026-03-11",
    status: "on_track",
    daysSinceJob: 0,
    nudges: [],
  },
  {
    id: "vc9",
    vendorId: "v1",
    vendorName: "Rocky Mountain Services",
    jobId: "RSG-2860",
    serviceDate: "2026-03-11",
    invoiceDueDate: "2026-03-14",
    status: "on_track",
    daysSinceJob: 0,
    nudges: [],
  },
  {
    id: "vc10",
    vendorId: "v5",
    vendorName: "Lone Star Relocation",
    jobId: "RSG-2861",
    serviceDate: "2026-03-12",
    invoiceDueDate: "2026-03-15",
    status: "on_track",
    daysSinceJob: 0,
    nudges: [],
  },
  {
    id: "vc11",
    vendorId: "v6",
    vendorName: "AllState Specialty Co.",
    jobId: "RSG-2847",
    serviceDate: "2026-02-20",
    invoiceDueDate: "2026-02-23",
    status: "overdue_48h",
    daysSinceJob: 7,
    nudges: [
      { day: 0, type: "Auto Thank-You", message: "Great work on RSG-2847 pilot job! Invoice due within 72 hours.", timestamp: "2026-02-20T18:00:00Z" },
      { day: 1, type: "Friendly Reminder", message: "Invoice for RSG-2847 due tomorrow.", timestamp: "2026-02-21T09:00:00Z" },
      { day: 2, type: "Second Notice", message: "Invoice for RSG-2847 due today. Please submit to avoid late fees.", timestamp: "2026-02-22T09:00:00Z" },
      { day: 3, type: "Penalty Warning", message: "OVERDUE: Invoice for RSG-2847 is now 72+ hours past due. Penalty will be applied.", timestamp: "2026-02-23T09:00:00Z" },
    ],
  },
  {
    id: "vc12",
    vendorId: "v5",
    vendorName: "Lone Star Relocation",
    jobId: "RSG-2863",
    serviceDate: "2026-03-13",
    invoiceDueDate: "2026-03-16",
    status: "on_track",
    daysSinceJob: 0,
    nudges: [],
  },
]

// ─── Estimates ─────────────────────────────────────────────────────────────

export type EstimateStatus = "fresh" | "aging" | "stale" | "converted"

export interface EstimateFollowUp {
  date: string
  method: "email" | "sms" | "phone"
  message: string
  response?: string
}

export interface EstimateRecord {
  id: string
  estimateNumber: string
  clientName: string       // moving company
  homeowner: string
  services: string[]
  quotedValue: number
  daysOpen: number
  createdDate: string
  lastFollowUp: string | null
  status: EstimateStatus
  followUps: EstimateFollowUp[]
}

export const ESTIMATES: EstimateRecord[] = [
  {
    id: "est-001",
    estimateNumber: "Q-2024-0892",
    clientName: "Syracuse Moving & Storage",
    homeowner: "Barbara Thornton",
    services: ["Piano Prep", "Chandelier"],
    quotedValue: 1240,
    daysOpen: 3,
    createdDate: "2026-02-24",
    lastFollowUp: "2026-02-25",
    status: "fresh",
    followUps: [
      { date: "2026-02-25T09:00:00Z", method: "email", message: "Hi Barbara — wanted to follow up on your estimate Q-2024-0892 for piano prep and chandelier services ($1,240). Let me know if you have any questions or would like to move forward!", response: "Thanks, still deciding." },
    ],
  },
  {
    id: "est-002",
    estimateNumber: "Q-2024-0887",
    clientName: "North Star Relocation",
    homeowner: "David Weston",
    services: ["Pool Table"],
    quotedValue: 580,
    daysOpen: 11,
    createdDate: "2026-02-16",
    lastFollowUp: "2026-02-24",
    status: "aging",
    followUps: [
      { date: "2026-02-20T10:00:00Z", method: "email", message: "Hi David — just checking in on your pool table estimate ($580). Slots are filling up for March. Can we lock you in?" },
      { date: "2026-02-24T09:00:00Z", method: "sms", message: "David — Emma here from RSG. Your estimate Q-2024-0887 is still open. Ready to schedule? Reply YES to confirm!", response: "Maybe next month" },
    ],
  },
  {
    id: "est-003",
    estimateNumber: "Q-2024-0871",
    clientName: "Apex Movers",
    homeowner: "Cynthia Reeves",
    services: ["Hot Tub", "Fitness Equipment"],
    quotedValue: 1850,
    daysOpen: 38,
    createdDate: "2026-01-20",
    lastFollowUp: "2026-02-21",
    status: "stale",
    followUps: [
      { date: "2026-01-27T10:00:00Z", method: "email", message: "Hi Cynthia — following up on your estimate for hot tub and fitness equipment relocation ($1,850)." },
      { date: "2026-02-03T10:00:00Z", method: "email", message: "Cynthia — just a reminder that your estimate Q-2024-0871 is still available. Prices are locked through Feb 28." },
      { date: "2026-02-10T09:00:00Z", method: "sms", message: "Hi Cynthia! Estimate Q-0871 expires soon. Lock in your hot tub + equipment move now. Reply YES or call us!" },
      { date: "2026-02-21T09:00:00Z", method: "email", message: "Final notice — your estimate expires at end of month. Let us know before March 1st to hold this rate.", response: "We postponed the move indefinitely." },
    ],
  },
  {
    id: "est-004",
    estimateNumber: "Q-2024-0901",
    clientName: "Prestige Relocation",
    homeowner: "Michael Farber",
    services: ["Piano Prep"],
    quotedValue: 720,
    daysOpen: 1,
    createdDate: "2026-02-26",
    lastFollowUp: null,
    status: "fresh",
    followUps: [],
  },
  {
    id: "est-005",
    estimateNumber: "Q-2024-0879",
    clientName: "Atlas Van Lines — Boston",
    homeowner: "Sarah Kim",
    services: ["Artwork Installation", "Chandelier"],
    quotedValue: 2100,
    daysOpen: 0,
    createdDate: "2026-02-27",
    lastFollowUp: null,
    status: "converted",
    followUps: [
      { date: "2026-02-23T09:00:00Z", method: "email", message: "Hi Sarah — your estimate Q-2024-0879 for artwork installation and chandelier handling ($2,100). Ready to schedule?" },
      { date: "2026-02-25T09:00:00Z", method: "sms", message: "Sarah — estimate still open! Would love to lock this in before next week's rush. Reply YES.", response: "YES — let's do it!" },
    ],
  },
  {
    id: "est-006",
    estimateNumber: "Q-2024-0855",
    clientName: "Two Men and a Truck — Chicago",
    homeowner: "Tom Gallagher",
    services: ["Gun Safe"],
    quotedValue: 480,
    daysOpen: 22,
    createdDate: "2026-02-05",
    lastFollowUp: "2026-02-26",
    status: "aging",
    followUps: [
      { date: "2026-02-12T10:00:00Z", method: "email", message: "Tom — your gun safe relocation estimate ($480) is still open. Our certified crew is ready!" },
      { date: "2026-02-19T10:00:00Z", method: "email", message: "Hi Tom — second follow-up on Q-2024-0855. Let us know if your timeline has changed." },
      { date: "2026-02-26T09:00:00Z", method: "sms", message: "Tom, estimate Q-0855 — safe moving quote. Still need help? Reply to book." },
    ],
  },
  {
    id: "est-007",
    estimateNumber: "Q-2024-0840",
    clientName: "Gentle Giant Moving",
    homeowner: "Patricia Chu",
    services: ["Piano Prep", "Pool Table"],
    quotedValue: 1560,
    daysOpen: 45,
    createdDate: "2026-01-13",
    lastFollowUp: "2026-02-20",
    status: "stale",
    followUps: [
      { date: "2026-01-20T10:00:00Z", method: "email", message: "Hi Patricia — following up on piano prep + pool table estimate ($1,560)." },
      { date: "2026-01-27T10:00:00Z", method: "email", message: "Patricia — second notice on Q-2024-0840. Pricing valid through end of January." },
      { date: "2026-02-03T09:00:00Z", method: "sms", message: "Patricia, estimate expiring soon. Reply YES to book piano + pool table move!" },
      { date: "2026-02-10T09:00:00Z", method: "email", message: "Final automated follow-up. Estimate Q-0840 open. Schedule before spots fill." },
      { date: "2026-02-20T09:00:00Z", method: "email", message: "Monthly check-in — estimate still available. New move date? Let us know!" },
    ],
  },
  {
    id: "est-008",
    estimateNumber: "Q-2024-0895",
    clientName: "Bellhop Moving",
    homeowner: "Ryan Nguyen",
    services: ["Safe Moving"],
    quotedValue: 390,
    daysOpen: 7,
    createdDate: "2026-02-20",
    lastFollowUp: "2026-02-27",
    status: "aging",
    followUps: [
      { date: "2026-02-24T10:00:00Z", method: "email", message: "Ryan — following up on your safe moving estimate ($390). RSG is fully certified for this service." },
      { date: "2026-02-27T09:00:00Z", method: "sms", message: "Ryan — estimate Q-0895 still open. Ready to move that safe? Reply YES." },
    ],
  },
  {
    id: "est-009",
    estimateNumber: "Q-2024-0863",
    clientName: "North Star Relocation",
    homeowner: "Amanda Price",
    services: ["Fitness Equipment"],
    quotedValue: 660,
    daysOpen: 0,
    createdDate: "2026-02-17",
    lastFollowUp: "2026-02-22",
    status: "converted",
    followUps: [
      { date: "2026-02-18T10:00:00Z", method: "email", message: "Amanda — your fitness equipment relocation estimate ($660)." },
      { date: "2026-02-22T09:00:00Z", method: "sms", message: "Amanda, estimate Q-0863 — ready to book? Reply YES!", response: "YES please!" },
    ],
  },
  {
    id: "est-010",
    estimateNumber: "Q-2024-0848",
    clientName: "Atlas Van Lines — Dallas",
    homeowner: "Carlos Iglesias",
    services: ["Piano Prep", "Safe Moving"],
    quotedValue: 1140,
    daysOpen: 33,
    createdDate: "2026-01-25",
    lastFollowUp: "2026-02-25",
    status: "stale",
    followUps: [
      { date: "2026-02-01T10:00:00Z", method: "email", message: "Carlos — following up on piano prep + safe moving estimate ($1,140)." },
      { date: "2026-02-08T10:00:00Z", method: "email", message: "Second notice on Q-2024-0848. Pricing valid through month end." },
      { date: "2026-02-15T09:00:00Z", method: "sms", message: "Carlos — estimate expiring soon. Book piano + safe move before Feb 28. Reply YES." },
      { date: "2026-02-25T09:00:00Z", method: "email", message: "Final monthly follow-up. Still interested? Estimate Q-0848 available." },
    ],
  },
]

// ─── QA Reviews ─────────────────────────────────────────────────────────────

export interface QAReview {
  id: string
  homeowner: string
  jobId: string
  vendorId: string
  vendorName: string
  serviceType: string
  completedDate: string
  score: number
  comment: string
  googleReviewTriggered: boolean
  googleReviewLeft?: boolean
  emmaSequence: { step: string; timestamp: string; message: string; response?: string }[]
}

export interface VendorQALeaderboard {
  vendorId: string
  vendorName: string
  jobsDone: number
  avgScore: number
  totalScores: number
}

export const QA_REVIEWS: QAReview[] = [
  {
    id: "qa-001",
    homeowner: "Thomas Wright",
    jobId: "RSG-2852",
    vendorId: "v5",
    vendorName: "Lone Star Relocation",
    serviceType: "Piano Prep",
    completedDate: "2026-02-27",
    score: 5,
    comment: "Dmitri and his crew were fantastic. Handled our Yamaha with incredible care. Would use again.",
    googleReviewTriggered: true,
    googleReviewLeft: true,
    emmaSequence: [
      { step: "Job Complete Text", timestamp: "2026-02-27T16:30:00Z", message: "Hi Thomas! Your piano relocation is complete. On a scale of 1–5, how would you rate today's service?" },
      { step: "Score Received", timestamp: "2026-02-27T16:45:00Z", message: "5 — received from Thomas Wright.", response: "5" },
      { step: "Google Review Ask", timestamp: "2026-02-27T16:46:00Z", message: "Fantastic! We're so glad you had a great experience. Would you mind leaving us a quick Google review? It helps us a lot! [link]", response: "Done! Just left one." },
    ],
  },
  {
    id: "qa-002",
    homeowner: "Linda Park",
    jobId: "RSG-2853",
    vendorId: "v3",
    vendorName: "Midwest Moving Pros",
    serviceType: "Pool Table",
    completedDate: "2026-02-22",
    score: 4,
    comment: "Good job overall, crew was a little late but very professional once on site.",
    googleReviewTriggered: true,
    googleReviewLeft: false,
    emmaSequence: [
      { step: "Job Complete Text", timestamp: "2026-02-22T19:00:00Z", message: "Hi Linda! Your pool table move is done. How would you rate today's service? (1–5)" },
      { step: "Score Received", timestamp: "2026-02-22T19:22:00Z", message: "4 — received from Linda Park.", response: "4" },
      { step: "Google Review Ask", timestamp: "2026-02-22T19:23:00Z", message: "Great to hear! If you have a moment, a Google review would mean the world to our team. [link]" },
    ],
  },
  {
    id: "qa-003",
    homeowner: "Rachel Kim",
    jobId: "RSG-2859",
    vendorId: "v4",
    vendorName: "Pacific Coast Specialists",
    serviceType: "Chandelier",
    completedDate: "2026-02-25",
    score: 5,
    comment: "Beautiful work. Very careful with our antique chandelier. Highly recommend.",
    googleReviewTriggered: true,
    googleReviewLeft: true,
    emmaSequence: [
      { step: "Job Complete Text", timestamp: "2026-02-25T17:00:00Z", message: "Hi Rachel! Your chandelier installation is complete. How was your experience today? (1–5)" },
      { step: "Score Received", timestamp: "2026-02-25T17:38:00Z", message: "5 — received from Rachel Kim.", response: "5" },
      { step: "Google Review Ask", timestamp: "2026-02-25T17:39:00Z", message: "Wonderful! You'd make our day by leaving a Google review — takes 60 seconds! [link]", response: "Happy to!" },
    ],
  },
  {
    id: "qa-004",
    homeowner: "Kevin O'Brien",
    jobId: "RSG-2854",
    vendorId: "v4",
    vendorName: "Pacific Coast Specialists",
    serviceType: "Fitness Equipment",
    completedDate: "2026-02-18",
    score: 5,
    comment: "Lena and team were super professional. Everything arrived in perfect condition.",
    googleReviewTriggered: true,
    googleReviewLeft: false,
    emmaSequence: [
      { step: "Job Complete Text", timestamp: "2026-02-18T15:30:00Z", message: "Hi Kevin! Your fitness equipment move is done. Rate your experience 1–5?" },
      { step: "Score Received", timestamp: "2026-02-18T16:02:00Z", message: "5 — received from Kevin O'Brien.", response: "5 — great team!" },
      { step: "Google Review Ask", timestamp: "2026-02-18T16:03:00Z", message: "Awesome! Mind leaving a quick Google review? [link]" },
    ],
  },
  {
    id: "qa-005",
    homeowner: "George Adams",
    jobId: "RSG-2862",
    vendorId: "v3",
    vendorName: "Midwest Moving Pros",
    serviceType: "Fitness Equipment",
    completedDate: "2026-02-20",
    score: 3,
    comment: "Treadmill was scratched during the move. Team apologized but still frustrating.",
    googleReviewTriggered: false,
    emmaSequence: [
      { step: "Job Complete Text", timestamp: "2026-02-20T14:00:00Z", message: "Hi George! Your fitness equipment move is complete. How would you rate today's service? (1–5)" },
      { step: "Score Received", timestamp: "2026-02-20T14:45:00Z", message: "3 — received from George Adams.", response: "3 — treadmill got scratched" },
      { step: "Internal Alert", timestamp: "2026-02-20T14:46:00Z", message: "⚠️ Score below 4 — Google review request suppressed. Nick notified of George Adams complaint (RSG-2862, Midwest Moving Pros)." },
    ],
  },
  {
    id: "qa-006",
    homeowner: "Priya Sharma",
    jobId: "RSG-2857",
    vendorId: "v2",
    vendorName: "Northeast Specialty Movers",
    serviceType: "Chandelier",
    completedDate: "2026-02-15",
    score: 5,
    comment: "Absolutely flawless. Elena was incredibly skilled and careful.",
    googleReviewTriggered: true,
    googleReviewLeft: true,
    emmaSequence: [
      { step: "Job Complete Text", timestamp: "2026-02-15T16:00:00Z", message: "Hi Priya! Your chandelier service is complete. How was your experience? (1–5)" },
      { step: "Score Received", timestamp: "2026-02-15T16:20:00Z", message: "5 — received from Priya Sharma.", response: "5 — perfection!" },
      { step: "Google Review Ask", timestamp: "2026-02-15T16:21:00Z", message: "That's wonderful! Please share it on Google when you get a chance! [link]", response: "Just did!" },
    ],
  },
  {
    id: "qa-007",
    homeowner: "Marcus Davis",
    jobId: "RSG-2850",
    vendorId: "v3",
    vendorName: "Midwest Moving Pros",
    serviceType: "Fitness Equipment",
    completedDate: "2026-02-10",
    score: 5,
    comment: "On time, professional, and quick. Couldn't ask for more.",
    googleReviewTriggered: true,
    googleReviewLeft: false,
    emmaSequence: [
      { step: "Job Complete Text", timestamp: "2026-02-10T13:00:00Z", message: "Hi Marcus! Rate your experience today (1–5)?" },
      { step: "Score Received", timestamp: "2026-02-10T13:30:00Z", message: "5 — received from Marcus Davis.", response: "5" },
      { step: "Google Review Ask", timestamp: "2026-02-10T13:31:00Z", message: "Thanks! A Google review helps so much. [link]" },
    ],
  },
  {
    id: "qa-008",
    homeowner: "Jennifer Mills",
    jobId: "RSG-2847",
    vendorId: "v1",
    vendorName: "Rocky Mountain Services",
    serviceType: "Piano Prep",
    completedDate: "2026-02-08",
    score: 5,
    comment: "My Steinway is in perfect shape. The team treated it like it was their own instrument.",
    googleReviewTriggered: true,
    googleReviewLeft: true,
    emmaSequence: [
      { step: "Job Complete Text", timestamp: "2026-02-08T17:00:00Z", message: "Hi Jennifer! Your piano relocation is done. How was your experience? (1–5)" },
      { step: "Score Received", timestamp: "2026-02-08T17:22:00Z", message: "5 — received from Jennifer Mills.", response: "5!!! Amazing team" },
      { step: "Google Review Ask", timestamp: "2026-02-08T17:23:00Z", message: "So glad to hear it! Would you mind sharing that on Google? It means a lot to our team. [link]", response: "Of course! Done." },
    ],
  },
]

export const VENDOR_QA_LEADERBOARD: VendorQALeaderboard[] = [
  { vendorId: "v1", vendorName: "Rocky Mountain Services", jobsDone: 187, avgScore: 4.9, totalScores: 142 },
  { vendorId: "v5", vendorName: "Lone Star Relocation", jobsDone: 212, avgScore: 4.8, totalScores: 178 },
  { vendorId: "v3", vendorName: "Midwest Moving Pros", jobsDone: 143, avgScore: 4.7, totalScores: 89 },
  { vendorId: "v4", vendorName: "Pacific Coast Specialists", jobsDone: 76, avgScore: 4.4, totalScores: 54 },
  { vendorId: "v2", vendorName: "Northeast Specialty Movers", jobsDone: 94, avgScore: 4.2, totalScores: 61 },
  { vendorId: "v6", vendorName: "AllState Specialty Co.", jobsDone: 31, avgScore: 3.8, totalScores: 14 },
]

// ─── Billing ────────────────────────────────────────────────────────────────

export type BillingStatus = "awaiting_paperwork" | "ready_to_bill" | "invoiced" | "paid"

export interface BillingRecord {
  id: string
  jobId: string
  clientName: string
  services: string[]
  billedAmount: number | null
  status: BillingStatus
  completedDate: string
  daysSinceComplete: number
  invoiceNumber?: string
  notes?: string
}

export const BILLING_RECORDS: BillingRecord[] = [
  {
    id: "bill-001",
    jobId: "RSG-2852",
    clientName: "Syracuse Moving & Storage",
    services: ["Piano Prep"],
    billedAmount: 485,
    status: "invoiced",
    completedDate: "2026-02-27",
    daysSinceComplete: 0,
    invoiceNumber: "INV-RSG-2852",
    notes: "Auto-invoice generated by Emma at job close",
  },
  {
    id: "bill-002",
    jobId: "RSG-2853",
    clientName: "North Star Relocation",
    services: ["Pool Table"],
    billedAmount: 520,
    status: "invoiced",
    completedDate: "2026-02-22",
    daysSinceComplete: 5,
    invoiceNumber: "INV-RSG-2853",
    notes: "Vendor paperwork delayed 3 days — invoice held",
  },
  {
    id: "bill-003",
    jobId: "RSG-2859",
    clientName: "Atlas Van Lines — Seattle",
    services: ["Chandelier"],
    billedAmount: null,
    status: "awaiting_paperwork",
    completedDate: "2026-02-25",
    daysSinceComplete: 2,
    notes: "Pacific Coast Specialists — invoice outstanding",
  },
  {
    id: "bill-004",
    jobId: "RSG-2854",
    clientName: "Bellhop Moving",
    services: ["Fitness Equipment"],
    billedAmount: 440,
    status: "paid",
    completedDate: "2026-02-18",
    daysSinceComplete: 9,
    invoiceNumber: "INV-RSG-2854",
    notes: "Paid in full Feb 26",
  },
  {
    id: "bill-005",
    jobId: "RSG-2862",
    clientName: "Two Men and a Truck — Columbus",
    services: ["Fitness Equipment"],
    billedAmount: null,
    status: "awaiting_paperwork",
    completedDate: "2026-02-20",
    daysSinceComplete: 7,
    notes: "QA complaint logged — billing held pending resolution",
  },
  {
    id: "bill-006",
    jobId: "RSG-2850",
    clientName: "Apex Movers",
    services: ["Fitness Equipment"],
    billedAmount: 395,
    status: "paid",
    completedDate: "2026-02-10",
    daysSinceComplete: 17,
    invoiceNumber: "INV-RSG-2850",
  },
  {
    id: "bill-007",
    jobId: "RSG-2847-P",
    clientName: "Gentle Giant Moving",
    services: ["Piano Prep"],
    billedAmount: 725,
    status: "paid",
    completedDate: "2026-02-08",
    daysSinceComplete: 19,
    invoiceNumber: "INV-RSG-2847P",
  },
  {
    id: "bill-008",
    jobId: "RSG-2857",
    clientName: "Prestige Relocation",
    services: ["Chandelier"],
    billedAmount: 680,
    status: "ready_to_bill",
    completedDate: "2026-02-15",
    daysSinceComplete: 12,
    notes: "Vendor submitted paperwork Feb 20 — ready to invoice client",
  },
  {
    id: "bill-009",
    jobId: "RSG-2846",
    clientName: "North Star Relocation",
    services: ["Safe Moving", "Fitness Equipment"],
    billedAmount: null,
    status: "awaiting_paperwork",
    completedDate: "2026-02-24",
    daysSinceComplete: 3,
  },
  {
    id: "bill-010",
    jobId: "RSG-2843",
    clientName: "Atlas Van Lines — Boston",
    services: ["Artwork Installation"],
    billedAmount: 820,
    status: "invoiced",
    completedDate: "2026-02-12",
    daysSinceComplete: 15,
    invoiceNumber: "INV-RSG-2843",
    notes: "Awaiting client payment — net 30 terms",
  },
]

// ─── Vendor Portal ──────────────────────────────────────────────────────────

export type VendorJobStatus = "assigned" | "accepted" | "window_set" | "on_site" | "complete" | "paperwork_uploaded"

export interface VendorPortalJob {
  id: string
  jobId: string
  homeowner: string
  homeownerAddress: string
  serviceType: string
  scheduledDate: string
  serviceWindow?: string
  status: VendorJobStatus
  movingCo: string
  specialNotes?: string
  closeOutItems: string[]
  earnings: number
}

export const VENDOR_PORTAL_JOBS: VendorPortalJob[] = [
  {
    id: "vp-001",
    jobId: "RSG-2848",
    homeowner: "Robert Chen",
    homeownerAddress: "42 Beacon St, Boston, MA 02108",
    serviceType: "Pool Table",
    scheduledDate: "2026-03-06",
    serviceWindow: "10:00 AM – 1:00 PM",
    status: "window_set",
    movingCo: "Syracuse Moving & Storage",
    specialNotes: "8-ft Brunswick table, second floor via staircase",
    closeOutItems: ["Mark on-site on arrival", "Upload pre/post photos", "Submit invoice within 72 hrs"],
    earnings: 420,
  },
  {
    id: "vp-002",
    jobId: "RSG-2863",
    homeowner: "Maria Vasquez",
    homeownerAddress: "1807 SW 3rd Ave, Miami, FL 33130",
    serviceType: "Artwork Installation",
    scheduledDate: "2026-03-13",
    status: "accepted",
    movingCo: "North Star Relocation",
    specialNotes: "15 pieces, museum-quality framing — white glove required",
    closeOutItems: ["Mark on-site on arrival", "Upload condition photos", "Get homeowner signature", "Submit invoice within 72 hrs"],
    earnings: 560,
  },
  {
    id: "vp-003",
    jobId: "RSG-2856",
    homeowner: "Ana Castellano",
    homeownerAddress: "3021 E 18th Ave, Denver, CO 80206",
    serviceType: "Piano Prep",
    scheduledDate: "2026-03-09",
    status: "assigned",
    movingCo: "Atlas Van Lines — Denver",
    specialNotes: "Steinway Model D concert grand. Heavy lift crew required.",
    closeOutItems: ["Accept job", "Set service window", "Mark on-site", "Upload photos", "Submit invoice"],
    earnings: 680,
  },
  {
    id: "vp-004",
    jobId: "RSG-2851-CMP",
    homeowner: "Diana Fletcher",
    homeownerAddress: "211 Lake Shore Dr, Seattle, WA 98112",
    serviceType: "Chandelier",
    scheduledDate: "2026-02-20",
    serviceWindow: "9:00 AM – 12:00 PM",
    status: "complete",
    movingCo: "Prestige Relocation",
    specialNotes: "Murano glass chandelier — box + wrap included",
    closeOutItems: ["Invoice submitted ✓", "Photos uploaded ✓", "Payment pending"],
    earnings: 380,
  },
  {
    id: "vp-005",
    jobId: "RSG-2860",
    homeowner: "Henry Larson",
    homeownerAddress: "5500 Boulder Pkwy, Boulder, CO 80301",
    serviceType: "Pool Table",
    scheduledDate: "2026-03-11",
    serviceWindow: "2:00 PM – 5:00 PM",
    status: "window_set",
    movingCo: "Gentle Giant Moving",
    specialNotes: "7-ft Olhausen table, basement to truck — narrow stairs",
    closeOutItems: ["Mark on-site on arrival", "Upload photos", "Submit invoice within 72 hrs"],
    earnings: 390,
  },
]

// ─── Chart Data ────────────────────────────────────────────────────────────

export const JOB_VOLUME_BY_MONTH = [
  { month: "Aug", jobs: 18 },
  { month: "Sep", jobs: 24 },
  { month: "Oct", jobs: 31 },
  { month: "Nov", jobs: 27 },
  { month: "Dec", jobs: 19 },
  { month: "Jan", jobs: 38 },
  { month: "Feb", jobs: 47 },
]

// ─── Helper lookups ─────────────────────────────────────────────────────────

export function getJob(id: string): Job | undefined {
  return JOBS.find(j => j.id === id)
}

export function getVendor(id: string): Vendor | undefined {
  return VENDORS.find(v => v.id === id)
}

export function getJobVendor(job: Job): Vendor | undefined {
  return job.vendorId ? getVendor(job.vendorId) : undefined
}

export const STATUS_LABELS: Record<JobStatus, string> = {
  pending_info: "Pending Info",
  needs_dispatch: "Needs Dispatch",
  dispatched: "Dispatched",
  window_confirmed: "Window Confirmed",
  active: "Active Today",
  complete: "Complete",
  at_risk: "At Risk",
}
