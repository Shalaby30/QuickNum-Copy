import { useState } from "react"
import { useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import Footer from "../Footer"

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isStreamPage = location.pathname.startsWith("/stream/")

  if (isStreamPage) {
    return (
      <div className="flex flex-col min-h-screen bg-background mesh-bg">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background mesh-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default AppLayout
