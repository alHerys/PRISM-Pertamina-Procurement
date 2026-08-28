import { useState } from "react"
import { Download, Search, TrendingUp, TrendingDown, ArrowLeft, Sparkles, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { downloadCsv } from "@/utils/exportCsv"
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"

const riwayat = [
  { id: "EVL-2026-142", item: "Industrial Pump - Qty 25", kategori: "Peralatan Mekanikal", vendor: "CV Mitra Teknik", tanggal: "22 Agu 2026", status: "review", deviasi: "+9.4%", evaluator: "Ahmad Rizki", hargaPenawaran: "Rp 1,25 M", refMin: "Rp 1,08 M", refMax: "Rp 1,15 M", confidence: 87, catatan: "Harga melampaui rentang referensi. Perlu negosiasi komponen material." },
  { id: "EVL-2026-141", item: "Kabel Listrik NYY 3x70mm", kategori: "Kelistrikan", vendor: "PT Kabel Nusantara", tanggal: "22 Agu 2026", status: "aman", deviasi: "+1.2%", evaluator: "Siti Rahayu", hargaPenawaran: "Rp 287 jt", refMin: "Rp 271 jt", refMax: "Rp 295 jt", confidence: 91, catatan: "Harga dalam rentang referensi. Dapat disetujui." },
  { id: "EVL-2026-140", item: "Semen Portland - 500 ton", kategori: "Material Konstruksi", vendor: "PT Semen Kaltim", tanggal: "21 Agu 2026", status: "aman", deviasi: "-0.8%", evaluator: "Budi Santoso", hargaPenawaran: "Rp 412 jt", refMin: "Rp 400 jt", refMax: "Rp 430 jt", confidence: 94, catatan: "Harga sedikit di bawah referensi. Sangat wajar." },
  { id: "EVL-2026-139", item: "Valve Gate 6 inch ANSI 300", kategori: "Perpipaan", vendor: "PT Valvindo", tanggal: "21 Agu 2026", status: "investigasi", deviasi: "+18.7%", evaluator: "Ahmad Rizki", hargaPenawaran: "Rp 89,4 jt", refMin: "Rp 68 jt", refMax: "Rp 75 jt", confidence: 79, catatan: "Deviasi ekstrem. Tender diteruskan ke tim investigasi pengadaan." },
  { id: "EVL-2026-138", item: "Pipa Baja Seamless 8 inch", kategori: "Perpipaan", vendor: "PT Krakatau Steel", tanggal: "20 Agu 2026", status: "aman", deviasi: "-2.1%", evaluator: "Dewi Kartika", hargaPenawaran: "Rp 634 jt", refMin: "Rp 625 jt", refMax: "Rp 670 jt", confidence: 88, catatan: "Harga kompetitif dan dalam batas wajar." },
  { id: "EVL-2026-137", item: "Genset 500 kVA Diesel", kategori: "Kelistrikan", vendor: "PT Aggreko", tanggal: "19 Agu 2026", status: "review", deviasi: "+7.3%", evaluator: "Siti Rahayu", hargaPenawaran: "Rp 1,8 M", refMin: "Rp 1,6 M", refMax: "Rp 1,68 M", confidence: 82, catatan: "Harga melebihi batas atas. Cek garansi dan biaya instalasi yang mungkin termasuk." },
  { id: "EVL-2026-136", item: "Safety Helmet SNI - 200 pcs", kategori: "APD", vendor: "PT Proteksi Utama", tanggal: "18 Agu 2026", status: "aman", deviasi: "+0.4%", evaluator: "Budi Santoso", hargaPenawaran: "Rp 48 jt", refMin: "Rp 45 jt", refMax: "Rp 50 jt", confidence: 96, catatan: "Harga sangat wajar." },
  { id: "EVL-2026-135", item: "Pompa Sentrifugal 4 inch", kategori: "Peralatan Mekanikal", vendor: "PT Flowserve ID", tanggal: "17 Agu 2026", status: "aman", deviasi: "-3.2%", evaluator: "Ahmad Rizki", hargaPenawaran: "Rp 210 jt", refMin: "Rp 200 jt", refMax: "Rp 230 jt", confidence: 89, catatan: "Harga di bawah rata-rata pasar. Dokumen teknis perlu diverifikasi." },
]

const deviasiMockup = [
  { faktor: "Biaya Material", kontribusi: 4.1, arah: "up" },
  { faktor: "Spesifikasi Teknis", kontribusi: 2.8, arah: "up" },
  { faktor: "Histori Harga Vendor", kontribusi: 3.2, arah: "up" },
  { faktor: "Volume Pengadaan", kontribusi: -1.7, arah: "down" },
  { faktor: "Faktor TKDN", kontribusi: -1.2, arah: "down" },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    aman: { label: "Aman", bg: "var(--color-success-light)", color: "var(--color-success)" },
    review: { label: "Perlu Review", bg: "var(--color-warning-light)", color: "#B45309" },
    investigasi: { label: "Investigasi", bg: "var(--color-danger-light)", color: "var(--color-danger)" },
  }
  const s = map[status] || map.aman
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
}

