const modalBackdrop = document.querySelector("#modalBackdrop");
const openModal = document.querySelector("#openModal");
const closeModal = document.querySelector("#closeModal");
const cancelModal = document.querySelector("#cancelModal");
const form = document.querySelector("#subscriptionForm");
const toast = document.querySelector("#toast");
const rows = document.querySelector("#subscriptionRows");
const searchInput = document.querySelector("#searchInput");
const menuToggle = document.querySelector("#menuToggle");
const sidebar = document.querySelector("#sidebar");
const storageKey = "brightloop-subscriptions";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function subscriptionRow(subscription) {
  const row = document.createElement("tr");
  const initials = subscription.customer.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const [plan, cycle] = subscription.plan.split(" · ");
  row.innerHTML = `<td><div class="customer"><span class="customer-avatar violet">${escapeHtml(initials)}</span><div><strong>${escapeHtml(subscription.customer)}</strong><small>${escapeHtml(subscription.email)}</small></div></div></td><td>${escapeHtml(plan)} <small>${escapeHtml(cycle)}</small></td><td><strong>${escapeHtml(subscription.amount)}</strong><small>per month</small></td><td>${escapeHtml(subscription.nextBilling)}</td><td><span class="status trial">Trial</span></td><td><button class="row-menu">•••</button></td>`;
  return row;
}

function getStoredSubscriptions() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function persistSubscription(subscription) {
  localStorage.setItem(storageKey, JSON.stringify([...getStoredSubscriptions(), subscription]));
}

getStoredSubscriptions().forEach((subscription) => rows.prepend(subscriptionRow(subscription)));

function setModal(open) {
  modalBackdrop.classList.toggle("open", open);
  if (open) modalBackdrop.querySelector("input").focus();
}

openModal.addEventListener("click", () => setModal(true));
closeModal.addEventListener("click", () => setModal(false));
cancelModal.addEventListener("click", () => setModal(false));
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) setModal(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setModal(false);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("customer") || "").trim();
  const email = String(data.get("email") || "").trim();
  const plan = String(data.get("plan") || "");
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (name.length < 2 || emailIsValid === false) {
    form.classList.add("invalid");
    form.querySelector("input[name='customer']").setCustomValidity(name.length < 2 ? "Enter a customer name." : "");
    form.querySelector("input[name='email']").setCustomValidity(emailIsValid ? "" : "Enter a valid email address.");
    form.reportValidity();
    return;
  }
  form.classList.remove("invalid");
  const subscription = { customer: name, email, plan, amount: "$299.00", nextBilling: "Nov 30, 2026" };
  const row = subscriptionRow(subscription);
  rows.prepend(row);
  persistSubscription(subscription);
  form.reset();
  setModal(false);
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
});

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  rows.querySelectorAll("tr").forEach((row) => {
    row.hidden = !row.textContent.toLowerCase().includes(query);
  });
});

document.querySelectorAll(".nav-item[data-view]").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item[data-view]").forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");
    document.querySelector("#pageTitle").textContent = item.dataset.view;
    sidebar.classList.remove("open");
    if (item.dataset.view !== "Overview") {
      document.querySelector("#greeting").innerHTML = `${item.dataset.view} <span>✦</span>`;
      document.querySelector(".page-intro .muted").textContent = `Manage your ${item.dataset.view.toLowerCase()} from one place.`;
    } else {
      document.querySelector("#greeting").innerHTML = "Good morning, Alex <span>✦</span>";
      document.querySelector(".page-intro .muted").textContent = "Here’s what’s happening with your subscriptions today.";
    }
  });
});

menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
document.querySelector("#viewAll").addEventListener("click", () => {
  document.querySelector("#subscriptionRows").scrollIntoView({ behavior: "smooth", block: "center" });
});
document.querySelector("#filterButton").addEventListener("click", (event) => {
  event.currentTarget.classList.toggle("filtered");
  event.currentTarget.innerHTML = event.currentTarget.classList.contains("filtered") ? "☷ Active filters <span class=\"filter-badge\">2</span>" : "☷ Filters <span class=\"filter-badge\">2</span>";
});
