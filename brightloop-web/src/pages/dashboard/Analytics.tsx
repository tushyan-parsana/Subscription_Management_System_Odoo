
import {
  TrendingUp,
  Users,
  IndianRupee,
  Repeat,
  Download,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react'

const monthlyRevenue = [
  { month: 'Jan', value: 35 },
  { month: 'Feb', value: 48 },
  { month: 'Mar', value: 42 },
  { month: 'Apr', value: 60 },
  { month: 'May', value: 55 },
  { month: 'Jun', value: 72 },
  { month: 'Jul', value: 65 },
  { month: 'Aug', value: 82 },
  { month: 'Sep', value: 75 },
  { month: 'Oct', value: 90 },
  { month: 'Nov', value: 80 },
  { month: 'Dec', value: 100 },
]

const plans = [
  { name: 'Enterprise', customers: 420, percent: 48, color: 'bg-blue-600' },
  { name: 'Professional', customers: 310, percent: 35, color: 'bg-violet-500' },
  { name: 'Starter', customers: 142, percent: 17, color: 'bg-emerald-500' },
]

function Analytics() {
  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-blue-600">
            BUSINESS INTELLIGENCE
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Understand your business performance and growth.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-sm hover:bg-slate-50">
            <CalendarDays size={17} />
            This year
          </button>

          <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 sm:px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <Download size={17} />
            Export report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {[
          { title: 'Total Revenue', value: '₹8.42L', growth: '+18.6%', icon: IndianRupee },
          { title: 'New Customers', value: '348', growth: '+12.4%', icon: Users },
          { title: 'Active Subscriptions', value: '856', growth: '+9.8%', icon: Repeat },
          { title: 'Renewal Rate', value: '94.6%', growth: '+3.2%', icon: TrendingUp },
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon size={22} />
                </div>

                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight size={14} />
                  {item.growth}
                </span>
              </div>

              <p className="mt-4 sm:mt-5 text-sm text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {item.value}
              </h2>
            </div>
          )
        })}
      </div>

      {/* Revenue and Plan Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Revenue Chart */}
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">
            Revenue performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monthly revenue trend for the year
          </p>

          <div className="mt-8 overflow-x-auto">
            <div className="flex h-64 min-w-[540px] items-end gap-3 sm:gap-4">
              {monthlyRevenue.map((item) => (
                <div
                  key={item.month}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3"
                >
                  <div
                    className="w-full rounded-t-lg bg-blue-100 transition-colors hover:bg-blue-500"
                    style={{ height: `${item.value}%` }}
                    title={`${item.month}: ${item.value}%`}
                  />

                  <span className="text-xs text-slate-400">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Plan distribution
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Customers by subscription plan
          </p>

          <div className="mt-8 space-y-7">
            {plans.map((plan) => (
              <div key={plan.name}>
                <div className="mb-2 flex justify-between gap-2 text-sm">
                  <span className="font-medium text-slate-700">
                    {plan.name}
                  </span>

                  <span className="font-semibold text-slate-900">
                    {plan.customers}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${plan.color}`}
                    style={{ width: `${plan.percent}%` }}
                  />
                </div>

                <p className="mt-1 text-right text-xs text-slate-400">
                  {plan.percent}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth and Retention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Customer Growth */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Customer growth
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            New customers acquired this year
          </p>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900">
                348
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-emerald-600">
                ↑ 12.4% compared to last year
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 sm:p-4 text-emerald-600">
              <Users size={28} />
            </div>
          </div>
        </div>

        {/* Subscription Retention */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Subscription retention
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Customers continuing their subscriptions
          </p>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900">
                94.6%
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-emerald-600">
                ↑ 3.2% compared to last month
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 sm:p-4 text-blue-600">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Demo Data Notice */}
      <p className="text-xs text-slate-400 text-center">
        Analytics figures are currently demonstration data.
      </p>

    </div>
  )
}

export default Analytics
