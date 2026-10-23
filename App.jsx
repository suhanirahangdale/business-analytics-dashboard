
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const initialSales = [
  { id: 1001, name: "Rahul Sharma", product: "Laptop", category: "Electronics", amount: 45000, status: "Completed" },
  { id: 1002, name: "Priya Patel", product: "Headphones", category: "Electronics", amount: 2500, status: "Completed" },
  { id: 1003, name: "Amit Verma", product: "Shoes", category: "Fashion", amount: 3200, status: "Pending" },
  { id: 1004, name: "Sneha Gupta", product: "Watch", category: "Accessories", amount: 5200, status: "Completed" },
  { id: 1005, name: "Rohan Singh", product: "T-Shirt", category: "Fashion", amount: 1200, status: "Pending" },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const [sales, setSales] = useState(initialSales);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This Year");
  const [activePage, setActivePage] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    product: "",
    category: "Electronics",
    amount: "",
  });

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.amount),
    0
  );

  const filteredSales = sales.filter((sale) =>
    `${sale.name} ${sale.product} ${sale.category} ${sale.id}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [32000, 45000, 38000, 58000, 48000, 70000, 62000, 82000, 68000, 95000, 78000, 110000],
        backgroundColor: "#6366f1",
        borderRadius: 6,
        barThickness: 17,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [25000, 39000, 32000, 55000, 47000, 72000],
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.12)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryCounts = ["Electronics", "Fashion", "Accessories"].map(
    (category) =>
      sales
        .filter((sale) => sale.category === category)
        .reduce((sum, sale) => sum + Number(sale.amount), 0)
  );

  const doughnutData = {
    labels: ["Electronics", "Fashion", "Accessories"],
    datasets: [
      {
        data: categoryCounts,
        backgroundColor: ["#6366f1", "#10b981", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.16)" },
        ticks: {
          callback: (value) => "₹" + Number(value) / 1000 + "k",
        },
      },
      x: { grid: { display: false } },
    },
  };

  function addSale(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.product.trim() || Number(form.amount) <= 0) {
      alert("Please enter valid customer, product and amount details.");
      return;
    }

    setSales([
      {
        id: Date.now(),
        name: form.name.trim(),
        product: form.product.trim(),
        category: form.category,
        amount: Number(form.amount),
        status: "Pending",
      },
      ...sales,
    ]);

    setForm({
      name: "",
      product: "",
      category: "Electronics",
      amount: "",
    });

    setShowForm(false);
  }

  function exportCSV() {
    const rows = [
      ["Order ID", "Customer", "Product", "Category", "Amount", "Status"],
      ...filteredSales.map((sale) => [
        sale.id,
        sale.name,
        sale.product,
        sale.category,
        sale.amount,
        sale.status,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "business-sales-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">B</div>
          <span>BizAnalytics</span>
        </div>

        <p className="menu-label">WORKSPACE</p>

        {[
          ["Overview", "▦"],
          ["Sales", "↗"],
          ["Customers", "♙"],
          ["Reports", "▤"],
        ].map(([page, icon]) => (
          <button
            key={page}
            className={`nav-item ${activePage === page ? "active" : ""}`}
            onClick={() => setActivePage(page)}
          >
            <span>{icon}</span> {page}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>Need some help?</strong>
            <p>Explore your business insights with ease.</p>
            <button onClick={() => alert("Welcome to BizAnalytics!")}>
              Learn more →
            </button>
          </div>

          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <strong>Admin User</strong>
              <small>Administrator</small>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Workspace / {activePage}</div>
            <h1>{activePage === "Overview" ? "Business Overview" : activePage}</h1>
            <p className="subtitle">
              Welcome back! Here's what's happening with your business.
            </p>
          </div>

          <div className="top-actions">
            <button
              className="icon-button"
              title="Notifications"
              onClick={() => alert("You're all caught up!")}
            >
              ♧
            </button>
            <div className="top-avatar">S</div>
          </div>
        </header>

        <section className="toolbar">
          <div>
            <span className="live-dot"></span> Live dashboard
          </div>
          <div className="toolbar-actions">
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              aria-label="Select period"
            >
              <option>This Year</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
            </select>
            <button className="primary-button" onClick={() => setShowForm(true)}>
              + Add Sale
            </button>
          </div>
        </section>

        {showForm && (
          <div className="modal-backdrop">
            <form className="sale-form" onSubmit={addSale}>
              <h2>Add New Sale</h2>
              <label>
                Customer Name
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter customer name"
                  required
                />
              </label>
              <label>
                Product
                <input
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  placeholder="Enter product"
                  required
                />
              </label>
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Accessories</option>
                </select>
              </label>
              <label>
                Amount (₹)
                <input
                  type="number"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter amount"
                  required
                />
              </label>
              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  Save Sale
                </button>
              </div>
            </form>
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Total Revenue</span>
              <span className="stat-icon purple">₹</span>
            </div>
            <h2>{money(totalRevenue)}</h2>
            <p className="stat-note"><span className="positive">↑ 12.8%</span> vs last period</p>
            <div className="mini-bars">
              {[35, 50, 40, 65, 45, 80, 60, 95, 70, 85, 65, 100].map((height, i) => (
                <i key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Orders</span>
              <span className="stat-icon green">▣</span>
            </div>
            <h2>{(sales.length * 250).toLocaleString("en-IN")}</h2>
            <p className="stat-note"><span className="positive">↑ 8.2%</span> vs last period</p>
            <div className="mini-bars green-bars">
              {[45, 35, 60, 50, 75, 55, 85, 65, 90, 70, 80, 100].map((height, i) => (
                <i key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Customers</span>
              <span className="stat-icon orange">♙</span>
            </div>
            <h2>{(sales.length * 170).toLocaleString("en-IN")}</h2>
            <p className="stat-note"><span className="positive">↑ 5.4%</span> vs last period</p>
            <div className="mini-bars orange-bars">
              {[30, 45, 35, 55, 65, 50, 75, 60, 85, 70, 90, 100].map((height, i) => (
                <i key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Growth Rate</span>
              <span className="stat-icon pink">↗</span>
            </div>
            <h2>12.5%</h2>
            <p className="stat-note"><span className="positive">↑ 2.1%</span> vs last period</p>
            <div className="mini-bars pink-bars">
              {[25, 40, 35, 55, 45, 70, 55, 80, 65, 85, 75, 100].map((height, i) => (
                <i key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </section>

        <section className="charts-grid">
          <div className="panel sales-panel">
            <div className="panel-heading">
              <div>
                <h3>Sales Overview</h3>
                <p>Monthly sales performance</p>
              </div>
              <span className="legend-label"><i></i> Sales</span>
            </div>
            <div className="chart-container">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          <div className="panel category-panel">
            <div className="panel-heading">
              <div>
                <h3>Sales by Category</h3>
                <p>Revenue distribution</p>
              </div>
              <button className="dots-button" onClick={exportCSV}>•••</button>
            </div>
            <div className="doughnut-container">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "72%",
                  plugins: { legend: { display: false } },
                }}
              />
              <div className="doughnut-center">
                <strong>{money(totalRevenue)}</strong>
                <span>Total sales</span>
              </div>
            </div>
            <div className="category-legend">
              {["Electronics", "Fashion", "Accessories"].map((category, i) => (
                <div key={category}>
                  <span><i style={{ background: ["#6366f1", "#10b981", "#f59e0b"][i] }}></i>{category}</span>
                  <strong>{money(categoryCounts[i])}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel revenue-panel">
          <div className="panel-heading">
            <div>
              <h3>Revenue Trends</h3>
              <p>Revenue performance over the last six months</p>
            </div>
            <span className="legend-label green-legend"><i></i> Revenue</span>
          </div>
          <div className="revenue-chart">
            <Line
              data={lineData}
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    ticks: {
                      callback: (value) => "₹" + Number(value) / 1000 + "k",
                    },
                  },
                },
              }}
            />
          </div>
        </section>

        <section className="panel table-panel">
          <div className="panel-heading table-heading">
            <div>
              <h3>{activePage === "Customers" ? "Customer Directory" : "Recent Sales"}</h3>
              <p>Track and manage your latest transactions</p>
            </div>
            <div className="table-actions">
              <input
                className="search-input"
                placeholder="⌕  Search sales..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="secondary-button" onClick={exportCSV}>↓ Export</button>
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>#{String(sale.id).slice(-6)}</td>
                    <td><div className="customer-cell"><span className="customer-avatar">{sale.name.charAt(0)}</span><strong>{sale.name}</strong></div></td>
                    <td>{sale.product}</td>
                    <td>{sale.category}</td>
                    <td className="amount-cell">{money(sale.amount)}</td>
                    <td><span className={`status ${sale.status.toLowerCase()}`}>{sale.status}</span></td>
                  </tr>
                ))}
                {filteredSales.length === 0 && (
                  <tr><td colSpan="6" className="empty-state">No sales found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            Showing {filteredSales.length} of {sales.length} records
            <span>BizAnalytics Dashboard</span>
          </div>
        </section>

        <footer className="footer">
          © 2026 BizAnalytics · Business Intelligence Dashboard
          <span>Built with React & Chart.js</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
