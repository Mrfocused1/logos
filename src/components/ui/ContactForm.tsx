import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './Button';

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  className?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
  logoFile?: File;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, className }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setLogoFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setLogoFile(file);
      }
    }
  };

  const removeFile = () => {
    setLogoFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData, logoFile: logoFile || undefined };
    onSubmit?.(submitData);
  };

  if (!showForm) {
    return (
      <div className={`max-w-lg mx-auto ${className}`}>
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          size="lg"
          className="w-full bg-black text-white hover:bg-white hover:text-black hover:border-black border-2 border-black transition-all duration-300"
        >
          Contact Me
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`max-w-lg mx-auto space-y-6 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
          Project Type *
        </label>
        <select
          id="projectType"
          name="projectType"
          required
          value={formData.projectType}
          onChange={handleInputChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors appearance-none bg-white"
        >
          <option value="">Select a project type</option>
          <option value="brand-identity">Brand Identity</option>
          <option value="graphic-design">Graphic Design</option>
          <option value="web-design">Web Design</option>
          <option value="logo-design">Logo Design</option>
          <option value="illustration">Illustration</option>
          <option value="other">Other</option>
        </select>
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current/Aspired Logo (Optional)
        </label>
        <div
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragActive ? 'border-black bg-gray-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {logoFile ? (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{logoFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your logo here, or{' '}
                <label className="text-black font-medium cursor-pointer hover:underline">
                  browse files
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, or SVG up to 10MB</p>
            </>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Project Details *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell me about your project, goals, and any specific requirements..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors resize-none"
        />
      </div>

      <div className="flex gap-2 sm:gap-4">
        <Button
          type="button"
          onClick={() => setShowForm(false)}
          variant="secondary"
          size="sm"
          className="flex-1 sm:size-lg py-2 sm:py-3 text-sm sm:text-base"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="flex-1 sm:size-lg py-2 sm:py-3 text-sm sm:text-base bg-black text-white hover:bg-gray-800 hover:text-white"
        >
          Send Message
        </Button>
      </div>
    </form>
  );
};