import { useState } from "react"
import { AlertTriangle, TrendingUp, CheckCircle, Info, Filter, ChevronRight, Bell } from "lucide-react"

export const allAlerts = [
  { id: 1, type: "danger", kategori: "Integritas Vendor", title: "Tender PJB-2026-089 memerlukan investigasi segera", desc: "Skor risiko kolusi 78/100 terdeteksi antara CV Mitra Teknik dan PT Indo Pump. Kemiripan pola penawaran mencapai 94%.", time: "5 menit lalu", unread: true, linked: "vendor", linkedId: "TDR-2026-089" },
  { id: 2, type: "warning", kategori: "Intelijen Pasar", title: "Harga Pipa Baja naik 4.2% dari bulan lalu", desc: "Harga referensi Pipa Baja Seamless naik signifikan. Pertimbangkan untuk memperbarui HPS tender terkait.", time: "1 jam lalu", unread: true, linked: "pasar", linkedId: "1" },
  { id: 3, type: "warning", kategori: "Evaluasi Harga", title: "3 evaluasi mendekati batas waktu review (24 jam)", desc: "EVL-2026-137, EVL-2026-139, dan EVL-2026-142 belum mendapat keputusan akhir dalam 24 jam.", time: "2 jam lalu", unread: true, linked: "evaluasi", linkedId: "EVL-2026-137" },
  { id: 4, type: "warning", kategori: "Intelijen Pasar", title: "Harga Valve Gate lonjak 12.1% MoM", desc: "Kenaikan melampaui ambang batas 10%. Tender yang menggunakan komponen ini perlu re-evaluasi.", time: "3 jam lalu", unread: false, linked: "pasar", linkedId: "4" },
  { id: 5, type: "success", kategori: "Laporan", title: "Laporan anomali Q3 berhasil diekspor", desc: "File laporan deteksi anomali vendor Q3 2026 (PDF, 2.4 MB) telah berhasil dibuat dan siap diunduh.", time: "Kemarin, 16:45", unread: false, linked: null },
  { id: 6, type: "info", kategori: "Sistem", title: "Data e-Katalog LKPP diperbarui", desc: "Crawler berhasil memperbarui 1.247 referensi harga dari e-Katalog LKPP. Model referensi harga diperbarui otomatis.", time: "Kemarin, 12:00", unread: false, linked: null },
  { id: 7, type: "danger", kategori: "Evaluasi Harga", title: "Deviasi ekstrem pada EVL-2026-139", desc: "Penawaran PT Valvindo untuk Valve Gate 6 inch melebihi batas referensi sebesar +18.7%. Perlu tindak lanjut.", time: "2 hari lalu", unread: false, linked: "evaluasi", linkedId: "EVL-2026-139" },
  { id: 8, type: "info", kategori: "Sistem", title: "Pembaruan model AI selesai", desc: "Model Historical Price Intelligence diperbarui dengan 3.200 data transaksi baru. Akurasi meningkat ke 89%.", time: "3 hari lalu", unread: false, linked: null },
]

const typeConfig: Record<string, { icon: typeof AlertTriangle; iconColor: string; bg: string; label: string }> = {
  danger: { icon: AlertTriangle, iconColor: "var(--color-danger)", bg: "var(--color-danger-light)", label: "Kritis" },
  warning: { icon: TrendingUp, iconColor: "var(--color-warning)", bg: "var(--color-warning-light)", label: "Perhatian" },
  success: { icon: CheckCircle, iconColor: "var(--color-success)", bg: "var(--color-success-light)", label: "Sukses" },
  info: { icon: Info, iconColor: "var(--color-brand-blue)", bg: "#EFF6FF", label: "Informasi" },
}

interface Props {
  onBack: () => void
  onNavigate: (page: string, id?: string) => void
}

export function AlertsPage({ onBack, onNavigate }: Props) {
  const [filter, setFilter] = useState<string>("all")
  const [readAlerts, setReadAlerts] = useState<Set<number>>(
    () => new Set(allAlerts.filter((alert) => !alert.unread).map((alert) => alert.id)),
  )

  const filtered = filter === "all" ? allAlerts : allAlerts.filter((a) => a.type === filter)
  const unreadCount = allAlerts.filter((alert) => !readAlerts.has(alert.id)).length

  function completeAlert(alert: (typeof allAlerts)[number]) {
    setReadAlerts((current) => new Set(current).add(alert.id))
    if (alert.linked) onNavigate(alert.linked, alert.linkedId)
  }

  return (
    <div className="p-4 md:p-6 max-w-[900px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Semua Notifikasi</h2>
            {unreadCount > 0 && (
              <span className="badge" style={{ background: "var(--color-danger-light)", color: "var(--color-danger)" }}>{unreadCount} baru</span>
            )}
          </div>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{allAlerts.length} notifikasi total</p>
        </div>
        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
          onClick={() => setReadAlerts(new Set(allAlerts.map((alert) => alert.id)))}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
          Tandai semua dibaca
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "Semua" },
          { id: "danger", label: "Kritis" },
          { id: "warning", label: "Perhatian" },
          { id: "success", label: "Sukses" },
          { id: "info", label: "Informasi" },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: filter === f.id ? "var(--color-brand-navy)" : "white",
              color: filter === f.id ? "white" : "var(--color-text-secondary)",
              border: `1px solid ${filter === f.id ? "var(--color-brand-navy)" : "var(--color-border)"}`,
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {filtered.map((a) => {
          const cfg = typeConfig[a.type]
          const Icon = cfg.icon
          const isRead = readAlerts.has(a.id)
          return (
            <article key={a.id}
              role="button"
              tabIndex={0}
              onClick={() => completeAlert(a)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  completeAlert(a)
                }
              }}
              className="rounded-xl p-4 transition-all cursor-pointer hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{
                background: !isRead ? "#FAFBFF" : "white",
                border: `1px solid ${!isRead ? "#DBEAFE" : "var(--color-border)"}`,
                borderLeft: `4px solid ${a.type === "danger" ? "var(--color-danger)" : a.type === "warning" ? "var(--color-warning)" : a.type === "success" ? "var(--color-success)" : "var(--color-brand-blue)"}`,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                  <Icon size={15} style={{ color: cfg.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: "var(--color-border)", color: "var(--color-text-muted)" }}>{a.kategori}</span>
                      {!isRead && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-brand-blue)" }} />}
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>{a.time}</span>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>{a.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{a.desc}</p>
                  {a.linked && (
                    <button
                      onClick={(event) => { event.stopPropagation(); completeAlert(a) }}
                      className="mt-2 flex items-center gap-1 text-xs font-semibold transition-colors"
                      style={{ color: "var(--color-brand-blue)" }}
                    >
                      Lihat detail <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </article>
          )
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Bell size={32} style={{ color: "var(--color-text-muted)", margin: "0 auto 12px" }} />
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Tidak ada notifikasi untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  )
}
