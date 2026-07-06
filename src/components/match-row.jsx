import { useNavigate } from "react-router-dom"
import { Trophy, Play, Clock, ChevronRight } from "lucide-react"

const MatchRow = ({ match }) => {
  const navigate = useNavigate()

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    })

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })

  const isLive = () => {
    const now = Date.now()
    const matchTime = new Date(match.date).getTime()
    return now >= matchTime && now <= matchTime + 3 * 60 * 60 * 1000
  }

  const live = isLive()

  const handleClick = () => {
    navigate(`/stream/${match.id}`, {
      state: { matchId: match.id, title: match.title, sources: match.sources },
    })
  }

  const TeamBadge = ({ team }) => {
    if (!team) return <Trophy className="h-5 w-5 text-primary" />
    if (team.badge) {
      return (
        <img
          src={`https://streamed.pk/api/images/badge/${team.badge}.webp`}
          alt={team.name}
          className="h-8 w-8 object-contain"
        />
      )
    }
    return <Trophy className="h-5 w-5 text-primary" />
  }

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-4 p-4 glass glass-hover rounded-xl text-left group"
    >
      <div className="shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
        {match.poster ? (
          <img
            src={`https://streamed.pk${match.poster}`}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center gap-1 px-1">
            <TeamBadge team={match.teams?.home} />
            <span className="text-[10px] text-muted-foreground">vs</span>
            <TeamBadge team={match.teams?.away} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {live && (
            <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Live
            </span>
          )}
          <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {match.title}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground capitalize">{match.category}</p>
      </div>

      <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
        <span className="text-xs font-medium text-foreground">{formatTime(match.date)}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDate(match.date)}
        </span>
      </div>

      <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="h-4 w-4 fill-current ml-0.5" />
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground sm:hidden shrink-0" />
    </button>
  )
}

export default MatchRow
