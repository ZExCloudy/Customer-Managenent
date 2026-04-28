import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const PAGE_SIZE = 5;

  const validate = () => {
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address.';
    if (form.phone.length === 0)
      errs.phone = 'Phone number is required.';
    else if (form.phone.length < 10)
      errs.phone = `Phone must be 10 digits (${form.phone.length}/10 entered).`;
    return errs;
  };

  const formatPhone = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 10);
    if (d.length <= 4) return d;
    if (d.length <= 7) return `${d.slice(0, 4)}-${d.slice(4)}`;
    return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7)}`;
  };

  const fetchCustomers = () =>
    fetch('/customers').then(r => r.json()).then(setCustomers);

  useEffect(() => { fetchCustomers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    await fetch('/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', email: '', phone: '' });
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    await fetch(`/customers/${id}`, { method: 'DELETE' });
    fetchCustomers();
  };

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const highlight = (text) => {
    if (!search) return text;
    const parts = text.split(new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((p, i) =>
      p.toLowerCase() === search.toLowerCase()
        ? <mark key={i} className="highlight">{p}</mark>
        : p
    );
  };

  return (
    <div className="page">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="logo">CM</div>
          <button className="menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <nav>
          <span className="nav-item active" onClick={() => setMenuOpen(false)}>Customers</span>
        </nav>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      <div className="content-wrap">
        <header className="mobile-header">
          <button className="hamburger" onClick={() => setMenuOpen(true)}>☰</button>
          <span className="mobile-title">Customer Management</span>
          <div className="total-badge">{customers.length} Total</div>
        </header>

        <main className="main">
        <div className="topbar">
          <div>
            <h1>Customer Management</h1>
            <p className="subtitle">Manage your customer records</p>
          </div>
          <div className="total-badge desktop-badge">{customers.length} Total</div>
        </div>

        <div className="card form-card">
          <h2 className="card-title">Add New Customer</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label>Full Name</label>
              <input
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Email Address</label>
              <input
                placeholder="john@example.com"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={errors.email ? 'input-error' : ''}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input
                placeholder="9879-890-890"
                value={formatPhone(form.phone)}
                onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className={errors.phone ? 'input-error' : ''}
                required
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
            <div className="field submit-field">
              <label>&nbsp;</label>
              <button type="submit" className="btn-primary">
                <span>＋</span> Add Customer
              </button>
            </div>
          </form>
        </div>

        <div className="card table-card">
          <div className="table-header">
            <h2 className="card-title">Customer List</h2>
            <div className="search-wrapper">
              <input
                className="search-input"
                placeholder="Search by name, email or phone…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              <button className="btn-search" onClick={() => setPage(1)}>
                🔍 Search
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Added At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6">
                      <div className="empty-state">
                        <span className="empty-icon">👤</span>
                        <p>No customers found.</p>
                      </div>
                    </td>
                  </tr>
                ) : paginated.map((c, i) => (
                  <tr key={c.id}>
                    <td><span className="row-num">{(page - 1) * PAGE_SIZE + i + 1}</span></td>
                    <td><span className="avatar">{c.name[0].toUpperCase()}</span>{highlight(c.name)}</td>
                    <td>{highlight(c.email)}</td>
                    <td>{highlight(formatPhone(c.phone))}</td>
                    <td className="date-cell">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}</td>
                    <td>
                      <button className="btn-delete" onClick={() => handleDelete(c.id)}>
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹ Prev</button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className={`page-num ${n === page ? 'active' : ''}`}
                    onClick={() => setPage(n)}
                  >{n}</button>
                ))}
              </div>
              <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next ›</button>
            </div>
          )}
        </div>
        </main>
      </div>
    </div>
  );
}

export default App;
