import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, Activity, Globe } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await adminAPI.getDashboardStats();
            setStats(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-10 text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2">Welcome back, here's what's happening today.</p>
                </div>
                <a href="/" className="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium flex items-center gap-2">
                    <Globe size={16} /> Go to Website
                </a>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.counts?.users || 0}
                    icon={Users}
                    color="bg-blue-500"
                    trend="+12% this month"
                />
                <StatCard
                    title="Total Orders"
                    value={stats?.counts?.orders || 0}
                    icon={ShoppingBag}
                    color="bg-indigo-500"
                    trend="+5 new today"
                />
                <StatCard
                    title="Total Revenue (INR)"
                    value={`₹${(stats?.revenue?.inr || 0).toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                    trend="INR Sales"
                />
                <StatCard
                    title="Total Projects"
                    value={stats?.counts?.projects || 0}
                    icon={Package}
                    color="bg-violet-500"
                    trend="Active Products"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                                    <th className="pb-3 text-left pl-2">Order ID</th>
                                    <th className="pb-3 px-4">Customer</th>
                                    <th className="pb-3 px-4">Amount</th>
                                    <th className="pb-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {stats?.recent_orders?.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 pl-2 font-mono text-gray-600">#{order.order_id.substring(0, 8)}...</td>
                                        <td className="py-4 px-4 text-gray-900 font-medium">{order.full_name}</td>
                                        <td className="py-4 px-4 text-gray-600">{order.currency} {order.amount}</td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                                order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.recent_orders || stats.recent_orders.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-400">No recent orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Activity (Placeholder for now) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">System Status</h2>
                    <div className="space-y-6 flex-1">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">System Healthy</p>
                                <p className="text-xs text-gray-500 mt-1">All systems operational. API response time: 12ms</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Daily Goal</p>
                                <div className="w-full bg-gray-100 rounded-full h-2 mt-2 overflow-hidden">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">70% of daily revenue target reached</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl text-white shadow-lg shadow-opacity-20 ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                    {trend}
                </span>
                <span className="text-gray-400 ml-2">vs last period</span>
            </div>
        </div>
    )
}
