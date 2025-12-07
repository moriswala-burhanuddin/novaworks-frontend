import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface Option {
    id: number;
    name: string;
}

interface MultiSelectProps {
    label: string;
    options: Option[];
    selectedIds: number[];
    onChange: (ids: number[]) => void;
    placeholder?: string;
}

export default function MultiSelect({ label, options, selectedIds, onChange, placeholder = "Select..." }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(prevId => prevId !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const removeTag = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        onChange(selectedIds.filter(prevId => prevId !== id));
    };

    const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

            <div
                className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 bg-white transition-all cursor-pointer flex flex-wrap gap-2 items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOptions.length === 0 && (
                    <span className="text-gray-400 text-sm">{placeholder}</span>
                )}

                {selectedOptions.map(option => (
                    <span key={option.id} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-sm flex items-center gap-1 border border-blue-100">
                        {option.name}
                        <button
                            onClick={(e) => removeTag(e, option.id)}
                            className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                <div className="ml-auto text-gray-400">
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto p-1">
                    {options.length === 0 ? (
                        <div className="p-3 text-center text-gray-400 text-sm">No options available</div>
                    ) : (
                        options.map(option => (
                            <div
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                                className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors flex items-center justify-between ${selectedIds.includes(option.id)
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                {option.name}
                                {selectedIds.includes(option.id) && <span className="text-blue-600">✓</span>}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