function ConfidenceRing({ value }: { value: number }) {
  const r = 32
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#E4E7EC" strokeWidth="7" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-ai-purple)" strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <div className="text-base font-bold font-tabular" style={{ color: "var(--color-ai-purple)" }}>{value}%</div>
      </div>
    </div>
  )
}

function DetailView({ item, onBack }: { item: typeof riwayat[0]; onBack: () => void }) {
  const isPositive = item.deviasi.startsWith("+")
  const devFaktors = item.status === "aman"
    ? deviasiMockup.map((d) => ({ ...d, kontribusi: d.kontribusi * 0.2 }))
    : deviasiMockup

  return (
    <div className="p-4 md:p-6 max-w-[1400px] space-y-5">
      <div>
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm mb-3 transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          <ArrowLeft size={15} /> Kembali ke Riwayat
        </button>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-tabular text-xs font-medium px-2 py-0.5 rounded" style={{ background: "#EFF6FF", color: "var(--color-brand-blue)" }}>{item.id}</span>
              <StatusBadge status={item.status} />
            </div>
            <h2 className="text-lg md:text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{item.item}</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {item.kategori} · {item.vendor} · Dievaluasi oleh {item.evaluator} pada {item.tanggal}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              className="btn-secondary text-xs py-2 px-3"
              onClick={() => downloadCsv(`PRISM_Riwayat_${item.id}.csv`, [
                ["ID Evaluasi", "Item Pengadaan", "Kategori", "Vendor", "Evaluator", "Tanggal", "Status"],
                [item.id, item.item, item.kategori, item.vendor, item.evaluator, item.tanggal, item.status],
                [],
                ["Harga Penawaran", "Referensi Bawah", "Referensi Atas", "Deviasi", "Confidence AI"],
                [item.hargaPenawaran, item.refMin, item.refMax, item.deviasi, `${item.confidence}%`],
                [],
                ["Catatan", item.catatan],
                [],
                ["Faktor Deviasi", "Kontribusi (%)"],
                ...deviasiMockup.map((d) => [d.faktor, `${d.arah === "up" ? "+" : ""}${d.kontribusi}%`]),
              ])}
            >
              <Download size={13} />Ekspor CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card flex flex-col items-center justify-center py-5">
          <ConfidenceRing value={item.confidence} />
          <p className="text-xs mt-2 text-center" style={{ color: "var(--color-text-muted)" }}>Confidence AI</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>Harga Penawaran</p>
          <p className="text-xl font-bold font-tabular" style={{ color: "var(--color-text-primary)" }}>{item.hargaPenawaran}</p>
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? <TrendingUp size={12} style={{ color: "var(--color-danger)" }} /> : <TrendingDown size={12} style={{ color: "var(--color-success)" }} />}
            <span className="text-xs font-semibold font-tabular" style={{ color: isPositive ? "var(--color-danger)" : "var(--color-success)" }}>{item.deviasi} vs referensi</span>
          </div>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>Rentang Referensi</p>
          <p className="text-sm font-semibold" style={{ color: "var(--color-success)" }}>{item.refMin}</p>
          <p className="text-xs my-0.5" style={{ color: "var(--color-text-muted)" }}>hingga</p>
          <p className="text-sm font-semibold" style={{ color: "var(--color-danger)" }}>{item.refMax}</p>
        </div>
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>Kesimpulan</p>
          <div className={`flex items-start gap-2 p-2 rounded-lg ${item.status === "investigasi" ? "" : ""}`}
            style={{ background: item.status === "aman" ? "var(--color-success-light)" : item.status === "investigasi" ? "var(--color-danger-light)" : "var(--color-warning-light)" }}>
            {item.status === "aman"
              ? <CheckCircle size={13} style={{ color: "var(--color-success)", marginTop: 1, flexShrink: 0 }} />
              : <AlertTriangle size={13} style={{ color: item.status === "investigasi" ? "var(--color-danger)" : "var(--color-warning)", marginTop: 1, flexShrink: 0 }} />}
            <p className="text-xs leading-snug" style={{ color: item.status === "aman" ? "#065F46" : item.status === "investigasi" ? "#991B1B" : "#92400E" }}>{item.catatan}</p>
          </div>
        </div>
      </div>

      {/* Deviation breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Breakdown Faktor Deviasi</h3>
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--color-ai-purple-light)", color: "var(--color-ai-purple)" }}>
              <Sparkles size={11} />AI
            </span>
          </div>
          <div className="space-y-3">
            {devFaktors.map((f) => (
              <div key={f.faktor} className="flex items-center justify-between gap-3">
                <span className="text-xs flex-1" style={{ color: "var(--color-text-secondary)" }}>{f.faktor}</span>
                <div className="w-24 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ background: "var(--color-border)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(Math.abs(f.kontribusi) * 10, 100)}%`, background: f.arah === "up" ? "var(--color-danger)" : "var(--color-success)" }} />
                </div>
                <span className="text-xs font-semibold font-tabular w-12 text-right flex-shrink-0"
                  style={{ color: f.arah === "up" ? "var(--color-danger)" : "var(--color-success)" }}>
                  {f.arah === "up" ? "+" : ""}{f.kontribusi.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 flex justify-between" style={{ borderTop: "1px solid var(--color-border)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Total Deviasi</span>
            <span className="text-sm font-bold font-tabular" style={{ color: isPositive ? "var(--color-danger)" : "var(--color-success)" }}>{item.deviasi}</span>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Visualisasi Kontribusi</h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={devFaktors} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v.toFixed(1)}%`} />
              <YAxis dataKey="faktor" type="category" width={120} tick={{ fontSize: 10, fill: "#4B5563" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${Number(v) > 0 ? "+" : ""}${Number(v).toFixed(1)}%`, "Kontribusi"]} contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #E4E7EC" }} />
              <Bar dataKey="kontribusi" radius={3}>
                {devFaktors.map((f, i) => <Cell key={i} fill={f.arah === "up" ? "#EF4444" : "#10B981"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Audit trail */}
      <div className="card">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Jejak Audit</h3>
        <div className="space-y-3">
          {[
            { aksi: "Evaluasi selesai", aktor: item.evaluator, waktu: item.tanggal + ", 14:32 WIB", icon: CheckCircle, color: "var(--color-success)" },
            { aksi: "Analisis AI dijalankan", aktor: "PRISM System", waktu: item.tanggal + ", 14:31 WIB", icon: Sparkles, color: "var(--color-ai-purple)" },
            { aksi: "Penawaran vendor diinput", aktor: item.evaluator, waktu: item.tanggal + ", 14:28 WIB", icon: ExternalLink, color: "var(--color-brand-blue)" },
          ].map((t, i) => {
            const Icon = t.icon
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${t.color}18` }}>
                  <Icon size={12} style={{ color: t.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>{t.aksi}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{t.aktor} · {t.waktu}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function RiwayatPage() {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterKategori, setFilterKategori] = useState("all")
  const [selected, setSelected] = useState<typeof riwayat[0] | null>(null)

  if (selected) return <DetailView item={selected} onBack={() => setSelected(null)} />

  const kategoriOptions = ["all", ...Array.from(new Set(riwayat.map((r) => r.kategori)))]

  const filtered = riwayat.filter((r) => {
    const matchSearch = r.item.toLowerCase().includes(search.toLowerCase()) || r.vendor.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || r.status === filterStatus
    const matchKategori = filterKategori === "all" || r.kategori === filterKategori
    return matchSearch && matchStatus && matchKategori
  })

  return (
    <div className="p-4 md:p-6 max-w-[1400px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Riwayat &amp; Laporan</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{riwayat.length} evaluasi tercatat</p>
        </div>
        <button
          className="btn-primary text-xs md:text-sm"
          onClick={() => downloadCsv("PRISM_Riwayat_Semua.csv", [
            ["ID Evaluasi", "Item Pengadaan", "Kategori", "Vendor", "Evaluator", "Tanggal", "Status", "Harga Penawaran", "Ref Bawah", "Ref Atas", "Deviasi", "Confidence AI"],
            ...riwayat.map((r) => [r.id, r.item, r.kategori, r.vendor, r.evaluator, r.tanggal, r.status, r.hargaPenawaran, r.refMin, r.refMax, r.deviasi, `${r.confidence}%`]),
          ])}
        >
          <Download size={14} />
          <span className="hidden sm:inline">Ekspor Semua (CSV)</span>
          <span className="sm:hidden">Ekspor</span>
        </button>
      </div>

      {/* Summary stat strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Evaluasi", value: riwayat.length, color: "var(--color-brand-blue)" },
          { label: "Perlu Review / Investigasi", value: riwayat.filter((r) => r.status !== "aman").length, color: "var(--color-warning)" },
          { label: "Disetujui (Aman)", value: riwayat.filter((r) => r.status === "aman").length, color: "var(--color-success)" },
        ].map((s) => (
          <div key={s.label} className="card py-3 text-center">
            <p className="text-2xl font-bold font-tabular" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: "1px solid var(--color-border)", background: "white" }}>
          <Search size={13} style={{ color: "var(--color-text-muted)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari item, vendor..."
            className="text-sm outline-none" style={{ width: 160, color: "var(--color-text-primary)" }} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ border: "1px solid var(--color-border)", background: "white", color: "var(--color-text-secondary)" }}>
          <option value="all">Semua Status</option>
          <option value="aman">Aman</option>
          <option value="review">Perlu Review</option>
          <option value="investigasi">Investigasi</option>
        </select>
        <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ border: "1px solid var(--color-border)", background: "white", color: "var(--color-text-secondary)" }}>
          {kategoriOptions.map((k) => (
            <option key={k} value={k}>{k === "all" ? "Semua Kategori" : k}</option>
          ))}
        </select>
        <input type="date" className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{ border: "1px solid var(--color-border)", background: "white", color: "var(--color-text-secondary)" }} />
      </div>

      {/* Table - desktop */}
      <div className="card p-0 overflow-hidden hidden md:block">
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
              {["ID", "Item Pengadaan", "Kategori", "Vendor", "Tanggal", "Deviasi", "Status", "Evaluator", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="table-row cursor-pointer" style={{ borderBottom: "1px solid var(--color-border-light)" }}
                onClick={() => setSelected(r)}>
                <td className="px-4 py-3.5 font-tabular text-xs font-medium" style={{ color: "var(--color-brand-blue)" }}>{r.id}</td>
                <td className="px-4 py-3.5 text-sm font-medium" style={{ color: "var(--color-text-primary)", maxWidth: 200 }}>
                  <span className="block truncate">{r.item}</span>
                </td>
                <td className="px-4 py-3.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>{r.kategori}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>{r.vendor}</td>
                <td className="px-4 py-3.5 text-xs" style={{ color: "var(--color-text-muted)" }}>{r.tanggal}</td>
                <td className="px-4 py-3.5">
                  <span className="font-tabular text-xs font-semibold flex items-center gap-1"
                    style={{ color: r.deviasi.startsWith("+") ? "var(--color-danger)" : "var(--color-success)" }}>
                    {r.deviasi.startsWith("+") ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {r.deviasi}
                  </span>
                </td>
                <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>{r.evaluator}</td>
                <td className="px-4 py-3.5">
                  <button className="text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors"
                    style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
                    onClick={(e) => { e.stopPropagation(); downloadCsv(`PRISM_${r.id}.csv`, [["ID", "Item", "Vendor", "Status", "Deviasi", "Harga Penawaran", "Evaluator", "Tanggal"], [r.id, r.item, r.vendor, r.status, r.deviasi, r.hargaPenawaran, r.evaluator, r.tanggal]]) }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <Download size={11} />CSV
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Belum ada evaluasi tercatat untuk filter ini.</p>
          </div>
        )}
      </div>

      {/* Card list - mobile */}
      <div className="md:hidden space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="card cursor-pointer transition-all" onClick={() => setSelected(r)}
            style={{ borderLeft: `4px solid ${r.status === "aman" ? "var(--color-success)" : r.status === "investigasi" ? "var(--color-danger)" : "var(--color-warning)"}` }}>
            <div className="flex items-start justify-between mb-2">
              <span className="font-tabular text-xs font-medium" style={{ color: "var(--color-brand-blue)" }}>{r.id}</span>
              <StatusBadge status={r.status} />
            </div>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>{r.item}</p>
            <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>{r.vendor} · {r.kategori}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{r.tanggal}</span>
              <span className="font-tabular text-xs font-semibold flex items-center gap-1"
                style={{ color: r.deviasi.startsWith("+") ? "var(--color-danger)" : "var(--color-success)" }}>
                {r.deviasi.startsWith("+") ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {r.deviasi}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm py-10" style={{ color: "var(--color-text-muted)" }}>Tidak ada data untuk filter ini.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Menampilkan {filtered.length} dari {riwayat.length} evaluasi</p>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((p) => (
            <button key={p} className="w-8 h-8 rounded-lg text-sm font-medium"
              style={{ background: p === 1 ? "var(--color-brand-navy)" : "white", color: p === 1 ? "white" : "var(--color-text-secondary)", border: `1px solid ${p === 1 ? "var(--color-brand-navy)" : "var(--color-border)"}` }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
