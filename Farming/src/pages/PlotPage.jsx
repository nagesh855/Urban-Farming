import { Link, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import { plots } from '../data/plots.js'

function PlotPage() {
  const { plotId } = useParams()
  const plot = plots.find(({ id }) => id === plotId)
  if (plotId) {
    if (!plot) return <main className="page-content"><BackButton fallback="/plots" /><h1>Garden plot not found</h1><Link className="primary-btn" to="/plots">Browse garden plots</Link></main>
    return <main className="page-content"><BackButton fallback="/plots" /><article className="detail-panel"><div className="detail-art" aria-hidden="true"><img src={plot.image} alt="" className="detail-art-image" /></div><div><span className="card-kicker">{plot.location}</span><h1>{plot.name}</h1><p>{plot.description}</p><p>{plot.size} · {plot.availability}</p><Link className="primary-btn" to="/register">Ask about a plot</Link></div></article></main>
  }
  return <main className="page-content"><BackButton /><div className="page-heading plants-hero plots-hero"><div><p className="eyebrow">Find your growing space</p><h1>Community Garden Plots</h1><p>Explore local spaces and find a place to grow.</p></div></div><div className="card-grid">{plots.map((item) => <article className="content-card plot-card" key={item.id}><div className="plot-art" aria-hidden="true"><img src={item.image} alt="" className="plot-art-image" /></div><div className="product-copy"><span className="card-kicker">{item.location}</span><h2>{item.name}</h2><p>{item.size} · {item.availability}</p><Link className="small-primary" to={`/plots/${item.id}`}>View plot details</Link></div></article>)}</div></main>
}

export default PlotPage
