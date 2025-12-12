import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { supabase, TermsCondition } from '../lib/supabase';

const AdminTerms = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<TermsCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    display_order: 0,
    is_active: true,
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('admin_authenticated')) {
      navigate('/admin/login');
      return;
    }
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('terms_conditions')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTerms(data || []);
    } catch (error) {
      console.error('Error fetching terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (term: TermsCondition) => {
    setEditingId(term.id);
    setEditForm({
      title: term.title,
      content: term.content,
      display_order: term.display_order,
      is_active: term.is_active,
    });
    setShowAddForm(false);
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('terms_conditions')
        .update(editForm)
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      fetchTerms();
      alert('Term updated successfully!');
    } catch (error) {
      console.error('Error updating term:', error);
      alert('Failed to update term');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this term?')) return;

    try {
      const { error } = await supabase.from('terms_conditions').delete().eq('id', id);

      if (error) throw error;
      fetchTerms();
      alert('Term deleted successfully!');
    } catch (error) {
      console.error('Error deleting term:', error);
      alert('Failed to delete term');
    }
  };

  const handleAdd = async () => {
    try {
      const { error } = await supabase.from('terms_conditions').insert({
        ...editForm,
        display_order: terms.length + 1,
      });

      if (error) throw error;

      setShowAddForm(false);
      setEditForm({ title: '', content: '', display_order: 0, is_active: true });
      fetchTerms();
      alert('Term added successfully!');
    } catch (error) {
      console.error('Error adding term:', error);
      alert('Failed to add term');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('terms_conditions')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchTerms();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00baff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-white/70 hover:text-[#00baff] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </motion.button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
            <p className="text-white/70">Manage your event booking terms</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingId(null);
              setEditForm({ title: '', content: '', display_order: terms.length + 1, is_active: true });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Term
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border border-[#00baff] rounded-xl p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Term</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none"
                  placeholder="Booking Confirmation"
                />
              </div>
              <div>
                <label className="block text-white/70 font-semibold mb-2">Content *</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none resize-none"
                  placeholder="Enter the term content..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Add Term
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-black border border-white/20 text-white font-bold rounded-lg hover:border-[#00baff] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Terms List */}
        <div className="space-y-4">
          {terms.map((term) => (
            <motion.div
              key={term.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-black border rounded-xl p-6 ${
                term.is_active ? 'border-white/20' : 'border-white/10 opacity-60'
              }`}
            >
              {editingId === term.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 font-semibold mb-2">Content *</label>
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleSave(term.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-6 py-2 bg-black border border-white/20 text-white font-bold rounded-lg hover:border-[#00baff] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">
                          {term.display_order}. {term.title}
                        </h3>
                        {!term.is_active && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 whitespace-pre-line">{term.content}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleActive(term.id, term.is_active)}
                        className={`p-2 rounded transition-colors ${
                          term.is_active
                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30'
                        }`}
                        title={term.is_active ? 'Hide' : 'Show'}
                      >
                        {term.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(term)}
                        className="p-2 bg-yellow-500/20 text-yellow-500 rounded hover:bg-yellow-500/30 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(term.id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {terms.length === 0 && !showAddForm && (
          <div className="text-center py-12 text-white/60">
            <p className="mb-4">No terms and conditions yet.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
            >
              Add Your First Term
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTerms;


