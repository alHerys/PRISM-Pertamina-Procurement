import { useState, useEffect } from "react"
import {
  LayoutDashboard, ClipboardList, TrendingUp, ShieldAlert,
  FileText, Settings, Bell, Search, ChevronDown, LogOut,
  X, User, Lock, Sliders, PanelLeftClose, PanelLeftOpen, Menu
} from "lucide-react"
import prismLogo from "@/imports/ChatGPT_Image_Aug_22__2026__02_59_49_AM.png"
import { DashboardPage } from "@/pages/Dashboard"
import { EvaluasiPage } from "@/pages/EvaluasiHarga"
import { InteligenPasarPage } from "@/pages/InteligenPasar"
import { IntegrasiVendorPage } from "@/pages/IntegrasiVendor"
import { RiwayatPage } from "@/pages/Riwayat"
import { PengaturanPage } from "@/pages/Pengaturan"
import { AlertsPage, allAlerts } from "@/pages/Alerts"

type Page = "dashboard" | "evaluasi" | "pasar" | "vendor" | "riwayat" | "pengaturan" | "alerts"

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "evaluasi" as Page, label: "Evaluasi Harga", icon: ClipboardList },
  { id: "pasar" as Page, label: "Intelijen Pasar", icon: TrendingUp },
  { id: "vendor" as Page, label: "Integritas Vendor", icon: ShieldAlert },
  { id: "riwayat" as Page, label: "Riwayat & Laporan", icon: FileText },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])
  return isMobile
}

interface Props {
  onLogout: () => void
}

