import { supabase } from '../lib/supabase';

/**
 * Temporary utility to create the admin user
 * Run this once to create your admin account
 */
export const createAdminUser = async () => {
  try {
    console.log('Creating admin user...');

    const { data, error } = await supabase.auth.signUp({
      email: 'logosbola@gmail.com',
      password: 'Prettypassword1',
    });

    if (error) {
      console.error('Error creating admin user:', error.message);
      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log('✅ Admin user created successfully!');
      console.log('Email:', data.user.email);
      console.log('User ID:', data.user.id);

      // Sign out after creation so you can test login
      await supabase.auth.signOut();
      console.log('✅ Signed out - you can now test login');

      return { success: true, user: data.user };
    }

    return { success: false, error: 'No user data returned' };
  } catch (error) {
    console.error('Failed to create admin user:', error);
    return { success: false, error: 'Failed to create admin user' };
  }
};

// Auto-run when imported (for development only)
if (import.meta.env.DEV) {
  console.log('🚀 Admin user creation utility loaded');
  console.log('Run createAdminUser() in browser console to create admin user');
}