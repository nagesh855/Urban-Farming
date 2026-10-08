const initialProducts = [
  { id: 'cherry-tomatoes', name: 'Organic Cherry Tomatoes', category: 'Vegetables', price: 4.5, unit: 'basket', stock: 18, icon: '🍅', image: '/images/marketplace/cherry-tomatoes.jpg', grower: 'Meadow Lane Garden', description: 'Sun-ripened cherry tomatoes, harvested fresh this morning.' },
  { id: 'rainbow-lettuce', name: 'Rainbow Lettuce Mix', category: 'Greens', price: 3.2, unit: 'bundle', stock: 12, icon: '🥬', image: '/images/marketplace/rainbow-lettuce.jpg', grower: 'North Terrace Growers', description: 'A crisp mix of tender, colorful seasonal lettuces.' },
  { id: 'sweet-peppers', name: 'Sweet Pepper Box', category: 'Vegetables', price: 5.8, unit: 'box', stock: 9, icon: '🫑', image: '/images/marketplace/sweet-peppers.jpg', grower: 'Sunrise Community Plot', description: 'Bright, sweet peppers picked at peak ripeness.' },
  { id: 'fresh-herbs', name: 'Fresh Herb Bundle', category: 'Herbs', price: 2.75, unit: 'bundle', stock: 15, icon: '🌿', image: '/images/marketplace/fresh-herbs.jpg', grower: 'Meadow Lane Garden', description: 'A fragrant bundle of basil, parsley, and mint.' },
  { id: 'strawberries', name: 'Garden Strawberries', category: 'Fruit', price: 6.25, unit: 'punnet', stock: 7, icon: '🍓', image: '/images/marketplace/strawberries.jpg', grower: 'Riverside Urban Farm', description: 'Sweet, locally grown strawberries picked by hand.' },
  { id: 'carrots', name: 'Rainbow Carrots', category: 'Vegetables', price: 3.85, unit: 'bunch', stock: 11, icon: '🥕', image: '/images/marketplace/carrots.jpg', grower: 'North Terrace Growers', description: 'Colorful, crunchy carrots with fresh leafy tops.' },
]

const PRODUCTS_STORAGE_KEY = 'urbanfarming-marketplace-products'

function readProducts() {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    const savedProducts = stored ? JSON.parse(stored) : null
    if (Array.isArray(savedProducts) && savedProducts.every((product) => (
      product
      && typeof product.id === 'string'
      && typeof product.name === 'string'
      && typeof product.category === 'string'
      && Number.isFinite(product.price)
      && typeof product.unit === 'string'
      && Number.isFinite(product.stock)
      && typeof product.image === 'string'
      && typeof product.grower === 'string'
    ))) return savedProducts
  } catch {
    return initialProducts
  }
  return initialProducts
}

export const products = readProducts()

export function persistProducts(nextProducts) {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(nextProducts))
  products.splice(0, products.length, ...nextProducts)
}

export const categories = ['All', ...new Set(products.map(({ category }) => category))]
