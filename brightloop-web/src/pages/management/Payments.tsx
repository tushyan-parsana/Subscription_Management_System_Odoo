
import { useMemo, useState } from 'react'
import {
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  Search,
  Download,
  Eye,
  X,
  RotateCcw,
} from 'lucide-react'

type PaymentStatus = 'Successful' | 'Pending' | 'Failed' | 'Refunded'

type Payment = {
  id: string
  customer: string
  email: string
  invoice: string
  amount: number
  method: string
  date: string
  status: PaymentStatus
}

const initialPayments: Payment[] = [
  { id: 'PAY-1001', customer: 'Acme Corporation', email: 'billing@acme.com', invoice: 'INV-1001', amount: 24999, method: 'Credit Card', date: '2026-10-28', status: 'Successful' },
  { id: 'PAY-1002', customer: 'TechNova Solutions', email: 'accounts@technova.com', invoice: 'INV-1002', amount: 12999, method: 'UPI', date: '2026-10-27', status: 'Successful' },
  { id: 'PAY-1003', customer: 'GreenLeaf Pvt Ltd', email: 'finance@greenleaf.com', invoice: 'INV-1003', amount: 8999, method: 'Net Banking', date: '2026-10-26', status: 'Pending' },
  { id: 'PAY-1004', customer: 'Pixel Studios', email: 'hello@pixel.com', invoice: 'INV-1004', amount: 15999, method: 'Credit Card', date: '2026-10-25', status: 'Failed' },
  { id: 'PAY-1005', customer: 'CloudNine Systems', email: 'pay@cloudnine.com', invoice: 'INV-1005', amount: 34999, method: 'UPI', date: '2026-10-24', status: 'Successful' },
  { id: 'PAY-1006', customer: 'BrightPath Education', email: 'admin@brightpath.com', invoice: 'INV-1006', amount: 4999, method: 'Credit Card', date: '2026-10-23', status: 'Refunded' },
  { id: 'PAY-1007', customer: 'Nova Retail', email: 'accounts@novaretail.com', invoice: 'INV-1007', amount: 10999, method: 'Net Banking', date: '2026-10-22', status: 'Failed' },
]

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

function Payments() {
  const [payments, setPayments] = useState(initialPayments)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(search.toLowerCase()) ||
        payment.customer.toLowerCase().includes(search.toLowerCase()) ||
        payment.invoice.toLowerCase().includes(search.toLowerCase())

      const matchesFilter = filter === 'All' || payment.status === filter
      return matchesSearch && matchesFilter
    })
  }, [payments, search, filter])

  const successful = payments.filter((p) => p.status === 'Successful')
  const collected = successful.reduce((sum, p) => sum + p.amount, 0)
  const pending = payments.filter((p) => p.status === 'Pending').length
  const failed = payments.filter((p) => p.status === 'Failed').length
  const refunded = payments.filter((p) => p.status === 'Refunded').length

  const exportCSV = () => {
    const headers = ['Payment ID', 'Customer', 'Invoice', 'Amount', 'Method', 'Date', 'Status']
    const rows = filteredPayments.map((p) => [
      p.id, p.customer, p.invoice, p.amount, p.method, p.date, p.status,
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'brightloop-payments.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const retryPayment = (id: string) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === id ? { ...payment, status: 'Successful' } : payment
      )
    )
    setSelectedPayment(null)
  }

  const statusStyle: Record<PaymentStatus, string> = {
    Successful: 'bg-emerald-50 text-emerald-700',
    Pending: 'bg-amber-50 text-amber-700',
    Failed: 'bg-rose-50 text-rose-700',
    Refunded: 'bg-slate-100 text-slate-600',
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor transactions and payment activity across your subscriptions.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <Download size={17} /> Export Payments
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Total Collected</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><CreditCard size={19} /></span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-4">{formatCurrency(collected)}</h2>
          <p className="text-xs text-emerald-600 mt-2">From successful payments</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Successful</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={19} /></span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-4">{successful.length}</h2>
          <p className="text-xs text-slate-500 mt-2">Completed transactions</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Pending / Failed</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><Clock3 size={19} /></span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-4">{pending + failed}</h2>
          <p className="text-xs text-slate-500 mt-2">{pending} pending · {failed} failed</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Refunded</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600"><RefreshCw size={19} /></span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-4">{refunded}</h2>
          <p className="text-xs text-slate-500 mt-2">Refunded transactions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Transaction History</h2>
              <p className="text-sm text-slate-500 mt-1">Review and manage customer payments.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2">
                <Search size={17} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search payments..."
                  className="outline-none text-sm w-full sm:w-48"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
              >
                <option>All</option>
                <option>Successful</option>
                <option>Pending</option>
                <option>Failed</option>
                <option>Refunded</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 font-medium">Payment ID</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Invoice</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Method</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-blue-600">{payment.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{payment.customer}</p>
                    <p className="text-xs text-slate-400 mt-1">{payment.email}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{payment.invoice}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{formatCurrency(payment.amount)}</td>
                  <td className="px-5 py-4 text-slate-600">{payment.method}</td>
                  <td className="px-5 py-4 text-slate-500">{payment.date}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      title="View payment details"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-slate-100 text-sm text-slate-500">
          Showing {filteredPayments.length} of {payments.length} payments
        </div>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">Payment Details</h2>
              <button onClick={() => setSelectedPayment(null)} className="text-slate-400 hover:text-slate-700">
                <X size={21} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                ['Payment ID', selectedPayment.id],
                ['Customer', selectedPayment.customer],
                ['Email', selectedPayment.email],
                ['Invoice', selectedPayment.invoice],
                ['Amount', formatCurrency(selectedPayment.amount)],
                ['Payment Method', selectedPayment.method],
                ['Date', selectedPayment.date],
                ['Status', selectedPayment.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800 text-right">{value}</span>
                </div>
              ))}
            </div>
            {selectedPayment.status === 'Failed' && (
              <button
                onClick={() => retryPayment(selectedPayment.id)}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold"
              >
                <RotateCcw size={17} /> Retry Payment (Demo)
              </button>
            )}
            <button
              onClick={() => setSelectedPayment(null)}
              className="w-full mt-3 border border-slate-200 rounded-xl py-3 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payments
