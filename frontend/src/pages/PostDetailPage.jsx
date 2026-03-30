import { useParams } from 'react-router-dom';

export default function PostDetailPage() {
  const { id } = useParams();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Post Detail (ID: {id})</h1>
      <p className="text-gray-600">Coming in Layer 8</p>
    </div>
  );
}