export function AppShell({ onLogout }: Props) {
  const [page, setPage] = useState<Page>("dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>()
  const [unreadCount, setUnreadCount] = useState(allAlerts.filter((a) => a.unread).length)
  const isMobile = useIsMobile()

  // Close mobile menu on page change
  function navigate(p: Page, id?: string) {
    setPage(p)
    setSelectedItemId(id)
    setMobileMenuOpen(false)
    setShowNotif(false)
    setShowProfile(false)
  }

  const pageTitle: Record<Page, string> = {
    dashboard: "Dashboard",
    evaluasi: "Evaluasi Harga",
    pasar: "Intelijen Pasar",
    vendor: "Integritas Vendor",
    riwayat: "Riwayat & Laporan",
    pengaturan: "Pengaturan",
    alerts: "Semua Notifikasi",
  }

  const sidebarW = isMobile ? 0 : collapsed ? 64 : 228

  function SidebarContent({ onClose }: { onClose?: () => void }) {
    return (
      <div className="flex flex-col h-full py-4">
        {/* Logo + toggle */}
        <div className={`flex items-center mb-5 px-3 ${collapsed && !isMobile ? "justify-center" : "justify-between"}`}>
          {(!collapsed || isMobile) && (
            <img src={prismLogo} alt="PRISM" className="h-7 object-contain object-left"
              style={{ filter: "brightness(0) invert(1)", maxWidth: 120 }} />
          )}
          <div className="flex items-center gap-1">
            {isMobile && onClose ? (
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ color: "#64748B" }}>
                <X size={16} />
              </button>
            ) : (
              <button onClick={() => setCollapsed(!collapsed)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                style={{ color: "#64748B" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}>
                {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = page === item.id
            const mini = collapsed && !isMobile
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                title={mini ? item.label : undefined}
                className="flex items-center gap-2.5 w-full rounded-lg transition-all"
                style={{
                  padding: mini ? "10px" : "8px 12px",
                  justifyContent: mini ? "center" : "flex-start",
                  background: active ? "rgba(43,107,232,0.2)" : "transparent",
                  color: active ? "#FFFFFF" : "#94A3B8",
                  fontSize: 14, fontWeight: 500,
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.07)" }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = active ? "rgba(43,107,232,0.2)" : "transparent" }}
              >
                <Icon size={17} style={{ color: active ? "#60A5FA" : "inherit", flexShrink: 0 }} />
                {!mini && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Bottom nav */}
        <div className="px-2 pt-3 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { id: "pengaturan" as Page, label: "Pengaturan", icon: Settings, danger: false },
          ].map((item) => {
            const Icon = item.icon
            const active = page === item.id
            const mini = collapsed && !isMobile
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                title={mini ? item.label : undefined}
                className="flex items-center gap-2.5 w-full rounded-lg transition-all"
                style={{
                  padding: mini ? "10px" : "8px 12px",
                  justifyContent: mini ? "center" : "flex-start",
                  background: active ? "rgba(43,107,232,0.2)" : "transparent",
                  color: active ? "#FFFFFF" : "#94A3B8",
                  fontSize: 14, fontWeight: 500,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = active ? "rgba(43,107,232,0.2)" : "transparent" }}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {!mini && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
              </button>
            )
          })}
          <button onClick={onLogout}
            title={collapsed && !isMobile ? "Keluar" : undefined}
            className="flex items-center gap-2.5 w-full rounded-lg transition-all"
            style={{
              padding: collapsed && !isMobile ? "10px" : "8px 12px",
              justifyContent: collapsed && !isMobile ? "center" : "flex-start",
              color: "#F87171", fontSize: 14, fontWeight: 500,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.1)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
          >
            <LogOut size={17} style={{ flexShrink: 0 }} />
            {!(collapsed && !isMobile) && <span style={{ whiteSpace: "nowrap" }}>Keluar</span>}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--color-surface)" }}>

      {/* Mobile overlay backdrop */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(13,43,82,0.5)", backdropFilter: "blur(2px)" }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      {!isMobile && (
        <aside
          className="flex-shrink-0 transition-all duration-200"
          style={{
            width: sidebarW,
            background: "var(--color-brand-navy)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <SidebarContent />
        </aside>
      )}

      {/* Sidebar - mobile slide drawer */}
      {isMobile && (
        <div
          className="fixed top-0 left-0 h-full z-50 transition-transform duration-250"
          style={{
            width: 240,
            background: "var(--color-brand-navy)",
            transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
            boxShadow: mobileMenuOpen ? "4px 0 24px rgba(0,0,0,0.3)" : "none",
          }}
        >
          <SidebarContent onClose={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 md:px-6 flex-shrink-0"
          style={{ background: "white", borderBottom: "1px solid var(--color-border)", height: 60 }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Menu size={20} />
              </button>
            )}
            <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {pageTitle[page]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search - hide on very small screens */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-text"
              style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", minWidth: 200 }}
            >
              <Search size={13} />
              <span className="text-xs flex-1">Cari tender, item, vendor...</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded hidden md:block" style={{ background: "var(--color-border)", fontFamily: "var(--font-mono)" }}>Ctrl K</span>
            </div>

            {/* Notif */}
            <div className="relative">
              <button
                onClick={() => { setShowNotif(!showNotif); setShowProfile(false); setUnreadCount(0) }}
                className="w-9 h-9 rounded-lg flex items-center justify-center relative transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = showNotif ? "var(--color-surface)" : "transparent")}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center rounded-full text-white text-[9px] font-bold"
                    style={{ background: "var(--color-danger)" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-11 w-80 rounded-xl shadow-xl z-50"
                  style={{ background: "white", border: "1px solid var(--color-border)" }}>
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <span className="font-semibold text-sm">Notifikasi</span>
                    <button onClick={() => setShowNotif(false)}><X size={14} style={{ color: "var(--color-text-muted)" }} /></button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {allAlerts.slice(0, 5).map((n) => {
                      const color = n.type === "danger" ? "var(--color-danger)" : n.type === "warning" ? "var(--color-warning)" : n.type === "success" ? "var(--color-success)" : "var(--color-brand-blue)"
                      return (
                        <div key={n.id} className="px-4 py-3 cursor-pointer transition-colors"
                          style={{ borderBottom: "1px solid var(--color-border-light)", background: n.unread ? "#F8FAFF" : "white" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? "#F8FAFF" : "white")}
                          onClick={() => { setShowNotif(false); if (n.linked) navigate(n.linked as Page, n.linkedId) }}>
                          <div className="flex gap-2.5 items-start">
                            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                            <div>
                              <p className="text-xs font-medium leading-snug" style={{ color: "var(--color-text-primary)" }}>{n.title}</p>
                              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{n.time}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="px-4 py-2.5 text-center">
                    <button onClick={() => { setShowNotif(false); navigate("alerts") }}
                      className="text-xs font-semibold" style={{ color: "var(--color-brand-blue)" }}>
                      Lihat semua notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotif(false) }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: "var(--color-brand-blue)" }}>AR</div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Ahmad Rizki</div>
                  <div className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Evaluator Senior</div>
                </div>
                <ChevronDown size={13} style={{ color: "var(--color-text-muted)" }} className="hidden md:block" />
              </button>

              {showProfile && (
                <div className="absolute right-0 top-11 w-52 rounded-xl shadow-xl z-50 py-1"
                  style={{ background: "white", border: "1px solid var(--color-border)" }}>
                  {[
                    { icon: User, label: "Profil Saya", action: () => { navigate("pengaturan") } },
                    { icon: Lock, label: "Ubah Password", action: () => setShowProfile(false) },
                    { icon: Sliders, label: "Preferensi", action: () => setShowProfile(false) },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: "var(--color-text-primary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-surface)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <item.icon size={14} style={{ color: "var(--color-text-muted)" }} />
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid var(--color-border)", marginTop: 4, paddingTop: 4 }}>
                    <button onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm"
                      style={{ color: "var(--color-danger)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <LogOut size={14} />Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {page === "dashboard" && <DashboardPage onNavigate={(p, id) => navigate(p as Page, id)} />}
          {page === "evaluasi" && <EvaluasiPage initialItemId={selectedItemId} />}
          {page === "pasar" && <InteligenPasarPage initialItemId={selectedItemId} />}
          {page === "vendor" && <IntegrasiVendorPage initialItemId={selectedItemId} />}
          {page === "riwayat" && <RiwayatPage />}
          {page === "pengaturan" && <PengaturanPage />}
          {page === "alerts" && <AlertsPage onBack={() => navigate("dashboard")} onNavigate={(p, id) => navigate(p as Page, id)} />}
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav className="flex-shrink-0 flex items-center justify-around px-2 py-1"
            style={{ background: "white", borderTop: "1px solid var(--color-border)", height: 60 }}>
            {[...navItems.slice(0, 4), { id: "pengaturan" as Page, label: "Pengaturan", icon: Settings }].map((item) => {
              const Icon = item.icon
              const active = page === item.id
              return (
                <button key={item.id} onClick={() => navigate(item.id)}
                  className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors"
                  style={{ color: active ? "var(--color-brand-navy)" : "var(--color-text-muted)" }}>
                  <Icon size={20} style={{ color: active ? "var(--color-brand-blue)" : "var(--color-text-muted)" }} />
                  <span className="text-[10px] font-medium" style={{ lineHeight: 1.2, textAlign: "center" }}>
                    {item.label === "Riwayat & Laporan" ? "Riwayat" : item.label === "Integritas Vendor" ? "Integritas" : item.label === "Intelijen Pasar" ? "Pasar" : item.label}
                  </span>
                </button>
              )
            })}
          </nav>
        )}
      </div>
    </div>
  )
}
