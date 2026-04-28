import { T } from "../theme";

export type Convo = {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread: number;
  status: "done" | "running" | "waiting" | "error";
  icon: string;
};

export type Space = {
  id: number;
  name: string;
  desc: string;
  status: "done" | "running" | "waiting" | "error";
  color: string;
  icon: string;
  agents: string[];
};

export const CONVOS: Convo[] = [
  { id: 1, name: "Build Asana → Notion sync", preview: "Live preview and architecture generated.", time: "2m", unread: 0, status: "done", icon: "sync-outline" },
  { id: 2, name: "Salesforce CRM pipeline",   preview: "Swarm simulation and sandbox running.",  time: "8m", unread: 2, status: "running", icon: "server-outline" },
  { id: 3, name: "Weekly PDF report bot",     preview: "Need approval to send emails.",           time: "1h", unread: 1, status: "waiting", icon: "stats-chart-outline" },
  { id: 4, name: "Stripe revenue analyzer",   preview: "Deep research completed with 12 sources.", time: "3h", unread: 0, status: "done", icon: "card-outline" },
  { id: 5, name: "Mermaid flowchart generator",preview: "Diagram exported to Notion.",            time: "1d", unread: 0, status: "done", icon: "git-network-outline" },
];

export const SPACES: Space[] = [
  { id: 101, name: "Asana Integration",  desc: "Converted from Chat", status: "running", color: T.amber,  icon: "sync-outline",   agents: [T.amber, T.violet, T.sage] },
  { id: 102, name: "Q3 Marketing Bot",   desc: "Converted from Chat", status: "waiting", color: T.violet, icon: "stats-chart-outline", agents: [T.violet, T.blue] },
  { id: 103, name: "Data Scraper Core",  desc: "Converted from Chat", status: "running", color: T.sage,   icon: "server-outline", agents: [T.sage, T.amber, T.red, T.blue] },
  { id: 104, name: "Customer Support",   desc: "Manual Space",        status: "done",    color: T.blue,   icon: "headset-outline",agents: [T.blue] },
];

export const FOLDERS = [
  { id: 1, name: "Exports",     count: 12, color: T.amber  },
  { id: 2, name: "Source Code", count: 45, color: T.violet },
  { id: 3, name: "UI Assets",   count: 8,  color: T.sage   },
  { id: 4, name: "Reports",     count: 23, color: T.blue   },
];

export const FILES = [
  { id: 1, name: "schema_v2.sql",       size: "12 KB",  date: "Today",     icon: "server-outline",        color: T.blue,   ext: "SQL" },
  { id: 2, name: "dashboard_hero.png",  size: "1.2 MB", date: "Yesterday", icon: "image-outline",         color: T.amber,  ext: "PNG" },
  { id: 3, name: "q3_report.pdf",       size: "4.5 MB", date: "Oct 12",    icon: "document-outline",      color: T.red,    ext: "PDF" },
  { id: 4, name: "fetcher.py",          size: "4 KB",   date: "Oct 10",    icon: "code-slash-outline",    color: T.sage,   ext: "PY"  },
  { id: 5, name: "design_tokens.json",  size: "2 KB",   date: "Oct 8",     icon: "color-palette-outline", color: T.violet, ext: "JSON" },
];

export type Message = {
  id: number;
  role: "user" | "agent" | "tool" | "approval" | "think";
  content?: string;
  block?: any;
  plan?: { label: string; done: boolean; pct: number }[];
  tool?: string;
  label?: string;
  code?: string;
  done?: boolean;
  result?: string;
};

