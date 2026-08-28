import { useState } from "react"
import {
  Plus, Search, TrendingUp, TrendingDown,
  ArrowLeft, Info, Download, AlertTriangle, CheckCircle, Sparkles,
  ChevronRight, Minus
} from "lucide-react"
import { downloadCsv } from "@/utils/exportCsv"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts"

type View = "list" | "form" | "detail"
type DetailTab = "referensi" | "deviasi" | "tkdn" | "simulator"

const items = [
  { id: "EVL-2026-142", nama: "Industrial Pump - Qty 25", kategori: "Peralatan Mekanikal", lokasi: "Kalimantan Timur", status: "review", tanggal: "22 Agu 2026", harga: "Rp 1,25 M", vendor: "CV Mitra Teknik" },
  { id: "EVL-2026-141", nama: "Kabel Listrik NYY 3×70mm", kategori: "Kelistrikan", lokasi: "Balikpapan", status: "aman", tanggal: "22 Agu 2026", harga: "Rp 287 jt", vendor: "PT Kabel Nusantara" },
  { id: "EVL-2026-140", nama: "Semen Portland - 500 ton", kategori: "Material Konstruksi", lokasi: "Bontang", status: "aman", tanggal: "21 Agu 2026", harga: "Rp 412 jt", vendor: "PT Semen Kaltim" },
  { id: "EVL-2026-139", nama: "Valve Gate 6 inch ANSI 300", kategori: "Perpipaan", lokasi: "Sangatta", status: "investigasi", tanggal: "21 Agu 2026", harga: "Rp 89,4 jt", vendor: "PT Valvindo" },
  { id: "EVL-2026-138", nama: "Pipa Baja Seamless 8 inch", kategori: "Perpipaan", lokasi: "Samarinda", status: "aman", tanggal: "20 Agu 2026", harga: "Rp 634 jt", vendor: "PT Krakatau Steel" },
  { id: "EVL-2026-137", nama: "Genset 500 kVA Diesel", kategori: "Kelistrikan", lokasi: "Tarakan", status: "review", tanggal: "19 Agu 2026", harga: "Rp 1,8 M", vendor: "PT Aggreko" },
  { id: "EVL-2026-136", nama: "Safety Helmet SNI - 200 pcs", kategori: "APD", lokasi: "Balikpapan", status: "aman", tanggal: "18 Agu 2026", harga: "Rp 48 jt", vendor: "PT Proteksi Utama" },
]

const historyPriceData = [
  { bulan: "Mar '25", harga: 980 }, { bulan: "Apr '25", harga: 1020 },
  { bulan: "Mei '25", harga: 1050 }, { bulan: "Jun '25", harga: 1040 },
  { bulan: "Jul '25", harga: 1080 }, { bulan: "Agu '25", harga: 1100 },
  { bulan: "Sep '25", harga: 1090 }, { bulan: "Okt '25", harga: 1110 },
  { bulan: "Nov '25", harga: 1150 }, { bulan: "Des '25", harga: 1130 },
  { bulan: "Jan '26", harga: 1070 }, { bulan: "Feb '26", harga: 1080 },
  { bulan: "Mar '26", harga: 1120 },
]

const deviasiFactors = [
  { faktor: "Biaya Material", kontribusi: 4.1, arah: "up" },
  { faktor: "Spesifikasi Teknis", kontribusi: 2.8, arah: "up" },
  { faktor: "Histori Harga Vendor", kontribusi: 3.2, arah: "up" },
  { faktor: "Volume Pengadaan", kontribusi: -1.7, arah: "down" },
  { faktor: "Faktor TKDN", kontribusi: -1.2, arah: "down" },
  { faktor: "Lokasi Pengiriman", kontribusi: 2.2, arah: "up" },
]

