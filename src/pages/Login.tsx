import { useState } from "react"
import {
  Shield, Eye, EyeOff, Zap, CheckCircle, TrendingUp, BarChart2,
  ShieldAlert, X, ChevronRight, ArrowRight, Users
} from "lucide-react"
import prismLogo from "@/imports/ChatGPT_Image_Aug_22__2026__02_59_49_AM.png"

interface Props {
  onLogin: () => void
}

function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin() }, 900)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(13,43,82,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden" style={{ background: "white" }}>
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <img src={prismLogo} alt="PRISM" className="h-8 object-contain" />
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <X size={16} />
            </button>
          </div>

          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>Masuk ke PRISM</h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>Gunakan akun SSO Pertamina Anda</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Email Korporat</label>
              <input
                type="email"
                defaultValue="evaluator@pertamina-patraniaga.id"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-brand-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text-primary)" }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  defaultValue="password"
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none pr-10 transition-all"
                  style={{ border: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-brand-blue)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-muted)" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              <Shield size={13} style={{ color: "#2563EB", marginTop: 1, flexShrink: 0 }} />
              <p className="text-xs leading-relaxed" style={{ color: "#1D4ED8" }}>
                Akses diverifikasi melalui SSO Pertamina Patra Niaga. Hanya untuk staf internal yang berwenang.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: loading ? "#6B7280" : "var(--color-brand-navy)", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Memverifikasi...</>
              ) : (
                <><Zap size={14} />Masuk dengan SSO Pertamina</>
              )}
            </button>
          </form>
        </div>
        <div className="px-8 py-4" style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
          <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
            Butuh bantuan? Hubungi{" "}
            <span style={{ color: "var(--color-brand-blue)", cursor: "pointer" }}>it-helpdesk@pertamina.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: BarChart2,
    color: "var(--color-brand-blue)",
    bg: "#EFF6FF",
    title: "Historical Price Intelligence",
    desc: "Rentang harga referensi otomatis dari data historis pengadaan ribuan transaksi sebelumnya.",
  },
  {
    icon: TrendingUp,
    color: "var(--color-brand-teal)",
    bg: "#ECFDF5",
    title: "Dynamic Market Crawling",
    desc: "Pemantauan harga komoditas secara real-time dari e-Katalog LKPP, e-Commerce B2B, dan bursa global.",
  },
  {
    icon: ShieldAlert,
    color: "var(--color-ai-purple)",
    bg: "var(--color-ai-purple-light)",
    title: "Vendor Anomaly Detection",
    desc: "Algoritma Machine Learning mendeteksi indikasi persekongkolan harga antar vendor dalam suatu tender.",
  },
  {
    icon: CheckCircle,
    color: "var(--color-success)",
    bg: "var(--color-success-light)",
    title: "TKDN-aware Evaluation",
    desc: "Harga Evaluasi Akhir (HEA) yang mempertimbangkan tingkat komponen dalam negeri setiap vendor.",
  },
]

const stats = [
  { value: "87%", label: "Akurasi model harga referensi (target)" },
  { value: "30%", label: "Efisiensi waktu evaluasi harga" },
  { value: "6 modul", label: "Fitur AI terintegrasi" },
  { value: "Proyek 4", label: "Pertamina Camp 2026 - FILKOM UB" },
]

const team = [
  { name: "Trisha Malina Hanim", role: "Project Manager", prodi: "Sistem Informasi", initials: "TM", color: "var(--color-brand-blue)" },
  { name: "Alvianto Hery Sarborn", role: "Fullstack Engineer", prodi: "Teknologi Informasi", initials: "AH", color: "var(--color-brand-teal)" },
  { name: "Novita Azka Maghfira", role: "Data / AI Engineer", prodi: "Sistem Informasi", initials: "NA", color: "var(--color-ai-purple)" },
]

