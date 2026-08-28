import { AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Activity, ChevronRight, Zap } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts"

type Page = "dashboard" | "evaluasi" | "pasar" | "vendor" | "riwayat" | "pengaturan" | "alerts"

interface Props {
  onNavigate: (page: Page, id?: string) => void
}

const activityData = [
  { date: "1 Agu", evaluasi: 4, alert: 1 },
  { date: "5 Agu", evaluasi: 7, alert: 2 },
  { date: "10 Agu", evaluasi: 5, alert: 0 },
  { date: "12 Agu", evaluasi: 9, alert: 3 },
  { date: "15 Agu", evaluasi: 6, alert: 1 },
  { date: "18 Agu", evaluasi: 11, alert: 2 },
  { date: "20 Agu", evaluasi: 8, alert: 1 },
  { date: "22 Agu", evaluasi: 13, alert: 4 },
]

const recentEvaluasi = [
  { id: "EVL-2026-142", item: "Industrial Pump - Qty 25", vendor: "CV Mitra Teknik", status: "review", deviasi: "+9.4%", waktu: "2 jam lalu" },
  { id: "EVL-2026-141", item: "Kabel Listrik NYY 3×70mm", vendor: "PT Kabel Nusantara", status: "aman", deviasi: "+1.2%", waktu: "4 jam lalu" },
  { id: "EVL-2026-140", item: "Semen Portland - 500 ton", vendor: "PT Semen Kaltim", status: "aman", deviasi: "-0.8%", waktu: "6 jam lalu" },
  { id: "EVL-2026-139", item: "Valve Gate 6 inch ANSI 300", vendor: "PT Valvindo", status: "investigasi", deviasi: "+18.7%", waktu: "Kemarin" },
  { id: "EVL-2026-138", item: "Pipa Baja Seamless 8 inch", vendor: "PT Krakatau Steel", status: "aman", deviasi: "-2.1%", waktu: "Kemarin" },
]

const alerts = [
  { type: "danger", msg: "Tender PJB-2026-089: Skor risiko kolusi 78/100 - diperlukan investigasi segera", time: "5 mnt", linked: "vendor" as Page, linkedId: "TDR-2026-089" },
  { type: "warning", msg: "Harga referensi Valve Gate melonjak 12% dari baseline bulan lalu", time: "1 jam", linked: "pasar" as Page, linkedId: "4" },
  { type: "warning", msg: "3 evaluasi harga mendekati batas waktu review (24 jam)", time: "2 jam", linked: "evaluasi" as Page, linkedId: "EVL-2026-137" },
  { type: "info", msg: "Data pasar e-Katalog LKPP berhasil diperbarui", time: "4 jam", linked: "pasar" as Page },
]

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    aman: { label: "Aman", bg: "var(--color-success-light)", color: "var(--color-success)" },
    review: { label: "Perlu Review", bg: "var(--color-warning-light)", color: "#B45309" },
    investigasi: { label: "Perlu Investigasi", bg: "var(--color-danger-light)", color: "var(--color-danger)" },
  }
  const s = map[status] || map.aman
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
  )
}

export function DashboardPage({ onNavigate }: Props) {
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-[1400px]">
      {/* Welcome */}
      <div className="flex items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
            Selamat datang, Ahmad Rizki
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            Jumat, 22 Agustus 2026 · Data pasar terakhir diperbarui 4 menit lalu
          </p>
        </div>
        <button className="btn-primary" onClick={() => onNavigate("evaluasi")}>
          <Zap size={15} />
          Evaluasi Baru
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Tender Aktif",
            value: "24",
            sub: "+3 dari minggu lalu",
            trend: "up",
            icon: Activity,
            color: "var(--color-brand-blue)",
            bg: "#EFF6FF",
          },
          {
            label: "Evaluasi Pending",
            value: "7",
            sub: "Menunggu review Anda",
            trend: "neutral",
            icon: Clock,
            color: "var(--color-warning)",
            bg: "var(--color-warning-light)",
          },
          {
            label: "Alert Anomali Baru",
            value: "3",
            sub: "Perlu tindak lanjut segera",
            trend: "up",
            icon: AlertTriangle,
            color: "var(--color-danger)",
            bg: "var(--color-danger-light)",
          },
          {
            label: "Evaluasi Aman (Bulan Ini)",
            value: "41",
            sub: "87% tingkat kepatuhan",
            trend: "up",
            icon: CheckCircle,
            color: "var(--color-success)",
            bg: "var(--color-success-light)",
          },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>{s.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold font-tabular" style={{ color: "var(--color-text-primary)" }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>{s.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Activity chart */}
        <div className="md:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Aktivitas Evaluasi</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Evaluasi harga & alert anomali - Agustus 2026</p>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 inline-block rounded" style={{ background: "var(--color-brand-blue)" }} />Evaluasi</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 inline-block rounded" style={{ background: "var(--color-danger)" }} />Alert</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2B6BE8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2B6BE8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E4E7EC", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
              <Area type="monotone" dataKey="evaluasi" stroke="#2B6BE8" strokeWidth={2} fill="url(#evalGrad)" dot={false} name="Evaluasi" />
              <Area type="monotone" dataKey="alert" stroke="#EF4444" strokeWidth={2} fill="url(#alertGrad)" dot={false} name="Alert" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Alert Terbaru</h3>
            <span className="badge" style={{ background: "var(--color-danger-light)", color: "var(--color-danger)" }}>3 baru</span>
          </div>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <button key={i} onClick={() => onNavigate(a.linked)}
                className="w-full flex gap-2.5 items-start text-left rounded-lg p-2 -m-2 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    background: a.type === "danger" ? "var(--color-danger)" : a.type === "warning" ? "var(--color-warning)" : "var(--color-brand-blue)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug" style={{ color: "var(--color-text-primary)" }}>{a.msg}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{a.time} yang lalu</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent evaluations */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Evaluasi Terbaru</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>5 item pengadaan terakhir</p>
          </div>
          <button className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--color-brand-blue)" }} onClick={() => onNavigate("evaluasi")}>
            Lihat semua <ChevronRight size={13} />
          </button>
        </div>

        {/* Desktop table */}
        <table className="w-full hidden md:table">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-light)" }}>
              {["ID Evaluasi", "Item Pengadaan", "Vendor", "Deviasi Harga", "Status", "Waktu"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentEvaluasi.map((row) => (
              <tr key={row.id} className="table-row transition-colors cursor-pointer" style={{ borderBottom: "1px solid var(--color-border-light)" }} onClick={() => onNavigate("evaluasi", row.id)}>
                <td className="px-5 py-3.5">
                  <span className="font-tabular text-xs font-medium" style={{ color: "var(--color-brand-blue)" }}>{row.id}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{row.item}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.vendor}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="font-tabular text-sm font-semibold flex items-center gap-1"
                    style={{ color: row.deviasi.startsWith("+") ? "var(--color-danger)" : "var(--color-success)" }}
                  >
                    {row.deviasi.startsWith("+") ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {row.deviasi}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{row.waktu}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile card list */}
        <div className="md:hidden divide-y" style={{ borderColor: "var(--color-border-light)" }}>
          {recentEvaluasi.map((row) => (
            <button key={row.id} onClick={() => onNavigate("evaluasi", row.id)} className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors hover:bg-slate-50"
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "var(--color-text-primary)" }}>{row.item}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{row.vendor} · {row.waktu}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-tabular text-xs font-semibold" style={{ color: row.deviasi.startsWith("+") ? "var(--color-danger)" : "var(--color-success)" }}>{row.deviasi}</span>
                <StatusBadge status={row.status} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
