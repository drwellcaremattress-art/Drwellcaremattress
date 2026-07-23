import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProductEditor from './pages/ProductEditor';
import OrdersTable from './pages/OrdersTable';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Bell,
  Search,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed">
      <div className="p-6">
        <div className="font-heading font-bold text-2xl text-primary-blue flex items-center gap-1">
          Dr Well Care<span className="text-brand-green text-3xl leading-none">.</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted ml-1">Admin Panel</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                isActive(item.path)
                  ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/20'
                  : 'text-ink-muted hover:bg-slate-50 hover:text-ink'
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-blue-light flex items-center justify-center text-primary-blue font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-semibold">Admin User</p>
            <p className="text-xs text-ink-muted">admin@drwellcare.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search orders, products, customers..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-ink-muted hover:text-ink transition-colors">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error-red rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}

function DashboardOverview() {
  const kpis = [
    { title: "Today's Revenue", value: '₹1,24,500', change: '+12.5%', isPositive: true },
    { title: "Orders", value: '24', change: '+5.2%', isPositive: true },
    { title: "AOV", value: '₹14,999', change: '-1.4%', isPositive: false },
    { title: "Conversion Rate", value: '3.2%', change: '+0.8%', isPositive: true },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Dashboard Overview</h1>
          <p className="text-ink-muted mt-1">Here's what's happening with your store today.</p>
        </div>
        <button className="bg-primary-blue hover:bg-primary-blue-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <TrendingUp size={18} /> Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-ink-muted text-sm font-medium mb-2">{kpi.title}</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-mono font-bold text-ink">{kpi.value}</span>
              <span className={`flex items-center text-sm font-semibold ${kpi.isPositive ? 'text-brand-green' : 'text-error-red'}`}>
                {kpi.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-ink-muted">Revenue Chart Placeholder (Recharts)</p>
        </div>
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-ink-muted">Top Products List Placeholder</p>
        </div>
      </div>
    </div>
  );
}

import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/*"
          element={
            <div className="flex bg-surface-alt min-h-screen">
              <Sidebar />
              <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Topbar />
                <main className="flex-1 overflow-x-hidden">
                  <Routes>
                    <Route path="/" element={<DashboardOverview />} />
                    <Route path="/products/*" element={<ProductEditor />} />
                    <Route path="/orders/*" element={<OrdersTable />} />
                    <Route path="*" element={<div className="p-8 text-center mt-20">Coming Soon</div>} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
