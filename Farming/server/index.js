import 'dotenv/config'
import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Dashboard from './models/Dashboard.js'
import User from './models/User.js'

const app = express()
const port = Number(process.env.PORT || 5000)
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/urbanharvest'
const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const deriveKey = promisify(scrypt)
const tokenLifetimeSeconds = 60 * 60 * 24

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.includes(origin))
  },
}))
app.use(express.json())

function tokenSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('Set AUTH_TOKEN_SECRET to a random value of at least 32 characters.')
  }
  return secret
}

function createToken(user) {
  const payload = Buffer.from(JSON.stringify({
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + tokenLifetimeSeconds,
  })).toString('base64url')
  const signature = createHmac('sha256', tokenSecret()).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

function readToken(token) {
  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra) return null
  let expected
  try {
    expected = createHmac('sha256', tokenSecret()).update(payload).digest()
    const supplied = Buffer.from(signature, 'base64url')
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null
    const user = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (typeof user.email !== 'string' || !['user', 'admin'].includes(user.role) || user.exp <= Date.now() / 1000) return null
    return user
  } catch {
    return null
  }
}

function authenticate(req, res, next) {
  const authorization = req.get('authorization') || ''
  const match = authorization.match(/^Bearer ([^\s]+)$/)
  const user = match ? readToken(match[1]) : null
  if (!user) {
    res.status(401).json({ error: 'A valid sign-in is required.' })
    return
  }
  req.authUser = user
  next()
}

function secureStringEqual(actual, expected) {
  if (typeof actual !== 'string' || typeof expected !== 'string') return false
  const actualHash = createHmac('sha256', 'urbanfarming-login-check').update(actual).digest()
  const expectedHash = createHmac('sha256', 'urbanfarming-login-check').update(expected).digest()
  return timingSafeEqual(actualHash, expectedHash) && actual.length === expected.length
}

app.post('/api/auth/register', async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = req.body?.password
  if (name.length < 2 || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    res.status(400).json({ error: 'Enter a valid name and email address.' })
    return
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    res.status(400).json({ error: 'Password must be between 8 and 128 characters.' })
    return
  }

  try {
    tokenSecret()
    const salt = randomBytes(16).toString('hex')
    const passwordHash = (await deriveKey(password, salt, 64)).toString('hex')
    const user = await User.create({ name, email, passwordHash, passwordSalt: salt })
    res.status(201).json({ message: 'Account created. Sign in to continue.', user: { name: user.name, email: user.email } })
  } catch (error) {
    if (error?.code === 11000) {
      res.status(409).json({ error: 'An account with this email already exists.' })
      return
    }
    if (error.message?.startsWith('Set AUTH_TOKEN_SECRET')) {
      res.status(503).json({ error: 'Account authentication is not configured on the server.' })
      return
    }
    console.error('Failed to register account:', error)
    res.status(500).json({ error: 'Account registration failed.' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = req.body?.password
  if (!email || typeof password !== 'string') {
    res.status(400).json({ error: 'Email and password are required.' })
    return
  }
  try {
    const user = await User.findOne({ email }).select('+passwordHash +passwordSalt')
    if (!user) {
      res.status(401).json({ error: 'Email or password is incorrect.' })
      return
    }
    const passwordHash = (await deriveKey(password, user.passwordSalt, 64)).toString('hex')
    if (!secureStringEqual(passwordHash, user.passwordHash)) {
      res.status(401).json({ error: 'Email or password is incorrect.' })
      return
    }
    res.json({
      token: createToken({ email: user.email, name: user.name, role: 'user' }),
      user: { name: user.name, email: user.email, role: 'user' },
    })
  } catch (error) {
    if (error.message?.startsWith('Set AUTH_TOKEN_SECRET')) {
      res.status(503).json({ error: 'Account authentication is not configured on the server.' })
      return
    }
    console.error('Failed to sign in account:', error)
    res.status(500).json({ error: 'Sign in failed.' })
  }
})

app.post('/api/auth/admin/login', (req, res) => {
  const { ADMIN_EMAIL: adminEmail, ADMIN_PASSWORD: adminPassword } = process.env
  if (!adminEmail || !adminPassword) {
    res.status(503).json({ error: 'Admin sign-in is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in the backend environment.' })
    return
  }
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const password = req.body?.password
  if (!secureStringEqual(email, adminEmail.trim().toLowerCase()) || !secureStringEqual(password, adminPassword)) {
    res.status(401).json({ error: 'Email or password is incorrect.' })
    return
  }
  try {
    const user = { email, name: 'Administrator', role: 'admin' }
    res.json({ token: createToken(user), user })
  } catch (error) {
    res.status(503).json({ error: error.message })
  }
})

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: { name: req.authUser.name, email: req.authUser.email, role: req.authUser.role } })
})

