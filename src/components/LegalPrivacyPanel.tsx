import { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck2,
  HardDrive,
  Scale,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import type { OperatorProfileMeta, OperatorSlotId } from "../utils/operatorStorage";

interface StorageSummary {
  builtTotal: number;
  tasksTotal: number;
  keysTotal: number;
  pinsTotal: number;
}

interface LegalPrivacyPanelProps {
  operatorProfiles: OperatorProfileMeta[];
  activeOperatorId: OperatorSlotId;
  storageSummary: StorageSummary;
  onExportBackup: () => void;
  onRestoreBackup: (rawJson: string) => {
    ok: boolean;
    message: string;
  };
  onEraseAllData: () => void;
}

const REFERENCE_LINKS = [
  {
    label: "GitHub Privacy Statement",
    desc: "How GitHub, Inc. handles HTTP transport & Pages hosting metadata",
    href: "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement",
  },
  {
    label: "GitHub Pages Data Collection Notice",
    desc: "Official disclosure on GitHub Pages visitor IP logging & static delivery",
    href: "https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#data-collection",
  },
  {
    label: "ICO UK GDPR Guidance",
    desc: "UK Information Commissioner's Office data protection resources",
    href: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/",
  },
  {
    label: "ICO — Raise a Data Complaint",
    desc: "How to raise a data protection concern with the UK regulator",
    href: "https://ico.org.uk/make-a-complaint/",
  },
  {
    label: "GZW Wiki Copyrights (CC BY-SA)",
    desc: "Community guide & task walkthrough licensing attribution",
    href: "https://gray-zone-warfare.fandom.com/wiki/Gray_Zone_Warfare_Wiki:Copyrights",
  },
];

export function LegalPrivacyPanel({
  operatorProfiles,
  activeOperatorId,
  storageSummary,
  onExportBackup,
  onRestoreBackup,
  onEraseAllData,
}: LegalPrivacyPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [confirmErase, setConfirmErase] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const res = onRestoreBackup(text);
      setActionFeedback({
        tone: res.ok ? "success" : "error",
        text: res.message,
      });
      setConfirmErase(false);
    } catch {
      setActionFeedback({
        tone: "error",
        text: "Could not read the selected backup file.",
      });
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#080b10] text-[#e2e8f0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hero Header */}
        <section className="bg-[#0e131b] border border-white/[0.08] rounded-xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#94a3b8]">
            <span>Privacy, Legal &amp; Data Controls</span>
            <span aria-hidden="true">·</span>
            <span>Public GitHub Pages Static App</span>
            <span aria-hidden="true">·</span>
            <span>Per-Visitor Browser Isolation</span>
            <span aria-hidden="true">·</span>
            <span>Notice updated: 24 November 2026</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#f8fafc] mt-2">
            Your progress. Your browser. Your control.
          </h1>
          <p className="text-sm text-[#cbd5e1] leading-relaxed max-w-3xl mt-2">
            Lamang Operations is an independent hobby &amp; tactical companion for{" "}
            <strong className="text-white font-semibold">Gray Zone Warfare</strong>, published as a
            public static web application on GitHub Pages. Although anyone can open the public link,{" "}
            <strong className="text-white font-semibold">
              every visitor only ever sees and accesses their own data on their own device
            </strong>
            . This notice describes clearly how the app works and is provided for transparency rather
            than as formal legal compliance certification.
          </p>
        </section>

        {/* Main 2-Column Content + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_350px] gap-6 items-start">
          {/* Left Column: Structured Privacy & Legal Sections */}
          <div className="space-y-4">
            {/* 1. Strict Single-User Data Isolation & What is Processed */}
            <article className="bg-[#0e131b] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#e5a93c] shrink-0" />
                <h2 className="font-display text-base sm:text-lg font-semibold text-[#f8fafc]">
                  Single-visitor isolation &amp; what is processed
                </h2>
              </div>
              <div className="space-y-2.5 text-[13.5px] text-[#cbd5e1] leading-relaxed">
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    One Person = Only Your Own Data (Zero Shared Database):
                  </strong>{" "}
                  There are no user accounts, login credentials, friend lists, party rooms, or
                  central server databases. If two different people open this public GitHub Pages
                  site, each person&apos;s browser maintains completely separate local storage on
                  their own machine. Other visitors cannot read, search, modify, or overwrite your
                  progress, and the site maintainer cannot see or access any visitor&apos;s saved
                  data.
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    Operator Slots &amp; Tactical Progress (Local Only):
                  </strong>{" "}
                  The app stores only what you enter locally for your three browser operator slots (
                  {operatorProfiles.map((p) => p.name).join(", ")}), including slot labels, chosen
                  faction filter, Hideout built/planned upgrade states, stash counts, completed
                  tasks, owned keys, saved Gunsmith weapon loadouts, map material ticks, custom
                  recon pins and notes, and sidebar panel width.
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    No Sensitive Info &amp; No Game Connection:
                  </strong>{" "}
                  This tool never links to your Steam, GitHub, or game account and reads no game
                  files or process memory. Do not enter personal, confidential, or sensitive details
                  into operator slot names or custom pin notes.
                </p>
              </div>
            </article>

            {/* 2. Where your data goes (Public GitHub Pages Architecture) */}
            <article className="bg-[#0e131b] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <h2 className="font-display text-base sm:text-lg font-semibold text-[#f8fafc]">
                  Where your data goes (GitHub Pages &amp; game CDNs)
                </h2>
              </div>
              <div className="space-y-2.5 text-[13.5px] text-[#cbd5e1] leading-relaxed">
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    100% Browser-Local Saves:
                  </strong>{" "}
                  All progress, stash counts, and custom pins stay inside this specific browser
                  profile on your device unless you explicitly click{" "}
                  <strong className="text-white">Export my progress</strong> to download a JSON file
                  yourself. Moving to another browser or computer requires transferring your own
                  exported JSON backup manually.
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    Static Hosting via GitHub Pages (GitHub, Inc.):
                  </strong>{" "}
                  Public builds are served as static HTML/JS/CSS files by GitHub Pages. When your
                  browser requests the page, GitHub&apos;s servers automatically receive standard
                  HTTP transport metadata (including your IP address, user-agent, requested URL, and
                  timestamp) for security, DDoS protection, and delivery under the{" "}
                  <strong className="text-white">GitHub Privacy Statement</strong>. The app
                  maintainer has no dashboard or access to individual visitor IP logs.
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    Direct Read-Only Game Data &amp; Map Tile Requests:
                  </strong>{" "}
                  When running on GitHub Pages, your browser connects directly (read-only) to
                  public community game services for item/task catalogs (
                  <code className="font-mono-tabular text-xs text-[#94a3b8]">gzw-data.dev</code>),
                  Lamang satellite map tiles (
                  <code className="font-mono-tabular text-xs text-[#94a3b8]">cdn.gzwtacmap.com</code>
                  ), and optional task walkthroughs/images (
                  <code className="font-mono-tabular text-xs text-[#94a3b8]">
                    gray-zone-warfare.fandom.com
                  </code>{" "}
                  &amp; <code className="font-mono-tabular text-xs text-[#94a3b8]">static.wikia.nocookie.net</code>).
                  When running on an optional Express/Node server preview, those read-only public
                  requests pass through the host server cache instead. In every mode, zero saved
                  progress, custom pins, or personal identifiers are ever included in those requests.
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    Zero Trackers &amp; External Links:
                  </strong>{" "}
                  No advertising SDKs, analytics scripts, telemetry beacons, or geolocation APIs are
                  used. External reference links contact those websites only when you click them.
                </p>
              </div>
            </article>

            {/* 3. Storage, cookies and retention */}
            <article className="bg-[#0e131b] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-[#34d399] shrink-0" />
                <h2 className="font-display text-base sm:text-lg font-semibold text-[#f8fafc]">
                  Browser storage, cookies &amp; retention
                </h2>
              </div>
              <div className="space-y-2.5 text-[13.5px] text-[#cbd5e1] leading-relaxed">
                <p>
                  Operator slots, progress snapshots, panel width preferences, and cached public
                  API/wiki snapshots are stored in this browser&apos;s{" "}
                  <code className="font-mono-tabular text-xs text-[#7dd3fc]">localStorage</code>{" "}
                  (<code className="font-mono-tabular text-xs text-[#94a3b8]">lamang_ops_*</code>{" "}
                  keys) strictly as user-requested core app functionality. The app sets no
                  advertising, analytics, or cross-site tracking cookies (consistent with UK PECR
                  and EU ePrivacy rules for strictly necessary local storage).
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    Shared Devices Warning &amp; Retention:
                  </strong>{" "}
                  A shared computer or shared browser profile is not encrypted private storage:
                  anyone using the same OS account and browser profile can view or clear your saved
                  progress. Local browser data stays until you overwrite it, clear site storage in
                  browser settings, or click <strong className="text-white">Erase my app data</strong>.
                  GitHub Pages and third-party CDN operational logs follow those providers&apos; own
                  retention schedules.
                </p>
              </div>
            </article>

            {/* 4. Purpose, lawful basis, UK/EU GDPR & International Transfers */}
            <article className="bg-[#0e131b] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-[#e5a93c] shrink-0" />
                <h2 className="font-display text-base sm:text-lg font-semibold text-[#f8fafc]">
                  Lawful basis, UK/EU GDPR &amp; international transfers
                </h2>
              </div>
              <div className="space-y-2.5 text-[13.5px] text-[#cbd5e1] leading-relaxed">
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    Purpose &amp; Lawful Basis:
                  </strong>{" "}
                  This public static site operates as a free, non-commercial community utility. To
                  the extent any network transport data is processed during page delivery, it is
                  processed solely for our legitimate interests in reliably serving the static app
                  and maintaining security, with zero profiling, marketing, or sale of data.
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    International Data Transfers:
                  </strong>{" "}
                  GitHub Pages is operated by GitHub, Inc. (United States) with global edge CDN
                  delivery, so basic HTTP connection metadata (such as your IP address) may be
                  routed outside the UK/EEA under GitHub&apos;s published data protection and
                  international transfer safeguards (linked on the right). Your saved game progress
                  itself never leaves your own device.
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    Your Rights &amp; Regulator Contact:
                  </strong>{" "}
                  Where UK GDPR or EU GDPR applies, you have rights of access, rectification,
                  erasure, restriction, portability, and objection. Because all app saves live
                  exclusively in your browser, you can exercise access, portability, and immediate
                  erasure directly using the controls on this page. You also have the right to
                  lodge a complaint with the{" "}
                  <strong className="text-white">UK Information Commissioner&apos;s Office (ICO)</strong>{" "}
                  or your local data protection authority.
                </p>
              </div>
            </article>

            {/* 5. Unofficial Fan Companion, Fair Play, Copyright & Liability */}
            <article className="bg-[#0e131b] border border-white/[0.08] rounded-xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#e5a93c] shrink-0" />
                <h2 className="font-display text-base sm:text-lg font-semibold text-[#f8fafc]">
                  Unofficial fan notice, fair play, copyright &amp; disclaimers
                </h2>
              </div>
              <div className="space-y-2.5 text-[13.5px] text-[#cbd5e1] leading-relaxed">
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    Non-Affiliation &amp; Intellectual Property:
                  </strong>{" "}
                  Lamang Operations is an independent, unofficial fan-made project and is{" "}
                  <strong className="text-white">
                    not affiliated with, endorsed by, sponsored by, or connected to MADFINGER Games,
                    a.s.
                  </strong>{" "}
                  or <em>Gray Zone Warfare</em>. All trademarks, faction names, map imagery, and
                  game assets belong to their respective owners. Structured community game data is
                  sourced from <code className="text-xs text-[#94a3b8]">gzw-data.dev</code>, tactical
                  map tiles from <code className="text-xs text-[#94a3b8]">gzwtacmap.com</code>, and
                  walkthrough text/media from the Gray Zone Warfare Fandom Wiki (CC BY-SA). Rights
                  holders requesting content removal or attribution updates may open an issue or
                  contact the maintainer via the public repository.
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    Fair Play &amp; External-Only Operation:
                  </strong>{" "}
                  This companion runs solely inside a standard browser as an interactive map and
                  progress checklist. It never reads or modifies game memory, binaries, files, or
                  network packets, and performs no screen capture or automated live tracking. You
                  remain solely responsible for complying with MADFINGER Games&apos; Terms of Service
                  and EULA.
                </p>
                <p>
                  <strong className="text-[#f1f5f9] font-semibold">
                    &ldquo;As-Is&rdquo; Disclaimer, Liability &amp; Minimum Age:
                  </strong>{" "}
                  Coordinates, disassembly yields, loot tiers, vendor prices, and task guides are
                  provided &ldquo;as is&rdquo; without warranty of accuracy, completeness, or
                  uptime, as game updates may change spawns or recipes at any time. To the maximum
                  extent permitted by law, the maintainer accepts no liability for gameplay, data,
                  or indirect losses arising from use of this tool. This site is not directed at
                  children under 13 (or 16 in jurisdictions requiring parental consent).
                </p>
              </div>
            </article>
          </div>

          {/* Right Column: Data Controls, Contact & Guidance Links */}
          <aside className="space-y-4 lg:sticky lg:top-6">
            {/* Access, Export, Restore & Erasure Controls */}
            <section className="bg-[#141b26] border border-white/[0.09] rounded-xl p-5 space-y-4">
              <div>
                <h2 className="font-display text-base font-semibold text-[#f8fafc]">
                  Access, export and erasure
                </h2>
                <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                  Applies only to this browser on your device across your 3 local operator slots
                  (active:{" "}
                  <span className="text-[#e2e8f0] font-medium">
                    {operatorProfiles.find((p) => p.id === activeOperatorId)?.name || "Operator 1"}
                  </span>
                  ).
                </p>
              </div>

              {/* Live Local Storage Telemetry */}
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#0a0e14] border border-white/[0.07] p-3">
                <div>
                  <div className="text-[11px] text-[#7f8ea1]">Built Upgrades</div>
                  <div className="font-mono-tabular text-sm font-semibold text-[#f8fafc] mt-0.5">
                    {storageSummary.builtTotal}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#7f8ea1]">Completed Tasks</div>
                  <div className="font-mono-tabular text-sm font-semibold text-[#f8fafc] mt-0.5">
                    {storageSummary.tasksTotal}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#7f8ea1]">Owned Keys</div>
                  <div className="font-mono-tabular text-sm font-semibold text-[#f8fafc] mt-0.5">
                    {storageSummary.keysTotal}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#7f8ea1]">Custom Pins</div>
                  <div className="font-mono-tabular text-sm font-semibold text-[#f8fafc] mt-0.5">
                    {storageSummary.pinsTotal}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onExportBackup();
                    setActionFeedback({
                      tone: "success",
                      text: "Exported full progress backup (.json).",
                    });
                  }}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#e5a93c] hover:bg-[#eab654] text-[#090d12] text-xs font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export my progress</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Choose progress backup JSON file"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a0e14] hover:bg-[#101722] border border-white/[0.12] hover:border-[#38bdf8]/60 text-[#e2e8f0] hover:text-white text-xs font-medium transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#38bdf8]" />
                  <span>Restore a progress backup</span>
                </button>

                {!confirmErase ? (
                  <button
                    type="button"
                    onClick={() => setConfirmErase(true)}
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a0e14] hover:bg-red-950/35 border border-white/[0.1] hover:border-red-500/50 text-red-300 hover:text-red-200 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Erase my app data</span>
                  </button>
                ) : (
                  <div className="rounded-xl bg-red-950/30 border border-red-500/45 p-3.5 space-y-2.5">
                    <p className="text-xs text-red-200 leading-relaxed">
                      This permanently removes all saved operators, Hideout plans, tasks, keys,
                      weapon loadouts, stash counts, custom pins, and cached data from this browser.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onEraseAllData();
                          setConfirmErase(false);
                          setActionFeedback({
                            tone: "success",
                            text: "All local app data has been erased and reset.",
                          });
                        }}
                        className="flex-1 min-h-[44px] px-3 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-semibold transition-colors"
                      >
                        Confirm erase
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmErase(false)}
                        className="min-h-[44px] px-3 py-2 rounded-lg bg-[#0a0e14] border border-white/[0.12] text-xs font-medium text-[#cbd5e1] hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {actionFeedback && (
                <div
                  role="status"
                  className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
                    actionFeedback.tone === "success"
                      ? "bg-emerald-950/35 border-emerald-500/40 text-emerald-200"
                      : "bg-red-950/35 border-red-500/40 text-red-200"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{actionFeedback.text}</span>
                </div>
              )}
            </section>

            {/* Maintainer & Public Contact */}
            <section className="bg-[#0e131b] border border-white/[0.08] rounded-xl p-5 space-y-2">
              <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                Maintainer &amp; privacy contact
              </h2>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                Hosted as a public static GitHub Pages project. Each user&apos;s saved data lives
                only in their own browser; the maintainer holds no user accounts, cloud saves, or
                visitor IP logs.
              </p>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                For copyright/attribution requests, bug reports, or privacy questions, contact the
                site maintainer via the public GitHub repository&apos;s Issues / Contact page.
              </p>
            </section>

            {/* GitHub Pages, ICO & Provider Policy Links */}
            <section className="bg-[#0e131b] border border-white/[0.08] rounded-xl p-5 space-y-2.5">
              <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                Hosting &amp; regulatory links
              </h2>
              <div className="divide-y divide-white/[0.06]">
                {REFERENCE_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-2 py-2.5 first:pt-1 last:pb-1 text-left"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#7dd3fc] group-hover:text-[#bae6fd] group-hover:underline">
                        {link.label}
                      </div>
                      <div className="text-[11px] text-[#7f8ea1] mt-0.5 leading-snug">
                        {link.desc}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#7f8ea1] group-hover:text-[#7dd3fc] shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
