import { useState } from "react"
import { User, Lock, Shield, Sliders, Plus, Trash2, Edit2 } from "lucide-react"

type Tab = "profil" | "akses" | "konfigurasi"

const users = [
  { id: 1, nama: "Ahmad Rizki", email: "a.rizki@pertamina-patraniaga.id", role: "Evaluator Senior", status: "aktif" },
  { id: 2, nama: "Siti Rahayu", email: "s.rahayu@pertamina-patraniaga.id", role: "Evaluator", status: "aktif" },
  { id: 3, nama: "Budi Santoso", email: "b.santoso@pertamina-patraniaga.id", role: "Evaluator", status: "aktif" },
  { id: 4, nama: "Dewi Kartika", email: "d.kartika@pertamina-patraniaga.id", role: "Verifikator", status: "aktif" },
  { id: 5, nama: "Reza Firmansyah", email: "r.firmansyah@pertamina-patraniaga.id", role: "Admin", status: "aktif" },
  { id: 6, nama: "Maya Sari", email: "m.sari@pertamina-patraniaga.id", role: "Evaluator", status: "nonaktif" },
]

function ThresholdConfig({ label, value, min, max, color, onChange }: {
  label: string; value: number; min: number; max: number; color: string; onChange: (v: number) => void
}) {
  return (
    <div className="p-4 rounded-xl" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{label}</p>
        <span className="font-tabular text-sm font-bold" style={{ color }}>{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
      <div className="flex justify-between mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  )
}

export function PengaturanPage() {
  const [tab, setTab] = useState<Tab>("profil")
  const [thresholds, setThresholds] = useState({ review: 5, investigasi: 15, kolusi: 60 })

  const tabs = [
    { id: "profil" as Tab, label: "Profil Pengguna", icon: User },
    { id: "akses" as Tab, label: "Manajemen Akses", icon: Shield },
    { id: "konfigurasi" as Tab, label: "Konfigurasi Sistem", icon: Sliders },
  ]

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Pengaturan</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>Kelola profil, akses pengguna, dan konfigurasi sistem</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0" style={{ borderBottom: "1px solid var(--color-border)" }}>
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium relative"
              style={{
                color: tab === t.id ? "var(--color-brand-navy)" : "var(--color-text-muted)",
                borderBottom: tab === t.id ? "2px solid var(--color-brand-navy)" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              <Icon size={15} />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === "profil" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 card space-y-5">
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Informasi Profil</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: "var(--color-brand-blue)" }}>AR</div>
              <div>
                <p className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>Ahmad Rizki</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Evaluator Senior · Regional Kalimantan</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Nama Lengkap", value: "Ahmad Rizki" },
                { label: "NIK Karyawan", value: "106234089" },
                { label: "Email Korporat", value: "a.rizki@pertamina-patraniaga.id" },
                { label: "Jabatan", value: "Evaluator Senior" },
                { label: "Unit Kerja", value: "Pengadaan Barang & Jasa" },
                { label: "Regional", value: "Kalimantan" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>{f.label}</label>
                  <input
                    defaultValue={f.value}
                    disabled={f.label === "NIK Karyawan" || f.label === "Email Korporat"}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                    style={{
                      border: "1px solid var(--color-border)",
                      background: f.label === "NIK Karyawan" || f.label === "Email Korporat" ? "var(--color-surface)" : "white",
                      color: "var(--color-text-primary)",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="btn-primary">Simpan Perubahan</button>
              <button className="btn-secondary">Batal</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--color-text-primary)" }}>
                <Lock size={14} />Keamanan Akun
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>Password</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Diperbarui 30 hari lalu</p>
                  </div>
                  <button className="text-xs font-semibold" style={{ color: "var(--color-brand-blue)" }}>Ubah</button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--color-surface)" }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>Sesi Aktif</p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>1 perangkat</p>
                  </div>
                  <button className="text-xs font-semibold" style={{ color: "var(--color-danger)" }}>Akhiri Semua</button>
                </div>
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Hak Akses</h3>
              <div className="space-y-2">
                {["Evaluasi Harga", "Intelijen Pasar", "Integritas Vendor", "Riwayat & Laporan"].map((p) => (
                  <div key={p} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{p}</span>
                    <span className="badge" style={{ background: "var(--color-success-light)", color: "var(--color-success)" }}>Aktif</span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Manajemen Akses</span>
                  <span className="badge" style={{ background: "var(--color-border)", color: "var(--color-text-muted)" }}>Terbatas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "akses" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{users.length} pengguna terdaftar</p>
            <button className="btn-primary"><Plus size={14} />Tambah Pengguna</button>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Nama", "Email", "Role", "Status", "Aksi"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="table-row" style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: "var(--color-brand-blue)" }}>
                          {u.nama.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{u.nama}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="badge" style={{ background: u.role === "Admin" ? "var(--color-ai-purple-light)" : "var(--color-border)", color: u.role === "Admin" ? "var(--color-ai-purple)" : "var(--color-text-secondary)" }}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge" style={{ background: u.status === "aktif" ? "var(--color-success-light)" : "var(--color-border)", color: u.status === "aktif" ? "var(--color-success)" : "var(--color-text-muted)" }}>
                        {u.status === "aktif" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button className="w-7 h-7 rounded flex items-center justify-center transition-colors" style={{ color: "var(--color-text-muted)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button className="w-7 h-7 rounded flex items-center justify-center transition-colors" style={{ color: "var(--color-danger)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-danger-light)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "konfigurasi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card space-y-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Ambang Batas Deviasi Harga</h3>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Persentase deviasi yang memicu status alert evaluasi</p>
            </div>
            <ThresholdConfig
              label="Batas Perlu Review (%)"
              value={thresholds.review}
              min={1} max={20}
              color="var(--color-warning)"
              onChange={(v) => setThresholds({ ...thresholds, review: v })}
            />
            <ThresholdConfig
              label="Batas Perlu Investigasi (%)"
              value={thresholds.investigasi}
              min={5} max={50}
              color="var(--color-danger)"
              onChange={(v) => setThresholds({ ...thresholds, investigasi: v })}
            />
            <div className="p-3 rounded-lg text-xs space-y-1" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p style={{ color: "var(--color-text-muted)" }}>Dampak konfigurasi saat ini:</p>
              <p style={{ color: "var(--color-text-secondary)" }}>• Deviasi {"<"}{thresholds.review}% → <strong>Aman</strong></p>
              <p style={{ color: "var(--color-text-secondary)" }}>• Deviasi {thresholds.review}–{thresholds.investigasi}% → <strong>Perlu Review</strong></p>
              <p style={{ color: "var(--color-text-secondary)" }}>• Deviasi {">"}{thresholds.investigasi}% → <strong>Perlu Investigasi</strong></p>
            </div>
          </div>

          <div className="card space-y-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Ambang Batas Skor Kolusi</h3>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Skor minimum yang memicu alert integritas vendor (0–100)</p>
            </div>
            <ThresholdConfig
              label="Skor Investigasi Vendor"
              value={thresholds.kolusi}
              min={10} max={90}
              color="var(--color-danger)"
              onChange={(v) => setThresholds({ ...thresholds, kolusi: v })}
            />
            <div className="p-3 rounded-lg text-xs space-y-1" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
              <p style={{ color: "var(--color-text-muted)" }}>Konfigurasi saat ini:</p>
              <p style={{ color: "var(--color-text-secondary)" }}>• Skor {"<"}50 → <strong>Normal</strong></p>
              <p style={{ color: "var(--color-text-secondary)" }}>• Skor 50–{thresholds.kolusi - 1} → <strong>Waspadai</strong></p>
              <p style={{ color: "var(--color-text-secondary)" }}>• Skor ≥{thresholds.kolusi} → <strong>Perlu Investigasi</strong></p>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <button className="btn-secondary">Reset ke Default</button>
            <button className="btn-primary">Simpan Konfigurasi</button>
          </div>
        </div>
      )}
    </div>
  )
}
