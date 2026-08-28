import { useState } from "react"
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, CheckCircle, ArrowLeft, Sparkles } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

const komoditas = [
  {
    id: 1,
    nama: "Pipa Baja Seamless",
    satuan: "meter",
    harga: "Rp 485.000",
    perubahan: +3.2,
    status: "up",
    updated: "4 mnt lalu",
    sources: { ekatalog: "ok", ecommerce: "ok", bursa: "ok" },
    sparkline: [320, 340, 330, 370, 360, 390, 400, 420, 415, 430, 450, 485],
  },
  {
    id: 2,
    nama: "Kabel Listrik NYY",
    satuan: "meter",
    harga: "Rp 127.500",
    perubahan: -1.4,
    status: "down",
    updated: "12 mnt lalu",
    sources: { ekatalog: "ok", ecommerce: "ok", bursa: "fail" },
    sparkline: [145, 142, 138, 135, 132, 130, 128, 129, 127, 128, 126, 127],
  },
  {
    id: 3,
    nama: "Semen Portland",
    satuan: "ton",
    harga: "Rp 824.000",
    perubahan: +0.8,
    status: "up",
    updated: "23 mnt lalu",
    sources: { ekatalog: "ok", ecommerce: "fail", bursa: "ok" },
    sparkline: [790, 795, 800, 798, 802, 808, 812, 815, 818, 820, 822, 824],
  },
  {
    id: 4,
    nama: "Valve Gate 6\"",
    satuan: "unit",
    harga: "Rp 3.450.000",
    perubahan: +12.1,
    status: "alert",
    updated: "1 jam lalu",
    sources: { ekatalog: "ok", ecommerce: "ok", bursa: "fail" },
    sparkline: [2800, 2820, 2900, 2950, 3000, 3100, 3200, 3250, 3300, 3350, 3420, 3450],
  },
  {
    id: 5,
    nama: "Pompa Sentrifugal 6\"",
    satuan: "unit",
    harga: "Rp 42.800.000",
    perubahan: -0.5,
    status: "down",
    updated: "2 jam lalu",
    sources: { ekatalog: "fail", ecommerce: "ok", bursa: "ok" },
    sparkline: [44000, 43800, 43500, 43200, 43100, 43000, 42900, 42800, 42750, 42700, 42750, 42800],
  },
  {
    id: 6,
    nama: "Safety Helmet SNI",
    satuan: "pcs",
    harga: "Rp 245.000",
    perubahan: +1.2,
    status: "up",
    updated: "30 mnt lalu",
    sources: { ekatalog: "ok", ecommerce: "ok", bursa: "ok" },
    sparkline: [230, 232, 235, 237, 238, 240, 241, 242, 243, 244, 244, 245],
  },
]

const trendData = [
  { bulan: "Mar", ekatalog: 420, ecommerce: 435, bursa: 415 },
  { bulan: "Apr", ekatalog: 435, ecommerce: 448, bursa: 428 },
  { bulan: "Mei", ekatalog: 448, ecommerce: 460, bursa: 440 },
  { bulan: "Jun", ekatalog: 440, ecommerce: 455, bursa: 438 },
  { bulan: "Jul", ekatalog: 462, ecommerce: 470, bursa: 455 },
  { bulan: "Agu", ekatalog: 480, ecommerce: 490, bursa: 470 },
]

const historyTable = [
  { tanggal: "22 Agu 2026", ekatalog: 485, ecommerce: 492, bursa: 478 },
  { tanggal: "15 Agu 2026", ekatalog: 470, ecommerce: 480, bursa: 465 },
  { tanggal: "8 Agu 2026", ekatalog: 455, ecommerce: 465, bursa: 450 },
  { tanggal: "1 Agu 2026", ekatalog: 448, ecommerce: 460, bursa: 443 },
  { tanggal: "25 Jul 2026", ekatalog: 440, ecommerce: 452, bursa: 435 },
]

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const h = 32
  const w = 80
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(" ")
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function SourceDot({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: status === "ok" ? "var(--color-success)" : "var(--color-danger)" }} />
    </div>
  )
}

