import React, {useState} from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileSpreadsheet,
  Info,
  MessageSquare,
  Printer,
  ShieldAlert,
  TrendingUp,
  Workflow,
} from 'lucide-react';
import {DEVELOPER_INFO} from '../data/pharmacyData';
import type {PharmacyConfig} from '../types/pharmacy';
import {BrandMark} from './BrandLogo';

interface RoadmapScreenProps {
  config: PharmacyConfig;
  onOpenCatalogue: () => void;
  onOpenContact: () => void;
}

const SECTION_LINKS = [
  {id: 'cover', label: '1. Cover'},
  {id: 'executive-summary', label: '2. Executive Summary'},
  {id: 'business-snapshot', label: '3. Snapshot'},
  {id: 'problems', label: '4. Problems'},
  {id: 'solutions', label: '5. AI Tools & Before/After'},
  {id: 'safety-kpis', label: '6. Safety & KPIs'},
  {id: 'budget-roi', label: '7. Budget & ROI'},
  {id: 'roadmap-90', label: '8. 30-60-90 Roadmap'},
  {id: 'next-step', label: '9. Benefits & Next Step'},
];

const RECOMMENDED_TOOLS = [
  {
    name: 'Botpress',
    category: 'Customer Communication',
    icon: <Bot className="w-5 h-5" />,
    solves: 'Handles routine store-hour, location, and catalogue questions 24/7 with strict pharmacy safety guardrails.',
    safetyRule:
      'Blocked from giving diagnoses, dosages, or drug advice; escalates any clinical symptom to Mrs. Amara or Mr. Tobi.',
  },
  {
    name: 'n8n',
    category: 'Workflow Automation',
    icon: <Workflow className="w-5 h-5" />,
    solves: 'Automates enquiry capture, sends instant staff alerts for pending requests, and schedules follow-up reminders.',
    safetyRule:
      'Logs escalation timestamps and prevents unverified messages from closing without human staff review.',
  },
  {
    name: 'Google Sheets',
    category: 'Business Records',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    solves: 'Organizes the 35-item product catalogue, stock check notes, customer enquiry logs, and weekly KPI summaries.',
    safetyRule:
      'Minimizes stored personal data—records only customer first name, enquiry topic, status, and staff sign-off.',
  },
  {
    name: 'WhatsApp Business',
    category: 'Customer Engagement',
    icon: <MessageSquare className="w-5 h-5" />,
    solves: 'Supports structured pre-filled enquiries, quick-reply labels, and timely customer pickup follow-ups.',
    safetyRule:
      'Orders and clinical advice remain human-confirmed by qualified pharmacy staff before dispensing.',
  },
];

const BEFORE_AFTER_ROWS = [
  {
    area: 'Customer WhatsApp Enquiries',
    before: 'Staff manually type replies for store hours, directions, and basic item checks while serving walk-in customers.',
    after: 'Pre-filled catalogue enquiries + Botpress greet customers instantly, collect item & quantity, and route clean summaries to staff.',
  },
  {
    area: 'Medicine & Symptom Questions',
    before: 'Mixed directly into casual chat threads with risk of missed context during busy afternoon periods.',
    after: 'Botpress enforces strict safety refusal on clinical questions and routes immediately to pharmacist approval.',
  },
  {
    area: 'Enquiry & Inventory Records',
    before: 'Ad-hoc chat history and manual memory or paper notes lead to forgotten callbacks or stock mismatches.',
    after: 'n8n logs every enquiry automatically into structured Google Sheets tabs with status labels and low-stock flags.',
  },
  {
    area: 'Customer Follow-Up',
    before: 'Inconsistent manual follow-up when a requested item is restocked or ready for pickup.',
    after: 'n8n triggers scheduled WhatsApp Business follow-up reminders for staff to confirm and send.',
  },
];

