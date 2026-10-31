
import {
  Users,
  Repeat,
  IndianRupee,
  FileText,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  Download,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from 'lucide-react'

const stats = [
  {
    title: 'Total Revenue',
    value: '₹8,42,650',
    change: '+18.6%',
    note: 'vs. last month',
    icon: IndianRupee,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Active Subscriptions',
    value: '856',
    change: '+12.8%',
    note: 'vs. last month',
    icon: Repeat,
    color: 'bg-violet-50 text-violet-600',
  },
  {
    title: 'Total Customers',
    value: '2,456',
    change: '+9.4%',
    note: 'vs. last month',
    icon: Users,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Pending Invoices',
    value: '38',
    change: '-4.2%',
    note: 'vs. last month',
    icon: FileText,
    color: 'bg-orange-50 text-orange-600',
  },
]

const revenue = [
  { month: 'Jan', amount: 42 },
  { month: 'Feb', amount: 58 },
  { month: 'Mar', amount: 48 },
  { month: 'Apr', amount: 72 },
  { month: 'May', amount: 63 },
  { month: 'Jun', amount: 86 },
  { month: 'Jul', amount: 68 },
  { month: 'Aug', amount: 94 },
  { month: 'Sep', amount: 76 },
  { month: 'Oct', amount: 100 },
  { month: 'Nov', amount: 82 },
  { month: 'Dec', amount: 92 },
]

const transactions = [
  {
    name: 'Aarav Sharma',
    email: 'aarav@company.com',
    plan: 'Enterprise',
    amount: '₹12,999',
    status: 'Paid',
    initials: 'AS',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Priya Mehta',
    email: 'priya@studio.com',
    plan: 'Professional',
    amount: '₹5,499',
    status: 'Pending',
    initials: 'PM',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul@agency.com',
    plan: 'Starter',
    amount: '₹1,999',
    status: 'Paid',
    initials: 'RV',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Ananya Patel',
    email: 'ananya@business.com',
    plan: 'Enterprise',
    amount: '₹12,999',
    status: 'Overdue',
    initials: 'AP',
    color: 'bg-orange-100 text-orange-700',
  },
]

function Dashboard() {
  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-blue-600">
            OVERVIEW
          </p>

          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            <Download size={17} />
            Export
          </button>

          <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
            <Plus size={18} />
            New subscription
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>

                <button
                  className="text-slate-400 hover:text-slate-700"
                  aria-label={`More options for ${stat.title}`}
                >
                  <MoreHorizontal size={21} />
                </button>
              </div>

              <p className="mt-4 sm:mt-5 text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <ArrowUpRight size={14} />
                  {stat.change}
                </span>

                <span className="text-slate-400">{stat.note}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Revenue Chart and Subscription Overview */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Revenue Chart */}
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Revenue overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your revenue performance throughout the year
              </p>
            </div>

            <button className="flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
              <CalendarDays size={16} />
              This year
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              ₹8.42L
            </h3>

            <span className="mb-1 flex items-center text-sm font-semibold text-emerald-600">
              <ArrowUpRight size={16} />
              18.6%
            </span>
          </div>

          <div className="mt-7 overflow-x-auto">
            <div className="flex h-52 min-w-[520px] items-end gap-3 sm:gap-4">
              {revenue.map((item) => (
                <div
                  key={item.month}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3"
                >
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      item.month === 'Oct'
                        ? 'bg-blue-600'
                        : 'bg-blue-100 hover:bg-blue-300'
                    }`}
                    style={{ height: `${item.amount}%` }}
                    title={`${item.month}: ${item.amount}%`}
                  />

                  <span className="text-xs text-slate-400">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subscription Health */}
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Subscription health
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current subscription status
          </p>

          <div className="relative mx-auto mt-7 flex h-40 w-40 items-center justify-center rounded-full border-[16px] border-emerald-100">
            <div className="absolute inset-[-16px] rounded-full border-[16px] border-blue-600 border-b-transparent border-l-transparent rotate-[-35deg]" />

            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">
                1,284
              </p>

              <p className="text-xs text-slate-500">
                Total subscriptions
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Active
              </span>

              <strong className="text-slate-900">856</strong>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                Trial
              </span>

              <strong className="text-slate-900">286</strong>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                Cancelled
              </span>

              <strong className="text-slate-900">142</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest customer payments and invoices
            </p>
          </div>

          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View all
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {transactions.map((item) => (
                <tr
                  key={item.email}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.color}`}>
                        {item.initials}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {item.plan}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {item.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {item.status === 'Paid' ? (
                        <CheckCircle2 size={13} />
                      ) : item.status === 'Pending' ? (
                        <Clock3 size={13} />
                      ) : (
                        <AlertCircle size={13} />
                      )}

                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button className="font-medium text-blue-600 hover:underline">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo Data Notice */}
      <p className="text-center text-xs text-slate-400">
        Dashboard figures are currently demonstration data.
      </p>

    </div>
  )
}

export default Dashboard
