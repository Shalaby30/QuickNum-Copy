import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import Home from "./pages/Home"
import Schedule from "./pages/Schedule"
import Live from "./pages/live"
import StreamPage from "./pages/stream-page"
import SportsMatches from "./pages/sports-matches"

const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/live" element={<Live />} />
          <Route path="/matches/:sportName" element={<SportsMatches />} />
          <Route path="/stream/:matchId" element={<StreamPage />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default App
