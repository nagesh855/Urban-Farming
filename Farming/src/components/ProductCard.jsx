import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/hooks.js'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  function buyNow() {
    addToCart(product.id)
    navigate('/cart')
  }

  return (
    <article className="content-card product-card">
      <Link className="product-art" to={`/marketplace/${product.id}`} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.name} className="product-art-image" />
      </Link>
      <div className="product-copy">
        <span className="card-kicker">{product.category} · {product.stock} available</span>
        <h2><Link to={`/marketplace/${product.id}`}>{product.name}</Link></h2>
        <p>{product.grower}</p>
        <div className="card-actions marketplace-card-actions">
          <strong>₹{product.price.toFixed(2)} <small>/ {product.unit}</small></strong>
          <div className="marketplace-card-buttons">
            <button type="button" className="small-primary" onClick={() => addToCart(product.id)}>Add to cart</button>
            <button type="button" className="small-primary marketplace-buy-now" onClick={buyNow}>Buy Now</button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
