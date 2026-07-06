import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.06] px-4 sm:px-6 py-4 shrink-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Streamz</p>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/live" className="hover:text-primary transition-colors">Live</Link>
          <Link to="/schedule" className="hover:text-primary transition-colors">Schedule</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