const KPI_LIST = [
  {
    metric: 'Average Customer Response Time',
    baseline: '25–90 mins (manual during peak hours)',
    target: 'Under 2 mins initial acknowledgement; <15 mins staff follow-up',
  },
  {
    metric: 'Number of Enquiries Handled',
    baseline: 'Untracked across personal chat history',
    target: '100% logged by category (OTC, Baby, Personal Care, Equipment)',
  },
  {
    metric: 'Number of Unanswered Enquiries',
    baseline: 'Estimated 15–25% missed after hours',
    target: 'Near 0% dropped enquiries via automated morning queue',
  },
  {
    metric: 'Inventory Recording Accuracy',
    baseline: 'Manual spot checks only',
    target: '95%+ weekly reconciliation across core catalogue SKUs',
  },
  {
    metric: 'Customer Follow-Up Completion Rate',
    baseline: 'Informal / inconsistent',
    target: '90%+ of restock & pickup enquiries followed up within 24 hours',
  },
  {
    metric: 'Staff Hours Saved Weekly',
    baseline: '0 hrs saved (all manual administration)',
    target: '6–10 hours/week saved across 2 staff members (illustrative)',
  },
];

const ROADMAP_PHASES = [
  {
    id: 'days-1-30',
    label: 'Days 1–30',
    title: 'Foundation, Data Hygiene & Safety Guardrails',
    goals: [
      'Standardize the 4 product categories and 35 core items in a structured Google Sheets master inventory & enquiry workbook.',
      'Configure WhatsApp Business profile, Lagos address, opening hours (Mon–Sat 9 AM–9 PM, Sun 12 PM–8 PM), and quick-reply labels.',
      'Draft and approve the Pharmacy AI Safety Policy with Mrs. Amara & Mr. Tobi (zero diagnosis, zero automated drug advice).',
    ],
    deliverable: 'Clean catalogue sheet + WhatsApp Business labels + signed safety rules.',
  },
  {
    id: 'days-31-60',
    label: 'Days 31–60',
    title: 'Botpress & n8n Automation Pilot',
    goals: [
      'Deploy Botpress non-clinical assistant handling opening hours, Surulere directions, and product catalogue routing.',
      'Build n8n workflow linking incoming enquiries to Google Sheets rows and sending instant WhatsApp/email alerts for pharmacist-required questions.',
      'Train both staff members (1-hour hands-on workshop) on reviewing escalated enquiries and marking follow-up status.',
    ],
    deliverable: 'Live supervised pilot logging real customer enquiries & response times.',
  },
  {
    id: 'days-61-90',
    label: 'Days 61–90',
    title: 'KPI Review, Follow-Up Optimization & Handover',
    goals: [
      'Audit 60-day chatbot transcripts to verify 100% compliance with clinical escalation rules and customer data minimization.',
      'Activate n8n automated restock/pickup follow-up reminders in Google Sheets.',
      'Review KPI improvements (response time, unanswered enquiries, staff hours saved) and finalize ongoing monthly maintenance checklist.',
    ],
    deliverable: '90-day KPI evaluation scorecard + owner operations playbook.',
  },
];