export const MOCK_CHATS: Record<number, Message[]> = {
  1: [
    { id: 1, role: "user", content: "Map out the Asana → Notion sync architecture and show me a live preview." },
    { id: 2, role: "agent", content: "I designed a webhook-driven pipeline. Here's the connection map:", block: { type: "connection", nodes: [
      { label: "Asana API",   icon: "git-branch-outline",  color: "#F06A6A" },
      { label: "Sync Engine", icon: "flash-outline",       color: T.amber   },
      { label: "Transform",   icon: "swap-horizontal-outline", color: T.violet },
      { label: "Notion DB",   icon: "server-outline",      color: T.sage    },
    ] } },
    { id: 3, role: "tool", tool: "search", label: "Searching Asana API docs", done: true, result: "Found 12 endpoints. Webhooks supported via /webhooks/v2/.", code: "" },
    { id: 4, role: "agent", content: "Live preview of the generated monitoring dashboard:", block: { type: "preview", title: "Sync Dashboard", url: "https://sync-dash.kittyclaw.app", stats: [{label:"Tasks", value:"1,432", color:T.sage},{label:"Errors", value:"2", color:T.red},{label:"Latency", value:"82ms", color:T.amber}] } },
    { id: 5, role: "agent", content: "And here's an A2UI form so you can configure it on the fly:", block: { type: "a2ui", surfaceId: "asana-config", components: [
      { id: "root", component: "Card", child: "col" },
      { id: "col", component: "Column", children: ["title", "f1", "f2", "btn"] },
      { id: "title", component: "Text", text: "Configure Sync", variant: "h2" },
      { id: "f1", component: "TextField", label: "Asana Workspace ID", value: "ws_8x39kk20" },
      { id: "f2", component: "TextField", label: "Notion Database ID", value: "db_28af201" },
      { id: "btn", component: "Button", text: "Save & Deploy", variant: "primary" },
    ] } },
  ],
  2: [
    { id: 10, role: "user", content: "Spin up the agent swarm for the Salesforce pipeline and run the data fetcher." },
    { id: 11, role: "agent", content: "Initializing multi-agent swarm. Each node specialises in one stage:", block: { type: "swarm", agents: [
      { id: "Alpha", role: "Fetcher",  color: T.amber  },
      { id: "Beta",  role: "Parser",   color: T.violet },
      { id: "Gamma", role: "Uploader", color: T.sage   },
      { id: "Delta", role: "Reviewer", color: T.blue   },
    ] } },
    { id: 12, role: "tool", tool: "code", label: "Generating fetcher.py", done: true, code: "async def fetch_salesforce():\n    print('Connecting to CRM...')\n    rows = await api.query('SELECT Id FROM Account LIMIT 5')\n    return [r.to_dict() for r in rows]" },
    { id: 13, role: "agent", content: "Sandbox is live. Watch the terminal stream output:", block: { type: "terminal", filename: "fetcher.py", code: "async def fetch_salesforce():\n    rows = await api.query('SELECT Id FROM Account')\n    return rows", output: "> Connecting to Salesforce...\n> Authenticated as svc-bot@kc\n> Fetching 5,432 rows...\n> ✓ Pipeline successful in 1.2s" } },
    { id: 14, role: "agent", content: "Connection health between agents:", block: { type: "connection", style: "horizontal", nodes: [
      { label: "Alpha", icon: "flash-outline", color: T.amber },
      { label: "Beta",  icon: "code-slash-outline", color: T.violet },
      { label: "Gamma", icon: "cloud-upload-outline", color: T.sage },
    ] } },
  ],
  3: [
    { id: 20, role: "user", content: "Build me an automation that posts a PDF summary to Slack every morning." },
    { id: 21, role: "agent", content: "Here's the automation pipeline I've designed:", block: { type: "automation", steps: [
      { label: "Cron 9:00 AM",    icon: "time-outline",       status: "done"    },
      { label: "Generate PDF",    icon: "document-text-outline", status: "done"    },
      { label: "Format digest",   icon: "color-wand-outline", status: "running" },
      { label: "Post to #updates",icon: "send-outline",       status: "pending" },
    ] } },
    { id: 22, role: "tool", tool: "code", label: "Writing pipeline module", done: true, code: "async def daily_digest():\n    pdf = await generate_pdf(stats)\n    await slack.post('#updates', pdf)\n    return 'sent'" },
    { id: 23, role: "agent", plan: [
      { label: "Generate PDF",      done: true,  pct: 100 },
      { label: "Format Slack digest", done: false, pct: 60  },
      { label: "Send to #updates",  done: false, pct: 0   },
    ] },
    { id: 24, role: "approval", content: "Ready to deploy. This will send actual messages to #updates daily at 9:00 AM." },
  ],
  4: [
    { id: 30, role: "user", content: "Do deep research on Stripe's revenue recognition rules for SaaS." },
    { id: 31, role: "agent", content: "Running multi-source deep research:", block: { type: "deepresearch", query: "Stripe SaaS revenue recognition", sources: 12, steps: [
      { label: "Searching Stripe docs",     done: true,  count: 4 },
      { label: "Scanning IFRS-15 reports",  done: true,  count: 3 },
      { label: "Reading SEC filings",        done: true,  count: 5 },
      { label: "Synthesising findings",      done: false, count: 0 },
    ] } },
    { id: 32, role: "tool", tool: "search", label: "Web search: ASC 606 SaaS deferred revenue", done: true, result: "Found 47 results across 12 verified sources. Top match: stripe.com/docs/revenue-recognition" },
    { id: 33, role: "agent", content: "I also opened a browser session to grab live screenshots:", block: { type: "browser", url: "stripe.com/docs/revenue-recognition", title: "Revenue Recognition · Stripe Docs", actions: [
      { label: "Navigate", done: true },
      { label: "Scroll to ASC 606", done: true },
      { label: "Screenshot", done: true },
      { label: "Extract tables", done: false },
    ] } },
  ],
  5: [
    { id: 40, role: "user", content: "Generate a mermaid flowchart of our user onboarding." },
    { id: 41, role: "agent", content: "Here's the rendered flowchart:", block: { type: "mermaid", code: "flowchart TD\n  A[User signs up] --> B{Email verified?}\n  B -->|Yes| C[Onboarding tour]\n  B -->|No| D[Send verify email]\n  C --> E[Connect integrations]\n  E --> F[Dashboard]" } },
    { id: 42, role: "agent", content: "Quick search comparison of similar onboarding flows:", block: { type: "search", query: "best SaaS onboarding flowchart 2026", results: [
      { title: "Linear's onboarding teardown", url: "linear.app/blog", snippet: "8-step flow with email verify gating connect step.", color: T.violet },
      { title: "Notion's signup funnel", url: "notion.so", snippet: "Skip-able verify, immediate template gallery.", color: T.amber },
      { title: "Stripe Atlas onboarding", url: "stripe.com/atlas", snippet: "Doc-heavy flow with progressive disclosure.", color: T.blue },
    ] } },
  ],
};

export type BgTask = { id: number; name: string; progress: number; color: string };

export const INITIAL_BG_TASKS: BgTask[] = [
  { id: 1, name: "Training Model v4",    progress: 65, color: T.amber  },
  { id: 2, name: "Syncing Asana Graph",  progress: 30, color: T.violet },
  { id: 3, name: "Scraping API Docs",    progress: 85, color: T.sage   },
];
