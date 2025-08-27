import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getLatestPublicReviews, type PublicReview } from '../services/supabase/publicReviews';

const LatestReviewsSection = () => {
  const [reviews, setReviews] = useState<PublicReview[]>([]);

  useEffect(() => {
    getLatestPublicReviews(4).then(setReviews).catch(() => {});
  }, []);

    return (
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-left text-3xl font-bold">Últimas opiniones</h2>
          {reviews.length === 0 ? (
            <p className="text-left text-gray-500">Aún no hay reseñas.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {reviews.map((r, i) => (
                <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                  className="rounded-lg bg-gray-50 p-6 text-left"
                >
                <p className="font-semibold text-gray-900">
                  {r.full_address ?? 'Dirección desconocida'}
                </p>
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {r.owner_opinion ?? 'Sin comentario'}
                </p>
                {r.created_at && (
                  <p className="mt-3 text-sm text-gray-500">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestReviewsSection;