const vendorTKDN = [
  { vendor: "CV Mitra Teknik", harga: 1250, tkdn: 42, hea: 1040, rank: 1 },
  { vendor: "PT Indo Pump", harga: 1180, tkdn: 18, hea: 1073, rank: 2 },
  { vendor: "PT Flowserve ID", harga: 1090, tkdn: 8, hea: 1051, rank: 3 },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    aman: { label: "Aman", bg: "var(--color-success-light)", color: "var(--color-success)" },
    review: { label: "Perlu Review", bg: "var(--color-warning-light)", color: "#B45309" },
    investigasi: { label: "Perlu Investigasi", bg: "var(--color-danger-light)", color: "var(--color-danger)" },
  }
  const s = map[status] || map.aman
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
}

function ConfidenceRing({ value }: { value: number }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#E4E7EC" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke="var(--color-ai-purple)" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-bold font-tabular" style={{ color: "var(--color-ai-purple)" }}>{value}%</div>
        <div className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Confidence</div>
      </div>
    </div>
  )
}

type PriceMode = "oe" | "evaluasi"

const hargaTimpangData = [
  { item: "Impeller Assembly", satuan: "Rp 42.500.000", referensi: "Rp 31.200.000", deviation: 36.2, status: "timpang" },
  { item: "Mechanical Seal Kit", satuan: "Rp 8.750.000", referensi: "Rp 7.900.000", deviation: 10.8, status: "wajar" },
  { item: "Bearing Set (SKF)", satuan: "Rp 5.200.000", referensi: "Rp 4.800.000", deviation: 8.3, status: "wajar" },
  { item: "Motor 37kW ABB", satuan: "Rp 68.000.000", referensi: "Rp 45.500.000", deviation: 49.5, status: "timpang" },
  { item: "Base Plate Fabricated", satuan: "Rp 12.300.000", referensi: "Rp 11.800.000", deviation: 4.2, status: "wajar" },
]

function DeviasiStatusBadge({ status }: { status: string }) {
  const isTimp = status === "timpang"
  return (
    <span
      className="badge"
      style={{
        background: isTimp ? "var(--color-danger-light)" : "var(--color-success-light)",
        color: isTimp ? "var(--color-danger)" : "var(--color-success)",
      }}
    >
      {isTimp ? "Harga Timpang" : "Wajar"}
    </span>
  )
}

