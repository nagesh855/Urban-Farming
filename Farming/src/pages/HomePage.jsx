import heroField from '../assets/hero-field.png'
import DroneAnimation from '../components/DroneAnimation.jsx'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Good things grow together</p>
          <h1 id="hero-title">
            <span className="hero-title-accent">AGRICULTURAL</span>{' '}
            <span className="hero-title-accent">ALLURI.</span>
          </h1>
          <p className="hero-text">
            urbanFarming helps you care for urban gardens, grow fresh crops, connect with your
            community, and share or sell the goodness you grow.
          </p>
          <div className="cta-row" id="get-started">
            <Link className="primary-btn" to="/register">
              Get Started <span aria-hidden="true">↗</span>
            </Link>
            <Link className="secondary-btn" to="/marketplace">
              <span className="produce-icon" aria-hidden="true">✳</span>
              Explore Local Produce
            </Link>
          </div>
          <div className="hero-note" id="community">
            <span className="note-icon" aria-hidden="true">✳</span>
            <p>
              A little more green, a little closer to home.
              <span>Made for neighbors, growers, and local food lovers.</span>
            </p>
          </div>
        </div>
        <div className="hero-visual" aria-label="Drone watering a lush green farm field">
          <div className="field-scene" style={{ backgroundImage: `url(${heroField})` }}>
            <div className="field-wash" aria-hidden="true" />
            <DroneAnimation />
            <div className="scene-label">
              <span className="scene-label-icon" aria-hidden="true">✦</span>
              <span>Growing a greener tomorrow</span>
            </div>
            <span className="scene-sun" aria-hidden="true">✳</span>
          </div>
          <div className="visual-caption">
            <span><i /> Grown with care, shared with community</span>
            <span className="caption-arrow" aria-hidden="true">↗</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
