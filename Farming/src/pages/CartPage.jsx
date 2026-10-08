import { useState } from 'react'
import { Link } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import { useCart } from '../context/hooks.js'
import { products } from '../data/marketplace.js'

function CartPage() {
  const { cart, setCartQuantity, clearCart } = useCart()
  const [message, setMessage] = useState('')
  const items = cart.map((entry) => ({ ...entry, product: products.find(({ id }) => id === entry.id) })).filter(({ product }) => product)
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  function checkout() {
    clearCart()
    setMessage('Demo checkout complete. No payment was processed.')
  }

  return (
    <main className="page-content">
      <BackButton fallback="/marketplace" />
      <div className="page-heading"><div><p className="eyebrow">Your harvest basket</p><h1>Shopping Cart</h1></div><Link to="/marketplace" className="text-link">Continue shopping →</Link></div>
      {message && <p className="form-success" role="status">{message}</p>}
      {!items.length ? <div className="empty-state"><p>Your cart is empty.</p><Link className="primary-btn" to="/marketplace">Explore local produce</Link></div> : (
        <div className="cart-layout">
          <div className="cart-items">{items.map(({ id, quantity, product }) => (
            <article className="cart-row" key={id}>
              <span className="cart-product-icon" aria-hidden="true">{product.icon}</span>
              <div className="cart-product-copy"><Link to={`/marketplace/${id}`}>{product.name}</Link><span>${product.price.toFixed(2)} / {product.unit}</span></div>
              <div className="quantity-control" aria-label={`Quantity of ${product.name}`}>
                <button type="button" aria-label={`Remove one ${product.name}`} onClick={() => setCartQuantity(id, quantity - 1)}>−</button>
                <span>{quantity}</span>
                <button type="button" aria-label={`Add one ${product.name}`} disabled={quantity >= product.stock} onClick={() => setCartQuantity(id, quantity + 1)}>+</button>
              </div>
              <strong>${(product.price * quantity).toFixed(2)}</strong>
              <button type="button" className="remove-button" onClick={() => setCartQuantity(id, 0)}>Remove</button>
            </article>
          ))}</div>
          <aside className="cart-summary"><h2>Order summary</h2><p><span>Subtotal</span><strong>${total.toFixed(2)}</strong></p><p><span>Pickup</span><span>Arrange with grower</span></p><hr /><p className="cart-total"><span>Total</span><strong>${total.toFixed(2)}</strong></p><button type="button" className="primary-btn" onClick={checkout}>Place demo order</button><small>No payment or real order is processed.</small></aside>
        </div>
      )}
    </main>
  )
}

export default CartPage
