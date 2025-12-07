import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "What technologies do you use?",
        answer: "We primarily work with the MERN stack (MongoDB, Express, React, Node.js) and Next.js for full-stack applications. For styling, we use Tailwind CSS and Framer Motion for animations."
    },
    {
        question: "Can I use these projects for commercial purposes?",
        answer: "Yes, most of our templates and projects come with a commercial license. Please check the specific license details included with each project."
    },
    {
        question: "Do you offer custom development services?",
        answer: "Absolutely! We specialize in building custom web applications tailored to your specific business needs. Contact us to discuss your project."
    },
    {
        question: "How do I get support?",
        answer: "We offer dedicated support for all our premium products via email and Discord. Our community is also active and helpful for general questions."
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 bg-main relative">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 text-primary mb-6">
                        <HelpCircle size={24} />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Frequently Asked <span className="text-primary">Questions</span>
                    </h2>
                    <p className="text-slate-400">
                        Everything you need to know about our products and services.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="group rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-primary/20"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={`font-medium text-lg transition-colors ${openIndex === idx ? 'text-primary' : 'text-white'}`}>
                                    {faq.question}
                                </span>
                                <span className={`p-2 rounded-full transition-all duration-300 ${openIndex === idx ? 'bg-primary/20 text-primary rotate-180' : 'bg-white/5 text-slate-400'}`}>
                                    {openIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
