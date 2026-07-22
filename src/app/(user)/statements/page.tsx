"use client";

import { Download, Calendar, Search, Filter, Info } from "lucide-react";

import { PageTitle, Panel } from "@/components/dashboard/blocks";

const sampleStatements = [
  { id: "ST-2024-04", month: "April 2024", type: "Combined Statement", date: "May 01, 2024", size: "1.2 MB" },
  { id: "ST-2024-03", month: "March 2024", type: "Combined Statement", date: "Apr 01, 2024", size: "1.1 MB" },
  { id: "ST-2024-02", month: "February 2024", type: "Combined Statement", date: "Mar 01, 2024", size: "1.4 MB" },
  { id: "ST-2024-01", month: "January 2024", type: "Combined Statement", date: "Feb 01, 2024", size: "1.2 MB" },
  { id: "ST-2023-FY", month: "Full Year 2023", type: "Tax Report (Annual)", date: "Jan 15, 2024", size: "2.8 MB" },
];

export default function StatementsPage() {
  return (
    <>
      <PageTitle 
        title="Financial Statements" 
        description="Access and download your monthly account statements, tax reports, and transaction histories in PDF or CSV format."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Panel title="Historical Statements">
            {/* Search & Filter */}
            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-banking-muted" />
                <input 
                  placeholder="Search by month or year..." 
                  className="w-full rounded-xl border border-banking-border bg-banking-offWhite py-2.5 pl-10 pr-4 text-sm outline-none focus:border-banking-blue transition-all"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-banking-border px-4 py-2.5 text-sm font-bold text-banking-text hover:bg-banking-offWhite transition-all">
                <Filter className="h-4 w-4" /> Filter
              </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-banking-border bg-white">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-banking-offWhite/50 border-b border-banking-border">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-banking-muted">Period</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-banking-muted">Type</th>
                    <th className="hidden px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-banking-muted sm:table-cell">Release Date</th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-widest text-banking-muted">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-banking-border">
                  {sampleStatements.map((s) => (
                    <tr key={s.id} className="group hover:bg-blue-50/20 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-banking-blue" />
                          <span className="font-bold text-banking-text">{s.month}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                          {s.type}
                        </span>
                      </td>
                      <td className="hidden px-6 py-5 text-sm text-banking-muted sm:table-cell">{s.date}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="inline-flex items-center gap-2 rounded-lg bg-banking-blue px-3 py-1.5 text-xs font-bold text-white hover:bg-banking-navy transition-all">
                          <Download className="h-3 w-3" /> PDF ({s.size})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Statement Settings">
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-banking-muted">Delivery Method</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="delivery" defaultChecked className="h-4 w-4 accent-banking-blue" />
                    <span className="text-sm font-medium text-banking-text">Digital Only (Eco)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="delivery" className="h-4 w-4 accent-banking-blue" />
                    <span className="text-sm font-medium text-banking-text">Digital + Mail ($2.00)</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-banking-border">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-banking-muted mb-3">Custom Export</h4>
                <p className="text-xs text-banking-muted leading-relaxed mb-4">
                  Need data for accounting software? Export your entire transaction history as a CSV or QBO file.
                </p>
                <button className="w-full rounded-xl border-2 border-banking-blue/20 py-3 text-sm font-bold text-banking-blue hover:bg-banking-blue hover:text-white transition-all">
                  Generate CSV Export
                </button>
              </div>
            </div>
          </Panel>

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <div className="flex gap-3 text-amber-800">
              <Info className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-bold">Tax Season Notice</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-800/70">
                  2024 Tax forms (T5 / T1135) will be available starting February 28, 2025.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

