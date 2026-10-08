import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { persistProducts, products as storedProducts } from '../data/marketplace.js'
import { useAuth, useCart } from '../context/hooks.js'
import './MarketplacePage.css'

const emptyProduct = {
  name: '',
  category: '',
  price: '',
  stock: '',
  unit: '',
  grower: '',
}

function createProductId(name) {
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'product'
  const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${slug}-${uniqueId}`
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('The selected image could not be read.'))
    }
    reader.onerror = () => reject(new Error('The selected image could not be read.'))
    reader.readAsDataURL(file)
  })
}

function MarketplacePage() {
  const { productId } = useParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [marketplaceProducts, setMarketplaceProducts] = useState(() => [...storedProducts])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formValues, setFormValues] = useState(emptyProduct)
  const [imageFile, setImageFile] = useState(null)
  const [formError, setFormError] = useState('')
  const [pageError, setPageError] = useState('')
  const [notice, setNotice] = useState('')
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { addToCart } = useCart()
  const product = marketplaceProducts.find(({ id }) => id === productId)
  const categoryOptions = [...new Set(marketplaceProducts.map(({ category: itemCategory }) => itemCategory))]
  const filteredProducts = useMemo(() => marketplaceProducts.filter((item) => {
    const matchesSearch = `${item.name} ${item.grower} ${item.category}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (category === 'All' || item.category === category)
  }), [marketplaceProducts, search, category])

  function openProductForm(item = null) {
    if (!isAdmin) return
    setEditingProduct(item)
    setFormValues(item ? {
      name: item.name,
      category: item.category,
      price: String(item.price),
      stock: String(item.stock),
      unit: item.unit,
      grower: item.grower,
    } : emptyProduct)
    setImageFile(null)
    setFormError('')
    setPageError('')
    setNotice('')
    setIsFormOpen(true)
  }

  function closeProductForm() {
    setIsFormOpen(false)
    setEditingProduct(null)
    setImageFile(null)
    setFormError('')
  }

  function saveProductList(nextProducts) {
    persistProducts(nextProducts)
    setMarketplaceProducts([...nextProducts])
  }

  async function handleProductSubmit(event) {
    event.preventDefault()
    if (!isAdmin) return
    setFormError('')
    const name = formValues.name.trim()
    const productCategory = formValues.category.trim()
    const unit = formValues.unit.trim()
    const grower = formValues.grower.trim()
    const price = Number(formValues.price)
    const stock = Number(formValues.stock)

    if (!name || !productCategory || !unit || !grower) {
      setFormError('Complete all required product details.')
      return
    }
    if (!Number.isFinite(price) || price <= 0) {
      setFormError('Enter a price greater than ₹0.')
      return
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setFormError('Enter an available quantity of zero or more whole units.')
      return
    }
    if (!editingProduct && !imageFile) {
      setFormError('Choose a product image before saving.')
      return
    }
    if (imageFile && imageFile.size > 2 * 1024 * 1024) {
      setFormError('Product images must be 2 MB or smaller.')
      return
    }
    if (imageFile && !imageFile.type.startsWith('image/')) {
      setFormError('Choose a valid image file.')
      return
    }

    try {
      const image = imageFile ? await readImage(imageFile) : editingProduct.image
      const updatedProduct = {
        ...(editingProduct || {}),
        id: editingProduct?.id || createProductId(name),
        name,
        category: productCategory,
        price,
        stock,
        unit,
        grower,
        image,
        icon: editingProduct?.icon || '🧺',
        description: editingProduct?.description || `${name}, freshly harvested by ${grower}.`,
      }
      const nextProducts = editingProduct
        ? marketplaceProducts.map((item) => item.id === editingProduct.id ? updatedProduct : item)
        : [...marketplaceProducts, updatedProduct]
      saveProductList(nextProducts)
      closeProductForm()
      setNotice(editingProduct ? `${name} was updated.` : `${name} was added to the Marketplace.`)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'The product could not be saved.')
    }
  }

  function deleteProduct(item) {
    if (!isAdmin) return
    if (!window.confirm(`Delete ${item.name} from the Marketplace?`)) return
    try {
      saveProductList(marketplaceProducts.filter(({ id }) => id !== item.id))
      if (category === item.category && !marketplaceProducts.some((entry) => entry.category === item.category && entry.id !== item.id)) {
        setCategory('All')
      }
      setPageError('')
      setNotice(`${item.name} was deleted.`)
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'The product could not be deleted.')
    }
  }

  if (productId) {
    if (!product) return <main className="page-content"><BackButton fallback="/marketplace" /><h1>Product not found</h1><Link className="primary-btn" to="/marketplace">Browse the marketplace</Link></main>
    return (
      <main className="page-content">
        <BackButton fallback="/marketplace" />
        <article className="detail-panel">
          <div className="detail-art" aria-hidden="true"><img src={product.image} alt={product.name} className="detail-art-image" /></div>
          <div>
            <span className="card-kicker">{product.category} · Grown by {product.grower}</span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p><strong>₹{product.price.toFixed(2)} / {product.unit}</strong> · {product.stock} available</p>
            <button type="button" className="primary-btn" onClick={() => addToCart(product.id)}>Add to cart</button>
            <Link className="secondary-btn" to="/cart">View cart</Link>
          </div>
        </article>
      </main>
    )
  }

  return (
    <main className="page-content">
      <BackButton />
      <div className="page-heading plants-hero marketplace-hero">
        <div><p className="eyebrow">Fresh from your neighbors</p><h1>Local Marketplace</h1><p>Shop seasonal produce grown in nearby community gardens.</p></div>
        <div className="marketplace-heading-actions">
          {isAdmin && <button type="button" className="primary-btn" onClick={() => openProductForm()}>Add Product</button>}
          <Link className="secondary-btn" to="/cart">View cart</Link>
        </div>
      </div>
      <div className="market-tools">
        <label className="search-field">Search products<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Try tomatoes or herbs" /></label>
        <label className="filter-field">Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option>{categoryOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      {notice && <p className="marketplace-notice" role="status">{notice}</p>}
      {pageError && <p className="marketplace-error" role="alert">{pageError}</p>}
      {filteredProducts.length ? (
        <div className="card-grid">
          {filteredProducts.map((item) => (
            <div className="marketplace-product-entry" key={item.id}>
              <ProductCard product={item} />
              {isAdmin && <div className="marketplace-product-management">
                <button type="button" className="text-action" onClick={() => openProductForm(item)}>Edit Product</button>
                <button type="button" className="remove-button" onClick={() => deleteProduct(item)}>Delete</button>
              </div>}
            </div>
          ))}
        </div>
      ) : <p className="empty-state">No products match your search. Try another name or category.</p>}

      {isAdmin && isFormOpen && (
        <div className="marketplace-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeProductForm()
        }}>
          <section className="marketplace-product-modal" role="dialog" aria-modal="true" aria-labelledby="marketplace-product-form-title">
            <div className="marketplace-modal-heading">
              <div><p className="eyebrow">{editingProduct ? 'Manage listing' : 'Grower listing'}</p><h2 id="marketplace-product-form-title">{editingProduct ? 'Edit Product' : 'Add Product'}</h2></div>
              <button type="button" className="marketplace-modal-close" aria-label="Close product form" onClick={closeProductForm}>×</button>
            </div>
            <form className="marketplace-product-form" onSubmit={handleProductSubmit}>
              <label>Product Name<input required maxLength="100" value={formValues.name} onChange={(event) => setFormValues({ ...formValues, name: event.target.value })} autoFocus /></label>
              <label>Category<input required maxLength="60" list="marketplace-category-options" value={formValues.category} onChange={(event) => setFormValues({ ...formValues, category: event.target.value })} /><datalist id="marketplace-category-options">{categoryOptions.map((item) => <option key={item} value={item} />)}</datalist></label>
              <label>Price (₹)<input required type="number" min="0.01" step="0.01" value={formValues.price} onChange={(event) => setFormValues({ ...formValues, price: event.target.value })} /></label>
              <label>Available Quantity<input required type="number" min="0" step="1" value={formValues.stock} onChange={(event) => setFormValues({ ...formValues, stock: event.target.value })} /></label>
              <label>Unit<input required maxLength="30" placeholder="kg, bunch, box, basket..." value={formValues.unit} onChange={(event) => setFormValues({ ...formValues, unit: event.target.value })} /></label>
              <label>Grower/Garden Name<input required maxLength="100" value={formValues.grower} onChange={(event) => setFormValues({ ...formValues, grower: event.target.value })} /></label>
              <label className="marketplace-image-field">Product Image<input type="file" accept="image/*" required={!editingProduct} onChange={(event) => setImageFile(event.target.files?.[0] || null)} />{editingProduct && <span>Choose a new image to replace the current one.</span>}</label>
              {imageFile && <p className="marketplace-image-name" aria-live="polite">Selected: {imageFile.name}</p>}
              {formError && <p className="marketplace-error marketplace-form-error" role="alert">{formError}</p>}
              <div className="marketplace-form-actions">
                <button type="button" className="secondary-btn" onClick={closeProductForm}>Cancel</button>
                <button type="submit" className="primary-btn">{editingProduct ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default MarketplacePage
