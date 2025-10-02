import emailjs from '@emailjs/browser';
import type { ContactFormData } from '../components/ui/ContactForm';

// EmailJS configuration - these will be set as environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_bola_logos';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_contact_form';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const emailService = {
  // Initialize EmailJS
  init() {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  },

  // Check if EmailJS is configured
  isConfigured(): boolean {
    return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
  },

  // Send contact form email
  async sendContactForm(formData: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
      // Check if EmailJS is configured
      if (!this.isConfigured()) {
        console.warn('EmailJS not configured, using mailto fallback');
        this.openMailto(formData);
        return {
          success: true,
          message: 'Email client opened with your message. Please send the email to complete your inquiry.'
        };
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        project_type: formData.projectType,
        message: formData.message,
        to_email: 'logosbola@gmail.com',
        reply_to: formData.email,
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email sent successfully:', response);
      return {
        success: true,
        message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!'
      };
    } catch (error) {
      console.error('Failed to send email:', error);

      // Fallback to mailto if EmailJS fails
      this.openMailto(formData);
      return {
        success: false,
        message: 'Email service unavailable. Your email client has been opened as a backup - please send the email manually.'
      };
    }
  },

  // Alternative: Simple mailto fallback
  openMailto(formData: ContactFormData) {
    const subject = encodeURIComponent(`New ${formData.projectType} Project Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Project Type: ${formData.projectType}

Message:
${formData.message}
    `);

    const mailtoUrl = `mailto:logosbola@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  }
};