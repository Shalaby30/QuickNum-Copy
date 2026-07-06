import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { Search, Loader2, Calendar, Filter, Radio } from "lucide-react"
import MatchRow from "../components/match-row"

const API_BASE_URL = "https://streamed.pk/api"

const filterButtons = [
  { key: "all", label: "All", icon: Filter },
  { key: "live", label: "Live", icon: Radio },
  { key: "today", label: "Today", icon: Calendar },
  { key: "upcoming", label: "Upcoming", icon: Calendar },
]

const SportsMatches = () => {
  const { sportName } = useParams()
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sportInfo, setSportInfo] = useState(null)
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    setIsLoading(true)

    axios
      .get(`${API_BASE_URL}/sports`)
      .then((res) => {
        const sport = res.data.find((s) => s.id === sportName)
        if (sport) setSportInfo(sport)
      })
      .catch(() => {})

    axios
      .get(`${API_BASE_URL}/matches/${sportName}`)
      .then((res) => {
        setMatches(res.data)
        setFilteredMatches(res.data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [sportName])

  useEffect(() => {
    let filtered = matches

    if (searchTerm) {
      filtered = filtered.filter((m) => m.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterType !== "all") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const now = Date.now()
      const threeHours = 3 * 60 * 60 * 1000

      filtered = filtered.filter((match) => {
        const matchDate = new Date(match.date)
        const matchTime = matchDate.getTime()
        if (filterType === "live") return now >= matchTime && now <= matchTime + threeHours
        if (filterType === "today") return matchDate >= today && matchDate < tomorrow
        if (filterType === "upcoming") return matchDate >= tomorrow
        return true
      })
    }

    setFilteredMatches(filtered)
  }, [searchTerm, matches, filterType])

  const displayName = sportInfo?.name || sportName

  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary mb-2 inline-block">
              ← Home
            </Link>
            <h1 className="text-2xl font-bold font-display capitalize">
              <span className="gradient-text">{displayName}</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredMatches.length} matches
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {filterButtons.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`flex items-center justify-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === key
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="space-y-2">
              {filteredMatches.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl py-16 text-center">
              <Search className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="font-semibold mb-1">No matches found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? `Nothing matching "${searchTerm}".`
                  : `No ${displayName} matches right now.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SportsMatches
