import { useMemo, useState } from "react";

const modules = [
  { id: "overview", label: "Overview", icon: "⌂", group: "Workspace" },
  { id: "products", label: "Products", icon: "◈", group: "Management" },
  { id: "plans", label: "Subscription plans", icon: "◇", group: "Management" },
  { id: "customers", label: "Customers", icon: "♙", group: "Management" },
  { id: "subscriptions", label: "Subscriptions", icon: "↻", group: "Management" },
  { id: "invoices", label: "Invoices & payments", icon: "▤", group: "Management" },
  { id: "portal", label: "Customer portal", icon: "↗", group: "Workspace" },
];

const collections = {
  products: [
    { name: "Cloud Workspace", detail: "PROD-001 · 3 variants", value: "$49.00", meta: "per seat / month", status: "Active", tone: "active", icon: "☁" },
    { name: "Analytics Suite", detail: "PROD-002 · 2 variants", value: "$129.00", meta: "per workspace / month", status: "Active", tone: "active", icon: "⌁" },
    { name: "Priority Support", detail: "PROD-003 · Add-on", value: "$299.00", meta: "per month", status: "Draft", tone: "draft", icon: "✦" },
    { name: "Onboarding package", detail: "PROD-004 · One-time", value: "$850.00", meta: "one-time", status: "Archived", tone: "archived", icon: "◒" },
  ],
  plans: [
    { name: "Starter", detail: "Monthly · 2 products", value: "$89.00", meta: "per month", status: "Active", tone: "active", icon: "S" },
    { name: "Growth", detail: "Monthly · 5 products", value: "$299.00", meta: "per month", status: "Active", tone: "active", icon: "G" },
    { name: "Enterprise", detail: "Annual · Unlimited", value: "$2,400.00", meta: "per year", status: "Active", tone: "active", icon: "E" },
    { name: "Pilot plan", detail: "Monthly · 3 products", value: "$149.00", meta: "per month", status: "Draft", tone: "draft", icon: "P" },
  ],
  customers: [
    { name: "Olivia Rhye", detail: "olivia@untitled.co · 2 subscriptions", value: "$2,400.00", meta: "annual value", status: "Active", tone: "active", icon: "OR" },
    { name: "Phoenix Baker", detail: "phoenix@acme.co · 1 subscription", value: "$299.00", meta: "monthly value", status: "Trial", tone: "trial", icon: "PB" },
    { name: "Candice Wu", detail: "candice@finery.co · 1 subscription", value: "$89.00", meta: "monthly value", status: "Active", tone: "active", icon: "CW" },
    { name: "Kelly Martinez", detail: "kelly@lattice.co · 1 subscription", value: "$2,990.00", meta: "past due", status: "Past due", tone: "overdue", icon: "KM" },
  ],
  subscriptions: [
    { name: "Olivia Rhye", detail: "Enterprise · Annual", value: "$2,400.00", meta: "Renews Nov 14, 2026", status: "Active", tone: "active", icon: "OR" },
    { name: "Phoenix Baker", detail: "Growth · Monthly", value: "$299.00", meta: "Renews Nov 08, 2026", status: "Trial", tone: "trial", icon: "PB" },
    { name: "Candice Wu", detail: "Starter · Monthly", value: "$89.00", meta: "Renews Nov 03, 2026", status: "Active", tone: "active", icon: "CW" },
    { name: "Kelly Martinez", detail: "Growth · Annual", value: "$2,990.00", meta: "Payment failed", status: "Past due", tone: "overdue", icon: "KM" },
  ],
  invoices: [
    { name: "INV-2026-1048", detail: "Olivia Rhye · Enterprise", value: "$2,400.00", meta: "Due Nov 14, 2026", status: "Paid", tone: "active", icon: "▤" },
    { name: "INV-2026-1047", detail: "Kelly Martinez · Growth", value: "$2,990.00", meta: "Due Oct 31, 2026", status: "Overdue", tone: "overdue", icon: "!" },
    { name: "INV-2026-1046", detail: "Phoenix Baker · Growth", value: "$299.00", meta: "Due Nov 08, 2026", status: "Pending", tone: "trial", icon: "◷" },
  ],
};

