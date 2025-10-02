import { supabase } from '../lib/supabase';
import type { ContactFormData } from '../components/ui/ContactForm';

export const contactService = {
  // Store contact form submission in Supabase
  async submitContactForm(formData: ContactFormData) {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          project_type: formData.projectType,
          message: formData.message,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing contact form:', error);
        return { success: false, error: error.message };
      }

      // Here you could also trigger a Supabase Edge Function to send email
      console.log('Contact form stored successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  // Send email using Supabase Edge Function (optional)
  async sendEmailNotification(formData: ContactFormData) {
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          to: 'logosbola@gmail.com',
          subject: `New ${formData.projectType} Project Inquiry from ${formData.name}`,
          formData,
        },
      });

      if (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error sending email:', error);
      return { success: false, error: 'Failed to send email notification' };
    }
  }
};