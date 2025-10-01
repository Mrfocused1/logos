import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, GlassCard, Squares, InteractiveHoverButton } from '../../components/ui';

const loginSchema = z.object({
  email: z.string().email('Valid email is required').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, signup, isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setLoginError('');

    try {
      const result = await login(data.email, data.password);

      if (!result.success) {
        setLoginError(result.error || 'Login failed');
      }
      // If successful, the AuthContext will handle the redirect
    } catch (error) {
      setLoginError('An unexpected error occurred');
    }
  };

  // Temporary function to create admin user (development only)
  const createAdmin = async () => {
    setLoginError('');

    try {
      const result = await signup('logosbola@gmail.com', 'Prettypassword1');

      if (result.success) {
        alert('✅ Admin user created successfully! You can now login.');
      } else {
        setLoginError(result.error || 'Failed to create admin user');
      }
    } catch (error) {
      setLoginError('Failed to create admin user');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    },
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Grid Background */}
        <div className="fixed inset-0 z-0">
          <Squares
            direction="diagonal"
            speed={0.3}
            borderColor="rgba(0, 0, 0, 0.025)"
            squareSize={40}
            hoverFillColor="rgba(0, 0, 0, 0.015)"
          />
        </div>
        <div className="relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-black font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(0, 0, 0, 0.025)"
          squareSize={40}
          hoverFillColor="rgba(0, 0, 0, 0.015)"
        />
      </div>

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      {/* Main Content */}
      <section id="main-content" className="relative min-h-screen flex items-center justify-center px-4 py-24 overflow-hidden z-10">
        <motion.div
          className="max-w-md mx-auto text-center relative z-10 w-full"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-black mb-4">
              BOLA LOGOS
            </h1>
            <p className="text-xl text-black mb-2 font-bold">
              Admin Portal
            </p>
            <p className="text-lg text-black font-bold">
              Sign in to access the dashboard
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-8 bg-white/90 backdrop-blur-sm border border-gray-200 text-left">
              {/* Error Message */}
              {loginError && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 text-sm font-medium">{loginError}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                  disabled={isSubmitting}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register('password')}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-black transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex justify-center">
                  <InteractiveHoverButton
                    text={isSubmitting ? 'Signing in...' : 'Sign In'}
                    type="submit"
                    className="w-40 h-12 text-black border-black"
                    disabled={isSubmitting}
                  />
                </div>
              </form>

              {/* Temporary Admin Creation Button - Development Only */}
              {import.meta.env.DEV && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Development: Create admin user first
                  </p>
                  <div className="flex justify-center">
                    <Button
                      onClick={createAdmin}
                      variant="outline"
                      className="text-sm"
                    >
                      Create Admin User
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center mt-8">
            <p className="text-sm text-gray-600">
              © 2025 BOLA LOGOS. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Inspiring Visual Storytelling
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default LoginPage;