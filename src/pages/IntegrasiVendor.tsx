import { useState } from "react"
import { ArrowLeft, Download, AlertTriangle, CheckCircle, ChevronRight, Sparkles, Info } from "lucide-react"
import { downloadCsv } from "@/utils/exportCsv"

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-flex items-center ml-1">
      <Info size={12} style={{ color: "var(--color-text-muted)", cursor: "help" }} />
      <span
        className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-44 text-center text-[11px] leading-snug px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
        style={{ background: "var(--color-brand-navy)", color: "white", whiteSpace: "normal" }}
      >
        Sumber: SAPP SmartGEP
        <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent" style={{ borderTopColor: "var(--color-brand-navy)" }} />
      </span>
    </span>
  )
}

const tenders = [
  { id: "TDR-2026-089", nama: "Pengadaan Pompa & Fitting - Kaltim Block", vendors: 5, skor: 78, status: "investigasi", tanggal: "20 Agu 2026" },
  { id: "TDR-2026-085", nama: "Kabel Distribusi Panel Listrik Kilang", vendors: 4, skor: 62, status: "review", tanggal: "18 Agu 2026" },
  { id: "TDR-2026-081", nama: "Material Konstruksi Storage Tank #7", vendors: 6, skor: 21, status: "aman", tanggal: "16 Agu 2026" },
  { id: "TDR-2026-079", nama: "APD & Safety Equipment Q3 2026", vendors: 3, skor: 8, status: "aman", tanggal: "14 Agu 2026" },
  { id: "TDR-2026-074", nama: "Genset & UPS Data Center Balikpapan", vendors: 4, skor: 55, status: "review", tanggal: "10 Agu 2026" },
  { id: "TDR-2026-070", nama: "Valve & Fitting Perpipaan Blok Mahakam", vendors: 7, skor: 12, status: "aman", tanggal: "8 Agu 2026" },
]

const vendorPairs = [
  { v1: "CV Mitra Teknik", v2: "PT Indo Pump", similarity: 94, flags: ["Harga identik digit terakhir", "Dokumen template sama"] },
  { v1: "CV Mitra Teknik", v2: "PT Flowserve ID", similarity: 71, flags: ["Selisih harga < 0.5%"] },
  { v1: "PT Indo Pump", v2: "PT Flowserve ID", similarity: 68, flags: ["Waktu submit berurutan"] },
  { v1: "PT Valvindo", v2: "PT Pumping Solutions", similarity: 83, flags: ["Harga identik digit terakhir", "Alamat berdekatan"] },
  { v1: "CV Surya Teknik", v2: "PT Valvindo", similarity: 45, flags: [] },
]

function SkorBar({ skor }: { skor: number }) {
  const color = skor >= 70 ? "var(--color-danger)" : skor >= 50 ? "var(--color-warning)" : "var(--color-success)"
  return (
    <div className="flex items-center gap-3">
      <div className="risk-bar flex-1">
        <div className="h-full rounded-full transition-all" style={{ width: `${skor}%`, background: color }} />
      </div>
      <span className="font-tabular text-sm font-bold w-10 text-right" style={{ color }}>{skor}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    aman: { label: "Normal", bg: "var(--color-success-light)", color: "var(--color-success)" },
    review: { label: "Waspadai", bg: "var(--color-warning-light)", color: "#B45309" },
    investigasi: { label: "Perlu Investigasi", bg: "var(--color-danger-light)", color: "var(--color-danger)" },
  }
  const s = map[status] || map.aman
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
}

function HeatmapCell({ value }: { value: number }) {
  const opacity = value / 100
  const color = value >= 70 ? `rgba(239,68,68,${opacity})` : value >= 50 ? `rgba(245,158,11,${opacity})` : `rgba(16,185,129,${opacity})`
  return (
    <td
      className="text-center font-tabular text-xs font-bold py-3 px-2"
      style={{ background: color, color: value > 60 ? "white" : "var(--color-text-primary)" }}
    >
      {value > 0 ? `${value}%` : "-"}
    </td>
  )
}

