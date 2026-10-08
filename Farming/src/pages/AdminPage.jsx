import { useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { useAdmin } from '../context/hooks.js'

const initialRecords = {
  users: [{ id: 'admin-demo-grower', name: 'Sample grower', detail: 'grower@example.test', status: 'Active' }],
  products: [{ id: 'admin-demo-produce', name: 'Sample harvest listing', detail: 'Local demo record', status: 'Available' }],
  plots: [{ id: 'admin-demo-plot', name: 'Sample garden plot', detail: 'Northside demo record', status: 'Open' }],
}

const tabs = ['users', 'products', 'plots']

function AdminPage() {
  const { adminRecords, setAdminRecords } = useAdmin()
  const [tab, setTab] = useState('users')
  const [name, setName] = useState('')
  const [detail, setDetail] = useState('')
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')
  const records = adminRecords || initialRecords

  function submit(event) {
    event.preventDefault()
    if (name.trim().length < 2 || detail.trim().length < 2) {
      setError('Enter a name and detail with at least 2 characters.')
      return
    }
    const current = records[tab]
    const updated = editingId
      ? current.map((record) => record.id === editingId ? { ...record, name: name.trim(), detail: detail.trim() } : record)
      : [...current, { id: `${tab}-${Date.now()}`, name: name.trim(), detail: detail.trim(), status: 'Active' }]
    setAdminRecords({ ...records, [tab]: updated })
    setName('')
    setDetail('')
    setEditingId('')
    setError('')
  }

  function edit(record) {
    setEditingId(record.id)
    setName(record.name)
    setDetail(record.detail)
  }

  function remove(id) {
    setAdminRecords({ ...records, [tab]: records[tab].filter((record) => record.id !== id) })
    if (editingId === id) {
      setEditingId('')
      setName('')
      setDetail('')
    }
  }

  return (
    <main className="page-content">
      <BackButton />
      <div className="page-heading"><div><p className="eyebrow">Protected workspace</p><h1>Admin dashboard</h1><p>Manage sample records. These CRUD changes are saved in this browser; they do not modify production data.</p></div><span className="admin-status">Authenticated</span></div>
      <div className="admin-tabs" role="tablist" aria-label="Admin sections">
        {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'admin-tab admin-tab--active' : 'admin-tab'} onClick={() => { setTab(item); setEditingId(''); setName(''); setDetail(''); setError('') }}>{item}</button>)}
      </div>
      <div className="admin-layout">
        <section className="admin-records" aria-label={`${tab} records`}>
          <h2>{tab[0].toUpperCase() + tab.slice(1)} <span>{records[tab].length}</span></h2>
          {records[tab].map((record) => (
            <article className="admin-record" key={record.id}>
              <div><strong>{record.name}</strong><span>{record.detail} · {record.status}</span></div>
              <div className="admin-record-actions">
                <button className="text-action" type="button" onClick={() => edit(record)}>Edit</button>
                <button className="remove-button" type="button" onClick={() => remove(record.id)}>Delete</button>
              </div>
            </article>
          ))}
          {!records[tab].length && <p className="empty-state">No records yet. Add one using the form.</p>}
        </section>
        <form className="stacked-form content-card admin-form" onSubmit={submit} noValidate>
          <h2>{editingId ? 'Edit' : 'Add'} {tab.slice(0, -1)}</h2>
          <label htmlFor="admin-name">Name</label><input id="admin-name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} />
          <label htmlFor="admin-detail">{tab === 'users' ? 'Email or role' : 'Description or location'}</label><input id="admin-detail" value={detail} onChange={(event) => setDetail(event.target.value)} required minLength={2} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-btn" type="submit">{editingId ? 'Save changes' : 'Add record'}</button>
          {editingId && <button className="secondary-btn" type="button" onClick={() => { setEditingId(''); setName(''); setDetail('') }}>Cancel edit</button>}
        </form>
      </div>
    </main>
  )
}

export default AdminPage
