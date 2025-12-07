import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Search, Mail } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await adminAPI.getUsers();
            setUsers(res.data.results || res.data); // Expecting list of users
        } catch (error) {
            console.error(error);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-500 text-sm">Manage registered accounts</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64 text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                            <th className="py-4 px-6">User</th>
                            <th className="py-4 px-6">Role</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                            {user.full_name ? user.full_name[0] : user.email[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.full_name || 'No Name'}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Mail size={10} /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    {user.is_superuser ? (
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-medium border border-purple-200">Admin</span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs border border-gray-200">Customer</span>
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </td>
                                <td className="py-4 px-6 text-gray-500">
                                    {new Date(user.date_joined).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 border-t border-gray-100 text-xs text-center text-gray-400">
                    Showing {filteredUsers.length} users
                </div>
            </div>
        </div>
    );
}
