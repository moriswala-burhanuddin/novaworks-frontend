import { useEffect, useState } from 'react';
import { adminAPI, getMediaUrl } from '../../services/api';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import ProjectModal from '../../components/admin/ProjectModal';

export default function AdminProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProjects();
    }, [currentPage]); // Re-fetch when page changes

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getProjects({ page: currentPage, search: searchTerm });
            // Handle pagination structure
            const data = res.data;
            if (data.results) {
                setProjects(data.results);
                // Calculate total pages (assuming page_size is standard, usually 10 or 20)
                // If backend provides `count`, we can deduce. DRF default limit/offset or page number?
                // Assuming standard PageNumberPagination: count, next, previous, results.
                const count = data.count || 0;
                const pageSize = 10; // Default DRF page size if not customized, adjust if needed
                setTotalPages(Math.ceil(count / pageSize));
            } else {
                setProjects(Array.isArray(data) ? data : []);
                setTotalPages(1);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    // Debounced search effect could be added, but for now simple filter or search param
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) fetchProjects();
            else setCurrentPage(1); // Reset to page 1 which triggers fetch
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await adminAPI.deleteProject(id);
            setProjects(projects.filter(p => p.id !== id));
            toast.success("Project deleted");
            // Optionally re-fetch if list becomes empty
        } catch (err) {
            toast.error("Failed to delete project");
        }
    }

    const handleEdit = (project: any) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    }

    const handleCreate = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    }

    const handleSuccess = () => {
        fetchProjects();
    }

    // Client-side filtering if API search not fully implemented or for instant feedback on current page
    // But since valid search uses API, we rely on API results mostly.
    // However, keeping filteredProjects for backward compat if API search fails or returns all?
    // Actually, let's rely on `projects` state which comes from API.

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-500 text-sm">Manage your digital products</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full md:w-64 text-sm"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/25"
                    >
                        <Plus size={18} />
                        Add New
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-400">Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        No projects found.
                    </div>
                ) : projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                        <div className="relative h-48 bg-gray-100">
                            <img
                                src={getMediaUrl(project.thumbnail || project.images?.[0]?.image)}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-blue-600 rounded-lg shadow-sm"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-red-500 rounded-lg shadow-sm">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded-md">
                                {project.version}
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 line-clamp-1">{project.title}</h3>
                                <span className="font-mono text-sm font-medium text-blue-600">₹{project.price_inr}</span>
                            </div>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{project.description}</p>

                            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                                <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${project.featured ? 'bg-amber-400' : 'bg-gray-300'}`}></div>
                                    {project.featured ? 'Featured' : 'Standard'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                project={selectedProject}
            />
        </div>
    );
}
