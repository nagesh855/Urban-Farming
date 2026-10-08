import BackButton from '../components/BackButton.jsx'
import './WeatherCalendarPage.css'

const seasons = {
  transition: {
    label: 'Transition months',
    icon: '🌤️',
    description: 'Drier, generally milder months between the main monsoon and summer.',
  },
  summer: {
    label: 'Low-rainfall / summer months',
    icon: '☀️',
    description: 'Hotter months with limited dependable rain; plan irrigation and conserve soil moisture.',
  },
  rainy: {
    label: 'Rainy months',
    icon: '🌧️',
    description: 'Monsoon and post-monsoon rains; rainfall timing and amount vary across Andhra Pradesh.',
  },
}

const months = [
  {
    name: 'January', short: 'JAN', season: 'transition', rainfall: 'Low', rainy: false,
    temperature: 'Cool to mild; pleasant days',
    water: 'Moderate; stored and residual water',
    crops: 'Rabi rice, chickpea, coriander, leafy greens',
    recommendation: 'Maintain light irrigation for winter crops and check soil moisture before watering.',
    icon: '🌱',
  },
  {
    name: 'February', short: 'FEB', season: 'transition', rainfall: 'Low', rainy: false,
    temperature: 'Mild, gradually warming',
    water: 'Moderate, beginning to decline',
    crops: 'Chickpea, sesame, tomato, brinjal',
    recommendation: 'Finish rabi sowing early where suitable and mulch beds as temperatures rise.',
    icon: '🌿',
  },
  {
    name: 'March', short: 'MAR', season: 'summer', rainfall: 'Low', rainy: false,
    temperature: 'Warm to hot',
    water: 'Low to moderate; irrigation often needed',
    crops: 'Summer vegetables, green gram, sesame',
    recommendation: 'Water in the early morning, use organic mulch and protect young plants from heat.',
    icon: '🪴',
  },
  {
    name: 'April', short: 'APR', season: 'summer', rainfall: 'Low', rainy: false,
    temperature: 'Hot; heat stress can build',
    water: 'Low; conserve and irrigate carefully',
    crops: 'Okra, gourds, summer pulses',
    recommendation: 'Use shade for tender seedlings and drip or basin irrigation to reduce water loss.',
    icon: '🌶️',
  },
  {
    name: 'May', short: 'MAY', season: 'summer', rainfall: 'Low', rainy: false,
    temperature: 'Very hot; occasional pre-monsoon storms',
    water: 'Low; replenishment is uncertain',
    crops: 'Short-duration pulses, okra, gourds',
    recommendation: 'Prepare drainage and nursery beds before monsoon showers; avoid relying on early rain.',
    icon: '🌞',
  },
  {
    name: 'June', short: 'JUN', season: 'rainy', rainfall: 'Medium', rainy: true,
    temperature: 'Warm and humid; monsoon onset varies',
    water: 'Improving where monsoon rain arrives',
    crops: 'Rice nurseries, millets, maize, cotton',
    recommendation: 'Sow after effective rain and ensure fields can drain during heavy spells.',
    icon: '🌧️',
  },
  {
    name: 'July', short: 'JUL', season: 'rainy', rainfall: 'High', rainy: true,
    temperature: 'Warm, humid and often cloudy',
    water: 'Generally better; manage excess runoff',
    crops: 'Rice, maize, groundnut, cotton',
    recommendation: 'Weed and earth up crops; clear field channels and watch for waterlogging.',
    icon: '🌾',
  },
  {
    name: 'August', short: 'AUG', season: 'rainy', rainfall: 'High', rainy: true,
    temperature: 'Warm and humid',
    water: 'Usually good, but varies by district',
    crops: 'Rice, pulses, maize, vegetables',
    recommendation: 'Inspect crops after heavy rain and keep bunds and drainage outlets in good shape.',
    icon: '🌿',
  },
  {
    name: 'September', short: 'SEP', season: 'rainy', rainfall: 'High', rainy: true,
    temperature: 'Warm; showers may continue',
    water: 'Good in many areas; rainfall may taper',
    crops: 'Rice, groundnut, cotton, pigeon pea',
    recommendation: 'Support tall crops and monitor pests as humid conditions continue.',
    icon: '🌱',
  },
  {
    name: 'October', short: 'OCT', season: 'rainy', rainfall: 'High', rainy: true,
    temperature: 'Warm and humid; storm risk in coastal areas',
    water: 'Variable; can rise quickly with rain',
    crops: 'Rice, rabi pulses, vegetables',
    recommendation: 'Protect nurseries and harvest-ready produce; check local cyclone and heavy-rain advisories.',
    icon: '⛈️',
  },
  {
    name: 'November', short: 'NOV', season: 'rainy', rainfall: 'Medium', rainy: true,
    temperature: 'Mild to warm; rain may persist in the south',
    water: 'Moderate to good, depending on recent rain',
    crops: 'Rabi rice, chickpea, mustard, vegetables',
    recommendation: 'Use a dry spell for sowing rabi crops and maintain drainage in low-lying plots.',
    icon: '🌦️',
  },
  {
    name: 'December', short: 'DEC', season: 'transition', rainfall: 'Low', rainy: false,
    temperature: 'Cooler and generally drier',
    water: 'Moderate; depends on tank and reservoir storage',
    crops: 'Rabi rice, chickpea, coriander, leafy greens',
    recommendation: 'Plan irrigation from stored water and protect sensitive crops on cooler nights.',
    icon: '🌤️',
  },
]

