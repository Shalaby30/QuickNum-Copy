import { useState, useEffect } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { Loader2, Monitor, Globe, Wifi, Shield } from "lucide-react"

const API_BASE_URL = "https://streamed.pk/api"

const makeApiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: { Accept: "application/json", ...options.headers },
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return response.json()
}

const fetchStreamsForSource = async (source, id) => {
  if (!source || !id) return []
  try {
    const data = await makeApiRequest(`/stream/${source.toLowerCase()}/${id}`)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

const StreamPage = () => {
  const [streams, setStreams] = useState([])
  const [currentStream, setCurrentStream] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [matchDetails, setMatchDetails] = useState(null)

  const location = useLocation()
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { title: initialTitle, sources: initialSources } = location.state || {}

  const fetchStreams = async (sourcesArray) => {
    if (!sourcesArray?.length) return
    setIsLoading(true)
    setError(null)
    try {
      const results = await Promise.all(
        sourcesArray.map((s) => fetchStreamsForSource(s.source, s.id))
      )
      const allStreams = results.flat().filter((s) => s?.embedUrl)
      setStreams(allStreams)
      if (allStreams.length > 0) setCurrentStream(allStreams[0])
    } catch {
      setError("Failed to load stream data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMatchData = async () => {
    if (!matchId) {
      setError("No match ID provided")
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const matches = await makeApiRequest("/matches/all")
      const match = matches.find(
        (m) => m.id === matchId || m.title?.toLowerCase().includes(matchId.toLowerCase())
      )
      if (!match) throw new Error("Match not found")
      setMatchDetails(match)
      if (match.sources?.length > 0) await fetchStreams(match.sources)
      else if (initialSources?.length) await fetchStreams(initialSources)
      else setError("No streams available for this match")
    } catch (err) {
      setError(err.message || "Failed to load match data.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMatchData()
  }, [matchId, retryCount])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading stream...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <div className="glass rounded-2xl p-8 border border-destructive/20">
          <h2 className="text-lg font-bold text-destructive mb-2">Something went wrong</h2>
          <p className="text-muted-foreground text-sm mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setRetryCount((p) => p + 1)}
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-xl bg-white/[0.06] text-sm font-semibold"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const title = matchDetails?.title || initialTitle || `Match: ${matchId}`

  return (
    <div className="flex flex-col">
      <div className="px-4 sm:px-6 py-4 border-b border-white/[0.06]">
        <h1 className="text-lg sm:text-xl font-bold font-display truncate">{title}</h1>
        {matchDetails?.category && (
          <p className="text-sm text-muted-foreground capitalize">{matchDetails.category}</p>
        )}
      </div>

      <div className="w-full bg-black">
        {currentStream ? (
          <div className="aspect-video max-h-[70vh] mx-auto">
            <iframe
              src={currentStream.embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope"
              referrerPolicy="no-referrer-when-downgrade"
              crossOrigin="anonymous"
              title={`Stream ${currentStream.streamNo}`}
            />
          </div>
        ) : (
          <div className="aspect-video max-h-[50vh] flex items-center justify-center text-muted-foreground">
            No stream available
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 py-4 border-b border-white/[0.06] overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {streams.map((stream) => (
            <button
              key={`${stream.source}-${stream.streamNo}`}
              onClick={() => setCurrentStream(stream)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                currentStream === stream
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/[0.06] text-muted-foreground hover:text-foreground hover:bg-white/[0.1]"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              {stream.source} #{stream.streamNo}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  stream.hd ? "bg-emerald-500/30 text-emerald-300" : "bg-amber-500/30 text-amber-300"
                }`}
              >
                {stream.hd ? "HD" : "SD"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {currentStream && (
        <div className="px-4 sm:px-6 py-5">
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            {[
              { icon: Globe, label: "Source", value: currentStream.source },
              { icon: Monitor, label: "Quality", value: currentStream.hd ? "HD" : "SD" },
              { icon: Wifi, label: "Language", value: currentStream.language || "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-muted-foreground mb-1">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs">{label}</span>
                </div>
                <p className="text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StreamPage
