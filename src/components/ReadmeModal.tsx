import { X, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getMediaUrl } from '../services/api';

interface ReadmeModalProps {
    isOpen: boolean;
    onClose: () => void;
    readmeUrl: string | null;
    title: string;
}

export default function ReadmeModal({ isOpen, onClose, readmeUrl, title }: ReadmeModalProps) {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (isOpen && readmeUrl) {
            setLoading(true);
            setError(false);
            fetch(getMediaUrl(readmeUrl))
                .then(res => {
                    if (!res.ok) throw new Error("Failed to load");
                    return res.text();
                })
                .then(text => setContent(text))
                .catch(() => setError(true))
                .finally(() => setLoading(false));
        }
    }, [isOpen, readmeUrl]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-4xl max-h-[85vh] bg-[#0b1121] border border-blue-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-blue-500/10 bg-[#0f172a]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <FileText className="text-blue-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Documentation</h3>
                                    <p className="text-xs text-blue-300/60">{title}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0b1121]">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-4">
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                    <p className="text-slate-400 text-sm">Loading documentation...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-2 text-red-400">
                                    <p>Failed to load documentation.</p>
                                    <button onClick={onClose} className="text-blue-400 hover:underline text-sm">Close</button>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-blue max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
