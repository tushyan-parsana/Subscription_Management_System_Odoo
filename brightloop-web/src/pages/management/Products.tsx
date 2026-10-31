
import { useMemo, useState } from 'react'
import {
  Package, Plus, Search, Download, Pencil, Trash2, X,
  CheckCircle2, XCircle
} from 'lucide-react'

type Product = {
  id: number
  name: string
  description: string
  category: string
  price: number
  interval: 'Monthly' | 'Yearly'
  status: 'Active' | 'Inactive'
}

const initialProducts: Product[] = [
  { id: 1, name: 'Brightloop Starter', description: 'Essential tools for small teams', category: 'Software', price: 499, interval: 'Monthly', status: 'Active' },
  { id: 2, name: 'Brightloop Pro', description: 'Advanced features for growing businesses', category: 'Software', price: 1499, interval: 'Monthly', status: 'Active' },
  { id: 3, name: 'Brightloop Enterprise', description: 'Complete business management suite', category: 'Software', price: 14999, interval: 'Yearly', status: 'Active' },
  { id: 4, name: 'Priority Support', description: 'Dedicated priority customer support', category: 'Support', price: 2999, interval: 'Monthly', status: 'Inactive' },
]

const emptyForm = {
  name: '',
  description: '',
  category: 'Software',
  price: '',
  interval: 'Monthly' as 'Monthly' | 'Yearly',
  status: 'Active' as 'Active' | 'Inactive',
}

function Products() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)

  const filteredProducts = useMemo(() => products.filter(product => {
    const matchesSearch = `${product.name} ${product.description} ${product.category}`
      .toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || product.status === filter
    return matchesSearch && matchesFilter
  }), [products, search, filter])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: String(product.price),
      interval: product.interval,
      status: product.status,
    })
    setShowForm(true)
  }

  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const price = Number(form.price)
    if (!form.name.trim() || !Number.isFinite(price) || price <= 0) return

    if (editingId !== null) {
      setProducts(current => current.map(product =>
        product.id === editingId ? { ...product, ...form, price } : product
      ))
    } else {
      setProducts(current => [
        ...current,
        { id: Date.now(), ...form, price },
      ])
    }

    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const deleteProduct = (id: number) => {
    if (window.confirm('Delete this product?')) {
      setProducts(current => current.filter(product => product.id !== id))
    }
  }

  const exportCSV = () => {
    const rows = [
      ['Product', 'Description', 'Category', 'Price', 'Billing Interval', 'Status'],
      ...filteredProducts.map(product => [
        product.name, product.description, product.category,
        String(product.price), product.interval, product.status
      ])
    ]
    const csv = rows.map(row =>
      row.map(value => `"${value.replace(/"/g, '""')}"`).join(',')
    ).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'brightloop-products.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const activeCount = products.filter(p => p.status === 'Active').length

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your products and subscription offerings.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50">
            <Download size={17} /> Export
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Products</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{products.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Active Products</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{activeCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Inactive Products</p>
          <p className="text-3xl font-bold text-slate-500 mt-2">{products.length - activeCount}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Billing</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Package size={20} /></div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{product.interval}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {product.status === 'Active' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(product)} title="Edit" className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Pencil size={16} /></button>
                      <button onClick={() => deleteProduct(product.id)} title="Delete" className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-slate-500">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                <p className="text-sm text-slate-500 mt-1">Enter the product details below.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
            </div>
            <form onSubmit={saveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="Enter product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" rows={2} placeholder="Short description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
                    <option>Software</option><option>Support</option><option>Services</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input required type="number" min="0.01" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm" placeholder="1499" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Billing Interval</label>
                  <select value={form.interval} onChange={e => setForm({ ...form, interval: e.target.value as Product['interval'] })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
                    <option>Monthly</option><option>Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Product['status'] })} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">{editingId ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
