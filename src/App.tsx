import { useState } from "react"
import { LoginPage } from "./pages/Login"
import { AppShell } from "./components/AppShell"

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />
  return <AppShell onLogout={() => setLoggedIn(false)} />
}
