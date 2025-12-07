import { useState, useEffect } from 'react';
import { adminAPI, storeAPI, Category } from '../../services/api';
import { X, Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DesignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    design?: any;
}

export default function DesignModal({ isOpen, onClose, onSuccess, design }: DesignModalProps) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        tool: 'Figma',
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [designFile, setDesignFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            fetchCategories();

            if (design) {
                // Fetch full details
                adminAPI.getDesign(design.id).then(res => {
                    const fullDesign = res.data;
                    setFormData({
                        title: fullDesign.title,
                        description: fullDesign.description,
                        category_id: typeof fullDesign.category === 'object' ? String((fullDesign.category as any).id) : String(fullDesign.category_id || ''),
                        tool: fullDesign.tool || 'Figma',
                    });
                    setExistingImages(fullDesign.images || []);
                }).catch(e => {
                    console.error(e);
                    // Fallback if detail fetch fails
                    setFormData({
                        title: design.title,
                        description: design.description,
                        category_id: design.category_id || '',
                        tool: design.tool || 'Figma',
                    });
                    // Fallback images from object if available
                    if (design.images) setExistingImages(design.images);
                });
            } else {
                setFormData({
                    title: '',
                    description: '',
                    category_id: '',
                    tool: 'Figma',
                });
                setImageFiles([]);
                setExistingImages([]);
                setDeletedImageIds([]);
                setDesignFile(null);
            }
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; }
    }, [isOpen, design]);

    const fetchCategories = async () => {
        try {
            const res = await storeAPI.getCategories();
            const resData = res.data as any;
            const categoriesData = resData.results || resData;
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (e) { console.error(e); }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setDesignFile(e.target.files[0]);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, String(value)));

        // Append Multiple Images
        if (imageFiles.length > 0) {
            imageFiles.forEach(file => data.append('uploaded_images', file));
        }

        // Append Deletions
        deletedImageIds.forEach(id => data.append('deleted_image_ids', String(id)));

        if (designFile) data.append('file', designFile);

        try {
            if (design) {
                await adminAPI.updateDesign(design.id, data);
                toast.success("Design updated");
            } else {
                await adminAPI.createDesign(data);
                toast.success("Design created");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error("Failed to save design");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-800">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        {design ? 'Edit Design' : 'Add New Design'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select required name="category_id" value={formData.category_id} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none bg-white">
                                <option value="">Select</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tool Used</label>
                            <input type="text" name="tool" value={formData.tool} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none" placeholder="Figma, Adobe XD" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Design Images</label>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-4 grid grid-cols-3 gap-3">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200">
                                        <img src={img.image} alt="Design" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDeletedImageIds(prev => [...prev, img.id]);
                                                setExistingImages(prev => prev.filter(i => i.id !== img.id));
                                            }}
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                        >
                                            <div className="bg-red-500/80 p-1.5 rounded-full">
                                                <X size={14} />
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-3 pb-4">
                                    <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500"><span className="font-semibold">Add Images</span></p>
                                </div>
                                <input type="file" onChange={handleImageChange} accept="image/*" multiple className="hidden" />
                            </label>
                        </div>
                        {imageFiles.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {imageFiles.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-md border border-pink-100">
                                        <span className="truncate max-w-[120px]">{f.name}</span>
                                        <button type="button" onClick={() => setImageFiles(prev => prev.filter((_, idx) => idx !== i))}>
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Design File (Zip/Fig)</label>
                        <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-70 flex items-center gap-2">
                            {loading ? 'Saving...' : 'Save Design'} <Plus size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