function DetailView({ tender, onBack }: { tender: (typeof tenders)[0]; onBack: () => void }) {
  const vendorNames = ["CV Mitra Teknik", "PT Indo Pump", "PT Flowserve ID", "PT Valvindo", "CV Surya Teknik"]
  const matrix: number[][] = [
    [100, 94, 71, 30, 22],
    [94, 100, 68, 28, 19],
    [71, 68, 100, 41, 35],
    [30, 28, 41, 100, 83],
    [22, 19, 35, 83, 100],
  ]

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={15} /> Kembali ke Daftar Tender
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-tabular text-xs px-2 py-0.5 rounded" style={{ background: "#EFF6FF", color: "var(--color-brand-blue)" }}>{tender.id}</span>
              <StatusBadge status={tender.status} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{tender.nama}</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {tender.vendors} vendor · Skor risiko kolusi: <strong style={{ color: "var(--color-danger)" }}>{tender.skor}/100</strong>
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => downloadCsv(`PRISM_Anomali_${tender.id}.csv`, [
              ["ID Tender", "Nama Tender", "Jumlah Vendor", "Skor Risiko Kolusi", "Status", "Tanggal"],
              [tender.id, tender.nama, String(tender.vendors), String(tender.skor), tender.status, tender.tanggal],
              [],
              ["Pasangan Vendor", "Kemiripan (%)", "Indikator yang Ditandai"],
              ...vendorPairs.filter((p) => p.flags.length > 0).map((p) => [
                `${p.v1} vs ${p.v2}`,
                `${p.similarity}%`,
                p.flags.join("; "),
              ]),
            ])}
          >
            <Download size={14} />
            Ekspor Laporan Anomali
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--color-danger-light)", border: "1px solid #FECACA" }}>
        <AlertTriangle size={14} style={{ color: "var(--color-danger)" }} />
        <p className="text-xs" style={{ color: "#991B1B" }}>
          Sistem mendeteksi indikasi kuat persekongkolan harga antara CV Mitra Teknik dan PT Indo Pump (kemiripan 94%). Diperlukan investigasi lebih lanjut.
        </p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Heatmap Kemiripan Pola Penawaran</h3>
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--color-ai-purple-light)", color: "var(--color-ai-purple)" }}>
            <Sparkles size={11} /> ML Model
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ borderRadius: 8, overflow: "hidden" }}>
            <thead>
              <tr>
                <th className="text-left px-3 py-3 text-xs" style={{ color: "var(--color-text-muted)" }}>Vendor</th>
                {vendorNames.map((v) => (
                  <th key={v} className="text-center px-2 py-3 text-xs" style={{ color: "var(--color-text-muted)", minWidth: 100 }}>
                    {v.length > 16 ? v.slice(0, 14) + "…" : v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={vendorNames[i]}>
                  <td className="px-3 py-3 text-xs font-medium" style={{ color: "var(--color-text-primary)", whiteSpace: "nowrap" }}>{vendorNames[i]}</td>
                  {row.map((val, j) => (
                    <HeatmapCell key={j} value={i === j ? 0 : val} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: "rgba(239,68,68,0.9)" }} />≥70% Sangat Mirip</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: "rgba(245,158,11,0.8)" }} />50–69% Mirip</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: "rgba(16,185,129,0.6)" }} />{"<"}50% Normal</span>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Indikator yang Ditandai</h3>
        <div className="space-y-3">
          {vendorPairs.filter((p) => p.flags.length > 0).map((p, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: p.similarity >= 70 ? "var(--color-danger-light)" : "var(--color-warning-light)", color: p.similarity >= 70 ? "var(--color-danger)" : "var(--color-warning)" }}
              >
                {p.similarity}%
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{p.v1} ↔ {p.v2}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {p.flags.map((f) => (
                    <span key={f} className="badge text-[11px]" style={{ background: "#FEF3C7", color: "#92400E" }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function IntegrasiVendorPage({ initialItemId }: { initialItemId?: string }) {
  const initialTender = initialItemId ? tenders.find((tender) => tender.id === initialItemId) ?? null : null
  const [selected, setSelected] = useState<(typeof tenders)[0] | null>(initialTender)
  const [sort, setSort] = useState<"skor" | "tanggal">("skor")

  if (selected) return <DetailView tender={selected} onBack={() => setSelected(null)} />

  const sorted = [...tenders].sort((a, b) => sort === "skor" ? b.skor - a.skor : b.tanggal.localeCompare(a.tanggal))

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Integritas Vendor</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
          Deteksi indikasi persekongkolan harga berbasis Machine Learning - {tenders.length} tender dianalisis
        </p>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--color-ai-purple-light)", border: "1px solid #DDD6FE" }}>
        <Sparkles size={14} style={{ color: "var(--color-ai-purple)" }} />
        <p className="text-xs" style={{ color: "var(--color-ai-purple)" }}>
          Vendor Anomaly Detection - algoritma ML menghitung skor risiko kolusi berdasarkan kemiripan pola penawaran, selisih harga, waktu submit, dan metadata dokumen.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Urutkan:</span>
        {[{ id: "skor" as const, label: "Skor Risiko" }, { id: "tanggal" as const, label: "Tanggal" }].map((s) => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: sort === s.id ? "var(--color-brand-navy)" : "white",
              color: sort === s.id ? "white" : "var(--color-text-secondary)",
              border: `1px solid ${sort === s.id ? "var(--color-brand-navy)" : "var(--color-border)"}`,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
              {["ID Tender", "Nama Tender", "Jumlah Vendor", "Skor Risiko Kolusi", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{h}</th>
              ))}
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                <span className="flex items-center gap-0.5">Waktu Submit<InfoTooltip text="Sumber: SAPP SmartGEP" /></span>
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                <span className="flex items-center gap-0.5">Struktur Penawaran<InfoTooltip text="Sumber: SAPP SmartGEP" /></span>
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, idx) => {
              const submitTimes = ["09:14", "09:17", "10:02", "08:55", "11:30", "09:43"]
              const structures = ["Standar", "Identik Vendor Lain", "Standar", "Tidak Lazim", "Standar", "Standar"]
              const submitTime = submitTimes[idx % submitTimes.length]
              const structure = structures[idx % structures.length]
              return (
              <tr
                key={t.id}
                className="table-row cursor-pointer"
                style={{ borderBottom: "1px solid var(--color-border-light)" }}
                onClick={() => setSelected(t)}
              >
                <td className="px-5 py-3.5 font-tabular text-xs font-medium" style={{ color: "var(--color-brand-blue)" }}>{t.id}</td>
                <td className="px-5 py-3.5 text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{t.nama}</td>
                <td className="px-5 py-3.5 text-sm font-tabular text-center" style={{ color: "var(--color-text-secondary)" }}>{t.vendors}</td>
                <td className="px-5 py-3.5 min-w-[180px]">
                  <SkorBar skor={t.skor} />
                </td>
                <td className="px-5 py-3.5"><StatusBadge status={t.status} /></td>
                <td className="px-5 py-3.5 font-tabular text-xs" style={{ color: "var(--color-text-secondary)" }}>{t.tanggal} {submitTime}</td>
                <td className="px-5 py-3.5">
                  <span
                    className="text-xs"
                    style={{ color: structure === "Standar" ? "var(--color-text-secondary)" : structure === "Identik Vendor Lain" ? "var(--color-danger)" : "var(--color-warning)" }}
                  >
                    {structure}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <ChevronRight size={15} style={{ color: "var(--color-text-muted)" }} />
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
