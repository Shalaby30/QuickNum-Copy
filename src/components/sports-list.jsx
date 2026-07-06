import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { getSportIcon } from "../utils/sportIcons"

const API_BASE_URL = "https://streamed.pk/api"

const SportsList = () => {
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/sports`)
      .then((res) => {
        setSports(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {sports.map((sport) => {
        const Icon = getSportIcon(sport.id)
        return (
          <button
            key={sport.id}
            onClick={() => navigate(`/matches/${sport.id}`)}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm font-medium hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
          >
            <Icon className="h-4 w-4" />
            {sport.name}
          </button>
        )
      })}
    </div>
  )
}

export default SportsList