function readSaved(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Login({ onLogin }) {
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);

  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.email || !values.password) {
      setError("Enter your email and password to continue.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError("Enter a valid work email address.");
      return;
    }
    localStorage.setItem("brightloop-authenticated", "true");
    onLogin();
  }

  function register(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (String(values.password).length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }
    localStorage.setItem("brightloop-user", JSON.stringify({ name: values.name.trim(), email: values.email.trim() }));
    localStorage.setItem("brightloop-authenticated", "true");
    onLogin();
  }

  if (registering) {
    return (
      <div className="auth-shell">
        <div className="auth-decoration"><div className="auth-orbit orbit-one" /><div className="auth-orbit orbit-two" /><div className="auth-glow" /><div className="auth-quote"><span>✦</span><strong>Start building<br />better retention.</strong><small>Bring your products, plans, and customer relationships together.</small></div></div>
        <main className="auth-card">
          <div className="auth-brand"><div className="brand-mark">B</div><span>brightloop</span></div>
          <div className="auth-copy"><p className="eyebrow">Create workspace access</p><h1>Create your account</h1><p className="muted">Set up your Brightloop administrator profile to get started.</p></div>
          <form className="auth-form" onSubmit={register}>
            <label>Full name<input required minLength="2" name="name" placeholder="Alex Morgan" autoComplete="name" /></label>
            <label>Work email<input required type="email" name="email" placeholder="you@company.com" autoComplete="email" /></label>
            <label>Password<input required minLength="8" type="password" name="password" placeholder="At least 8 characters" autoComplete="new-password" /></label>
            <label>Confirm password<input required minLength="8" type="password" name="confirmPassword" placeholder="Repeat your password" autoComplete="new-password" /></label>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button className="primary-button auth-submit" type="submit">Create account <span>→</span></button>
          </form>
          <p className="auth-footer">Already have an account? <button className="auth-link-button" onClick={() => { setRegistering(false); setError(""); }}>Sign in</button></p>
          <small className="auth-legal">By continuing, you agree to Brightloop’s Terms and Privacy Policy.</small>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-decoration"><div className="auth-orbit orbit-one" /><div className="auth-orbit orbit-two" /><div className="auth-glow" /><div className="auth-quote"><span>✦</span><strong>Make recurring revenue<br />feel effortless.</strong><small>One calm workspace for every customer relationship.</small></div></div>
      <main className="auth-card">
        <div className="auth-brand"><div className="brand-mark">B</div><span>brightloop</span></div>
        <div className="auth-copy"><p className="eyebrow">Workspace login</p><h1>Welcome back</h1><p className="muted">Sign in to manage your subscriptions and customer revenue.</p></div>
        <form className="auth-form" onSubmit={submit}>
          <label>Work email<input required type="email" name="email" placeholder="you@company.com" autoComplete="email" /></label>
          <label>Password<div className="password-field"><input required minLength="6" type="password" name="password" placeholder="Enter your password" autoComplete="current-password" /><button type="button" aria-label="Show password" onClick={(event) => { const input = event.currentTarget.previousElementSibling; input.type = input.type === "password" ? "text" : "password"; }}>◉</button></div></label>
          <div className="auth-options"><label className="checkbox-label"><input type="checkbox" name="remember" /> Remember me</label><a href="#forgot">Forgot password?</a></div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="primary-button auth-submit" type="submit">Sign in <span>→</span></button>
        </form>
        <p className="auth-footer">Don’t have an account? <button className="auth-link-button" onClick={() => { setRegistering(true); setError(""); }}>Create an account</button></p>
        <small className="auth-legal">By continuing, you agree to Brightloop’s Terms and Privacy Policy.</small>
      </main>
    </div>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem("brightloop-authenticated") === "true");
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [data, setData] = useState(() => Object.fromEntries(Object.entries(collections).map(([key, value]) => [key, [...readSaved(`brightloop-${key}`), ...value]])));

  const currentModule = modules.find((item) => item.id === active);
  const currentRows = data[active] || [];
  const visibleRows = useMemo(() => currentRows.filter((row) => `${row.name} ${row.detail} ${row.status}`.toLowerCase().includes(query.toLowerCase())), [currentRows, query]);

  function navigate(id) {
    setActive(id);
    setQuery("");
    setSidebarOpen(false);
  }

  function saveRecord(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const name = values.name.trim();
    if (name.length < 2) {
      event.currentTarget.elements.name.setCustomValidity("Enter at least 2 characters.");
      event.currentTarget.reportValidity();
      return;
    }
    const record = {
      name,
      detail: values.detail || `${values.type || "New record"} · Recently created`,
      value: values.value || "$299.00",
      meta: values.meta || "per month",
      status: "Active",
      tone: "active",
      icon: name.slice(0, 2).toUpperCase(),
    };
    const saved = readSaved(active);
    localStorage.setItem(`brightloop-${active}`, JSON.stringify([record, ...saved]));
    setData((current) => ({ ...current, [active]: [record, ...current[active]] }));
    setModal(null);
    setNotice(`${currentModule.label} record created`);
    setTimeout(() => setNotice(""), 3200);
  }

  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />;

  function logout() {
    localStorage.removeItem("brightloop-authenticated");
    setAuthenticated(false);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark">B</div><span>brightloop</span></div>
        <div className="workspace-switcher"><div className="workspace-avatar">BS</div><div><strong>Brightloop Software</strong><small>Workspace</small></div><span className="chevron">⌄</span></div>
        <nav className="main-nav" aria-label="Main navigation">
          {["Workspace", "Management"].map((group) => <div key={group}><p className={`nav-label ${group === "Management" ? "secondary-label" : ""}`}>{group}</p>{modules.filter((item) => item.group === group).map((item) => <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}{item.id === "subscriptions" && <span className="nav-count">24</span>}{item.id === "invoices" && <span className="nav-count warm">3</span>}</button>)}</div>)}
        </nav>
        <div className="sidebar-bottom"><div className="odoo-status"><span className="status-dot"></span><div><strong>Odoo connected</strong><small>Synced 8 min ago</small></div><span className="sync-icon">↗</span></div><button className="nav-item"><span className="nav-icon">⚙</span> Settings</button><div className="profile"><div className="profile-avatar">AM</div><div><strong>Alex Morgan</strong><small>Administrator</small></div><button className="logout-button" onClick={logout} aria-label="Log out">↪</button></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen((open) => !open)}>☰</button><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{currentModule.label}</strong></div><div className="topbar-actions"><button className="icon-button">?</button><button className="icon-button notification">♢<i></i></button><div className="topbar-avatar">AM</div></div></header>
        <div className="page">
          {active === "overview" ? <Overview onNavigate={navigate} /> : active === "portal" ? <Portal /> : <ManagementPage module={currentModule} rows={visibleRows} query={query} setQuery={setQuery} onCreate={() => setModal(active)} />}
          <footer><span>© 2026 Brightloop Software</span><span><a href="#help">Help center</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a></span></footer>
        </div>
      </main>
      {modal && <CreateModal title={`New ${currentModule.label.replace(" & payments", "")}`} onClose={() => setModal(null)} onSubmit={saveRecord} />}
      {notice && <div className="toast show"><span>✓</span><div><strong>{notice}</strong><small>Changes are saved to this workspace.</small></div></div>}
    </div>
  );
}

