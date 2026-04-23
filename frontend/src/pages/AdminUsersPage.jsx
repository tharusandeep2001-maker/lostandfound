import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, banUser, deleteUser } from '../services/adminService';
import { ArrowLeft, Ban, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId, name, isBanned) => {
    if (!confirm(`Are you sure you want to ${isBanned ? 'unban' : 'ban'} ${name}?`)) return;
    setActionLoading(userId);
    try {
      const data = await banUser(userId);
      toast.success(data.message);
      setUsers(users.map(u =>
        u._id === userId ? { ...u, isBanned: data.isBanned } : u
      ));
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId, name) => {
    if (!confirm(`Are you sure you want to permanently delete ${name}? This cannot be undone.`)) return;
    setActionLoading(userId);
    try {
      await deleteUser(userId);
      toast.success(`${name} has been deleted`);
      setUsers(users.filter(u => u._id !== userId));
    } catch {
      toast.error('Delete failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
        <span className="ml-auto bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
          {users.length} students
        </span>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No users registered yet.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Faculty</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Joined</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{user.faculty}</td>
                  <td className="px-6 py-4">
                    {user.isBanned ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        <Ban className="w-3 h-3" /> Banned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleBan(user._id, user.name, user.isBanned)}
                        disabled={actionLoading === user._id}
                        className={`px-3 py-1.5 text-xs font-medium rounded-xl transition ${
                          user.isBanned
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        } disabled:opacity-50`}
                      >
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        disabled={actionLoading === user._id}
                        className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}