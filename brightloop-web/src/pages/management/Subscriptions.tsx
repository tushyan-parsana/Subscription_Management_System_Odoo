
import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Download,
  X,
  Pause,
  Play,
  Ban,
  RefreshCw,
  Repeat,
  CalendarDays,
  IndianRupee,
} from 'lucide-react'

type Status = 'Active' | 'Trial' | 'Paused' | 'Cancelled'

type Subscription = {
  id: number
  customer: string
  email: string
  plan: string
  amount: number
  startDate: string
  nextBilling: string
  status: Status
}

const initialSubscriptions: Subscription[] = [
  { id: 1001, customer: 'Aarav Mehta', email: 'aarav@example.com', plan: 'Pro Plan', amount: 1499, startDate: '2026-08-01', nextBilling: '2026-11-01', status: 'Active' },
  { id: 1002, customer: 'Diya Shah', email: 'diya@example.com', plan: 'Basic Plan', amount: 499, startDate: '2026-09-12', nextBilling: '2026-11-12', status: 'Active' },
  { id: 1003, customer: 'Rohan Patel', email: 'rohan@example.com', plan: 'Enterprise', amount: 4999, startDate: '2026-10-01', nextBilling: '2026-11-01', status: 'Trial' },
  { id: 1004, customer: 'Ananya Desai', email: 'ananya@example.com', plan: 'Pro Plan', amount: 1499, startDate: '2026-07-15', nextBilling: '2026-11-15', status: 'Paused' },
  { id: 1005, customer: 'Kabir Joshi', email: 'kabir@example.com', plan: 'Basic Plan', amount: 499, startDate: '2026-06-20', nextBilling: '2026-10-20', status: 'Cancelled' },
  { id: 1006, customer: 'Isha Trivedi', email: 'isha@example.com', plan: 'Enterprise', amount: 4999, startDate: '2026-09-05', nextBilling: '2026-11-05', status: 'Active' },
]

const statusStyles: Record<Status, string> = {
  Active: 'bg-emerald-50 text-emerald-700',
  Trial: 'bg-violet-50 text-violet-700',
  Paused: 'bg-amber-50 text-amber-700',
  Cancelled: 'bg-red-50 text-red-700',
}

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [customer, setCustomer] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('Pro Plan')
  const [amount, setAmount] = useState('1499')
  const [nextBilling, setNextBilling] = useState('2026-11-30')

  const filtered = useMemo(() => subscriptions.filter((item) => {
    const matchesSearch =
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.plan.toLowerCase().includes(search.toLowerCase()) ||
      String(item.id).includes(search)

    return matchesSearch && (filter === 'All' || item.status === filter)
  }), [subscriptions, search, filter])

  const activeCount = subscriptions.filter(s => s.status === 'Active').length
  const trialCount = subscriptions.filter(s => s.status === 'Trial').length
  const pausedCount = subscriptions.filter(s => s.status === 'Paused').length
  const monthlyRevenue = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + s.amount, 0)

  function changeStatus(id: number, status: Status) {
    setSubscriptions(current =>
      current.map(item => item.id === id ? { ...item, status } : item)
    )
  }

  function addSubscription(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newSubscription: Subscription = {
      id: Math.max(1000, ...subscriptions.map(s => s.id)) + 1,
      customer,
      email,
      plan,
      amount: Number(amount),
      startDate: new Date().toISOString().slice(0, 10),
      nextBilling,
      status: 'Active',
    }

    setSubscriptions(current => [newSubscription, ...current])
    setShowModal(false)
    setCustomer('')
    setEmail('')
    setPlan('Pro Plan')
    setAmount('1499')
  }

  function exportCSV() {
    const rows = [
      ['ID', 'Customer', 'Email', 'Plan', 'Amount', 'Start Date', 'Next Billing', 'Status'],
      ...filtered.map(s => [
        s.id, s.customer, s.email, s.plan, s.amount,
        s.startDate, s.nextBilling, s.status,
      ]),
    ]

    const csv = rows.map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ).join('\n')

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'brightloop-subscriptions.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
          <p className="text-sm text-slate-500 mt-1">Manage customer subscriptions and recurring billing.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50">
            <Download size={17} /> Export
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20">
            <Plus size={18} /> New Subscription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: 'Total Subscriptions', value: subscriptions.length, icon: Repeat, color: 'blue' },
          { label: 'Active Subscriptions', value: activeCount, icon: RefreshCw, color: 'emerald' },
          { label: 'Trial Subscriptions', value: trialCount, icon: CalendarDays, color: 'violet' },
          { label: 'Monthly Recurring Revenue', value: `₹${monthlyRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'amber' },
        ].map((card) => {
          const Icon = card.icon
          const colorClasses: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600',
            emerald: 'bg-emerald-50 text-emerald-600',
            violet: 'bg-violet-50 text-violet-600',
            amber: 'bg-amber-50 text-amber-600',
          }

          return (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{card.label}</p>
                <div className={`p-2.5 rounded-xl ${colorClasses[card.color]}`}>
                  <Icon size={20} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-4">{card.value}</h2>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between">
          <div>
            <h2 className="font-bold text-slate-900">All Subscriptions</h2>
            <p className="text-xs text-slate-500 mt-1">{filtered.length} subscriptions found</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl">
              <Search size={17} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search subscriptions..."
                className="outline-none text-sm w-full sm:w-52"
              />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none">
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Paused">Paused</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Start Date</th>
                <th className="px-6 py-4 font-semibold">Next Billing</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm text-slate-800">{item.customer}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.email}</p>
                    <p className="text-xs text-slate-400">#{item.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{item.plan}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{item.amount.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400"> /mo</span></td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.startDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.nextBilling}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.status === 'Active' && (
                        <button title="Pause" onClick={() => changeStatus(item.id, 'Paused')} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50">
                          <Pause size={16} />
                        </button>
                      )}
                      {item.status === 'Paused' && (
                        <button title="Resume" onClick={() => changeStatus(item.id, 'Active')} className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50">
                          <Play size={16} />
                        </button>
                      )}
                      {item.status !== 'Cancelled' && (
                        <button title="Cancel" onClick={() => changeStatus(item.id, 'Cancelled')} className="p-2 rounded-lg text-red-500 hover:bg-red-50">
                          <Ban size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create Subscription</h2>
                <p className="text-sm text-slate-500 mt-1">Add a new customer subscription.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addSubscription} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input required value={customer} onChange={e => setCustomer(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100" placeholder="Enter customer name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100" placeholder="customer@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                  <select value={plan} onChange={e => {
                    setPlan(e.target.value)
                    setAmount(e.target.value === 'Basic Plan' ? '499' : e.target.value === 'Pro Plan' ? '1499' : '4999')
                  }} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none">
                    <option>Basic Plan</option>
                    <option>Pro Plan</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Amount (₹)</label>
                  <input required min="1" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Next Billing Date</label>
                <input required type="date" value={nextBilling} onChange={e => setNextBilling(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Create Subscription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400">
        Demo data only. Subscription changes are currently stored in browser memory and are not yet synced with Odoo.
      </p>
    </div>
  )
}

export default Subscriptions
