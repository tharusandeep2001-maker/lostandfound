import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePost, useUpdatePost } from '../hooks/postHooks';
import PostForm from '../components/post/PostForm';
import PageHeader from '../components/layout/PageHeader';
import toast from 'react-hot-toast';

export default function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: post, isLoading, isError } = usePost(id);
  const { mutateAsync: updatePost, isPending } = useUpdatePost();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <svg className="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-2xl mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Post not found</h2>
        <Link to="/posts" className="text-indigo-600 hover:underline">&larr; Back to Browse</Link>
      </div>
    );
  }

  const handleEdit = async (formData) => {
    try {
      await updatePost({ id, ...formData });
      toast.success('Post updated successfully');
      navigate(`/posts/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link to={`/posts/${id}`} className="text-indigo-600 hover:text-indigo-800 text-sm mb-4 inline-block font-medium">
        &larr; Back to Post Details
      </Link>
      
      <PageHeader 
        title="Edit Post"
        subtitle="Update the details of your recovered or lost item."
      />
      
      <div className="bg-white p-6 shadow-sm border border-slate-100 rounded-2xl">
        <PostForm mode="edit" defaultValues={post} onSubmit={handleEdit} isSubmitting={isPending} />
      </div>
    </div>
  );
}
