import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { Search, Loader2, Calendar, Filter, Radio } from "lucide-react"
import MatchRow from "./match-row"
import { Pagination } from "./ui/pagination"

const API_BASE_URL = "https://streamed.pk/api"
const ITEMS_PER_PAGE = 50

const filterButtons = [
  { key: "all", label: "All", icon: Filter },
  { key: "today", label: "Today", icon: Calendar },
  { key: "upcoming", label: "Upcoming", icon: Calendar },
]

const MatchesList = ({ type = "all" }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState("all")
  const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1", 10))

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "")
  }, [searchParams])

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true)
      try {
        const endpoint = type === "live" ? "matches/live" : "matches/all"
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`)
        setMatches(response.data)
        setFilteredMatches(response.data)
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMatches()
  }, [type])

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

      filtered = filtered.filter((match) => {
        const matchDate = new Date(match.date)
        if (filterType === "today") return matchDate >= today && matchDate < tomorrow
        if (filterType === "upcoming") return matchDate >= tomorrow
        return true
      })
    }

    setFilteredMatches(filtered)
    setCurrentPage(1)
    setSearchParams({ search: searchTerm, page: "1" })
  }, [searchTerm, matches, filterType, setSearchParams])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSearchParams({ search: searchTerm, page: page.toString() })
  }

  const paginatedMatches = filteredMatches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold font-display mb-1">
              {type === "live" ? (
                <span className="gradient-text">Live</span>
              ) : (
                "Schedule"
              )}
            </h1>
            <p className="text-xs text-muted-foreground">
              {type === "live"
                ? "Matches broadcasting now"
                : `${filteredMatches.length} matches`}
            </p>
          </div>

          {type === "live" && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              On Air
            </div>
          )}

          {type !== "live" && (
            <div className="flex flex-wrap gap-2">
              {filterButtons.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilterType(key)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
          )}

          <div className="relative">
            <input
              type="text"
              placeholder="Filter results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {searchTerm && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing results for &quot;{searchTerm}&quot;
            </p>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : paginatedMatches.length > 0 ? (
            <>
              <div className="space-y-2">
                {paginatedMatches.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredMatches.length}
                  pageSize={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl py-16 text-center">
              {type === "live" ? (
                <Radio className="h-10 w-10 text-primary mx-auto mb-3" />
              ) : (
                <Search className="h-10 w-10 text-primary mx-auto mb-3" />
              )}
              <p className="font-semibold mb-1">No matches found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Try a different search term." : "Check back later."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MatchesList
