import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Mock fetch function - in reality this would hit an admin endpoint like /api/orders/all
const fetchOrders = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: '#DW-10042', customer: 'Rahul Sharma', date: 'Oct 12, 2026', total: 14999, status: 'Delivered', payment: 'Paid' },
    { id: '#DW-10043', customer: 'Priya Patel', date: 'Oct 12, 2026', total: 29998, status: 'Processing', payment: 'Paid' },
    { id: '#DW-10044', customer: 'Amit Kumar', date: 'Oct 13, 2026', total: 9999, status: 'Placed', payment: 'Pending' },
    { id: '#DW-10045', customer: 'Sneha Gupta', date: 'Oct 13, 2026', total: 45999, status: 'Shipped', payment: 'Paid' },
    { id: '#DW-10046', customer: 'Vikram Singh', date: 'Oct 14, 2026', total: 14999, status: 'Cancelled', payment: 'Refunded' },
  ];
};

export default function OrdersTable() {
  const [statusFilter, setStatusFilter] = useState('All');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const filteredOrders = statusFilter === 'All' ? orders : orders.filter((o: any) => o.status === statusFilter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-brand-green/20 text-brand-green-dark';
      case 'Processing': return 'bg-warning-gold/20 text-warning-gold';
      case 'Shipped': return 'bg-primary-blue/20 text-primary-blue-dark';
      case 'Cancelled': return 'bg-error-red/20 text-error-red';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-ink-muted flex items-center justify-center h-64">Loading orders...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Orders</h1>
          <p className="text-ink-muted">Manage and track customer orders.</p>
        </div>
        <button className="bg-white border border-slate-200 text-ink px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm hover:bg-slate-50">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex gap-2">
            {['All', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === status 
                    ? 'bg-primary-blue text-white' 
                    : 'bg-white border border-slate-200 text-ink-muted hover:text-ink hover:border-slate-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:border-primary-blue w-64"
              />
            </div>
            <button className="p-1.5 border border-slate-200 rounded-md text-ink-muted hover:text-ink bg-white">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-ink-muted font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Fulfillment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-ink">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-ink">{order.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm font-semibold">₹{order.total.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      order.payment === 'Paid' ? 'bg-brand-green-light text-brand-green-dark' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-ink-muted hover:text-primary-blue p-1">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-ink-muted bg-white">
          <span>Showing 1 to {filteredOrders.length} of {orders.length} results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
