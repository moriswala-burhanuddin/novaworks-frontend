
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reviewsAPI, Review } from '../../services/api';
import StarRating from './StarRating';
import { toast } from 'sonner';
import { User, Trash2, Edit2 } from 'lucide-react';

interface ReviewSectionProps {
    modelType: 'project' | 'design' | 'miniproject';
    objectId: number;
}

export default function ReviewSection({ modelType, objectId }: ReviewSectionProps) {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [modelType, objectId]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await reviewsAPI.getReviews(modelType, objectId);
            const data = res.data.results || res.data;
            setReviews(data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error("Please login to write a review");
            return;
        }
        setSubmitting(true);
        try {
            if (isEditing && userReview) {
                await reviewsAPI.updateReview(userReview.id, { rating, comment });
                toast.success("Review updated!");
            } else {
                await reviewsAPI.createReview({ model_type: modelType, object_id: objectId, rating, comment });
                toast.success("Review posted!");
            }
            // Reset form
            setRating(5);
            setComment('');
            setIsEditing(false);
            fetchReviews();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to submit review");
            if (error.response?.data?.non_field_errors) {
                toast.error(error.response.data.non_field_errors[0]);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await reviewsAPI.deleteReview(id);
            toast.success("Review deleted");
            fetchReviews();
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    // Helper to identify my review (Basic client-side heuristic until serializer has is_owner)
    const isMyReview = (review: Review) => {
        return user && (review.user_name === user.full_name || review.user_name === user.email);
    };

    // When reviews load, update local state for my review
    useEffect(() => {
        if (user && reviews.length > 0) {
            const myRev = reviews.find(r => isMyReview(r));
            if (myRev) {
                setUserReview(myRev);
            } else {
                setUserReview(null);
            }
        }
    }, [reviews, user]);

    // Pre-fill form on edit click
    const handlEditClick = (review: Review) => {
        setRating(review.rating);
        setComment(review.comment);
        setIsEditing(true);
        setUserReview(review); // ensure set
        // Scroll to form?
    };


    return (
        <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-8">Customer Reviews ({reviews.length})</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* REVIEWS LIST */}
                <div className="space-y-6">
                    {loading ? <p className="text-gray-400">Loading reviews...</p> : reviews.length === 0 ? (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to share your thoughts!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        {review.user_avatar ? (
                                            <img src={review.user_avatar} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <User size={16} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-white text-sm">{review.user_name || "Anonymous"}</p>
                                            <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {isMyReview(review) && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handlEditClick(review)} className="text-blue-400 hover:text-blue-300"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDelete(review.id)} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                                        </div>
                                    )}
                                </div>
                                <StarRating rating={review.rating} size={14} readOnly />
                                <p className="text-gray-300 mt-2 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* WRITE REVIEW FORM */}
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-fit">
                    <h4 className="text-xl font-bold text-white mb-4">{isEditing ? 'Edit Review' : 'Write a Review'}</h4>

                    {!isAuthenticated ? (
                        <div className="text-center py-6">
                            <p className="text-gray-400 mb-4">Please log in to post a review.</p>
                        </div>
                    ) : (userReview && !isEditing) ? (
                        <div className="text-center py-6 bg-green-500/10 rounded-xl border border-green-500/20">
                            <p className="text-green-400 font-bold">You have reviewed this item.</p>
                            <button onClick={() => handlEditClick(userReview)} className="mt-2 text-sm text-gray-400 underline hover:text-white">Edit your review</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Rating</label>
                                <StarRating rating={rating} setRating={setRating} size={24} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Review</label>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500/50 min-h-[120px]"
                                    placeholder="Share your experience..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Post Review')}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={() => { setIsEditing(false); setComment(''); setRating(5); }} className="w-full py-2 text-sm text-gray-400 hover:text-white">
                                    Cancel
                                </button>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