function ManagementPage({ module, rows, query, setQuery, onCreate }) {
  const description = { products: "Manage your catalog, pricing, and product variants.", plans: "Package products into flexible recurring offers.", customers: "Keep customer profiles, billing, and account health in sync.", subscriptions: "Track renewals, trials, and recurring revenue.", invoices: "Review billing activity and payment collection." }[module.id];
  return <><section className="page-intro"><div><p className="eyebrow">Management workspace</p><h1>{module.label} <span>✦</span></h1><p className="muted">{description}</p></div><button className="primary-button" onClick={onCreate}><span>＋</span> New {module.id === "invoices" ? "invoice" : module.id.slice(0, -1)}</button></section><section className="module-kpis"><Kpi label="Total records" value={rows.length + (rows.length === 0 ? 0 : 280)} change="↑ 12.5%" /><Kpi label="Active" value={rows.filter((row) => row.tone === "active").length + 236} change="↑ 8.2%" /><Kpi label="Needs attention" value={rows.filter((row) => row.tone === "overdue" || row.tone === "draft").length + 3} change="Review now" /></section><section className="panel management-panel"><div className="panel-header"><div><h2>All {module.label.toLowerCase()}</h2><p className="muted">Search, filter, and manage your records</p></div><button className="filter-button">☷ Filters <span className="filter-badge">2</span></button></div><div className="table-toolbar"><div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder={`Search ${module.label.toLowerCase()}...`} /></div><button className="select-button">Recently updated <span>⌄</span></button></div><ManagementTable rows={rows} /></section></>;
}

function ManagementTable({ rows }) {
  return <div className="table-scroll"><table><thead><tr><th>Name</th><th>Details</th><th>Value</th><th>Status</th><th>Updated</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={`${row.name}-${row.detail}`}><td><div className="customer"><span className={`customer-avatar ${row.avatar || "violet"}`}>{row.icon}</span><div><strong>{row.name}</strong><small>{row.detail.split(" · ")[0]}</small></div></div></td><td>{row.detail}</td><td><strong>{row.value}</strong><small>{row.meta}</small></td><td><span className={`status ${row.tone}`}>{row.status}</span></td><td>Oct 31, 2026</td><td><button className="row-menu">•••</button></td></tr>)}</tbody></table>{rows.length === 0 && <div className="empty-state"><span>⌕</span><strong>No matching records</strong><small>Try a different search term.</small></div>}</div>;
}

