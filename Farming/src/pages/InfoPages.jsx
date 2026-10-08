import BackButton from '../components/BackButton.jsx'

export function AboutPage() {
  return <main className="page-content"><BackButton /><section className="info-panel about-info-panel"><p className="eyebrow">Our roots</p><h1>Growing good things together</h1><p>urbanFarming connects local growers, neighbors, and food lovers through shared garden spaces and seasonal produce.</p></section></main>
}

export function ContactPage() {
  return (
    <main className="page-content">
      <BackButton />
      <section className="info-panel contact-info-panel">
        <p className="eyebrow">Get in touch</p>
        <h1>Contact the community team</h1>
        <p>
          Questions, customer feedback, or suggestions? Email us or give us a call.
        </p>
        <div className="contact-actions">
          <a
            className="primary-btn"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=nageshsamadi034%40gmail.com&su=UrbanFarming%20Customer%20Feedback"
            target="_blank"
            rel="noreferrer"
          >
            Email us
          </a>
          <a className="secondary-btn" href="tel:+919492529494">
            Call +91 94925 29494
          </a>
        </div>
      </section>
    </main>
  )
}
