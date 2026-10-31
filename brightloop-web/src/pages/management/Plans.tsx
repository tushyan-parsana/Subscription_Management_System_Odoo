
import { useMemo, useState } from 'react'
import {
  Plus, Search, Download, Pencil, Trash2, X,
  CheckCircle2, Layers, IndianRupee
} from 'lucide-react'

type Plan = {
  id: number
  name: string
  description: string
  price: number
  interval: 'Monthly' | 'Quarterly' | 'Yearly'
  features: string
  status: 'Active' | 'Inactive'
}

const initialPlans: Plan[] = [
  { id: 1, name: 'Starter', description: 'For individuals and small teams', price: 499, interval: 'Monthly', features: 'Basic dashboard, 5 users, Email support', status: 'Active' },
  { id: 2, name: 'Professional', description: 'For growing businesses', price: 1499, interval: 'Monthly', features: 'Advanced analytics, 25 users, Priority support', status: 'Active' },
  { id: 3, name: 'Business', description: 'For established teams', price: 4999, interval: 'Quarterly', features: 'Custom reports, 100 users, Integrations', status: 'Active' },
  { id: 4, name: 'Enterprise', description: 'Complete business solution', price: 14999, interval: 'Yearly', features: 'Unlimited users, Dedicated support, API access', status: 'Active' },
]

const emptyForm = {
  name: '',
  description: '',
  price: '',
  interval: 'Monthly' as Plan['interval'],
  features: '',
  status: 'Active' as Plan['status'],
}

function Plans() {
  const [plans, setPlans] = useState(initialPlans)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const filteredPlans = useMemo(() => plans.filter(plan => {
    const matchesSearch = `${plan.name} ${plan.description}`
      .toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filter === 'All' || plan.status === filter
    return matchesSearch && matchesStatus
  }), [plans, search, filter])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (plan: Plan) => {
    setEditingId(plan.id)
    setForm({
      name: plan.name,
      description: plan.description,
      price: String(plan.price),
      interval: plan.interval,
      features: plan.features,
      status: plan.status,
    })
    setShowForm(true)
  }

  const savePlan = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const price = Number(form.price)
    if (!form.name.trim() || !Number.isFinite(price) || price <= 0) return

    if (editingId !== null) {
      setPlans(current => current.map(plan =>
        plan.id === editingId ? { ...plan, ...form, price } : plan
      ))
    } else {
      setPlans(current => [...current, { id: Date.now(), ...form, price }])
    }

    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const deletePlan = (id: number) => {
    if (window.confirm('Delete this plan?')) {
      setPlans(current => current.filter(plan => plan.id !== id))
    }
  }

  const exportCSV = () => {
    const rows = [
      ['Plan', 'Description', 'Price', 'Billing', 'Features', 'Status'],
      ...filteredPlans.map(plan => [
        plan.name, plan.description, String(plan.price),
        plan.interval, plan.features, plan.status
      ])
    ]
    const csv = rows.map(row =>
      row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')
    ).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'brightloop-plans.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const activeCount = plans.filter(plan => plan.status === 'Active').length

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage pricing plans for your customers.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50">
            <Download size={17} /> Export
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
            <Plus size={18} /> Create Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Total Plans</p>
            <Layers size={20} className="text-blue-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-slate-900">{plans.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Active Plans</p>
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-emerald-600">{activeCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">Inactive Plans</p>
            <IndianRupee size={20} className="text-slate-400" />
          </div>
          <p className="text-3xl font-bold mt-2 text-slate-500">{plans.length - activeCount}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plans..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Billing</th>
                <th className="px-6 py-4">Features</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlans.map(plan => (
                <tr key={plan.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm text-slate-800">{plan.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{plan.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{plan.interval}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">{plan.features}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${plan.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      <CheckCircle2 size={13} /> {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(plan)} title="Edit" className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Pencil size={16} /></button>
                      <button onClick={() => deletePlan(plan.id)} title="Delete" className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPlans.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-500">No plans found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
          Showing {filteredPlans.length} of {plans.length} plans
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Plan' : 'Create Plan'}</h2>
                <p className="text-sm text-slate-500 mt-1">Enter plan details and pricing.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
            </div>
            <form onSubmit={savePlan} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="e.g. Professional" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Short plan description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input required type="number" min="0.01" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="1499" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Billing Interval</label>
                  <select value={form.interval} onChange={e => setForm({ ...form, interval: e.target.value as Plan['interval'] })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
                    <option>Monthly</option><option>Quarterly</option><option>Yearly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Features</label>
                <textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="List the plan features" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Plan['status'] })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">{editingId ? 'Save Changes' : 'Create Plan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Plans
