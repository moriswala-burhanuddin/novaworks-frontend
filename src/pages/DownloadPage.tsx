import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Package, Check, Loader2, AlertCircle } from 'lucide-react';
import { storeAPI, getMediaUrl } from '../services/api';
import { toast } from 'sonner';

export default function DownloadPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await storeAPI.getOrderById(orderId!);
            setOrder(res.data);
        } catch (err: any) {
            console.error(err);
            setError("Failed to load order details. You may not be authorized to view this order.");
            toast.error("Access Denied or Order Not Found");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    if (error || !order) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-red-500/10 p-6 rounded-full mb-6 text-red-400">
                <AlertCircle size={48} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Access Error</h1>
            <p className="text-slate-400 max-w-md mb-8">{error}</p>
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all">
                Go Home
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-20 px-4 md:px-6 relative overflow-x-hidden">
            <div className="max-w-4xl mx-auto">

                {/* Success Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 text-green-400 rounded-full mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Payment Successful!</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Thank you for your purchase. Your order has been confirmed and your downloads are ready below.
                    </p>
                    <div className="mt-4 text-sm text-slate-500 font-mono bg-white/5 inline-block px-4 py-2 rounded-lg border border-white/10">
                        Order ID: {order.order_id}
                    </div>
                </div>

                {/* Downloads List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Package className="text-primary" />
                        Your Downloads
                    </h2>

                    {order.items.map((item: any) => (
                        <div key={item.id} className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl transition-all hover:border-primary/30 group">
                            <img
                                src={getMediaUrl(item.project_image) || '/placeholder.png'}
                                alt={item.project_title}
                                className="w-full md:w-32 h-48 md:h-24 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="flex-1 text-center md:text-left w-full">
                                <h3 className="text-xl font-bold text-white mb-2">{item.project_title}</h3>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                    <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-md border border-primary/20">v1.0</span>
                                    <span className="bg-white/5 text-slate-400 text-xs px-2 py-1 rounded-md border border-white/10">License: Standard</span>
                                </div>
                                <p className="text-sm text-slate-400 hidden md:block">
                                    Thank you for supporting our work. Access your files securely below.
                                </p>
                            </div>

                            <div className="w-full md:w-auto">
                                <DownloadButton orderId={order.id} item={item} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-slate-400 hover:text-white transition-colors underline"
                    >
                        View Account & Order History
                    </button>
                </div>

            </div>
        </div>
    );
}

function DownloadButton({ orderId, item }: { orderId: string, item: any }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            toast.info("Starting secure download...");
            const response = await storeAPI.downloadItem(orderId, item.id);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // Extract filename from header if possible, else default
            const contentDisposition = response.headers['content-disposition'];
            let filename = `${item.project_title || 'download'}.zip`;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2)
                    filename = fileNameMatch[1];
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Download started!");
            toast.success("Download started!");
        } catch (error: any) {
            console.error(error);
            let errorMessage = "Download failed. Please try again.";

            // If response is a blob (which it is for downloadItem), we need to parse it to get JSON error
            if (error.response && error.response.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const json = JSON.parse(text);
                    if (json.error) errorMessage = json.error;
                } catch (e) {
                    // Failed to parse blob as text/json, stick to default
                }
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            toast.error(errorMessage);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {downloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {downloading ? "Downloading..." : "Download Files"}
        </button>
    );
}
