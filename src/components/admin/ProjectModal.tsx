import { useState, useEffect } from 'react';
import { adminAPI, Category, Technology, Tag, storeAPI } from '../../services/api';
import { X, Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';
import MultiSelect from './MultiSelect';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    project?: any; // If editing
}

export default function ProjectModal({ isOpen, onClose, onSuccess, project }: ProjectModalProps) {
    const [loading, setLoading] = useState(false);

    // Data Sources
    const [categories, setCategories] = useState<Category[]>([]);
    const [technologies, setTechnologies] = useState<Technology[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price_inr: '',
        price_usd: '',
        discount_percentage: '0',
        category_id: '',
        version: 'v1.0',
        demo_link: '',
        github_release_url: '',
        license_type: 'PROPRIETARY',
        featured: false,
    });

    // Multi-select states
    const [selectedTechIds, setSelectedTechIds] = useState<number[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]); // Store {id, image, is_thumbnail}
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [readmeFile, setReadmeFile] = useState<File | null>(null);

    const fetchData = async () => {
        try {
            const [catRes, techRes, tagRes] = await Promise.all([
                storeAPI.getCategories(),
                storeAPI.getTechnologies(),
                storeAPI.getTags()
            ]);

            // Handle pagination or direct list for Categories
            const catData = catRes.data as any;
            setCategories(Array.isArray(catData) ? catData : (catData.results || []));

            // Handle pagination or direct list for Technologies
            const techData = techRes.data as any;
            setTechnologies(Array.isArray(techData) ? techData : (techData.results || []));

            // Handle pagination or direct list for Tags
            const tagData = tagRes.data as any;
            setTags(Array.isArray(tagData) ? tagData : (tagData.results || []));

        } catch (error) {
            console.error("Failed to fetch form data", error);
            toast.error("Failed to load form options");
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Disable body scroll
            fetchData();

            if (project) {
                // Fetch full details to get all images
                adminAPI.getProject(project.id).then(res => {
                    const fullProject = res.data;

                    // Determine valid license
                    const validLicenses = ['MIT', 'GNU', 'PROPRIETARY', 'APACHE', 'BSD'];
                    const license = validLicenses.includes(fullProject.license_type) ? fullProject.license_type : 'PROPRIETARY';

                    setFormData({
                        title: fullProject.title,
                        description: fullProject.description,
                        price_inr: String(fullProject.price_inr),
                        price_usd: String(fullProject.price_usd),
                        discount_percentage: String(fullProject.discount_percentage),
                        category_id: fullProject.category?.id ? String(fullProject.category.id) : '',
                        version: fullProject.version,
                        demo_link: fullProject.demo_link || '',
                        github_release_url: fullProject.github_release_url || '',
                        license_type: license,
                        featured: fullProject.featured,
                    });

                    setSelectedTechIds(fullProject.technologies?.map((t: any) => t.id) || []);
                    setSelectedTagIds(fullProject.tags?.map((t: any) => t.id) || []);
                    setExistingImages(fullProject.images || []);
                }).catch(err => {
                    console.error("Failed to fetch full project details", err);
                    toast.error("Failed to load project details");
                });

            } else {
                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    price_inr: '',
                    price_usd: '',
                    discount_percentage: '0',
                    category_id: '',
                    version: 'v1.0',
                    demo_link: '',
                    github_release_url: '',
                    license_type: 'PROPRIETARY',
                    featured: false,
                });
                setSelectedTechIds([]);
                setSelectedTagIds([]);
                setImageFiles([]);
                setExistingImages([]);
                setDeletedImageIds([]);
                setReadmeFile(null);
            }
        } else {
            document.body.style.overflow = ''; // Re-enable body scroll
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [isOpen, project]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
        }
    }

    const handleReadmeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReadmeFile(e.target.files[0]);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, String(value));
        });

        // Append Multi-selects (need to append each ID separately)
        selectedTechIds.forEach(id => data.append('technology_ids', String(id)));
        selectedTagIds.forEach(id => data.append('tag_ids', String(id)));

        // Append Multiple Images
        if (imageFiles.length > 0) {
            imageFiles.forEach((file) => {
                data.append('uploaded_images', file);
            });
        }

        // Append IDs of images to delete
        deletedImageIds.forEach(id => data.append('deleted_image_ids', String(id)));

        if (readmeFile) {
            data.append('readme_file', readmeFile);
        }

        try {
            if (project) {
                await adminAPI.updateProject(project.id, data);
                toast.success("Project updated successfully");
            } else {
                await adminAPI.createProject(data);
                toast.success("Project created successfully");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (error: any) => {
        if (error.response?.data) {
            const data = error.response.data;
            if (data.detail) return data.detail;

            // Handle field errors (e.g. { title: ["This field is required."] })
            const fieldErrors = Object.entries(data)
                .map(([key, messages]) => `${key}: ${(Array.isArray(messages) ? messages : [messages]).join(' ')}`)
                .join(' | ');

            return fieldErrors || "Failed to save project";
        }
        return "Failed to save project";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 m-0 w-screen h-screen">
            <div className="bg-white w-full h-full flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header - Fixed */}
                <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100 bg-white z-10 shadow-sm">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {project ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <form id="projectForm" onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g., E-Commerce Platform"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Detailed description of functionality..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    required
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all"
                                >
                                    <option value="">Select Category</option>
                                    {categories?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            {/* MultiSelects */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <MultiSelect
                                    label="Technologies"
                                    options={technologies}
                                    selectedIds={selectedTechIds}
                                    onChange={setSelectedTechIds}
                                    placeholder="Select technologies..."
                                />
                                <MultiSelect
                                    label="Tags"
                                    options={tags}
                                    selectedIds={selectedTagIds}
                                    onChange={setSelectedTagIds}
                                    placeholder="Select tags..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
                                <input
                                    required
                                    type="number"
                                    name="price_inr"
                                    value={formData.price_inr}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                                <input
                                    required
                                    type="number"
                                    name="price_usd"
                                    value={formData.price_usd}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                                <input
                                    type="number"
                                    name="discount_percentage"
                                    value={formData.discount_percentage}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
                                <select
                                    name="license_type"
                                    value={formData.license_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all"
                                >
                                    <option value="MIT">MIT License</option>
                                    <option value="GNU">GNU GPL v3</option>
                                    <option value="PROPRIETARY">Proprietary / Commercial</option>
                                    <option value="APACHE">Apache License 2.0</option>
                                </select>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Release URL (for downloads)</label>
                                <input
                                    type="url"
                                    name="github_release_url"
                                    value={formData.github_release_url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="https://github.com/user/repo/releases/download/v1.0/file.zip"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Demo Link</label>
                                <input
                                    type="url"
                                    name="demo_link"
                                    value={formData.demo_link}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Project Images</label>

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-4 grid grid-cols-3 sm:grid-cols-4 gap-4">
                                        {existingImages.map((img) => (
                                            <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200">
                                                <img src={img.image} alt="Project" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDeletedImageIds(prev => [...prev, img.id]);
                                                        setExistingImages(prev => prev.filter(i => i.id !== img.id));
                                                    }}
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                                >
                                                    <div className="bg-red-500/80 p-2 rounded-full">
                                                        <X size={16} />
                                                    </div>
                                                </button>
                                                {img.is_thumbnail && (
                                                    <span className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">Cover</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                            <p className="text-sm text-gray-500"><span className="font-semibold">Add New Images</span></p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG (MAX. 800x400px)</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                                    </label>
                                </div>
                                {imageFiles.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {imageFiles.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100 max-w-full">
                                                <span className="truncate max-w-[150px]">{f.name}</span>
                                                <button type="button" onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-blue-800">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Readme Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">README File (Markdown)</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                            <p className="text-sm text-gray-500"><span className="font-semibold">Upload README.md</span></p>
                                            <p className="text-xs text-gray-400 mt-1">Markdown .md files</p>
                                        </div>
                                        <input type="file" className="hidden" accept=".md" onChange={handleReadmeChange} />
                                    </label>
                                </div>
                                {readmeFile && <p className="text-sm text-green-600 mt-2 truncate">Selected: {readmeFile.name}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="featured"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured Project</label>
                        </div>
                    </form>
                </div>

                {/* Footer - Fixed */}
                <div className="flex-none p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="projectForm"
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? 'Saving...' : 'Save Project'}
                        {!loading && <Plus size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
