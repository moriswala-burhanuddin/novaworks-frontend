import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmail() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');
    const verifyCalled = useRef(false);

    useEffect(() => {
        if (verifyCalled.current) return;
        verifyCalled.current = true;

        if (!uid || !token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        authAPI.verifyEmail(uid, token)
            .then(() => {
                setStatus('success');
                setMessage('Email verified successfully! You can now login.');
                toast.success("Email Verified!");
                setTimeout(() => navigate('/login'), 3000);
            })
            .catch((err) => {
                console.error(err);
                setStatus('error');
                setMessage(err.response?.data?.detail || 'Verification failed. Link may be invalid or expired.');
                toast.error("Verification failed");
            });
    }, [uid, token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">

                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                        <h2 className="text-xl font-semibold text-gray-700">Verifying...</h2>
                        <p className="text-gray-500 mt-2">Please wait while we activate your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center animate-fadeInUp">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Verified!</h2>
                        <p className="text-green-700 font-medium mt-2">{message}</p>
                        <p className="text-sm text-gray-400 mt-4">Redirecting to login...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center animate-fadeInUp">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                            <XCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
                        <p className="text-red-600 font-medium mt-2">{message}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