function Kpi({ label, value, change }) {
  return <article className="stat-card compact-kpi"><div className="stat-heading"><span>{label}</span><span className="stat-icon lavender">✦</span></div><strong className="stat-number">{value}</strong><div className="stat-footer"><span className="positive">{change}</span></div></article>;
}

function Overview({ onNavigate }) {
  return <><section className="page-intro"><div><p className="eyebrow">Saturday, October 31, 2026</p><h1>Good morning, Alex <span>✦</span></h1><p className="muted">Your subscription operations are looking healthy today.</p></div><button className="primary-button" onClick={() => onNavigate("subscriptions")}><span>↗</span> View subscriptions</button></section><section className="stats-grid">{[["Monthly recurring revenue", "$48,290", "↑ 12.5%", "mint"], ["Active subscriptions", "284", "↑ 8.2%", "lavender"], ["Churn rate", "2.4%", "↓ 0.6%", "peach"], ["Outstanding invoices", "$12,840", "↑ 4.1%", "blue"]].map(([label, value, change, color]) => <article className="stat-card" key={label}><div className="stat-heading"><span>{label}</span><span className={`stat-icon ${color}`}>↗</span></div><strong className="stat-number">{value}</strong><div className="stat-footer"><span className={color === "blue" ? "negative" : "positive"}>{change}</span><span>vs. last month</span></div><div className={`sparkline ${color}-line`}>{Array.from({ length: 8 }, (_, index) => <span key={index} />)}</div></article>)}</section><section className="quick-actions panel"><div><p className="eyebrow">Command center</p><h2>Build your next billing cycle</h2><p className="muted">Jump into the module you need to keep customer revenue moving.</p></div><div className="quick-action-grid">{[["products", "Add products", "Catalog and variants"], ["plans", "Create a plan", "Bundle recurring offers"], ["customers", "Add customer", "Start a relationship"]].map(([id, title, detail]) => <button key={id} onClick={() => onNavigate(id)}><span>{modules.find((item) => item.id === id).icon}</span><div><strong>{title}</strong><small>{detail}</small></div><b>→</b></button>)}</div></section><section className="panel integration-banner"><div className="integration-orb">⌘</div><div><p className="eyebrow">Odoo integration</p><h2>Everything is in sync</h2><p className="muted">Customers, products, and invoices are syncing with Odoo automatically.</p></div><span className="sync-label"><i /> Last synced 8 min ago</span></section></>;
}

function Portal() {
  return <><section className="page-intro"><div><p className="eyebrow">Customer experience</p><h1>Customer portal <span>✦</span></h1><p className="muted">Give customers a clear view of their plans, billing, and account.</p></div><button className="primary-button"><span>↗</span> Preview portal</button></section><section className="portal-preview panel"><div className="portal-top"><div className="brand"><div className="brand-mark">B</div><span>brightloop</span></div><span className="portal-avatar">OR</span></div><div className="portal-welcome"><p className="eyebrow">Customer account</p><h2>Welcome back, Olivia</h2><p className="muted">Here’s a quick look at your Brightloop workspace.</p></div><div className="portal-cards"><div><small>Current plan</small><strong>Enterprise</strong><span>Renews Nov 14, 2026</span></div><div><small>Next invoice</small><strong>$2,400.00</strong><span>Annual billing</span></div><div><small>Account status</small><strong className="portal-green">Active</strong><span>Everything is up to date</span></div></div><div className="portal-table"><h3>Recent invoices</h3><div><span>INV-2026-1048</span><b>$2,400.00</b><em>Paid</em></div><div><span>INV-2025-1048</span><b>$2,400.00</b><em>Paid</em></div></div></section></>;
}

function CreateModal({ title, onClose, onSubmit }) {
  return <div className="modal-backdrop open" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal" role="dialog" aria-modal="true"><button className="close-modal" onClick={onClose}>×</button><div className="modal-icon">✦</div><h2>{title}</h2><p className="muted">Add a new record to your management workspace.</p><form onSubmit={onSubmit}><label>Name<input required minLength="2" name="name" placeholder="e.g. Taylor Smith" /></label><label>Details<input name="detail" placeholder="e.g. Monthly · 3 products" /></label><div className="form-grid"><label>Value<input name="value" placeholder="$299.00" /></label><label>Type<select name="type"><option>Monthly</option><option>Annual</option><option>One-time</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Create record</button></div></form></div></div>;
}
