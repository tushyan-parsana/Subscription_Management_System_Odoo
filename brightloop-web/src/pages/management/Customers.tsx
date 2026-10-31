
import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Download,
  Users,
  Mail,
  Phone,
  MoreHorizontal,
  X,
} from 'lucide-react'

type Customer = {
  id: number
  name: string
  email: string
  phone: string
  company: string
  plan: string
  status: 'Active' | 'Inactive'
  joined: string
}

const initialCustomers: Customer[] = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@company.com', phone: '+91 98765 43210', company: 'TechNova Solutions', plan: 'Enterprise', status: 'Active', joined: '12 Oct 2026' },
  { id: 2, name: 'Priya Mehta', email: 'priya@studio.com', phone: '+91 98765 12345', company: 'Creative Studio', plan: 'Professional', status: 'Active', joined: '08 Oct 2026' },
  { id: 3, name: 'Rahul Verma', email: 'rahul@agency.com', phone: '+91 98765 67890', company: 'Growth Agency', plan: 'Starter', status: 'Inactive', joined: '05 Oct 2026' },
  { id: 4, name: 'Ananya Patel', email: 'ananya@business.com', phone: '+91 98765 11223', company: 'Patel Enterprises', plan: 'Enterprise', status: 'Active', joined: '02 Oct 2026' },
  { id: 5, name: 'Karan Shah', email: 'karan@digital.com', phone: '+91 98765 44556', company: 'Digital Works', plan: 'Professional', status: 'Active', joined: '28 Sep 2026' },
  { id: 6, name: 'Neha Desai', email: 'neha@startup.com', phone: '+91 98765 77889', company: 'NextGen Startup', plan: 'Starter', status: 'Inactive', joined: '25 Sep 2026' },
]

function Customers() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<Customer | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  })

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch = `${customer.name} ${customer.email} ${customer.company}`
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesFilter = filter === 'All' || customer.status === filter
      return matchesSearch && matchesFilter
    })
  }, [customers, search, filter])

  function addCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newCustomer: Customer = {
      id: Date.now(),
      ...form,
      plan: 'No plan',
      status: 'Active',
      joined: new Date().toLocaleDateString('en-IN'),
    }

    setCustomers((current) => [newCustomer, ...current])
    setForm({ name: '', email: '', phone: '', company: '' })
    setShowForm(false)
  }

  function exportCustomers() {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Plan', 'Status']
    const rows = filteredCustomers.map((c) =>
      [c.name, c.email, c.phone, c.company, c.plan, c.status]
        .map((value) => `"${value.replace(/"/g, '""')}"`)
        .join(',')
    )

    const csv = [headers.join(','), ...rows].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'brightloop-customers.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">CUSTOMER MANAGEMENT</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your customer relationships and account details.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={exportCustomers} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Download size={17} /> Export
          </button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <Plus size={18} /> Add customer
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: 'Total customers', value: customers.length, icon: Users },
          { label: 'Active customers', value: customers.filter(c => c.status === 'Active').length, icon: Users },
          { label: 'Inactive customers', value: customers.filter(c => c.status === 'Inactive').length, icon: Users },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Icon size={21} /></div>
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</h2>
            </div>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">All customers</h2>
            <p className="mt-1 text-sm text-slate-500">{filteredCustomers.length} customers found</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Search size={17} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full text-sm outline-none sm:w-52"
              />
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none">
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{customer.name}</p>
                        <p className="text-xs text-slate-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{customer.company}</td>
                  <td className="px-6 py-4 text-slate-600">{customer.plan}</td>
                  <td className="px-6 py-4 text-slate-500">{customer.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(customer)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600" title="View customer">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No customers found. Try another search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form onSubmit={addCustomer} className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add customer</h2>
                <p className="mt-1 text-sm text-slate-500">Enter the customer's details.</p>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>

            {[
              { key: 'name', label: 'Full name', placeholder: 'Customer name', type: 'text' },
              { key: 'email', label: 'Email address', placeholder: 'name@company.com', type: 'email' },
              { key: 'phone', label: 'Phone number', placeholder: '+91 ...', type: 'tel' },
              { key: 'company', label: 'Company', placeholder: 'Company name', type: 'text' },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
                <input
                  required
                  type={field.type}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600">Cancel</button>
              <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Save customer</button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Customer details</h2>
              <button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                {selected.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-bold text-slate-900">{selected.name}</p>
                <p className="text-sm text-slate-500">{selected.company}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              <p className="flex items-center gap-3 text-slate-600"><Mail size={17} /> {selected.email}</p>
              <p className="flex items-center gap-3 text-slate-600"><Phone size={17} /> {selected.phone}</p>
              <p className="text-slate-600">Plan: <strong>{selected.plan}</strong></p>
              <p className="text-slate-600">Status: <strong>{selected.status}</strong></p>
              <p className="text-slate-600">Joined: <strong>{selected.joined}</strong></p>
            </div>
            <button onClick={() => setSelected(null)} className="mt-7 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