app.get('/api/admin/access', authenticate, (req, res) => {
  if (req.authUser.role !== 'admin') {
    res.status(403).json({ error: 'Admin access is required.' })
    return
  }
  res.json({ status: 'ok', role: 'admin' })
})

const dashboardData = {
  stats: [
    { label: 'Active garden plots', value: '184', delta: '+24 this month' },
    { label: 'Crop yield tracked', value: '9.4t', delta: '+16% vs last cycle' },
    { label: 'Community members', value: '2,480', delta: '+180 new growers' },
    { label: 'Marketplace revenue', value: '$18.6k', delta: '+32% this season' },
  ],
  roles: [
    { icon: '🌱', title: 'Grower', description: 'Manage plots, track harvests, and optimize crop schedules with weather insights.' },
    { icon: '🤝', title: 'Community Coordinator', description: 'Coordinate volunteers, events, and shared resource requests across neighborhoods.' },
    { icon: '🛒', title: 'Buyer', description: 'Browse hyperlocal produce, place orders, and support regenerative urban agriculture.' },
    { icon: '👑', title: 'Admin', description: 'Monitor operations, approve bookings, and manage payments and permissions centrally.' },
  ],
  features: [
    { icon: '🏠', title: 'Smart Home Dashboard', description: 'See field health, upcoming tasks, and community activity in one workspace.' },
    { icon: '📅', title: 'Plot Booking', description: 'Reserve raised beds, greenhouse space, and collaborative garden zones instantly.' },
    { icon: '☀️', title: 'Weather Crop Planner', description: 'Match planting dates to local climate data and seasonal growth trends.' },
    { icon: '🌾', title: 'Harvest Tracking', description: 'Record yields, monitor inventory, and forecast the next harvest cycle.' },
    { icon: '🛍️', title: 'Marketplace', description: 'Sell produce directly to nearby families, cafes, and community buyers.' },
    { icon: '♻️', title: 'Resource Sharing', description: 'Trade compost, tools, and surplus materials with neighbors and growers.' },
  ],
  marketplace: [
    { name: 'Organic Cherry Tomatoes', price: '$4.50 / basket', stock: '18 baskets left' },
    { name: 'Rainbow Lettuce Mix', price: '$3.20 / bundle', stock: '12 bundles left' },
    { name: 'Sweet Pepper Box', price: '$5.80 / box', stock: '9 boxes left' },
  ],
  tasks: [
    { title: 'Watering rotation', detail: 'North terrace plots • 9:00 AM' },
    { title: 'Compost pickup', detail: 'Community hub • 1:30 PM' },
    { title: 'Seedling handoff', detail: 'Greenhouse 2 • Ready for pickup' },
  ],
  forum: [
    { title: 'Best low-water crops for summer', tag: 'Gardening Tips' },
    { title: 'Volunteer day recap', tag: 'Community News' },
    { title: 'Sharing compost bin schedule', tag: 'Resource Hub' },
  ],
}

app.get('/api/dashboard', async (_req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ key: 'homepage' })
      .select('-_id stats roles features marketplace tasks forum')
      .lean()

    if (!dashboard) {
      res.status(503).json({ error: 'Dashboard data is not initialized' })
      return
    }

    res.json(dashboard)
  } catch (error) {
    console.error('Failed to load dashboard data from MongoDB:', error)
    res.status(500).json({ error: 'Failed to load dashboard data' })
  }
})

app.get('/api/health', (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'error',
    service: 'urban-farming-api',
    database: databaseConnected ? 'connected' : 'disconnected',
  })
})

try {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  console.log(`Connected to MongoDB database "${mongoose.connection.name}"`)

  const dashboardExists = await Dashboard.exists({ key: 'homepage' })
  if (!dashboardExists) {
    await Dashboard.create({ key: 'homepage', ...dashboardData })
    console.log('Initialized the MongoDB dashboard document with existing starter data')
  }

  app.listen(port, () => {
    console.log(`Urban Farming API listening on http://localhost:${port}`)
  })
} catch (error) {
  console.error('Failed to start the API with MongoDB:', error)
  process.exitCode = 1
}