export function InteligenPasarPage({ initialItemId }: { initialItemId?: string }) {
  const initialItem = initialItemId ? komoditas.find((item) => String(item.id) === initialItemId) ?? null : null
  const [selected, setSelected] = useState<(typeof komoditas)[0] | null>(initialItem)

  if (selected) {
    return (
      <div className="p-6 max-w-[1400px] space-y-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={15} /> Kembali ke Intelijen Pasar
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{selected.nama}</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              Data pasar terakhir diperbarui {selected.updated} · per {selected.satuan}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-tabular" style={{ color: "var(--color-text-primary)" }}>{selected.harga}</p>
            <p className="text-sm font-semibold flex items-center gap-1 justify-end"
              style={{ color: selected.perubahan > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
              {selected.perubahan > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {selected.perubahan > 0 ? "+" : ""}{selected.perubahan}% MoM
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "e-Katalog LKPP", status: selected.sources.ekatalog, color: "var(--color-brand-blue)" },
            { name: "e-Commerce B2B", status: selected.sources.ecommerce, color: "var(--color-brand-teal)" },
            { name: "Bursa Global", status: selected.sources.bursa, color: "var(--color-ai-purple)" },
          ].map((s) => (
            <div key={s.name} className="card flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>{s.name}</p>
                <p className="text-xs mt-0.5" style={{ color: s.status === "ok" ? "var(--color-success)" : "var(--color-danger)" }}>
                  {s.status === "ok" ? "● Aktif" : "● Gagal - mencoba ulang"}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: s.status === "ok" ? "var(--color-success-light)" : "var(--color-danger-light)" }}>
                {s.status === "ok" ? <CheckCircle size={16} style={{ color: "var(--color-success)" }} /> : <AlertCircle size={16} style={{ color: "var(--color-danger)" }} />}
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>Tren Harga per Sumber - {selected.nama}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}rb`} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #E4E7EC" }} formatter={(v) => [`Rp ${Number(v).toLocaleString("id")}`, ""]} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Line type="monotone" dataKey="ekatalog" stroke="var(--color-brand-blue)" strokeWidth={2} dot={false} name="e-Katalog LKPP" />
              <Line type="monotone" dataKey="ecommerce" stroke="var(--color-brand-teal)" strokeWidth={2} dot={false} name="e-Commerce B2B" />
              <Line type="monotone" dataKey="bursa" stroke="var(--color-ai-purple)" strokeWidth={2} dot={false} name="Bursa Global" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Riwayat Harga Mingguan</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
                {["Tanggal", "e-Katalog LKPP (Rp/m)", "e-Commerce B2B (Rp/m)", "Bursa Global (Rp/m)"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyTable.map((r) => (
                <tr key={r.tanggal} className="table-row" style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>{r.tanggal}</td>
                  <td className="px-5 py-3 font-tabular text-sm font-medium" style={{ color: "var(--color-brand-blue)" }}>{r.ekatalog.toLocaleString("id")}</td>
                  <td className="px-5 py-3 font-tabular text-sm font-medium" style={{ color: "var(--color-brand-teal)" }}>{r.ecommerce.toLocaleString("id")}</td>
                  <td className="px-5 py-3 font-tabular text-sm font-medium" style={{ color: "var(--color-ai-purple)" }}>{r.bursa.toLocaleString("id")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Intelijen Pasar</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            Pemantauan harga komoditas real-time dari e-Katalog LKPP, e-Commerce B2B, dan bursa global
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <RefreshCw size={12} style={{ color: "var(--color-success)" }} />
          <span style={{ color: "var(--color-text-muted)" }}>Auto-refresh aktif</span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "var(--color-ai-purple-light)", border: "1px solid #DDD6FE" }}>
        <Sparkles size={14} style={{ color: "var(--color-ai-purple)" }} />
        <p className="text-xs" style={{ color: "var(--color-ai-purple)" }}>
          Dynamic Market Crawling Machine - AI melacak harga dari 3 sumber eksternal secara otomatis untuk menyusun HPS/HEA yang akurat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {komoditas.map((k) => {
          const isAlert = k.status === "alert"
          const borderColor = isAlert ? "var(--color-danger)" : k.perubahan > 0 ? "var(--color-warning)" : "var(--color-border)"
          return (
            <div
              key={k.id}
              className="card cursor-pointer transition-all hover:shadow-md"
              style={{ borderLeft: `4px solid ${borderColor}`, cursor: "pointer" }}
              onClick={() => setSelected(k)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{k.nama}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>per {k.satuan}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  <SourceDot status={k.sources.ekatalog} />
                  <SourceDot status={k.sources.ecommerce} />
                  <SourceDot status={k.sources.bursa} />
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold font-tabular" style={{ color: "var(--color-text-primary)" }}>{k.harga}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {k.perubahan > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span
                      className="text-xs font-semibold font-tabular"
                      style={{ color: isAlert ? "var(--color-danger)" : k.perubahan > 0 ? "var(--color-warning)" : "var(--color-success)" }}
                    >
                      {k.perubahan > 0 ? "+" : ""}{k.perubahan}% MoM
                    </span>
                  </div>
                </div>
                <MiniSparkline
                  data={k.sparkline}
                  color={isAlert ? "var(--color-danger)" : k.perubahan > 0 ? "var(--color-warning)" : "var(--color-success)"}
                />
              </div>

              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border-light)" }}>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Diperbarui {k.updated}</p>
                {isAlert && (
                  <span className="badge" style={{ background: "var(--color-danger-light)", color: "var(--color-danger)" }}>
                    <AlertCircle size={10} className="mr-1" />Lonjakan Signifikan
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
