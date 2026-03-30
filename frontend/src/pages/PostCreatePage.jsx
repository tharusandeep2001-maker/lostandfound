import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PostForm from '../components/post/PostForm';
import { useCreatePost } from '../hooks/postHooks';

export default function PostCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync: createPostMutation, isPending } = useCreatePost();

  async function handleCreate(formData) {
    try {
      const result = await createPostMutation(formData);
      toast.success(`Post created! ${result.matchCount ?? 0} match(es) found.`);
      navigate(`/posts/${result.post._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Report a Lost or Found Item</h1>
        <p className="text-gray-500 mt-2">Fill in the details to help others identify your item</p>
      </div>
      
      <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
        <PostForm mode="create" onSubmit={handleCreate} isSubmitting={isPending} />
      </div>
    </div>
  );
}
