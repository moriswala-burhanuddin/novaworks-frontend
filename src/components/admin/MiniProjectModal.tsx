import { useState, useEffect } from 'react';
import { adminAPI, storeAPI, Category, Technology } from '../../services/api';
import { X, Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MiniProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    project?: any;
}

export default function MiniProjectModal({ isOpen, onClose, onSuccess, project }: MiniProjectModalProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        price: '0.00',
        source_code: '',
        demo_link: '',
    });
    const [selectedTechIds, setSelectedTechIds] = useState<number[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            fetchData();
            if (project) {
                setFormData({
                    title: project.title,
                    description: project.description,
                    category_id: typeof project.category === 'object' ? String(project.category.id) : String(project.category_id || ''),
                    price: String(project.price || '0.00'),
                    source_code: project.source_code || '',
                    demo_link: project.demo_link || '',
                });
                if (project.technologies) {
                    setSelectedTechIds(project.technologies.map((t: any) => t.id || t));
                }
            } else {
                setFormData({
                    title: '',
                    description: '',
                    category_id: '',
                    price: '0.00',
                    source_code: '',
                    demo_link: '',
                });
                setSelectedTechIds([]);
                setImageFile(null);
            }
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; }
    }, [isOpen, project]);

    const fetchData = async () => {
        try {
            const [catRes, techRes] = await Promise.all([
                storeAPI.getCategories(),
                storeAPI.getTechnologies()
            ]);

            const cats = (catRes.data as any).results || catRes.data;
            const techs = (techRes.data as any).results || techRes.data;

            setCategories(Array.isArray(cats) ? cats : []);
            setTechnologies(Array.isArray(techs) ? techs : []);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load form data");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
    }

    const toggleTech = (id: number) => {
        setSelectedTechIds(prev =>
            prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, String(value)));
        selectedTechIds.forEach(id => data.append('technology_ids', String(id)));

        if (imageFile) data.append('image', imageFile);

        try {
            if (project) {
                await adminAPI.updateMiniProject(project.id, data);
                toast.success("Mini Project updated");
            } else {
                await adminAPI.createMiniProject(data);
                toast.success("Mini Project created");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to save mini project");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-800">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {project ? 'Edit Mini Project' : 'Add New Mini Project'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select required name="category_id" value={formData.category_id} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none bg-white">
                                <option value="">Select</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-xl">
                            {technologies.map(tech => (
                                <button
                                    key={tech.id}
                                    type="button"
                                    onClick={() => toggleTech(tech.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedTechIds.includes(tech.id)
                                            ? 'bg-purple-100 text-purple-700 border-purple-200'
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {tech.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Source Code URL</label>
                            <input type="url" name="source_code" value={formData.source_code} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="https://github.com/..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                            <input type="url" name="demo_link" value={formData.demo_link} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="https://demo.com" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                        {project && project.image && !imageFile && (
                            <img src={project.image} alt="Current" className="w-full h-32 object-cover rounded-lg mb-2 opacity-70" />
                        )}
                        <input type="file" onChange={handleImageChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100" />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center gap-2">
                            {loading ? 'Saving...' : 'Save Mini Project'} <Plus size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
