import { Star } from 'lucide-react';
import './StarRating.css';

export default function StarRating({ rating = 5, max = 5, size = 16 }) {
  return (
    <div className="star-rating" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'star-rating__star--filled' : 'star-rating__star--empty'}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}
