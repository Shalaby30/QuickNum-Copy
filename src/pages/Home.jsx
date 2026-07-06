import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { Radio, Calendar, Loader2 } from "lucide-react"
import PopularMatches from "./popular-matches"
import MatchRow from "../components/match-row"

const API_BASE_URL = "https://streamed.pk/api"

const Home = () => {
  const [liveMatches, setLiveMatches] = useState([])
  const [loadingLive, setLoadingLive] = useState(true)

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/matches/live`)
      .then((res) => setLiveMatches(res.data.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoadingLive(false))
  }, [])

  return (
    <div className="p-4 sm:p-6">
      <div className="grid xl:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-8 min-w-0">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Live Now</h2>
              <Link to="/live" className="text-xs text-primary hover:underline font-medium">
                See all
              </Link>
            </div>
            {loadingLive ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : liveMatches.length > 0 ? (
              <div className="space-y-2">
                {liveMatches.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-xl p-8 text-center text-muted-foreground text-sm">
                No live matches right now. Check the{" "}
                <Link to="/schedule" className="text-primary hover:underline">schedule</Link>.
              </div>
            )}
          </section>

          <div className="grid lg:grid-cols-2 gap-6">
            <PopularMatches
              sport="Football"
              apiUrl="https://streamed.pk/api/matches/football/popular"
              limit={4}
            />
            <PopularMatches
              sport="Basketball"
              apiUrl="https://streamed.pk/api/matches/basketball/popular"
              limit={4}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5 sticky top-20">
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Access</h3>
            <ul className="space-y-2">
              {[
                { to: "/live", label: "Live Matches", desc: "Watch now", color: "text-red-400" },
                { to: "/schedule", label: "All Matches", desc: "Browse schedule", color: "text-primary" },
                { to: "/matches/football", label: "Football", desc: "Popular sport", color: "text-foreground" },
                { to: "/matches/basketball", label: "Basketball", desc: "Popular sport", color: "text-foreground" },
              ].map(({ to, label, desc, color }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors group"
                  >
                    <div>
                      <p className={`text-sm font-medium ${color} group-hover:text-primary transition-colors`}>
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <span className="text-muted-foreground group-hover:text-primary">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Home
