import { useParams } from 'react-router-dom';

const ReviewPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Review {id}</h1>
      <p>Esta página mostrará la información completa de tu reseña.</p>
    </div>
  );
};

export default ReviewPage;
