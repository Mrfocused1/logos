import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, ExternalLink, GripVertical, Eye, EyeOff } from 'lucide-react';
import { menuService, MenuLink, CreateMenuLinkData } from '../../services/menuService';
import { Button, Input, GlassCard } from '../../components/ui';

const MenuLinksPage: React.FC = () => {
  const [links, setLinks] = useState<MenuLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New link form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState<CreateMenuLinkData>({ title: '', url: '' });

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ title: string; url: string }>({ title: '', url: '' });

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await menuService.getAllLinks();
      setLinks(data);
    } catch (err) {
      console.error('Error loading links:', err);
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      setError('Title and URL are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const maxOrder = links.length > 0 ? Math.max(...links.map(l => l.display_order)) : -1;
      await menuService.createLink({
        ...newLink,
        display_order: maxOrder + 1
      });
      setNewLink({ title: '', url: '' });
      setShowAddForm(false);
      await loadLinks();
      showSuccess('Link added successfully!');
    } catch (err) {
      console.error('Error adding link:', err);
      setError('Failed to add link');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLink = async (id: string) => {
    if (!editData.title.trim() || !editData.url.trim()) {
      setError('Title and URL are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await menuService.updateLink(id, editData);
      setEditingId(null);
      await loadLinks();
      showSuccess('Link updated successfully!');
    } catch (err) {
      console.error('Error updating link:', err);
      setError('Failed to update link');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      setSaving(true);
      setError(null);
      await menuService.deleteLink(id);
      await loadLinks();
      showSuccess('Link deleted successfully!');
    } catch (err) {
      console.error('Error deleting link:', err);
      setError('Failed to delete link');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (link: MenuLink) => {
    try {
      setSaving(true);
      setError(null);
      await menuService.updateLink(link.id, { is_active: !link.is_active });
      await loadLinks();
      showSuccess(`Link ${link.is_active ? 'hidden' : 'shown'} successfully!`);
    } catch (err) {
      console.error('Error toggling link:', err);
      setError('Failed to update link');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (link: MenuLink) => {
    setEditingId(link.id);
    setEditData({ title: link.title, url: link.url });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ title: '', url: '' });
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === links.length - 1)
    ) {
      return;
    }

    const newLinks = [...links];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap display orders
    const tempOrder = newLinks[index].display_order;
    newLinks[index].display_order = newLinks[swapIndex].display_order;
    newLinks[swapIndex].display_order = tempOrder;

    // Swap positions in array
    [newLinks[index], newLinks[swapIndex]] = [newLinks[swapIndex], newLinks[index]];

    setLinks(newLinks);

    try {
      await menuService.reorderLinks([
        { id: newLinks[index].id, display_order: newLinks[index].display_order },
        { id: newLinks[swapIndex].id, display_order: newLinks[swapIndex].display_order }
      ]);
    } catch (err) {
      console.error('Error reordering links:', err);
      await loadLinks(); // Reload to restore correct order
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Menu Links</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your linktree-style menu at /menu</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button
            variant="ghost"
            onClick={() => window.open('/menu', '_blank')}
            className="flex-1 sm:flex-none gap-1.5 sm:gap-2 border border-gray-300 text-sm sm:text-base px-3 sm:px-4 py-2"
          >
            <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>View Menu</span>
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowAddForm(true)}
            className="flex-1 sm:flex-none gap-1.5 sm:gap-2 bg-black text-white hover:bg-gray-800 text-sm sm:text-base px-3 sm:px-4 py-2"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Add Link</span>
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
        >
          {error}
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700"
        >
          {successMessage}
        </motion.div>
      )}

      {/* Add Link Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-6 bg-white border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Add New Link</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Title"
                placeholder="e.g., Instagram"
                value={newLink.title}
                onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
              />
              <Input
                label="URL"
                placeholder="https://instagram.com/bolalogos"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setNewLink({ title: '', url: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddLink}
                disabled={saving}
                className="bg-black text-white hover:bg-gray-800"
              >
                {saving ? 'Adding...' : 'Add Link'}
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Links List */}
      <GlassCard className="p-4 sm:p-6 bg-white border border-gray-200">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading links...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No links yet. Add your first link!</p>
            <Button
              variant="primary"
              onClick={() => setShowAddForm(true)}
              className="gap-2 bg-black text-white hover:bg-gray-800"
            >
              <Plus size={18} />
              Add Link
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border ${
                  link.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <button
                    onClick={() => moveLink(index, 'up')}
                    disabled={index === 0}
                    className="p-0.5 sm:p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <GripVertical size={14} className="sm:w-4 sm:h-4 rotate-180" />
                  </button>
                  <button
                    onClick={() => moveLink(index, 'down')}
                    disabled={index === links.length - 1}
                    className="p-0.5 sm:p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                  >
                    <GripVertical size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Link Content */}
                <div className="flex-1 min-w-0">
                  {editingId === link.id ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                      <Input
                        placeholder="Title"
                        value={editData.title}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        size="sm"
                      />
                      <Input
                        placeholder="URL"
                        value={editData.url}
                        onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
                        size="sm"
                      />
                    </div>
                  ) : (
                    <div className="min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{link.title}</h4>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-blue-600 hover:underline truncate block"
                      >
                        {link.url}
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {editingId === link.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateLink(link.id)}
                        disabled={saving}
                        className="text-green-600 hover:bg-green-50 p-1.5 sm:p-2"
                      >
                        <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        className="text-gray-600 hover:bg-gray-100 p-1.5 sm:p-2"
                      >
                        <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(link)}
                        className={`p-1.5 sm:p-2 ${link.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={link.is_active ? 'Hide link' : 'Show link'}
                      >
                        {link.is_active ? <Eye size={16} className="sm:w-[18px] sm:h-[18px]" /> : <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(link)}
                        className="text-blue-600 hover:bg-blue-50 p-1.5 sm:p-2"
                      >
                        <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-red-600 hover:bg-red-50 p-1.5 sm:p-2"
                      >
                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default MenuLinksPage;
