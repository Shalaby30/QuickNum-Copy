import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Search, X, Menu, ArrowLeft, Play } from "lucide-react"

const TopBar = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const isStreamPage = location.pathname.startsWith("/stream/")

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/schedule?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-white/[0.06] glass flex items-center gap-4 px-4 sm:px-6 shrink-0">
      {isStreamPage ? (
        <>
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Play className="h-3.5 w-3.5 text-primary-foreground fill-primary-foreground ml-0.5" />
            </div>
            <span className="font-bold font-display gradient-text">Streamz</span>
          </Link>
        </>
      ) : (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-white/[0.06] text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search matches..."
          className="w-full pl-10 pr-9 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
    </header>
  )
}

export default TopBar
