
import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Download,
  X,
  FileText,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react'

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Cancelled'

type Invoice = {
  id: string
  customer: string
  email: string
  amount: number
  issueDate: string
  dueDate: string
  status: InvoiceStatus
}

const initialInvoices: Invoice[] = [
  { id: 'INV-2026-001', customer: 'Aarav Mehta', email: 'aarav@example.com', amount: 1499, issueDate: '2026-10-01', dueDate: '2026-10-10', status: 'Paid' },
  { id: 'INV-2026-002', customer: 'Diya Shah', email: 'diya@example.com', amount: 499, issueDate: '2026-10-05', dueDate: '2026-11-05', status: 'Pending' },
  { id: 'INV-2026-003', customer: 'Rohan Patel', email: 'rohan@example.com', amount: 4999, issueDate: '2026-09-01', dueDate: '2026-09-10', status: 'Overdue' },
  { id: 'INV-2026-004', customer: 'Ananya Desai', email: 'ananya@example.com', amount: 1499, issueDate: '2026-10-08', dueDate: '2026-10-18', status: 'Paid' },
  { id: 'INV-2026-005', customer: 'Kabir Joshi', email: 'kabir@example.com', amount: 499, issueDate: '2026-10-10', dueDate: '2026-10-20', status: 'Cancelled' },
  { id: 'INV-2026-006', customer: 'Isha Trivedi', email: 'isha@example.com', amount: 4999, issueDate: '2026-10-15', dueDate: '2026-11-15', status: 'Pending' },
]

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: 'bg-emerald-50 text-emerald-700',
  Pending: 'bg-amber-50 text-amber-700',
  Overdue: 'bg-red-50 text-red-700',
  Cancelled: 'bg-slate-100 text-slate-600',
}

function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const [customer, setCustomer] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [issueDate, setIssueDate] = useState('2026-10-31')
  const [dueDate, setDueDate] = useState('2026-11-10')

  const filtered = useMemo(() => invoices.filter(invoice => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(search.toLowerCase()) ||
      invoice.email.toLowerCase().includes(search.toLowerCase())

    return matchesSearch && (filter === 'All' || invoice.status === filter)
  }), [invoices, search, filter])

  const paidAmount = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0)

  const pendingAmount = invoices
    .filter(i => i.status === 'Pending')
    .reduce((sum, i) => sum + i.amount, 0)

  const overdueCount = invoices.filter(i => i.status === 'Overdue').length

  function markAsPaid(id: string) {
    setInvoices(current =>
      current.map(invoice =>
        invoice.id === id ? { ...invoice, status: 'Paid' } : invoice
      )
    )
    setSelectedInvoice(null)
  }

  function createInvoice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newInvoice: Invoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      customer,
      email,
      amount: Number(amount),
      issueDate,
      dueDate,
      status: 'Pending',
    }

    setInvoices(current => [newInvoice, ...current])
    setShowModal(false)
    setCustomer('')
    setEmail('')
    setAmount('')
  }

  function exportCSV() {
    const rows = [
      ['Invoice ID', 'Customer', 'Email', 'Amount', 'Issue Date', 'Due Date', 'Status'],
      ...filtered.map(i => [
        i.id, i.customer, i.email, i.amount, i.issueDate, i.dueDate, i.status,
      ]),
    ]

    const csv = rows.map(row =>
      row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ).join('\n')

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'brightloop-invoices.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const stats = [
    { label: 'Total Invoices', value: invoices.length, icon: FileText, color: 'blue' },
    { label: 'Paid Amount', value: `₹${paidAmount.toLocaleString('en-IN')}`, icon: CheckCircle, color: 'emerald' },
    { label: 'Pending Amount', value: `₹${pendingAmount.toLocaleString('en-IN')}`, icon: Clock, color: 'amber' },
    { label: 'Overdue Invoices', value: overdueCount, icon: AlertCircle, color: 'red' },
  ]

  const colorStyles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wider text-blue-600">BILLING MANAGEMENT</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Create, track and manage customer invoices.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50">
            <Download size={17} /> Export
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
            <Plus size={18} /> Create Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">{item.label}</p>
                <div className={`p-2.5 rounded-xl ${colorStyles[item.color]}`}>
                  <Icon size={20} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-4">{item.value}</h2>
            </div>
          )
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">All Invoices</h2>
            <p className="text-xs text-slate-500 mt-1">{filtered.length} invoices found</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl">
              <Search size={17} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search invoices..."
                className="outline-none text-sm w-full sm:w-52"
              />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none">
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Issue Date</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-blue-600">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{invoice.customer}</p>
                    <p className="text-xs text-slate-400 mt-1">{invoice.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                    ₹{invoice.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{invoice.issueDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{invoice.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelectedInvoice(invoice)} title="View invoice" className="p-2 rounded-lg text-blue-600 hover:bg-blue-50">
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-slate-400">No invoices found.</td>
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
                <h2 className="text-lg font-bold text-slate-900">Create Invoice</h2>
                <p className="text-sm text-slate-500 mt-1">Enter customer and billing details.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={createInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input required value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Enter customer name" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="customer@example.com" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Amount (₹)</label>
                <input required min="1" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
                  <input required type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input required type="date" min={issueDate} value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-blue-600">INVOICE DETAILS</p>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedInvoice.id}</h2>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="mt-6 space-y-4">
              <div><p className="text-xs text-slate-400">Customer</p><p className="font-semibold text-slate-800">{selectedInvoice.customer}</p><p className="text-sm text-slate-500">{selectedInvoice.email}</p></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Amount</span><strong>₹{selectedInvoice.amount.toLocaleString('en-IN')}</strong></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Issue date</span><span className="text-sm">{selectedInvoice.issueDate}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500">Due date</span><span className="text-sm">{selectedInvoice.dueDate}</span></div>
              <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Status</span><span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyles[selectedInvoice.status]}`}>{selectedInvoice.status}</span></div>
            </div>
            <div className="mt-7 flex gap-3">
              {selectedInvoice.status !== 'Paid' && selectedInvoice.status !== 'Cancelled' && (
                <button onClick={() => markAsPaid(selectedInvoice.id)} className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-emerald-700">
                  Mark as Paid
                </button>
              )}
              <button onClick={() => setSelectedInvoice(null)} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400">Demo data only. Invoice records and payment updates are not yet synced with Odoo.</p>
    </div>
  )
}

export default Invoices
