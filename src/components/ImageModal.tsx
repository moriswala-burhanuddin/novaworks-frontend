import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '../services/api';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: { id?: number; image: string }[];
    initialIndex?: number;
}

export default function ImageModal({ isOpen, onClose, images, initialIndex = 0 }: ImageModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Sync internal state when opened
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex]);

    const showNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const showPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
                onClick={onClose}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20 group"
                >
                    <X size={24} className="group-hover:rotate-90 transition-transform" />
                </button>

                {/* Counter */}
                <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/10 text-white font-medium text-sm backdrop-blur-md z-20">
                    {currentIndex + 1} / {images.length}
                </div>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); showPrev(); }}
                            className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20 hover:scale-110 active:scale-95"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); showNext(); }}
                            className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20 hover:scale-110 active:scale-95"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </>
                )}

                {/* Main Image */}
                <div
                    className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
                    onClick={(e) => e.stopPropagation()}
                >
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={currentIndex}
                            src={getMediaUrl(images[currentIndex].image)}
                            alt={`View ${currentIndex + 1}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm selection:bg-transparent"
                            draggable={false}
                        />
                    </AnimatePresence>
                </div>

            </motion.div>
        </AnimatePresence>
    );
}
