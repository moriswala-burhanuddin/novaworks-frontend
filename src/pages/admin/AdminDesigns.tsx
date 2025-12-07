import { useEffect, useState } from 'react';
import { adminAPI, getMediaUrl } from '../../services/api';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import DesignModal from '../../components/admin/DesignModal';

export default function AdminDesigns() {
    const [designs, setDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState<any>(null);

    useEffect(() => {
        fetchDesigns();
    }, []);

    const fetchDesigns = async () => {
        try {
            const res = await adminAPI.getDesigns();
            setDesigns(res.data.results || res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load designs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this design?")) return;
        try {
            await adminAPI.deleteDesign(id);
            setDesigns(designs.filter(d => d.id !== id));
            toast.success("Design deleted");
        } catch (err) {
            toast.error("Failed to delete design");
        }
    }

    const handleEdit = (design: any) => {
        setSelectedDesign(design);
        setIsModalOpen(true);
    }

    const handleCreate = () => {
        setSelectedDesign(null);
        setIsModalOpen(true);
    }

    const handleSuccess = () => {
        fetchDesigns();
    }

    const filteredDesigns = designs.filter(
        (design) =>
            design.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Designs</h1>
                    <p className="text-gray-500 text-sm">Manage UI/UX designs</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search designs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64 text-sm"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-pink-500/25"
                    >
                        <Plus size={18} />
                        Add New
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-400">Loading designs...</div>
                ) : filteredDesigns.map((design) => (
                    <div key={design.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                        <div className="relative h-48 bg-gray-100">
                            <img
                                src={getMediaUrl(
                                    design.images?.find((img: any) => img.is_thumbnail)?.image ||
                                    design.images?.[0]?.image ||
                                    design.image
                                )}
                                alt={design.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={() => handleEdit(design)}
                                    className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-pink-600 rounded-lg shadow-sm"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(design.id)}
                                    className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-red-500 rounded-lg shadow-sm">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{design.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{design.description}</p>
                            <div className="text-xs text-gray-400 border-t border-gray-50 pt-3">
                                {new Date(design.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <DesignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                design={selectedDesign}
            />
        </div>
    );
}