function RainfallIndicator({ level }) {
  const levelCount = { Low: 1, Medium: 2, High: 3 }[level]

  return (
    <div className="weather-rainfall" aria-label={`Expected rainfall: ${level}`}>
      <div className={`weather-rainfall-bars weather-rainfall-bars--${level.toLowerCase()}`} aria-hidden="true">
        {[1, 2, 3].map((bar) => <span className={bar <= levelCount ? 'is-filled' : ''} key={bar} />)}
      </div>
      <span className="weather-rainfall-label">{level}</span>
    </div>
  )
}

function WeatherCalendarPage() {
  return (
    <main className="page-content weather-page">
      <BackButton />
      <section className="weather-hero">
        <div className="weather-hero-copy">
          <p className="eyebrow"><span aria-hidden="true">✳</span> Grow with the seasons</p>
          <h1>Rainfall &amp; Weather Calendar</h1>
          <p className="weather-intro">
            A month-by-month growing guide for Andhra Pradesh, from summer water planning to monsoon sowing.
          </p>
          <p className="weather-guidance"><span aria-hidden="true">ⓘ</span> General seasonal guidance, not an exact weather forecast.</p>
        </div>
      </section>

      <section className="weather-season-overview" aria-labelledby="season-heading">
        <div className="weather-section-heading">
          <div>
            <p className="eyebrow">The year at a glance</p>
            <h2 id="season-heading">Three growing seasons</h2>
          </div>
          <p>Local rainfall differs between coastal districts, Rayalaseema and upland areas.</p>
        </div>
        <div className="weather-season-grid">
          {Object.entries(seasons).map(([key, season]) => {
            const seasonMonths = months.filter(({ season: monthSeason }) => monthSeason === key)
            return (
              <article className={`weather-season-card weather-season-card--${key}`} key={key}>
                <span className="weather-season-icon" aria-hidden="true">{season.icon}</span>
                <div>
                  <h3>{season.label}</h3>
                  <p>{season.description}</p>
                  <span className="weather-season-months">{seasonMonths.map(({ short }) => short).join(' · ')}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="weather-month-section" aria-labelledby="months-heading">
        <div className="weather-section-heading weather-month-heading">
          <div>
            <p className="eyebrow">January — December</p>
            <h2 id="months-heading">Your monthly field guide</h2>
          </div>
          <div className="weather-rainfall-legend" aria-label="Rainfall indicator legend">
            <span>Rainfall</span>
            <span><i className="weather-legend-dot weather-legend-dot--low" /> Low</span>
            <span><i className="weather-legend-dot weather-legend-dot--medium" /> Medium</span>
            <span><i className="weather-legend-dot weather-legend-dot--high" /> High</span>
          </div>
        </div>

        <div className="weather-month-grid">
          {months.map((month) => (
            <article className={`weather-month-card weather-month-card--${month.season}`} key={month.name}>
              <div className="weather-month-topline">
                <span className="weather-month-icon" aria-hidden="true">{month.icon}</span>
                <span className={`weather-season-tag weather-season-tag--${month.season}`}>{seasons[month.season].label}</span>
              </div>
              <h3>{month.name}</h3>
              <div className="weather-rainfall-row">
                <span className="weather-detail-label">Expected rainfall</span>
                <RainfallIndicator level={month.rainfall} />
              </div>
              <div className={`weather-rain-status${month.rainy ? ' is-rainy' : ''}`}>
                <span aria-hidden="true">{month.rainy ? '🌧️' : '☀️'}</span>
                {month.rainy ? 'Rainy month' : 'Generally non-rainy'}
              </div>
              <dl className="weather-month-details">
                <div>
                  <dt><span aria-hidden="true">🌡️</span> Temperature</dt>
                  <dd>{month.temperature}</dd>
                </div>
                <div>
                  <dt><span aria-hidden="true">💧</span> Water availability</dt>
                  <dd>{month.water}</dd>
                </div>
                <div>
                  <dt><span aria-hidden="true">🌾</span> Suitable crops</dt>
                  <dd>{month.crops}</dd>
                </div>
              </dl>
              <p className="weather-recommendation"><strong>Field tip</strong>{month.recommendation}</p>
            </article>
          ))}
        </div>
      </section>

      <aside className="weather-local-note">
        <span aria-hidden="true">🌿</span>
        <p><strong>Grow for your locality.</strong> These broad seasonal patterns are not forecasts. Actual rain, heat and water supply vary by district and year. Check local agriculture and weather advisories before sowing, irrigation or crop-protection decisions.</p>
      </aside>
    </main>
  )
}

export default WeatherCalendarPage
