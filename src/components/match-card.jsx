import { useNavigate } from "react-router-dom"
import { Trophy, Play, Clock } from "lucide-react"

const MatchCard = ({ match, compact = false }) => {
  const navigate = useNavigate()

  const formatMatchTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatMatchDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const isLive = () => {
    const now = Date.now()
    const matchTime = new Date(match.date).getTime()
    const threeHours = 3 * 60 * 60 * 1000
    return now >= matchTime && now <= matchTime + threeHours
  }

  const handleMatchClick = () => {
    navigate(`/stream/${match.id}`, {
      state: {
        matchId: match.id,
        title: match.title,
        sources: match.sources,
      },
    })
  }

  const live = isLive()

  return (
    <div
      onClick={handleMatchClick}
      className={`group w-full ${compact ? "max-w-[300px]" : ""} glass glass-hover rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:glow-primary`}
    >
      {match.poster ? (
        <div className="relative w-full h-[168px] overflow-hidden">
          <img
            src={`https://streamed.pk${match.poster}`}
            alt={match.title || "Match Poster"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          {live && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              LIVE
            </div>
          )}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/90 text-primary-foreground">
              <Play className="h-4 w-4 fill-current ml-0.5" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-[168px] bg-gradient-to-br from-secondary to-card flex items-center justify-center p-4">
          {live && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/90 text-white text-xs font-semibold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              LIVE
            </div>
          )}
          <div className="flex items-center justify-between w-full max-w-[260px]">
            {match.teams?.home ? (
              <div className="flex flex-col items-center flex-1">
                {match.teams.home.badge ? (
                  <img
                    src={`https://streamed.pk/api/images/badge/${match.teams.home.badge}.webp`}
                    alt={match.teams.home.name}
                    className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-primary" />
                  </div>
                )}
                <span className="text-xs text-muted-foreground mt-2 text-center line-clamp-1 max-w-[90px]">
                  {match.teams.home.name}
                </span>
              </div>
            ) : (
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
            )}
            <div className="flex flex-col items-center px-3">
              <span className="text-xs font-bold text-primary/80 tracking-widest">VS</span>
              <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatMatchTime(match.date)}
              </span>
            </div>
            {match.teams?.away ? (
              <div className="flex flex-col items-center flex-1">
                {match.teams.away.badge ? (
                  <img
                    src={`https://streamed.pk/api/images/badge/${match.teams.away.badge}.webp`}
                    alt={match.teams.away.name}
                    className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-primary" />
                  </div>
                )}
                <span className="text-xs text-muted-foreground mt-2 text-center line-clamp-1 max-w-[90px]">
                  {match.teams.away.name}
                </span>
              </div>
            ) : (
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-foreground font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {match.title}
        </h3>
        <p className="text-muted-foreground text-xs mt-1 capitalize">{match.category}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
          <span className="text-xs text-muted-foreground">{formatMatchDate(match.date)}</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {formatMatchTime(match.date)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MatchCard
