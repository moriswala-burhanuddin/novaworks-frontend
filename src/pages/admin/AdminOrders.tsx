import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Search, Filter, Eye } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await adminAPI.getOrders();
            setOrders(res.data.results || res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 text-sm">Manage and view all customer transactions</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64 text-sm"
                        />
                    </div>
                    <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                                <th className="py-4 px-6">Order ID</th>
                                <th className="py-4 px-6">Customer</th>
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Amount</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {loading ? (
                                <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading orders...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan={6} className="py-8 text-center text-gray-400">No orders found matching your search.</td></tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="py-4 px-6 font-mono text-gray-600">
                                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">{order.order_id}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{order.full_name}</div>
                                            <div className="text-xs text-gray-500">{order.email}</div>
                                            <div className="text-xs text-gray-400 mt-1">{order.phone} • {order.city}, {order.country}</div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-gray-900">
                                            {order.currency} {order.amount}
                                            <div className="text-xs text-gray-500 bg-gray-100 inline-block px-1 rounded mt-1">{order.items?.length || 0} items</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => {
                                                    // Simple alert for now, or expand logic. 
                                                    // Ideally we'd use a modal, but let's stick to table enhancement first as per request "full details" usually implies visible.
                                                    alert(JSON.stringify(order, null, 2))
                                                }}
                                                className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"
                                                title="View JSON Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination could go here */}
                <div className="p-4 border-t border-gray-100 text-xs text-center text-gray-400">
                    Showing {filteredOrders.length} orders
                </div>
            </div>
        </div>
    );
}
