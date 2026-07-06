import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import { Link } from "react-router-dom"
import MatchCard from "../components/match-card"

const PopularMatches = ({ sport, apiUrl, limit = 6 }) => {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((res) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const filtered = res.data.filter((m) => {
          const d = new Date(m.date)
          d.setHours(0, 0, 0, 0)
          return d >= today
        })
        setMatches(filtered.slice(0, limit))
      })
      .catch((err) => console.error(`Error fetching ${sport}:`, err))
  }, [apiUrl, sport, limit])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title text-lg">Popular {sport}</h2>
        <Link
          to={`/matches/${sport.toLowerCase()}`}
          className="text-xs text-primary hover:underline font-medium"
        >
          View all
        </Link>
      </div>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-6 text-center text-muted-foreground text-sm">
          No upcoming {sport} matches
        </div>
      )}
    </section>
  )
}

PopularMatches.propTypes = {
  sport: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
  limit: PropTypes.number,
}

export default PopularMatches
