import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import { Home, Calendar, Radio, Play, Loader2, X } from "lucide-react"
import { getSportIcon } from "../../utils/sportIcons"

const API_BASE_URL = "https://streamed.pk/api"

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/live", label: "Live", icon: Radio, live: true },
  { to: "/schedule", label: "Schedule", icon: Calendar },
]

const Sidebar = ({ isOpen, onClose }) => {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/sports`)
      .then((res) => {
        setSports(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/[0.06]">
        <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent">
            <Play className="h-4 w-4 text-primary-foreground fill-primary-foreground ml-0.5" />
          </div>
          <span className="text-lg font-bold font-display gradient-text">Streamz</span>
        </Link>
      </div>

      <nav className="p-3 space-y-1">
        {navLinks.map(({ to, label, icon: Icon, live }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(to)
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
            {live && (
              <span className="ml-auto relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sports</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        ) : (
          <ul className="space-y-0.5">
            {sports.map((sport) => {
              const Icon = getSportIcon(sport.id)
              const active = location.pathname === `/matches/${sport.id}`
              return (
                <li key={sport.id}>
                  <Link
                    to={`/matches/${sport.id}`}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{sport.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-60 xl:w-64 shrink-0 border-r border-white/[0.06] glass h-screen sticky top-0">
        {content}
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative w-72 max-w-[85vw] h-full glass border-r border-white/[0.06] flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.06] text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