export function LoginPage({ onLogin }: Props) {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "white", fontFamily: "var(--font-sans)" }}>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={onLogin} />}

      {/* Sticky Nav */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-8 h-[68px]"
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--color-border)" }}
      >
        <img src={prismLogo} alt="PRISM" className="h-9 object-contain" />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
          {[
            { label: "Fitur", href: "#fitur" },
            { label: "Cara Kerja", href: "#cara-kerja" },
            { label: "Tentang", href: "#tentang" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="transition-colors hover:text-gray-900">{item.label}</a>
          ))}
        </nav>
        <button
          onClick={() => setShowLogin(true)}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all"
          style={{ background: "var(--color-brand-navy)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-brand-navy-light)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-brand-navy)")}
        >
          Masuk
        </button>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D2B52 0%, #163D6E 60%, #1a4a82 100%)" }}>
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "var(--color-brand-blue)", filter: "blur(120px)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10" style={{ background: "var(--color-brand-teal)", filter: "blur(100px)", transform: "translate(-30%, 30%)" }} />

        <div className="relative max-w-6xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(43,107,232,0.25)", border: "1px solid rgba(43,107,232,0.4)", color: "#93C5FD" }}>
              <Zap size={12} />
              AI-Powered Procurement Intelligence
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-white mb-5">
              Evaluasi harga vendor<br />lebih cepat, lebih<br />
              <span style={{ color: "#60A5FA" }}>akurat, dan terdokumentasi.</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
              PRISM membantu tim procurement PT Pertamina Patra Niaga menilai kewajaran harga penawaran vendor berbasis data historis, mempertimbangkan TKDN, dan mendeteksi indikasi persekongkolan antar vendor.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "var(--color-brand-blue)", color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FD6")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-brand-blue)")}
              >
                Masuk ke Dashboard <ArrowRight size={16} />
              </button>
              <a
                href="#fitur"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              >
                Pelajari Fitur <ChevronRight size={15} />
              </a>
            </div>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8">
              {["PT Pertamina Patra Niaga", "FILKOM Universitas Brawijaya", "Pertamina Camp 2026"].map((b) => (
                <div key={b} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <CheckCircle size={12} style={{ color: "var(--color-brand-teal)" }} />
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}>
              {/* Mockup top bar */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#FFBD2E" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
                </div>
                <div className="flex-1 mx-3 h-5 rounded-md text-xs flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                  prism.pertamina-patraniaga.id
                </div>
              </div>
              {/* Mockup content */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Tender Aktif", val: "24", color: "#60A5FA" },
                    { label: "Evaluasi Pending", val: "7", color: "#FCD34D" },
                    { label: "Alert Anomali", val: "3", color: "#F87171" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <p className="text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
                      <p className="text-2xl font-bold font-tabular" style={{ color: s.color }}>{s.val}</p>
                    </div>
                  ))}
                </div>
                {/* Mini chart bars */}
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>Aktivitas Evaluasi - Agustus 2026</p>
                  <div className="flex items-end gap-1.5 h-16">
                    {[4, 7, 5, 9, 6, 11, 8, 13, 10, 9, 12, 15].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${(h / 15) * 100}%`, background: i === 11 ? "#60A5FA" : "rgba(96,165,250,0.35)" }} />
                    ))}
                  </div>
                </div>
                {/* Mini table rows */}
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  {[
                    { id: "EVL-142", item: "Industrial Pump x25", status: "review", statusColor: "#FCD34D" },
                    { id: "EVL-141", item: "Kabel NYY 3x70mm", status: "aman", statusColor: "#34D399" },
                    { id: "EVL-139", item: "Valve Gate 6\"", status: "investigasi", statusColor: "#F87171" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <div>
                        <p className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>{r.item}</p>
                        <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>{r.id}</p>
                      </div>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${r.statusColor}22`, color: r.statusColor }}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: "var(--color-brand-navy)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold font-tabular mb-1" style={{ color: "#60A5FA" }}>{s.value}</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="py-20 px-8" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-brand-blue)" }}>Fitur Unggulan</p>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
              Semua yang dibutuhkan tim procurement modern
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Dari harga referensi historis hingga deteksi anomali vendor, PRISM menyatukan seluruh alur evaluasi pengadaan dalam satu platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="rounded-2xl p-6 transition-all"
                  style={{ background: "white", border: "1px solid var(--color-border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(13,43,82,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg }}>
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cara-kerja" className="py-20 px-8" style={{ background: "white" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-brand-blue)" }}>Cara Kerja</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Dari Owner Estimate hingga Evaluasi Penawaran</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              PRISM digunakan di dua titik kritis alur pemilihan penyedia: saat penyusunan Owner Estimate (pra-tender) dan saat evaluasi penawaran vendor yang masuk.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Input Spesifikasi",
                desc: "Masukkan detail item pengadaan: spesifikasi teknis, volume, lokasi, penawaran vendor, dan persentase TKDN (Form A1/A2/B1 TKDN).",
                color: "var(--color-brand-blue)",
                tag: "Pra-tender / Evaluasi",
              },
              {
                step: "02",
                title: "Harga Referensi AI",
                desc: "PRISM menghitung rentang harga referensi dari data historis pengadaan dan pemantauan pasar aktif (e-Katalog LKPP, e-Commerce B2B, bursa global).",
                color: "var(--color-brand-teal)",
                tag: "Historical Price + Market Crawling",
              },
              {
                step: "03",
                title: "Analisis & Deteksi",
                desc: "Breakdown faktor penyebab deviasi, deteksi harga timpang per line item, kalkulasi HEA berbasis TKDN, dan deteksi anomali/kolusi antar vendor.",
                color: "var(--color-ai-purple)",
                tag: "Explainability + Anomaly Detection",
              },
              {
                step: "04",
                title: "Keputusan Terinformasi",
                desc: "Terima rekomendasi status (Aman / Perlu Review / Investigasi) lengkap dengan justifikasi terstruktur yang dapat diekspor sebagai laporan audit.",
                color: "var(--color-success)",
                tag: "Audit Trail + Export",
              },
            ].map((s) => (
              <div key={s.step} className="relative p-6 rounded-2xl" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                <div className="text-4xl font-black mb-3 font-tabular" style={{ color: `${s.color}20` }}>{s.step}</div>
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3" style={{ background: `${s.color}15`, color: s.color }}>{s.tag}</span>
                <h3 className="text-sm font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Integration note */}
          <div className="mt-10 p-5 rounded-2xl flex items-start gap-4" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--color-brand-blue)" }}>
              <Zap size={14} style={{ color: "white" }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#1D4ED8" }}>PRISM melengkapi, bukan menggantikan, sistem yang sudah ada</p>
              <p className="text-xs leading-relaxed" style={{ color: "#1E40AF" }}>
                PRISM diposisikan sebagai lapisan decision-support di atas SAPP SmartGEP (RFX, penawaran vendor, PO), SAPP PROMISE (perencanaan pengadaan), dan SAPP DOCGEN (RKS, Rancangan Kontrak). Data supplier dan respons penawaran vendor dari SmartGEP menjadi basis analisis PRISM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section id="tentang" className="py-20 px-8" style={{ background: "var(--color-surface)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-brand-blue)" }}>Tentang Proyek</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--color-text-primary)" }}>Tim Raiyon Pertamina</h2>
            <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
              Proyek inovasi dalam rangka Pertamina Camp 2026 - Program Magang Berbasis Proyek FILKOM UB x PT Pertamina Patra Niaga Cabang Kalimantan.
            </p>
          </div>

          {/* Project info card */}
          <div className="rounded-2xl p-8 mb-8" style={{ background: "white", border: "1px solid var(--color-border)" }}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>Judul Proyek</p>
                <p className="text-sm font-semibold leading-relaxed mb-6" style={{ color: "var(--color-text-primary)" }}>
                  PRISM: Procurement Intelligence Berbasis AI untuk Evaluasi Harga dan HEA yang Akurat, Transparan, dan Adaptif
                </p>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-text-muted)" }}>Tema Proyek</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  Proyek 4 - Strategis dan Berdampak Besar, Subtopik D12 "AI Price Reference &amp; HEA Engine"
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>Program</p>
                <div className="space-y-2 mb-6">
                  {[
                    "Pertamina Camp 2026",
                    "FILKOM - Universitas Brawijaya",
                    "PT Pertamina Patra Niaga Cabang Kalimantan",
                    "1 September - 21 Desember 2026",
                  ].map((l) => (
                    <div key={l} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      <CheckCircle size={12} style={{ color: "var(--color-brand-teal)", flexShrink: 0 }} />
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--color-text-muted)" }}>Dosen Pembimbing (Pilihan)</p>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Lutfi Fanani, S.Kom, M.T., M.Sc. · Agi Putra Kharisma, S.T., M.T. · Bayu Priyambadha, S.Kom., M.Kom., Ph.D.
                </p>
              </div>
            </div>
          </div>

          {/* Team cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl p-6 text-center" style={{ background: "white", border: "1px solid var(--color-border)" }}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-4"
                  style={{ background: m.color }}
                >
                  {m.initials}
                </div>
                <p className="text-sm font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>{m.name}</p>
                <p className="text-xs font-semibold mb-1" style={{ color: m.color }}>{m.role}</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{m.prodi} - Semester 5, FILKOM UB</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-8" style={{ background: "var(--color-brand-navy)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Evaluasi harga pengadaan yang lebih cepat, transparan, dan akuntabel</h2>
            <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              PRISM membantu tim procurement PT Pertamina Patra Niaga Regional Kalimantan menilai kewajaran harga vendor berbasis data, mempertimbangkan TKDN, dan mendeteksi indikasi persekongkolan - semuanya dengan justifikasi yang dapat diaudit.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              "Historical Price Intelligence",
              "Explainable Price Deviation",
              "TKDN-aware HEA",
              "Vendor Anomaly Detection",
              "What-if Simulator",
              "Dynamic Market Crawling",
            ].map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <CheckCircle size={11} style={{ color: "var(--color-brand-teal)" }} />
                {f}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all"
              style={{ background: "var(--color-brand-blue)", color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1D5FD6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-brand-blue)")}
            >
              <Zap size={18} />
              Masuk ke PRISM
            </button>
            <a
              href="#tentang"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
            >
              <Users size={16} />
              Tentang Tim
            </a>
          </div>
          <p className="mt-6 text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
            Credit: Tim Raiyon Pertamina · Pertamina Camp 2026 · FILKOM UB x PT Pertamina Patra Niaga
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8" style={{ background: "#06192E", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={prismLogo} alt="PRISM" className="h-7 object-contain" style={{ filter: "brightness(0) invert(1)", opacity: 0.6 }} />
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            PRISM v1.0 · Procurement Reference Intelligence &amp; Smart Market Engine · 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
