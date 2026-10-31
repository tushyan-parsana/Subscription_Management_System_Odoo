import { Router } from "express";
import { Prisma, Role, SubscriptionStatus, InvoiceStatus } from "@prisma/client";
import { z } from "zod";
import prisma from "../config/database";
import { authenticate } from "../middleware/auth.middleware";
import { requireRoles } from "../middleware/role.middleware";
import { pagination } from "../utils/pagination";

const router = Router();
router.use(authenticate);
const id = z.object({ id: z.string().uuid() });
const page = (req: Parameters<typeof pagination>[0]) => pagination(req);
const result = (res: Parameters<Router["get"]>[1] extends never ? never : any, data: unknown, message = "Operation successful") => res.json({ success: true, message, data });

function canAccessCustomer(req: Parameters<typeof authenticate>[0], customerUserId: string | null) {
  return req.user?.role !== Role.CUSTOMER || customerUserId === req.user.id;
}

router.get("/users", requireRoles(Role.ADMIN), async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
  return result(res, users);
});
router.post("/users/staff", requireRoles(Role.ADMIN), async (req, res) => {
  const parsed = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(9).regex(/[A-Z]/).regex(/[a-z]/).regex(/[^A-Za-z0-9]/) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues });
  const bcrypt = await import("bcryptjs");
  const user = await prisma.user.create({ data: { ...parsed.data, passwordHash: await bcrypt.hash(parsed.data.password, 12), role: Role.STAFF }, select: { id: true, name: true, email: true, role: true } });
  return res.status(201).json({ success: true, message: "Staff account created", data: user });
});

router.get("/customers", async (req, res) => {
  const p = page(req);
  const where = req.user?.role === Role.CUSTOMER ? { userId: req.user.id } : undefined;
  const [customers, total] = await prisma.$transaction([prisma.customer.findMany({ where, skip: p.skip, take: p.limit, orderBy: { createdAt: "desc" } }), prisma.customer.count({ where })]);
  return result(res, { items: customers, page: p.page, limit: p.limit, total });
});
router.post("/customers", requireRoles(Role.ADMIN, Role.STAFF), async (req, res) => {
  const parsed = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues });
  return res.status(201).json({ success: true, message: "Customer created", data: await prisma.customer.create({ data: parsed.data }) });
});
router.get("/customers/:id", async (req, res) => {
  const customer = await prisma.customer.findUnique({ where: { id: String(req.params.id) }, include: { subscriptions: true, invoices: true } });
  if (!customer || !canAccessCustomer(req, customer.userId)) return res.status(customer ? 403 : 404).json({ success: false, message: customer ? "Forbidden" : "Customer not found" });
  return result(res, customer);
});
router.put("/customers/:id", requireRoles(Role.ADMIN, Role.STAFF), async (req, res) => {
  const parsed = z.object({ name: z.string().min(2).optional(), email: z.string().email().optional(), phone: z.string().nullable().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues });
  return result(res, await prisma.customer.update({ where: { id: String(req.params.id) }, data: parsed.data }), "Customer updated");
});
router.delete("/customers/:id", requireRoles(Role.ADMIN), async (req, res) => { await prisma.customer.delete({ where: { id: String(req.params.id) } }); return result(res, null, "Customer deleted"); });

