import { useEffect, useState } from 'react';
import { adminAPI, getMediaUrl } from '../../services/api';
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import MiniProjectModal from '../../components/admin/MiniProjectModal';

export default function AdminMiniProjects() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getMiniProjects();
            setData(res.data.results || res.data);
        } catch (error) {
            console.error("Failed to load mini projects", error);
            toast.error("Failed to load mini projects");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this mini project?")) return;
        try {
            await adminAPI.deleteMiniProject(id);
            setData(data.filter(d => d.id !== id));
            toast.success("Deleted successfully");
        } catch (err) { toast.error("Failed to delete"); }
    }

    const handleCreate = () => {
        setSelected(null);
        setIsModalOpen(true);
    }

    const handleEdit = (item: any) => {
        setSelected(item);
        setIsModalOpen(true);
    }

    const handleSuccess = () => {
        loadData();
    }

    const filtered = data.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mini Projects</h1>
                    <p className="text-gray-500 text-sm">Scripts, utilities, and components</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 w-full md:w-64 text-sm"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/25"
                    >
                        <Plus size={18} />
                        Add New
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-400">Loading...</div>
                ) : filtered.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                        <div className="relative h-40 bg-gray-100">
                            <img
                                src={getMediaUrl(item.image)}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-purple-600 rounded-lg shadow-sm">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-red-500 rounded-lg shadow-sm">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                                <span className="text-sm font-medium text-purple-600">₹{item.price || 'Free'}</span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2 h-10">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <MiniProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                project={selected}
            />
        </div>
    );
}
