import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PostForm from '../components/post/PostForm';
import PageHeader from '../components/layout/PageHeader';
import { useCreatePost } from '../hooks/postHooks';

export default function PostCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync: createPost, isPending } = useCreatePost();

  async function handleCreate(formData) {
    const toastId = toast.loading('Submitting your report...');
    try {
      const result = await createPost(formData);
      toast.success(
        `Report submitted! ${
          result.matchCount > 0 
            ? result.matchCount + ' match(es) found.' 
            : 'We will notify you if a match is found.'
        }`,
        { id: toastId }
      );
      navigate(`/posts/${result.post._id}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to submit. Try again.',
        { id: toastId }
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <PageHeader 
        title="Report a Lost or Found Item"
        subtitle="Fill in the details to help others identify your item"
      />
      
      <div className="bg-white p-6 shadow-sm border border-slate-100 rounded-2xl">
        <PostForm mode="create" onSubmit={handleCreate} isSubmitting={isPending} />
      </div>
    </div>
  );
}
