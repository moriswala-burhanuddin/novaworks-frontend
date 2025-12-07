import { X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CodeComponent } from '../services/api';

interface CodeViewerProps {
    component: CodeComponent | null;
    onClose: () => void;
}

export default function CodeViewer({ component, onClose }: CodeViewerProps) {
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
    const [copied, setCopied] = useState(false);

    if (!component) return null;

    const getCode = () => {
        switch (activeTab) {
            case 'html': return component.html_code;
            case 'css': return component.css_code;
            case 'js': return component.js_code;
            default: return '';
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {component && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#020617]">
                            <div>
                                <h2 className="text-xl font-bold text-white">{component.title}</h2>
                                <p className="text-sm text-slate-400">{component.category.name}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} className="text-slate-400 hover:text-white" />
                            </button>
                        </div>

                        {/* Split View: Preview & Code */}
                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                            {/* Preview Panel */}
                            <div className="flex-1 bg-[#020617] p-8 flex items-center justify-center overflow-auto border-b lg:border-b-0 lg:border-r border-white/5 relative">
                                <style>{component.css_code}</style>
                                <div dangerouslySetInnerHTML={{ __html: component.html_code }} />
                                <span className="absolute top-2 left-2 text-xs font-mono text-slate-600 uppercase">Preview</span>
                            </div>

                            {/* Code Panel */}
                            <div className="flex-1 flex flex-col bg-[#0f172a] min-h-[300px]">
                                <div className="flex items-center border-b border-white/5">
                                    {(['html', 'css', 'js'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-6 py-3 text-sm font-mono uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab
                                                    ? 'border-primary text-white bg-white/5'
                                                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                    <div className="ml-auto p-2">
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
                                        >
                                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                            {copied ? 'Copied' : 'Copy Code'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-auto p-4 font-mono text-sm text-slate-300">
                                    <pre className="whitespace-pre-wrap theme-atom-one-dark">
                                        <code>{getCode()}</code>
                                    </pre>
                                    {!getCode() && (
                                        <div className="h-full flex items-center justify-center text-slate-600 italic">
                                            No {activeTab.toUpperCase()} code for this component.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
