import {
  Trophy,
  Circle,
  Dumbbell,
  Swords,
  Target,
  Bike,
  Waves,
  Gamepad2,
} from "lucide-react"

const sportIcons = {
  football: Circle,
  basketball: Circle,
  tennis: Target,
  cricket: Trophy,
  baseball: Trophy,
  hockey: Swords,
  mma: Swords,
  boxing: Swords,
  rugby: Trophy,
  volleyball: Circle,
  "american-football": Trophy,
  golf: Target,
  motorsport: Bike,
  swimming: Waves,
  esports: Gamepad2,
  default: Dumbbell,
}

export const getSportIcon = (sportId) => {
  const key = sportId?.toLowerCase().replace(/\s+/g, "-")
  return sportIcons[key] || sportIcons.default
}
