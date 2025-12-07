
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    setRating?: (rating: number) => void;
    size?: number;
    readOnly?: boolean;
}

export default function StarRating({ rating, setRating, size = 20, readOnly = false }: StarRatingProps) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readOnly && setRating && setRating(star)}
                    disabled={readOnly}
                    className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                >
                    <Star
                        size={size}
                        className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                            } transition-colors`}
                    />
                </button>
            ))}
        </div>
    );
}