router.get("/products", async (req, res) => { const p = page(req); const [items, total] = await prisma.$transaction([prisma.product.findMany({ include: { variants: true }, skip: p.skip, take: p.limit, orderBy: { createdAt: "desc" } }), prisma.product.count()]); return result(res, { items, page: p.page, limit: p.limit, total }); });
router.post("/products", requireRoles(Role.ADMIN, Role.STAFF), async (req, res) => {
  const parsed = z.object({ name: z.string().min(1), type: z.enum(["SERVICE", "GOODS"]), salesPrice: z.coerce.number().nonnegative(), costPrice: z.coerce.number().nonnegative().optional(), notes: z.string().optional(), variants: z.array(z.object({ name: z.string().min(1), extraPrice: z.coerce.number().nonnegative() })).optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues });
  const { variants, ...data } = parsed.data;
  return res.status(201).json({ success: true, message: "Product created", data: await prisma.product.create({ data: { ...data, salesPrice: new Prisma.Decimal(data.salesPrice), costPrice: data.costPrice === undefined ? undefined : new Prisma.Decimal(data.costPrice), variants: { create: variants?.map((v) => ({ ...v, extraPrice: new Prisma.Decimal(v.extraPrice) })) } }, include: { variants: true } }) });
});
router.put("/products/:id", requireRoles(Role.ADMIN, Role.STAFF), async (req, res) => { const parsed = z.object({ name: z.string().min(1).optional(), notes: z.string().nullable().optional(), salesPrice: z.coerce.number().nonnegative().optional(), costPrice: z.coerce.number().nonnegative().nullable().optional() }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed" }); const data = { ...parsed.data, salesPrice: parsed.data.salesPrice === undefined ? undefined : new Prisma.Decimal(parsed.data.salesPrice), costPrice: parsed.data.costPrice === undefined || parsed.data.costPrice === null ? parsed.data.costPrice : new Prisma.Decimal(parsed.data.costPrice) }; return result(res, await prisma.product.update({ where: { id: String(req.params.id) }, data }), "Product updated"); });
router.delete("/products/:id", requireRoles(Role.ADMIN), async (req, res) => { await prisma.product.delete({ where: { id: String(req.params.id) } }); return result(res, null, "Product deleted"); });

router.get("/plans", async (_req, res) => result(res, await prisma.plan.findMany({ orderBy: { name: "asc" } })));
router.post("/plans", requireRoles(Role.ADMIN, Role.STAFF), async (req, res) => { const parsed = z.object({ name: z.string().min(1), description: z.string().optional(), price: z.coerce.number().nonnegative(), billingCycle: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]), minimumQuantity: z.coerce.number().int().positive().default(1), availableFrom: z.coerce.date().optional(), availableTo: z.coerce.date().optional(), autoClose: z.boolean().optional(), allowPause: z.boolean().optional(), allowRenewal: z.boolean().optional() }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues }); return res.status(201).json({ success: true, message: "Plan created", data: await prisma.plan.create({ data: { ...parsed.data, price: new Prisma.Decimal(parsed.data.price) } }) }); });
router.put("/plans/:id", requireRoles(Role.ADMIN, Role.STAFF), async (req, res) => { const parsed = z.object({ name: z.string().min(1).optional(), description: z.string().nullable().optional(), price: z.coerce.number().nonnegative().optional(), availableTo: z.coerce.date().nullable().optional() }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed" }); return result(res, await prisma.plan.update({ where: { id: String(req.params.id) }, data: { ...parsed.data, price: parsed.data.price === undefined ? undefined : new Prisma.Decimal(parsed.data.price) } }), "Plan updated"); });
router.delete("/plans/:id", requireRoles(Role.ADMIN), async (req, res) => { await prisma.plan.delete({ where: { id: String(req.params.id) } }); return result(res, null, "Plan deleted"); });

function addCycle(date: Date, cycle: string) { const next = new Date(date); if (cycle === "DAILY") next.setDate(next.getDate() + 1); else if (cycle === "WEEKLY") next.setDate(next.getDate() + 7); else if (cycle === "YEARLY") next.setFullYear(next.getFullYear() + 1); else next.setMonth(next.getMonth() + 1); return next; }
const transitions: Record<SubscriptionStatus, SubscriptionStatus[]> = { DRAFT: [SubscriptionStatus.QUOTATION, SubscriptionStatus.CLOSED], QUOTATION: [SubscriptionStatus.CONFIRMED, SubscriptionStatus.DRAFT], CONFIRMED: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CLOSED], ACTIVE: [SubscriptionStatus.PAUSED, SubscriptionStatus.CLOSED], PAUSED: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CLOSED], CLOSED: [] };
router.get("/subscriptions", async (req, res) => { const where = req.user?.role === Role.CUSTOMER ? { customer: { userId: req.user.id } } : {}; return result(res, await prisma.subscription.findMany({ where, include: { customer: true, plan: true, items: { include: { product: true } } }, orderBy: { createdAt: "desc" } })); });
router.post("/subscriptions", async (req, res) => { const parsed = z.object({ customerId: z.string().uuid(), planId: z.string().uuid(), startDate: z.coerce.date(), expiryDate: z.coerce.date().optional(), paymentTerms: z.string().optional(), items: z.array(z.object({ productId: z.string().uuid(), quantity: z.coerce.number().int().positive(), unitPrice: z.coerce.number().nonnegative().optional() })).min(1) }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues }); const plan = await prisma.plan.findUnique({ where: { id: parsed.data.planId } }); const customer = await prisma.customer.findUnique({ where: { id: parsed.data.customerId } }); if (!plan || !customer || !canAccessCustomer(req, customer.userId)) return res.status(404).json({ success: false, message: "Plan or customer not found" }); if (parsed.data.items.some((x) => x.quantity < plan.minimumQuantity)) return res.status(400).json({ success: false, message: "Minimum quantity not met" }); const number = `SUB-${Date.now()}`; return res.status(201).json({ success: true, message: "Subscription created", data: await prisma.subscription.create({ data: { subscriptionNumber: number, customerId: customer.id, planId: plan.id, startDate: parsed.data.startDate, expiryDate: parsed.data.expiryDate, nextBillingDate: parsed.data.startDate, paymentTerms: parsed.data.paymentTerms, items: { create: parsed.data.items.map((item) => ({ productId: item.productId, quantity: item.quantity, unitPrice: new Prisma.Decimal(item.unitPrice ?? Number(plan.price)) })) } }, include: { items: true, plan: true } }) }); });
router.patch("/subscriptions/:id/status", async (req, res) => { const parsed = z.object({ status: z.nativeEnum(SubscriptionStatus) }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Invalid status" }); const subscription = await prisma.subscription.findUnique({ where: { id: String(req.params.id) }, include: { customer: true, plan: true } }); if (!subscription || !canAccessCustomer(req, subscription.customer.userId)) return res.status(404).json({ success: false, message: "Subscription not found" }); if (!transitions[subscription.status].includes(parsed.data.status)) return res.status(400).json({ success: false, message: `Invalid transition from ${subscription.status}` }); return result(res, await prisma.subscription.update({ where: { id: subscription.id }, data: { status: parsed.data.status } }), "Subscription status updated"); });
router.post("/subscriptions/:id/renew", async (req, res) => { const subscription = await prisma.subscription.findUnique({ where: { id: String(req.params.id) }, include: { customer: true, plan: true } }); if (!subscription || !subscription.plan.allowRenewal || !canAccessCustomer(req, subscription.customer.userId)) return res.status(400).json({ success: false, message: "Renewal not permitted" }); const from = subscription.expiryDate || new Date(); return result(res, await prisma.subscription.update({ where: { id: subscription.id }, data: { status: SubscriptionStatus.ACTIVE, startDate: from, nextBillingDate: from, expiryDate: addCycle(from, subscription.plan.billingCycle) } }), "Subscription renewed"); });

router.get("/invoices", async (req, res) => { const where = req.user?.role === Role.CUSTOMER ? { customer: { userId: req.user.id } } : {}; return result(res, await prisma.invoice.findMany({ where, include: { items: true, payments: true }, orderBy: { createdAt: "desc" } })); });
router.get("/invoices/:id", async (req, res) => { const invoice = await prisma.invoice.findUnique({ where: { id: String(req.params.id) }, include: { customer: true, items: true, payments: true } }); if (!invoice || !canAccessCustomer(req, invoice.customer.userId)) return res.status(invoice ? 403 : 404).json({ success: false, message: invoice ? "Forbidden" : "Invoice not found" }); return result(res, invoice); });
router.post("/invoices/:id/confirm", requireRoles(Role.ADMIN, Role.STAFF), async (req, res) => { const invoice = await prisma.invoice.update({ where: { id: String(req.params.id) }, data: { status: InvoiceStatus.CONFIRMED } }); return result(res, invoice, "Invoice confirmed"); });
router.post("/invoices/:id/cancel", requireRoles(Role.ADMIN, Role.STAFF), async (req, res) => { const invoice = await prisma.invoice.update({ where: { id: String(req.params.id) }, data: { status: InvoiceStatus.CANCELLED } }); return result(res, invoice, "Invoice cancelled"); });
router.get("/invoices/:id/payments", async (req, res) => result(res, await prisma.payment.findMany({ where: { invoiceId: String(req.params.id) }, orderBy: { paidAt: "desc" } })));

router.post("/billing/generate", requireRoles(Role.ADMIN, Role.STAFF), async (_req, res) => {
  const due = await prisma.subscription.findMany({ where: { status: SubscriptionStatus.ACTIVE, nextBillingDate: { lte: new Date() } }, include: { items: { include: { product: true } }, customer: true, plan: true } });
  const invoices = [];
  for (const subscription of due) {
    const period = subscription.nextBillingDate?.toISOString().slice(0, 10) || new Date().toISOString().slice(0, 10);
    const existing = await prisma.invoice.findFirst({ where: { subscriptionId: subscription.id, billingPeriod: period } });
    if (existing) continue;
    const subtotal = subscription.items.reduce((sum, item) => sum.add(item.unitPrice.mul(item.quantity)), new Prisma.Decimal(0));
    const invoice = await prisma.$transaction(async (tx) => {
      const created = await tx.invoice.create({ data: { invoiceNumber: `INV-${Date.now()}-${invoices.length}`, customerId: subscription.customerId, subscriptionId: subscription.id, billingPeriod: period, subtotal, discountAmount: 0, taxAmount: 0, totalAmount: subtotal, dueDate: new Date(Date.now() + 30 * 86400000), items: { create: subscription.items.map((item) => ({ productId: item.productId, description: item.product.name, quantity: item.quantity, unitPrice: item.unitPrice, taxAmount: 0, totalAmount: item.unitPrice.mul(item.quantity) })) } }, include: { items: true } });
      await tx.subscription.update({ where: { id: subscription.id }, data: { nextBillingDate: addCycle(subscription.nextBillingDate || new Date(), subscription.plan.billingCycle) } });
      return created;
    });
    invoices.push(invoice);
  }
  return result(res, { generated: invoices.length, invoices }, "Billing generation complete");
});

router.get("/payments", requireRoles(Role.ADMIN, Role.STAFF), async (_req, res) => result(res, await prisma.payment.findMany({ include: { invoice: true }, orderBy: { paidAt: "desc" } })));
router.post("/payments", async (req, res) => {
  const parsed = z.object({ invoiceId: z.string().uuid(), amount: z.coerce.number().positive(), method: z.enum(["CASH", "BANK_TRANSFER", "CARD", "UPI", "OTHER"]), paidAt: z.coerce.date().optional(), note: z.string().optional() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues });
  const invoice = await prisma.invoice.findUnique({ where: { id: parsed.data.invoiceId }, include: { customer: true, payments: true } });
  if (!invoice || !canAccessCustomer(req, invoice.customer.userId)) return res.status(404).json({ success: false, message: "Invoice not found" });
  const payment = await prisma.$transaction(async (tx) => {
    const created = await tx.payment.create({ data: { ...parsed.data, amount: new Prisma.Decimal(parsed.data.amount) } });
    const paid = invoice.payments.reduce((sum, item) => sum.add(item.amount), new Prisma.Decimal(0)).add(created.amount);
    await tx.invoice.update({ where: { id: invoice.id }, data: { status: paid.gte(invoice.totalAmount) ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID } });
    return created;
  });
  return res.status(201).json({ success: true, message: "Payment recorded", data: payment });
});

router.get("/discounts", requireRoles(Role.ADMIN, Role.STAFF), async (_req, res) => result(res, await prisma.discount.findMany({ include: { products: true } })));
router.post("/discounts", requireRoles(Role.ADMIN), async (req, res) => { const parsed = z.object({ name: z.string().min(1), type: z.enum(["FIXED", "PERCENTAGE"]), value: z.coerce.number().nonnegative(), minimumQuantity: z.coerce.number().int().positive().optional(), minimumPurchase: z.coerce.number().nonnegative().optional(), startDate: z.coerce.date().optional(), endDate: z.coerce.date().optional(), usageLimit: z.coerce.number().int().positive().optional(), productIds: z.array(z.string().uuid()).optional() }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed", errors: parsed.error.issues }); const { productIds, ...data } = parsed.data; return res.status(201).json({ success: true, message: "Discount created", data: await prisma.discount.create({ data: { ...data, value: new Prisma.Decimal(data.value), minimumPurchase: data.minimumPurchase === undefined ? undefined : new Prisma.Decimal(data.minimumPurchase), products: { create: productIds?.map((productId) => ({ productId })) } } }) }); });
router.put("/discounts/:id", requireRoles(Role.ADMIN), async (req, res) => { const parsed = z.object({ active: z.boolean().optional(), value: z.coerce.number().nonnegative().optional(), endDate: z.coerce.date().nullable().optional() }).safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: "Validation failed" }); return result(res, await prisma.discount.update({ where: { id: String(req.params.id) }, data: { ...parsed.data, value: parsed.data.value === undefined ? undefined : new Prisma.Decimal(parsed.data.value) } }), "Discount updated"); });
router.delete("/discounts/:id", requireRoles(Role.ADMIN), async (req, res) => { await prisma.discount.delete({ where: { id: String(req.params.id) } }); return result(res, null, "Discount deleted"); });

router.get("/dashboard/stats", requireRoles(Role.ADMIN, Role.STAFF), async (req, res) => {
  const since = req.query.from ? new Date(String(req.query.from)) : undefined;
  const until = req.query.to ? new Date(String(req.query.to)) : undefined;
  const invoiceWhere = { createdAt: { ...(since ? { gte: since } : {}), ...(until ? { lte: until } : {}) } };
  const [customers, activeSubscriptions, totalSubscriptions, paid, outstanding, overdue, distribution] = await prisma.$transaction([
    prisma.customer.count(), prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }), prisma.subscription.count(),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { paidAt: { ...(since ? { gte: since } : {}), ...(until ? { lte: until } : {}) } } }),
    prisma.invoice.aggregate({ _sum: { totalAmount: true }, where: { ...invoiceWhere, status: { in: [InvoiceStatus.CONFIRMED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] } } }),
    prisma.invoice.count({ where: { status: InvoiceStatus.OVERDUE } }),
    prisma.subscription.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  return result(res, { totalCustomers: customers, activeSubscriptions, totalSubscriptions, revenueCollected: paid._sum.amount || 0, outstandingAmount: outstanding._sum.totalAmount || 0, overdueInvoices: overdue, subscriptionStatusDistribution: distribution });
});

export default router;

