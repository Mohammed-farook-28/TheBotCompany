import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase, TicketType } from '../lib/supabase';

interface TicketTypeForm {
  name: string;
  description: string;
  price: number;
  total_quantity: number;
  max_per_order: number;
}

const AdminEventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_end_date: '',
    location: '',
    venue_name: '',
    image_url: '',
    category: 'experience',
    status: 'active',
    organizer: 'ULA Experiences',
    terms_and_conditions: '',
  });

  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>([
    { name: '', description: '', price: 0, total_quantity: 0, max_per_order: 10 },
  ]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (!sessionStorage.getItem('admin_authenticated')) {
      navigate('/admin/login');
      return;
    }

    if (isEditMode) {
      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
    // Set image preview when image_url changes
    if (formData.image_url) {
      setImagePreview(formData.image_url);
    }
  }, [formData.image_url]);

  const fetchEvent = async () => {
    try {
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventData) {
        setFormData({
          title: eventData.title,
          description: eventData.description,
          event_date: new Date(eventData.event_date).toISOString().slice(0, 16),
          event_end_date: eventData.event_end_date
            ? new Date(eventData.event_end_date).toISOString().slice(0, 16)
            : '',
          location: eventData.location,
          venue_name: eventData.venue_name || '',
          image_url: eventData.image_url || '',
          category: eventData.category,
          status: eventData.status,
          organizer: eventData.organizer,
          terms_and_conditions: eventData.terms_and_conditions || '',
        });
      }

      const { data: ticketsData } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('event_id', id);

      if (ticketsData && ticketsData.length > 0) {
        setTicketTypes(
          ticketsData.map((t) => ({
            name: t.name,
            description: t.description || '',
            price: parseFloat(t.price.toString()),
            total_quantity: t.total_quantity,
            max_per_order: t.max_per_order,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.event_date) newErrors.event_date = 'Event date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (ticketTypes.length === 0) {
      newErrors.tickets = 'At least one ticket type is required';
    } else {
      ticketTypes.forEach((ticket, index) => {
        if (!ticket.name.trim()) newErrors[`ticket_${index}_name`] = 'Ticket name is required';
        if (ticket.price <= 0) newErrors[`ticket_${index}_price`] = 'Price must be greater than 0';
        if (ticket.total_quantity <= 0)
          newErrors[`ticket_${index}_quantity`] = 'Quantity must be greater than 0';
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const eventPayload = {
        ...formData,
        event_date: new Date(formData.event_date).toISOString(),
        event_end_date: formData.event_end_date
          ? new Date(formData.event_end_date).toISOString()
          : null,
      };

      let eventId = id;

      if (isEditMode) {
        // Update event
        const { error: updateError } = await supabase
          .from('events')
          .update(eventPayload)
          .eq('id', id);

        if (updateError) throw updateError;

        // Delete existing ticket types
        await supabase.from('ticket_types').delete().eq('event_id', id);
      } else {
        // Create new event
        const { data: newEvent, error: createError } = await supabase
          .from('events')
          .insert(eventPayload)
          .select()
          .single();

        if (createError) throw createError;
        eventId = newEvent.id;
      }

      // Insert ticket types
      const ticketPayload = ticketTypes.map((ticket) => ({
        event_id: eventId,
        name: ticket.name,
        description: ticket.description || null,
        price: ticket.price,
        total_quantity: ticket.total_quantity,
        available_quantity: ticket.total_quantity,
        max_per_order: ticket.max_per_order,
      }));

      const { error: ticketsError } = await supabase.from('ticket_types').insert(ticketPayload);

      if (ticketsError) throw ticketsError;

      alert(isEditMode ? 'Event updated successfully!' : 'Event created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { name: '', description: '', price: 0, total_quantity: 0, max_per_order: 10 },
    ]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const updateTicketType = (index: number, field: keyof TicketTypeForm, value: any) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setTicketTypes(updated);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 10MB for high-quality posters)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      setUploading(true);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      // Update form data with the image URL
      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);

      alert('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black border border-white/20 rounded-xl p-8"
        >
          <h1 className="text-3xl font-bold mb-8">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Details Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#00baff]">Event Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-bold mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors ${
                      errors.title ? 'border-red-500' : 'border-white/20 focus:border-[#00baff]'
                    }`}
                    placeholder="Tech Conference 2025"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none transition-colors"
                  >
                    <option value="experience">Experience</option>
                    <option value="conference">Conference</option>
                    <option value="workshop">Workshop</option>
                    <option value="tour">Tour</option>
                    <option value="festival">Festival</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors resize-none ${
                    errors.description
                      ? 'border-red-500'
                      : 'border-white/20 focus:border-[#00baff]'
                  }`}
                  placeholder="Describe your event..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Terms and Conditions</label>
                <textarea
                  value={formData.terms_and_conditions}
                  onChange={(e) => setFormData({ ...formData, terms_and_conditions: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#00baff] transition-colors resize-none font-['Josefin_Sans']"
                  placeholder="Enter event-specific terms and conditions. Use line breaks to separate points.&#10;&#10;Example:&#10;• All tickets are non-refundable&#10;• Entry is subject to availability&#10;• Valid ID required for entry&#10;• Photography allowed for personal use only"
                />
                <p className="text-xs text-white/50 mt-2">
                  These terms will be displayed on the event detail page. Leave empty to use default terms.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-bold mb-2">Event Start Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none transition-colors ${
                      errors.event_date
                        ? 'border-red-500'
                        : 'border-white/20 focus:border-[#00baff]'
                    }`}
                  />
                  {errors.event_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.event_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Event End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.event_end_date}
                    onChange={(e) => setFormData({ ...formData, event_end_date: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-bold mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors ${
                      errors.location ? 'border-red-500' : 'border-white/20 focus:border-[#00baff]'
                    }`}
                    placeholder="New York"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Venue Name</label>
                  <input
                    type="text"
                    value={formData.venue_name}
                    onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors"
                    placeholder="Convention Center"
                  />
                </div>
              </div>

              {/* Event Image Upload */}
              <div>
                <label className="block text-white font-bold mb-2">Event Image</label>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center justify-center gap-2 px-6 py-3 bg-black border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        uploading
                          ? 'border-white/20 opacity-50 cursor-not-allowed'
                          : 'border-[#00baff] hover:bg-[#00baff]/10'
                      }`}
                    >
                      {uploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#00baff] border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-white/70">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-[#00baff]" />
                          <span className="text-white font-semibold">Upload Image</span>
                        </>
                      )}
                    </label>
                    <p className="text-xs text-white/50">
                      Supported: JPG, PNG, GIF, WebP (Max 10MB)
                      <br />
                      All sizes: Portrait posters, Landscape banners, Square images
                    </p>
                    
                    {/* Manual URL input (optional) */}
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Or paste image URL:</label>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-white/20 rounded-lg text-white text-sm placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Image Preview - Supports all aspect ratios */}
                  <div>
                    {imagePreview ? (
                      <div className="relative rounded-lg overflow-hidden border-2 border-[#00baff] bg-black">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full max-h-96 object-contain"
                          style={{ display: 'block' }}
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, image_url: '' });
                              setImagePreview('');
                            }}
                            className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/80 rounded text-xs text-white/70">
                          All sizes supported: Portrait, Landscape, Square
                        </div>
                      </div>
                    ) : (
                      <div className="h-96 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
                        <div className="text-center text-white/50">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">No image selected</p>
                          <p className="text-xs mt-2 text-white/40">
                            Portrait, Landscape & Square supported
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-bold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="sold_out">Sold Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">Organizer</label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors"
                    placeholder="ULA Experiences"
                  />
                </div>
              </div>

            </div>

            {/* Ticket Types Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#00baff]">Ticket Types</h2>
                <button
                  type="button"
                  onClick={addTicketType}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Ticket Type
                </button>
              </div>

              {errors.tickets && <p className="text-red-500 text-sm">{errors.tickets}</p>}

              {ticketTypes.map((ticket, index) => (
                <div
                  key={index}
                  className="bg-black border border-white/20 rounded-lg p-6 space-y-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Ticket Type #{index + 1}</h3>
                    {ticketTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicketType(index)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 font-semibold mb-2">Name *</label>
                      <input
                        type="text"
                        value={ticket.name}
                        onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                        className={`w-full px-4 py-2 bg-black border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors ${
                          errors[`ticket_${index}_name`]
                            ? 'border-red-500'
                            : 'border-white/20 focus:border-[#00baff]'
                        }`}
                        placeholder="Early Bird"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-semibold mb-2">Price (₹) *</label>
                      <input
                        type="number"
                        value={ticket.price}
                        onChange={(e) =>
                          updateTicketType(index, 'price', parseFloat(e.target.value) || 0)
                        }
                        className={`w-full px-4 py-2 bg-black border rounded-lg text-white focus:outline-none transition-colors ${
                          errors[`ticket_${index}_price`]
                            ? 'border-red-500'
                            : 'border-white/20 focus:border-[#00baff]'
                        }`}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-2">Description</label>
                    <input
                      type="text"
                      value={ticket.description}
                      onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors"
                      placeholder="100 tickets available"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 font-semibold mb-2">
                        Total Quantity *
                      </label>
                      <input
                        type="number"
                        value={ticket.total_quantity}
                        onChange={(e) =>
                          updateTicketType(index, 'total_quantity', parseInt(e.target.value) || 0)
                        }
                        className={`w-full px-4 py-2 bg-black border rounded-lg text-white focus:outline-none transition-colors ${
                          errors[`ticket_${index}_quantity`]
                            ? 'border-red-500'
                            : 'border-white/20 focus:border-[#00baff]'
                        }`}
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-semibold mb-2">
                        Max Per Order
                      </label>
                      <input
                        type="number"
                        value={ticket.max_per_order}
                        onChange={(e) =>
                          updateTicketType(index, 'max_per_order', parseInt(e.target.value) || 1)
                        }
                        className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none transition-colors"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_30px_rgba(0,186,255,0.5)]"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditMode ? 'Update Event' : 'Create Event'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-8 py-4 bg-black border border-white/20 text-white font-bold rounded-lg hover:border-[#00baff] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminEventForm;