function DetailView({ item, onBack }: { item: (typeof items)[0]; onBack: () => void }) {
  const [tab, setTab] = useState<DetailTab>("referensi")
  const [priceMode, setPriceMode] = useState<PriceMode>("evaluasi")
  const [simVolume, setSimVolume] = useState(25)
  const [simTkdn, setSimTkdn] = useState(40)
  const isOwnerEstimate = priceMode === "oe"
  const referenceRange = isOwnerEstimate
    ? { lower: "Rp 1,02 M", upper: "Rp 1,12 M", confidence: 91 }
    : { lower: "Rp 1,08 M", upper: "Rp 1,15 M", confidence: 87 }

  const tabs: { id: DetailTab; label: string }[] = [
    { id: "referensi", label: "Harga Referensi" },
    { id: "deviasi", label: "Analisis Deviasi" },
    { id: "tkdn", label: "TKDN & HEA" },
    { id: "simulator", label: "Simulator What-if" },
  ]

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-3 transition-colors" style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          <ArrowLeft size={15} /> Kembali ke Daftar
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-tabular text-xs font-medium px-2 py-0.5 rounded" style={{ background: "#EFF6FF", color: "var(--color-brand-blue)" }}>{item.id}</span>
              <StatusBadge status={item.status} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{item.nama}</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {item.kategori} · {item.lokasi} · {item.vendor}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() => downloadCsv(`PRISM_Evaluasi_${item.id}.csv`, [
                ["ID", "Nama Item", "Kategori", "Lokasi", "Vendor", "Status", "Tanggal", "Harga Penawaran"],
                [item.id, item.nama, item.kategori, item.lokasi, item.vendor, item.status, item.tanggal, item.harga],
                [],
                ["Rentang Harga Referensi", "Batas Bawah", "Batas Atas", "Confidence", "Deviasi"],
                ["", "Rp 1.080.000.000", "Rp 1.150.000.000", "87%", "+9.4%"],
                [],
                ["Faktor Deviasi", "Kontribusi (%)"],
                ...deviasiFactors.map((f) => [f.faktor, `${f.arah === "up" ? "+" : ""}${f.kontribusi}%`]),
                [],
                ["Deteksi Harga Timpang - Nama Item", "Harga Satuan Penawaran", "Harga Satuan Referensi", "Deviasi", "Status"],
                ...hargaTimpangData.map((r) => [r.item, r.satuan, r.referensi, `+${r.deviation}%`, r.status === "timpang" ? "Harga Timpang" : "Wajar"]),
              ])}
            >
              <Download size={14} />Ekspor Laporan
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0" style={{ borderBottom: "1px solid var(--color-border)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-sm font-medium transition-colors relative"
            style={{ color: tab === t.id ? "var(--color-brand-navy)" : "var(--color-text-muted)", borderBottom: tab === t.id ? "2px solid var(--color-brand-navy)" : "2px solid transparent", marginBottom: -1 }}
          >
            {t.label}
            {t.id === "tkdn" && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: "var(--color-ai-purple-light)", color: "var(--color-ai-purple)" }}>AI</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "referensi" && (
        <div className="space-y-5">
          {/* Mode toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Konteks penggunaan:</span>
            <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
              {([
                { id: "oe" as PriceMode, label: "Penyusunan Owner Estimate" },
                { id: "evaluasi" as PriceMode, label: "Evaluasi Penawaran" },
              ]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPriceMode(m.id)}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: priceMode === m.id ? "var(--color-brand-navy)" : "white",
                    color: priceMode === m.id ? "white" : "var(--color-text-secondary)",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: isOwnerEstimate ? "#EFF6FF" : "#F0FDF4", border: `1px solid ${isOwnerEstimate ? "#BFDBFE" : "#BBF7D0"}` }}>
            <Info size={16} style={{ color: isOwnerEstimate ? "var(--color-brand-blue)" : "var(--color-success)", marginTop: 1, flexShrink: 0 }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {isOwnerEstimate ? "Mode Owner Estimate: susun HPS sebelum tender" : "Mode Evaluasi Penawaran: review harga vendor yang masuk"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                {isOwnerEstimate
                  ? "Gunakan rentang harga pasar dan histori transaksi untuk menetapkan estimasi internal. Belum ada harga vendor yang dibandingkan."
                  : "Bandingkan harga vendor dengan rentang referensi untuk menentukan status review dan tindak lanjut."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card flex flex-col items-center justify-center py-6">
              <ConfidenceRing value={referenceRange.confidence} />
              <p className="text-xs mt-2 text-center" style={{ color: "var(--color-text-muted)" }}>{isOwnerEstimate ? "Confidence estimasi HPS" : "Tingkat keyakinan model"}</p>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-text-muted)" }}>{isOwnerEstimate ? "Rentang Owner Estimate" : "Rentang Harga Referensi"}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Batas Bawah</p>
                  <p className="text-2xl font-bold font-tabular" style={{ color: "var(--color-success)" }}>{referenceRange.lower}</p>
                </div>
                <div className="h-px" style={{ background: "var(--color-border)" }} />
                <div>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Batas Atas</p>
                  <p className="text-2xl font-bold font-tabular" style={{ color: "var(--color-danger)" }}>{referenceRange.upper}</p>
                </div>
              </div>
            </div>
            {isOwnerEstimate ? (
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-text-muted)" }}>Rekomendasi HPS</p>
                <p className="text-2xl font-bold font-tabular mb-1" style={{ color: "var(--color-brand-blue)" }}>Rp 1,07 M</p>
                <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>Estimasi titik tengah untuk 25 unit</p>
                <div className="mt-3 p-2.5 rounded-lg flex items-start gap-2" style={{ background: "#EFF6FF" }}>
                  <CheckCircle size={13} style={{ color: "var(--color-brand-blue)", marginTop: 1 }} />
                  <p className="text-xs" style={{ color: "#1D4ED8" }}>Siap digunakan sebagai acuan penyusunan HPS dan strategi tender.</p>
                </div>
              </div>
            ) : (
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-text-muted)" }}>Harga Penawaran</p>
                <p className="text-2xl font-bold font-tabular mb-1" style={{ color: "var(--color-text-primary)" }}>Rp 1,25 M</p>
                <div className="flex items-center gap-1.5 mb-3">
                  <TrendingUp size={14} style={{ color: "var(--color-danger)" }} />
                  <span className="text-sm font-semibold font-tabular" style={{ color: "var(--color-danger)" }}>+9.4% di atas rentang pasar</span>
                </div>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>CV Mitra Teknik · Qty 25 unit</p>
                <div className="mt-3 p-2.5 rounded-lg flex items-start gap-2" style={{ background: "var(--color-warning-light)" }}>
                  <AlertTriangle size={13} style={{ color: "var(--color-warning)", marginTop: 1 }} />
                  <p className="text-xs" style={{ color: "#B45309" }}>Rekomendasi: Perlu ditinjau lebih lanjut sebelum disetujui.</p>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Histori Harga Sejenis</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{
                    background: priceMode === "oe" ? "#EFF6FF" : "#F0FDF4",
                    color: priceMode === "oe" ? "var(--color-brand-blue)" : "var(--color-success)",
                  }}>
                    Konteks: {priceMode === "oe" ? "Owner Estimate" : "Evaluasi Penawaran"}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Industrial Pump - Kalimantan Timur, Mar 2025 – Mar 2026</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--color-ai-purple-light)", color: "var(--color-ai-purple)" }}>
                <Sparkles size={12} />
                Dihasilkan oleh AI
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historyPriceData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} jt`} />
                <Tooltip formatter={(v) => [`Rp ${v} jt`, "Harga"]} contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #E4E7EC" }} />
                <Line type="monotone" dataKey="harga" stroke="var(--color-brand-blue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "deviasi" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "var(--color-ai-purple-light)", color: "var(--color-ai-purple)" }}>
                  <Sparkles size={12} />AI Explainability
                </div>
              </div>
              <div className="space-y-2.5">
                {deviasiFactors.map((f) => (
                  <div key={f.faktor} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{f.faktor}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.abs(f.kontribusi) * 10}%`,
                            background: f.arah === "up" ? "var(--color-danger)" : "var(--color-success)",
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-semibold font-tabular w-12 text-right"
                        style={{ color: f.arah === "up" ? "var(--color-danger)" : "var(--color-success)" }}
                      >
                        {f.arah === "up" ? "+" : ""}{f.kontribusi}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Total Deviasi</span>
                  <span className="text-base font-bold font-tabular" style={{ color: "var(--color-danger)" }}>+9.4%</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Visualisasi Kontribusi Faktor</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deviasiFactors} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <YAxis dataKey="faktor" type="category" width={130} tick={{ fontSize: 11, fill: "#4B5563" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`${Number(v) > 0 ? "+" : ""}${v}%`, "Kontribusi"]} contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #E4E7EC" }} />
                  <Bar dataKey="kontribusi" radius={3}>
                    {deviasiFactors.map((f, i) => (
                      <Cell key={i} fill={f.arah === "up" ? "#EF4444" : "#10B981"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card" style={{ borderLeft: "4px solid var(--color-warning)" }}>
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} style={{ color: "var(--color-warning)", marginTop: 1 }} />
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>Status: Perlu Review</p>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Harga penawaran CV Mitra Teknik berada +9.4% di atas rentang referensi pasar. Faktor dominan adalah biaya material (+4.1%) dan histori harga vendor (+3.2%). Rekomendasi: tinjau spesifikasi teknis dan negosiasikan komponen material sebelum menyetujui.
                </p>
              </div>
            </div>
          </div>

          {/* Deteksi Harga Timpang */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-border)" }}>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Deteksi Harga Timpang per Line Item</h3>
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--color-ai-purple-light)", color: "var(--color-ai-purple)" }}>
                  <Sparkles size={11} />AI
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "var(--color-danger-light)", color: "var(--color-danger)" }}>
                2 item timpang terdeteksi
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Nama Item", "Harga Satuan Penawaran", "Harga Satuan Referensi", "Deviasi", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hargaTimpangData.map((row) => (
                  <tr
                    key={row.item}
                    className="table-row"
                    style={{
                      borderBottom: "1px solid var(--color-border-light)",
                      background: row.status === "timpang" ? "#FFF5F5" : "white",
                    }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {row.status === "timpang" && <AlertTriangle size={13} style={{ color: "var(--color-danger)", flexShrink: 0 }} />}
                        <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{row.item}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-tabular text-sm font-medium" style={{ color: row.status === "timpang" ? "var(--color-danger)" : "var(--color-text-primary)" }}>{row.satuan}</td>
                    <td className="px-5 py-3.5 font-tabular text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.referensi}</td>
                    <td className="px-5 py-3.5 font-tabular text-sm font-semibold" style={{ color: row.deviation > 15 ? "var(--color-danger)" : "var(--color-text-secondary)" }}>
                      +{row.deviation}%
                    </td>
                    <td className="px-5 py-3.5"><DeviasiStatusBadge status={row.status} /></td>
                    <td className="px-5 py-3.5">
                      {row.status === "timpang" ? (
                        <button
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background: "var(--color-danger-light)", color: "var(--color-danger)", border: "1px solid #FECACA" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#FECACA")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-danger-light)")}
                        >
                          Tandai untuk Klarifikasi
                        </button>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "tkdn" && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--color-ai-purple-light)", border: "1px solid #DDD6FE" }}>
            <Sparkles size={14} style={{ color: "var(--color-ai-purple)" }} />
            <p className="text-xs" style={{ color: "var(--color-ai-purple)" }}>
              HEA dihitung menggunakan formula preferensi harga TKDN sesuai Perpres No. 16/2018 dan perubahannya.
            </p>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Vendor", "Harga Penawaran", "TKDN", "HEA (Harga Evaluasi Akhir)", "Ranking"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendorTKDN.map((v) => (
                  <tr
                    key={v.vendor}
                    className="table-row"
                    style={{
                      borderBottom: "1px solid var(--color-border-light)",
                      background: v.rank === 1 ? "#F0FDF4" : "white",
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {v.rank === 1 && <CheckCircle size={14} style={{ color: "var(--color-success)" }} />}
                        <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{v.vendor}</span>
                        {v.rank === 1 && (
                          <span className="badge" style={{ background: "var(--color-success-light)", color: "var(--color-success)" }}>HEA Terbaik</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-tabular text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                      Rp {v.harga.toLocaleString("id")} jt
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-border)" }}>
                          <div className="h-full rounded-full" style={{ width: `${v.tkdn}%`, background: "var(--color-brand-teal)" }} />
                        </div>
                        <span className="font-tabular text-sm font-semibold" style={{ color: "var(--color-brand-teal)" }}>{v.tkdn}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-tabular text-sm font-bold" style={{ color: v.rank === 1 ? "var(--color-success)" : "var(--color-text-primary)" }}>
                      Rp {v.hea.toLocaleString("id")} jt
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: v.rank === 1 ? "var(--color-success)" : "var(--color-border)", color: v.rank === 1 ? "white" : "var(--color-text-secondary)" }}
                      >
                        #{v.rank}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
            Perhitungan HEA pra-tender - tidak termasuk verifikasi TKDN pasca-kontrak yang dilakukan oleh Lembaga Verifikasi Independen.
          </p>
        </div>
      )}

      {tab === "simulator" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="md:col-span-2 card space-y-5">
            <div>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Parameter Skenario</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>Volume Pengadaan</label>
                    <span className="font-tabular text-sm font-semibold" style={{ color: "var(--color-brand-blue)" }}>{simVolume} unit</span>
                  </div>
                  <input
                    type="range" min={5} max={100} value={simVolume}
                    onChange={(e) => setSimVolume(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: "var(--color-brand-blue)" }}
                  />
                  <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <span>5</span><span>100</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>Minimum TKDN</label>
                    <span className="font-tabular text-sm font-semibold" style={{ color: "var(--color-brand-teal)" }}>{simTkdn}%</span>
                  </div>
                  <input
                    type="range" min={0} max={100} value={simTkdn}
                    onChange={(e) => setSimTkdn(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: "var(--color-brand-teal)" }}
                  />
                  <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <span>0%</span><span>100%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Waktu Pengadaan</label>
                  <input
                    type="month"
                    defaultValue="2026-09"
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ border: "1px solid var(--color-border)", color: "var(--color-text-primary)", outline: "none" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
                <Sparkles size={14} style={{ color: "var(--color-ai-purple)" }} />
                Hasil Simulasi
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Skenario Saat Ini", harga: "Rp 1,25 M", tkdn: "42%", hea: "Rp 1,04 M", color: "var(--color-text-primary)" },
                  { label: `Skenario Baru (Vol ${simVolume}, TKDN ${simTkdn}%)`, harga: `Rp ${(1.25 - (simVolume - 25) * 0.008).toFixed(2)} M`, tkdn: `${simTkdn}%`, hea: `Rp ${(1.04 + (simTkdn - 42) * 0.005).toFixed(2)} M`, color: "var(--color-brand-blue)" },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-xl" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                    <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
                    <div className="space-y-2">
                      {[["Harga Penawaran", s.harga], ["TKDN", s.tkdn], ["HEA", s.hea]].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{k}</span>
                          <span className="text-xs font-semibold font-tabular" style={{ color: s.color }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function EvaluasiPage({ initialItemId }: { initialItemId?: string }) {
  const initialItem = initialItemId ? items.find((item) => item.id === initialItemId) ?? null : null
  const [view, setView] = useState<View>(initialItem ? "detail" : "list")
  const [selectedItem, setSelectedItem] = useState<(typeof items)[0] | null>(initialItem)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [search, setSearch] = useState("")

  if (view === "detail" && selectedItem) {
    return <DetailView item={selectedItem} onBack={() => setView("list")} />
  }

  if (view === "form") {
    return <FormView onBack={() => setView("list")} />
  }

  const filtered = items.filter((i) => {
    const matchStatus = filterStatus === "all" || i.status === filterStatus
    const matchSearch = i.nama.toLowerCase().includes(search.toLowerCase()) || i.vendor.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Daftar Item Pengadaan</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{items.length} item pengadaan terdaftar</p>
        </div>
        <button className="btn-primary" onClick={() => setView("form")}>
          <Plus size={15} />
          Item Pengadaan Baru
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-xs" style={{ border: "1px solid var(--color-border)", background: "white" }}>
          <Search size={14} style={{ color: "var(--color-text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari item atau vendor…"
            className="flex-1 text-sm outline-none"
            style={{ color: "var(--color-text-primary)" }}
          />
        </div>
        <div className="flex gap-1.5">
          {[
            { id: "all", label: "Semua" },
            { id: "aman", label: "Aman" },
            { id: "review", label: "Perlu Review" },
            { id: "investigasi", label: "Investigasi" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterStatus === f.id ? "var(--color-brand-navy)" : "white",
                color: filterStatus === f.id ? "white" : "var(--color-text-secondary)",
                border: `1px solid ${filterStatus === f.id ? "var(--color-brand-navy)" : "var(--color-border)"}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
              {["ID", "Item Pengadaan", "Kategori", "Lokasi", "Harga Penawaran", "Status", "Tanggal", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="table-row cursor-pointer" style={{ borderBottom: "1px solid var(--color-border-light)" }}
                onClick={() => { setSelectedItem(row); setView("detail") }}>
                <td className="px-5 py-3.5 font-tabular text-xs font-medium" style={{ color: "var(--color-brand-blue)" }}>{row.id}</td>
                <td className="px-5 py-3.5">
                  <div className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{row.nama}</div>
                  <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{row.vendor}</div>
                </td>
                <td className="px-5 py-3.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.kategori}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.lokasi}</td>
                <td className="px-5 py-3.5 font-tabular text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{row.harga}</td>
                <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
                <td className="px-5 py-3.5 text-xs" style={{ color: "var(--color-text-muted)" }}>{row.tanggal}</td>
                <td className="px-5 py-3.5">
                  <button
                    aria-label={`Lihat detail ${row.nama}`}
                    className="flex items-center gap-1 text-xs font-semibold transition-colors"
                    style={{ color: "var(--color-brand-blue)" }}
                    onClick={(event) => { event.stopPropagation(); setSelectedItem(row); setView("detail") }}
                  >
                    Detail <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Belum ada item pengadaan untuk filter ini.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FormView({ onBack }: { onBack: () => void }) {
  const [vendors, setVendors] = useState([{ nama: "CV Mitra Teknik", harga: "1250000000", tkdn: "42" }])

  return (
    <div className="min-h-full w-full p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={15} /> Kembali
        </button>
        <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Item Pengadaan Baru</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>Masukkan detail item untuk memulai evaluasi harga AI</p>
      </div>

      <div className="card w-full space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Spesifikasi Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { label: "Nama Item", placeholder: "mis. Industrial Pump Centrifugal 6\"" },
            { label: "Kategori", placeholder: "mis. Peralatan Mekanikal", type: "select" },
            { label: "Volume", placeholder: "mis. 25" },
            { label: "Satuan", placeholder: "mis. unit, kg, m" },
            { label: "Lokasi Pengadaan", placeholder: "mis. Kalimantan Timur", type: "select" },
            { label: "Tanggal Dibutuhkan", placeholder: "", type: "date" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>{f.label}</label>
              <input
                type={f.type === "date" ? "date" : "text"}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: "1px solid var(--color-border)", background: "white", color: "var(--color-text-primary)" }}
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Deskripsi & Spesifikasi Teknis</label>
          <textarea
            rows={3}
            placeholder="Masukkan spesifikasi teknis lengkap…"
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
            style={{ border: "1px solid var(--color-border)", background: "white", color: "var(--color-text-primary)" }}
          />
        </div>
      </div>

      <div className="card w-full space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Penawaran Vendor</h3>
          <button
            className="btn-secondary text-xs py-1.5"
            onClick={() => setVendors([...vendors, { nama: "", harga: "", tkdn: "" }])}
          >
            <Plus size={13} />Tambah Vendor
          </button>
        </div>
        {vendors.map((v, i) => (
          <div key={i} className="p-4 rounded-xl space-y-3" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Vendor #{i + 1}</span>
              {vendors.length > 1 && (
                <button className="text-xs" style={{ color: "var(--color-danger)" }} onClick={() => setVendors(vendors.filter((_, j) => j !== i))}>Hapus</button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "nama", label: "Nama Vendor", placeholder: "PT / CV …" },
                { key: "harga", label: "Harga Penawaran (Rp)", placeholder: "1250000000" },
                { key: "tkdn", label: "TKDN (%)", placeholder: "42" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-secondary)" }}>{f.label}</label>
                  <input
                    value={(v as Record<string, string>)[f.key]}
                    onChange={(e) => {
                      const updated = [...vendors]
                      updated[i] = { ...updated[i], [f.key]: e.target.value }
                      setVendors(updated)
                    }}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none font-tabular"
                    style={{ border: "1px solid var(--color-border)", background: "white", color: "var(--color-text-primary)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button className="btn-primary flex-1 justify-center">
          <Sparkles size={15} />
          Mulai Evaluasi AI
        </button>
        <button className="btn-secondary" onClick={onBack}>Batal</button>
      </div>
    </div>
  )
}