export const RoadmapScreen: React.FC<RoadmapScreenProps> = ({
  config,
  onOpenCatalogue,
  onOpenContact,
}) => {
  const [activePhaseId, setActivePhaseId] = useState<string>('days-1-30');
  const [weeklyEnquiries, setWeeklyEnquiries] = useState<number>(60);
  const [minutesSavedPerEnquiry, setMinutesSavedPerEnquiry] = useState<number>(6);
  const [hourlyStaffValueNgn, setHourlyStaffValueNgn] = useState<number>(2500);

  const weeklyHoursSaved = Number(((weeklyEnquiries * minutesSavedPerEnquiry) / 60).toFixed(1));
  const monthlyHoursSaved = Number((weeklyHoursSaved * 4.3).toFixed(1));
  const estimatedMonthlyTimeValueNgn = Math.round(monthlyHoursSaved * hourlyStaffValueNgn);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Sticky Quick Actions & Section Jump Bar (hidden when printing) */}
      <div className="no-print rounded-2xl bg-white border border-[#E2ECE7] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="min-h-[34px] inline-flex items-center px-2.5 py-1 rounded-lg bg-[#F8FAF9] border border-[#DCE8E1] text-xs font-medium text-[#0F5132] hover:bg-[#F1F7F4] transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5132] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0B3D25] transition-colors whitespace-nowrap shrink-0"
        >
          <Printer className="w-4 h-4 shrink-0" />
          <span>Print / Save 3–5 Page PDF</span>
        </button>
      </div>

      {/* 1. COVER PAGE */}
      <section
        id="cover"
        className="print-avoid-break rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-10 shadow-xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1F7F4] pb-6">
          <div className="flex items-center gap-3.5">
            <BrandMark size={52} className="shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#0F5132]">
                Project 8 · AI Business Consulting Deliverable
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A241F] tracking-tight mt-0.5">
                Greenfield Pharmacy — AI Adoption Roadmap
              </h1>
            </div>
          </div>
          <span className="text-xs font-medium text-[#4B5E54] bg-[#F8FAF9] border border-[#E2ECE7] rounded-xl px-3.5 py-2 self-start sm:self-auto">
            3–5 Page Practical Consulting Proposal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div className="rounded-2xl bg-[#F8FAF9] border border-[#E2ECE7] p-5 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#0F5132]">
              Client Business Profile (Sample Case)
            </h2>
            <p className="text-base font-bold text-[#1A241F]">Greenfield Pharmacy</p>
            <p className="text-[#4B5E54]">{config.address}</p>
            <p className="text-[#4B5E54]">
              Operations Team: <strong className="text-[#1A241F]">{config.staffNames}</strong> (2 staff)
            </p>
            <p className="text-[#4B5E54]">
              Hours: <span className="text-[#1A241F]">{config.openingHours}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAF9] border border-[#E2ECE7] p-5 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#0F5132]">
              Prepared By (AI Business Consultant &amp; App Developer)
            </h2>
            <p className="text-base font-bold text-[#1A241F]">{DEVELOPER_INFO.name}</p>
            <p className="text-[#4B5E54]">Email: {DEVELOPER_INFO.email}</p>
            <p className="text-[#4B5E54]">Phone: {DEVELOPER_INFO.phoneDisplay}</p>
            <a
              href={DEVELOPER_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-semibold text-[#0F5132] hover:underline"
            >
              LinkedIn: linkedin.com/in/ezeobinwa-anthonia
            </a>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE SUMMARY & 3. BUSINESS SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section
          id="executive-summary"
          className="print-avoid-break lg:col-span-7 rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-4 shadow-xs"
        >
          <h2 className="text-xl font-bold text-[#1A241F]">2. Executive Summary</h2>
          <p className="text-sm sm:text-base text-[#4B5E54] leading-relaxed">
            Greenfield Pharmacy is a busy neighbourhood pharmacy serving both walk-in shoppers and
            WhatsApp customers in Surulere, Lagos with a lean two-person team ({config.staffNames}
            ). Because every price check, availability request, and general question currently relies
            on manual chat replies and informal notes, staff lose hours daily and after-hours
            enquiries risk going unanswered.
          </p>
          <p className="text-sm sm:text-base text-[#4B5E54] leading-relaxed">
            This roadmap proposes a low-cost, safety-first AI workflow combining{' '}
            <strong className="text-[#1A241F]">Botpress</strong>,{' '}
            <strong className="text-[#1A241F]">n8n</strong>,{' '}
            <strong className="text-[#1A241F]">Google Sheets</strong>, and{' '}
            <strong className="text-[#1A241F]">WhatsApp Business</strong>. Automation handles
            non-clinical store information, structured enquiry capture, and follow-up tracking,
            while qualified staff retain 100% control over medicine advice and dispensing.
          </p>
        </section>

        <section
          id="business-snapshot"
          className="print-avoid-break lg:col-span-5 rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-4 shadow-xs"
        >
          <h2 className="text-xl font-bold text-[#1A241F]">3. Business Snapshot</h2>
          <dl className="divide-y divide-[#F1F7F4] text-sm">
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#4B5E54]">Location</dt>
              <dd className="font-medium text-[#1A241F] text-right">Surulere, Lagos</dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#4B5E54]">Team Size</dt>
              <dd className="font-medium text-[#1A241F] text-right">2 Staff ({config.staffNames})</dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#4B5E54]">Customer Channels</dt>
              <dd className="font-medium text-[#1A241F] text-right">Walk-in + WhatsApp + Catalogue App</dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#4B5E54]">Core Categories</dt>
              <dd className="font-medium text-[#1A241F] text-right">Personal Care, Baby, Equipment, OTC</dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#4B5E54]">Case Context</dt>
              <dd className="font-medium text-[#1A241F] text-right">Sample business consulting case</dd>
            </div>
          </dl>
        </section>
      </div>

      {/* 4. IDENTIFIED BUSINESS PROBLEMS */}
      <section
        id="problems"
        className="print-avoid-break rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-5 shadow-xs"
      >
        <div>
          <h2 className="text-xl font-bold text-[#1A241F]">4. Identified Business Problems</h2>
          <p className="text-sm text-[#4B5E54] mt-0.5">
            Core operational bottlenecks affecting customer response speed and staff capacity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#F8FAF9] border border-[#E2ECE7] p-5 space-y-2">
            <p className="text-xs font-semibold text-[#0F5132]">Problem 1 · Slow Manual Replies</p>
            <h3 className="text-base font-bold text-[#1A241F]">
              Repetitive WhatsApp &amp; Walk-In Bottlenecks
            </h3>
            <p className="text-sm text-[#4B5E54] leading-relaxed">
              During busy periods, Mrs. Amara and Mr. Tobi must pause counter customers to answer
              repetitive questions on opening hours, directions, and product availability.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAF9] border border-[#E2ECE7] p-5 space-y-2">
            <p className="text-xs font-semibold text-[#0F5132]">Problem 2 · Unstructured Tracking</p>
            <h3 className="text-base font-bold text-[#1A241F]">
              Fragmented Inventory &amp; Missed Follow-Ups
            </h3>
            <p className="text-sm text-[#4B5E54] leading-relaxed">
              Without a central enquiry log connected to product records, out-of-stock requests and
              restock promises are easily forgotten inside chat threads.
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAF9] border border-[#E2ECE7] p-5 space-y-2">
            <p className="text-xs font-semibold text-[#0F5132]">Problem 3 · After-Hours Drop-Off</p>
            <h3 className="text-base font-bold text-[#1A241F]">
              Unanswered Evening &amp; Morning Requests
            </h3>
            <p className="text-sm text-[#4B5E54] leading-relaxed">
              Messages received outside 9 AM–9 PM wait overnight without acknowledgement, causing
              customers to visit competing pharmacies.
            </p>
          </div>
        </div>
      </section>

      {/* 5. RECOMMENDED AI SOLUTIONS + A. BEFORE-AND-AFTER COMPARISON */}
      <section
        id="solutions"
        className="print-break-before space-y-6 rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 shadow-xs"
      >
        <div>
          <h2 className="text-xl font-bold text-[#1A241F]">
            5. Recommended AI Tools &amp; Workflow Architecture
          </h2>
          <p className="text-sm text-[#4B5E54] mt-0.5">
            Four practical, low-overhead tools tailored for a two-staff Lagos community pharmacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOMMENDED_TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="print-avoid-break rounded-2xl bg-[#F8FAF9] border border-[#E2ECE7] p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F5132] text-white">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A241F]">{tool.name}</h3>
                    <p className="text-xs font-medium text-[#0F5132]">{tool.category}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#4B5E54] leading-relaxed">{tool.solves}</p>
              <p className="text-xs text-[#1A241F] bg-white border border-[#DCE8E1] rounded-xl px-3 py-2">
                <strong>Guardrail:</strong> {tool.safetyRule}
              </p>
            </div>
          ))}
        </div>

        {/* A. Before-and-After Comparison */}
        <div className="print-avoid-break pt-4 border-t border-[#F1F7F4] space-y-3">
          <h3 className="text-lg font-bold text-[#1A241F]">
            A. Before-and-After Process Comparison
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-[#E2ECE7]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#F1F7F4] text-[#1A241F]">
                  <th className="p-3.5 font-semibold border-b border-[#E2ECE7]">Process Area</th>
                  <th className="p-3.5 font-semibold border-b border-[#E2ECE7]">
                    Before (Current Manual Process)
                  </th>
                  <th className="p-3.5 font-semibold border-b border-[#E2ECE7]">
                    After (AI-Supported Workflow)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F7F4]">
                {BEFORE_AFTER_ROWS.map((row) => (
                  <tr key={row.area} className="align-top">
                    <td className="p-3.5 font-semibold text-[#1A241F] whitespace-nowrap">
                      {row.area}
                    </td>
                    <td className="p-3.5 text-[#4B5E54]">{row.before}</td>
                    <td className="p-3.5 text-[#0F5132] font-medium bg-[#F8FAF9]/60">
                      {row.after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* C. RISK & SAFETY MANAGEMENT + D. SUCCESS MEASUREMENT (KPIs) */}
      <div id="safety-kpis" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="print-avoid-break lg:col-span-6 rounded-3xl bg-[#FFF7ED] border border-[#FDBA74] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#9A3412]">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h2 className="text-xl font-bold">C. Pharmacy Risk &amp; AI Safety Management</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#7C2D12] leading-relaxed">
            Patient safety takes strict precedence over automation. Botpress and n8n operate purely
            as administrative and catalogue assistants under five mandatory rules:
          </p>
          <ul className="space-y-2.5 text-sm text-[#7C2D12]">
            {[
              'No AI-generated diagnosis or prescriptions under any circumstances.',
              'No automated medication recommendations, dosing advice, or drug-interaction claims.',
              'Mandatory pharmacist approval for all medicine-related or symptom questions.',
              'Customer data privacy & protection: collect minimum enquiry details only (no medical histories stored in public sheets).',
              'Human supervision of chatbot responses with weekly transcript audits by pharmacy staff.',
            ].map((rule) => (
              <li key={rule} className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="print-avoid-break lg:col-span-6 rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#0F5132]">
            <BarChart3 className="w-5 h-5 shrink-0" />
            <h2 className="text-xl font-bold text-[#1A241F]">D. Success Measurement (KPIs)</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5E54]">
            Measured weekly inside the Greenfield Pharmacy Google Sheets dashboard:
          </p>
          <div className="divide-y divide-[#F1F7F4]">
            {KPI_LIST.map((kpi) => (
              <div key={kpi.metric} className="py-2.5 space-y-0.5">
                <p className="text-sm font-semibold text-[#1A241F]">{kpi.metric}</p>
                <p className="text-xs text-[#4B5E54]">
                  <strong>Baseline:</strong> {kpi.baseline}
                </p>
                <p className="text-xs text-[#0F5132] font-medium">
                  <strong>Target:</strong> {kpi.target}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 6 & E. IMPLEMENTATION BUDGET + B. ILLUSTRATIVE ROI */}
      <section
        id="budget-roi"
        className="print-break-before grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        <div className="print-avoid-break lg:col-span-7 rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-4 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-[#1A241F]">
              6 &amp; E. Implementation Budget &amp; Cost Estimates
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5E54] mt-1">
              Tools, initial setup, and ongoing monthly maintenance separated clearly. Verify live
              vendor pricing and FX rates before presenting formal client quotations.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E2ECE7]">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#F1F7F4] text-[#1A241F]">
                  <th className="p-3 font-semibold border-b border-[#E2ECE7]">Cost Category</th>
                  <th className="p-3 font-semibold border-b border-[#E2ECE7]">Item / Scope</th>
                  <th className="p-3 font-semibold border-b border-[#E2ECE7] text-right">
                    Illustrative Estimate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F7F4]">
                <tr>
                  <td className="p-3 font-medium text-[#1A241F]">One-Time Setup</td>
                  <td className="p-3 text-[#4B5E54]">
                    Botpress guardrails, n8n workflow, Google Sheets setup &amp; 2-staff training
                  </td>
                  <td className="p-3 font-semibold text-[#1A241F] text-right tabular-nums whitespace-nowrap">
                    ₦150,000 – ₦280,000
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#1A241F]">Software Tools (Monthly)</td>
                  <td className="p-3 text-[#4B5E54]">
                    Botpress starter/pay-as-you-go + n8n Cloud/VPS + Google Sheets (Free) + WhatsApp Business App (Free)
                  </td>
                  <td className="p-3 font-semibold text-[#1A241F] text-right tabular-nums whitespace-nowrap">
                    ₦25,000 – ₦65,000 / mo
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#1A241F]">Ongoing Maintenance</td>
                  <td className="p-3 text-[#4B5E54]">
                    Monthly workflow health check, prompt safety audit &amp; catalogue sync
                  </td>
                  <td className="p-3 font-semibold text-[#1A241F] text-right tabular-nums whitespace-nowrap">
                    ₦35,000 – ₦60,000 / mo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-[#F8FAF9] border border-[#DCE8E1] p-3 text-xs text-[#4B5E54]">
            <Info className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
            <span>
              <strong>Price Verification Notice:</strong> All Naira ranges above are unverified
              illustrative planning estimates, not binding vendor quotes. Confirm current USD/NGN
              pricing for Botpress, n8n hosting, and WhatsApp Business API messaging tiers before
              client sign-off.
            </span>
          </div>
        </div>

        {/* B. Return on Investment (ROI) */}
        <div className="print-avoid-break lg:col-span-5 rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5 text-[#0F5132]">
            <TrendingUp className="w-5 h-5 shrink-0" />
            <h2 className="text-xl font-bold text-[#1A241F]">
              B. Illustrative ROI Estimator
            </h2>
          </div>

          <p className="text-xs text-[#9A3412] bg-[#FFF7ED] border border-[#FDBA74] rounded-xl px-3 py-2 leading-relaxed">
            <strong>Illustrative Assumptions Only:</strong> Figures below model potential time
            savings from reduced manual chat triage and follow-ups—not actual pharmacy financial
            results.
          </p>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="roi-enq" className="font-medium text-[#1A241F]">
                  Weekly WhatsApp Enquiries
                </label>
                <span className="font-semibold text-[#0F5132] tabular-nums">
                  {weeklyEnquiries} / week
                </span>
              </div>
              <input
                id="roi-enq"
                type="range"
                min={20}
                max={200}
                step={5}
                value={weeklyEnquiries}
                onChange={(e) => setWeeklyEnquiries(Number(e.target.value))}
                className="w-full accent-[#0F5132]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="roi-mins" className="font-medium text-[#1A241F]">
                  Manual Minutes Saved per Enquiry
                </label>
                <span className="font-semibold text-[#0F5132] tabular-nums">
                  {minutesSavedPerEnquiry} mins
                </span>
              </div>
              <input
                id="roi-mins"
                type="range"
                min={2}
                max={12}
                step={1}
                value={minutesSavedPerEnquiry}
                onChange={(e) => setMinutesSavedPerEnquiry(Number(e.target.value))}
                className="w-full accent-[#0F5132]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="roi-rate" className="font-medium text-[#1A241F]">
                  Assumed Staff Time Value (₦/hr)
                </label>
                <span className="font-semibold text-[#0F5132] tabular-nums">
                  ₦{hourlyStaffValueNgn.toLocaleString()}
                </span>
              </div>
              <input
                id="roi-rate"
                type="range"
                min={1000}
                max={6000}
                step={500}
                value={hourlyStaffValueNgn}
                onChange={(e) => setHourlyStaffValueNgn(Number(e.target.value))}
                className="w-full accent-[#0F5132]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F1F7F4]">
            <div className="rounded-2xl bg-[#F1F7F4] p-3.5">
              <span className="block text-[11px] text-[#4B5E54]">Estimated Hours Saved</span>
              <span className="text-lg font-bold text-[#0F5132] tabular-nums">
                {monthlyHoursSaved} hrs / mo
              </span>
            </div>
            <div className="rounded-2xl bg-[#F1F7F4] p-3.5">
              <span className="block text-[11px] text-[#4B5E54]">Illustrative Time Value</span>
              <span className="text-lg font-bold text-[#0F5132] tabular-nums">
                ₦{estimatedMonthlyTimeValueNgn.toLocaleString()} / mo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 30-60-90-DAY ROADMAP */}
      <section
        id="roadmap-90"
        className="print-avoid-break rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-5 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-5 h-5 text-[#0F5132] shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-[#1A241F]">7. 30-60-90-Day Implementation Roadmap</h2>
              <p className="text-xs sm:text-sm text-[#4B5E54]">
                Phased rollout designed for minimal disruption to daily counter service.
              </p>
            </div>
          </div>

          <div className="no-print flex flex-wrap gap-2" role="tablist" aria-label="Roadmap phases">
            {ROADMAP_PHASES.map((phase) => (
              <button
                key={phase.id}
                type="button"
                role="tab"
                aria-selected={activePhaseId === phase.id}
                onClick={() => setActivePhaseId(phase.id)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activePhaseId === phase.id
                    ? 'bg-[#0F5132] text-white'
                    : 'bg-[#F1F7F4] text-[#4B5E54] hover:text-[#1A241F]'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {ROADMAP_PHASES.map((phase) => {
            const isActive = activePhaseId === phase.id;
            return (
              <div
                key={phase.id}
                className={`rounded-2xl border p-5 space-y-3 transition-all ${
                  isActive
                    ? 'border-[#0F5132] bg-[#F8FAF9] shadow-xs'
                    : 'border-[#E2ECE7] bg-white'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-[#0F5132]">{phase.label}</span>
                  <h3 className="text-base font-bold text-[#1A241F] mt-0.5">{phase.title}</h3>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#4B5E54]">
                  {phase.goals.map((goal) => (
                    <li key={goal} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-[#1A241F] pt-2 border-t border-[#E2ECE7]">
                  <strong>Milestone:</strong> {phase.deliverable}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. EXPECTED BENEFITS & 9. PRACTICAL NEXT STEP */}
      <section
        id="next-step"
        className="print-avoid-break rounded-3xl bg-white border border-[#E2ECE7] p-6 sm:p-8 space-y-5 shadow-xs"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#1A241F]">8. Expected Benefits</h2>
            <ul className="space-y-2.5 text-sm text-[#4B5E54]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A241F]">Time Savings:</strong> Cuts repetitive manual
                  WhatsApp replies so Mrs. Amara &amp; Mr. Tobi focus on walk-in patient care.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A241F]">Improved Customer Service:</strong> Instant
                  acknowledgement after hours and clearer product discovery before visiting.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#1A241F]">Operational Efficiency:</strong> Single source
                  of truth in Google Sheets for enquiries, stock follow-ups, and KPI tracking.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-[#F1F7F4] border border-[#CFE0D6] p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#0F5132]">
                <ClipboardCheck className="w-5 h-5 shrink-0" />
                <h2 className="text-lg font-bold text-[#1A241F]">
                  9. Practical Next Step for the Owner
                </h2>
              </div>
              <p className="text-sm text-[#4B5E54] leading-relaxed">
                Start with a <strong>14-day zero-risk pilot</strong>: connect the 35-item product
                catalogue in Google Sheets to WhatsApp Business enquiry templates and test
                supervised Botpress non-clinical replies before paying for higher-tier automation
                plans.
              </p>
            </div>

            <div className="no-print flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={onOpenCatalogue}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-[#0F5132] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#0B3D25] transition-colors whitespace-nowrap"
              >
                <span>Inspect Live Product Catalogue</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <button
                type="button"
                onClick={onOpenContact}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-xl border border-[#CFE0D6] bg-white px-4 py-2 text-xs sm:text-sm font-medium text-[#1A241F] hover:bg-[#F8FAF9] transition-colors whitespace-nowrap"
              >
                <span>Pharmacy &amp; Consultant Contacts</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
