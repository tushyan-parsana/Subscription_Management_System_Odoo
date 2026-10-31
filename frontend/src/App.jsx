import { useMemo, useState } from "react";

const initialSubscriptions = [
  { customer: "Olivia Rhye", email: "olivia@untitled.co", initials: "OR", avatar: "violet", plan: "Enterprise", cycle: "Annual", amount: "$2,400.00", billing: "Nov 14, 2026", status: "Active" },
  { customer: "Phoenix Baker", email: "phoenix@acme.co", initials: "PH", avatar: "yellow", plan: "Growth", cycle: "Monthly", amount: "$299.00", billing: "Nov 08, 2026", status: "Trial" },
  { customer: "Candice Wu", email: "candice@finery.co", initials: "CW", avatar: "blue-avatar", plan: "Starter", cycle: "Monthly", amount: "$89.00", billing: "Nov 03, 2026", status: "Active" },
  { customer: "Kelly Martinez", email: "kelly@lattice.co", initials: "KM", avatar: "pink", plan: "Growth", cycle: "Annual", amount: "$2,990.00", billing: "Oct 31, 2026", status: "Past due" },
];

const navItems = ["Overview", "Subscriptions", "Customers", "Invoices", "Plans", "Analytics", "Integrations"];

function getSavedSubscriptions() {
  try {
    const saved = JSON.parse(localStorage.getItem("brightloop-subscriptions") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function App() {
  const [activeView, setActiveView] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(false);
  const [subscriptions, setSubscriptions] = useState(() => [...getSavedSubscriptions(), ...initialSubscriptions]);

  const filteredSubscriptions = useMemo(
    () => subscriptions.filter((subscription) => `${subscription.customer} ${subscription.email} ${subscription.plan}`.toLowerCase().includes(query.toLowerCase())),
    [query, subscriptions],
  );

  function createSubscription(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const customer = String(form.get("customer")).trim();
    const email = String(form.get("email")).trim();
    if (customer.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      event.currentTarget.reportValidity();
      return;
    }
    const subscription = { customer, email, initials: customer.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase(), avatar: "violet", plan: "Growth", cycle: "Monthly", amount: "$299.00", billing: "Nov 30, 2026", status: "Trial" };
    const saved = getSavedSubscriptions();
    localStorage.setItem("brightloop-subscriptions", JSON.stringify([subscription, ...saved]));
    setSubscriptions((current) => [subscription, ...current]);
    event.currentTarget.reset();
    setModalOpen(false);
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark">B</div><span>brightloop</span></div>
        <div className="workspace-switcher"><div className="workspace-avatar">BS</div><div><strong>Brightloop Software</strong><small>Workspace</small></div><span className="chevron">⌄</span></div>
        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.slice(0, 4).map((item, index) => <NavItem key={item} item={item} index={index} activeView={activeView} onSelect={(value) => { setActiveView(value); setSidebarOpen(false); }} />)}
          <p className="nav-label secondary-label">Manage</p>
          {navItems.slice(4).map((item, index) => <NavItem key={item} item={item} index={index + 4} activeView={activeView} onSelect={(value) => { setActiveView(value); setSidebarOpen(false); }} />)}
        </nav>
        <div className="sidebar-bottom"><div className="odoo-status"><span className="status-dot"></span><div><strong>Odoo connected</strong><small>Synced 8 min ago</small></div><span className="sync-icon">↗</span></div><button className="nav-item"><span className="nav-icon">⚙</span> Settings</button><div className="profile"><div className="profile-avatar">AM</div><div><strong>Alex Morgan</strong><small>Administrator</small></div><span className="more">•••</span></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen((open) => !open)} aria-label="Toggle menu">☰</button><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{activeView}</strong></div><div className="topbar-actions"><button className="icon-button">?</button><button className="icon-button notification">♢<i></i></button><div className="topbar-avatar">AM</div></div></header>
        <div className="page">
          <section className="page-intro"><div><p className="eyebrow">Saturday, October 31, 2026</p><h1>{activeView === "Overview" ? "Good morning, Alex" : activeView} <span>✦</span></h1><p className="muted">{activeView === "Overview" ? "Here’s what’s happening with your subscriptions today." : `Manage your ${activeView.toLowerCase()} from one place.`}</p></div><button className="primary-button" onClick={() => setModalOpen(true)}><span>＋</span> New subscription</button></section>
          <Stats />
          <section className="dashboard-grid"><RevenuePanel /><HealthPanel /></section>
          <section className="panel subscriptions-panel"><div className="panel-header"><div><h2>Recent subscriptions</h2><p className="muted">Keep track of your latest customer activity</p></div><button className="text-button">View all <span>→</span></button></div><div className="table-toolbar"><div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search subscriptions..." /></div><button className="filter-button">☷ Filters <span className="filter-badge">2</span></button></div><SubscriptionTable subscriptions={filteredSubscriptions} /></section>
          <footer><span>© 2026 Brightloop Software</span><span><a href="#help">Help center</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a></span></footer>
        </div>
      </main>
      {modalOpen && <div className="modal-backdrop open" onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><button className="close-modal" onClick={() => setModalOpen(false)}>×</button><div className="modal-icon">↻</div><h2 id="modalTitle">Create subscription</h2><p className="muted">Add a new customer subscription to your workspace.</p><form onSubmit={createSubscription}><label>Customer name<input required minLength="2" name="customer" placeholder="e.g. Taylor Smith" /></label><label>Email address<input required type="email" name="email" placeholder="taylor@company.com" /></label><label>Plan<select name="plan"><option>Growth · Monthly</option><option>Starter · Monthly</option><option>Enterprise · Annual</option></select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary-button" type="submit">Create subscription</button></div></form></div></div>}
      {toast && <div className="toast show"><span>✓</span><div><strong>Subscription created</strong><small>It has been added to your recent activity.</small></div></div>}
    </div>
  );
}

function NavItem({ item, index, activeView, onSelect }) {
  return <button className={`nav-item ${activeView === item ? "active" : ""}`} onClick={() => onSelect(item)}><span className="nav-icon">{["⌂", "↻", "♙", "▤", "◇", "⌁", "⌘"][index]}</span>{item}{item === "Subscriptions" && <span className="nav-count">24</span>}{item === "Invoices" && <span className="nav-count warm">3</span>}</button>;
}

function Stats() {
  const stats = [["Monthly recurring revenue", "$48,290", "↑ 12.5%", "mint"], ["Active subscriptions", "284", "↑ 8.2%", "lavender"], ["Churn rate", "2.4%", "↓ 0.6%", "peach"], ["Outstanding invoices", "$12,840", "↑ 4.1%", "blue"]];
  return <section className="stats-grid">{stats.map(([label, value, change, color]) => <article className="stat-card" key={label}><div className="stat-heading"><span>{label}</span><span className={`stat-icon ${color}`}>↗</span></div><strong className="stat-number">{value}</strong><div className="stat-footer"><span className={color === "blue" ? "negative" : "positive"}>{change}</span><span>vs. last month</span></div><div className={`sparkline ${color}-line`}>{Array.from({ length: 8 }, (_, index) => <span key={index} />)}</div></article>)}</section>;
}

function RevenuePanel() {
  return <article className="panel revenue-panel"><div className="panel-header"><div><h2>Revenue overview</h2><p className="muted">Monthly recurring revenue</p></div><button className="select-button">Last 6 months <span>⌄</span></button></div><div className="chart-wrap"><div className="y-axis"><span>$50k</span><span>$40k</span><span>$30k</span><span>$20k</span><span>$10k</span><span>$0</span></div><div className="chart"><div className="grid-lines"><i /><i /><i /><i /><i /><i /></div><svg viewBox="0 0 640 225" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6857f5" stopOpacity=".2" /><stop offset="100%" stopColor="#6857f5" stopOpacity="0" /></linearGradient></defs><path className="area" d="M0,178 C42,175 60,158 100,164 S156,150 200,142 S253,112 294,123 S343,132 390,102 S446,110 486,76 S550,92 585,54 S620,48 640,28 L640,225 L0,225 Z" /><path className="line" d="M0,178 C42,175 60,158 100,164 S156,150 200,142 S253,112 294,123 S343,132 390,102 S446,110 486,76 S550,92 585,54 S620,48 640,28" /></svg><div className="x-axis"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div></div></div></article>;
}

function HealthPanel() {
  return <article className="panel health-panel"><div className="panel-header"><div><h2>Subscription health</h2><p className="muted">Current status breakdown</p></div><button className="dots">•••</button></div><div className="donut-wrap"><div className="donut"><div><strong>284</strong><small>Total</small></div></div><div className="legend"><span><i className="dot active-dot" />Active <b>236</b></span><span><i className="dot trial-dot" />Trial <b>32</b></span><span><i className="dot paused-dot" />Paused <b>9</b></span><span><i className="dot canceled-dot" />Canceled <b>7</b></span></div></div><div className="health-note"><span>✦</span><div><strong>Great momentum</strong><small>Your active subscriptions grew by 8.2% this month.</small></div></div></article>;
}

function SubscriptionTable({ subscriptions }) {
  return <div className="table-scroll"><table><thead><tr><th>Customer</th><th>Plan</th><th>Amount</th><th>Next billing</th><th>Status</th><th /></tr></thead><tbody>{subscriptions.map((subscription) => <tr key={`${subscription.email}-${subscription.billing}`}><td><div className="customer"><span className={`customer-avatar ${subscription.avatar}`}>{subscription.initials}</span><div><strong>{subscription.customer}</strong><small>{subscription.email}</small></div></div></td><td>{subscription.plan} <small>{subscription.cycle}</small></td><td><strong>{subscription.amount}</strong><small>per month</small></td><td>{subscription.billing}</td><td><span className={`status ${subscription.status === "Active" ? "active" : subscription.status === "Trial" ? "trial" : "overdue"}`}>{subscription.status}</span></td><td><button className="row-menu">•••</button></td></tr>)}</tbody></table></div>;
}

export default App;
