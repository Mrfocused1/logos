import emailjs from '@emailjs/browser';
import type { ContactFormData } from '../components/ui/ContactForm';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_bola_logos';
const EMAILJS_TEMPLATE_ID = 'template_contact_form';
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'; // We'll replace this

export const emailService = {
  // Initialize EmailJS
  init() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  },

  // Send contact form email
  async sendContactForm(formData: ContactFormData): Promise<boolean> {
    try {
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
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
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