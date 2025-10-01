import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, Button, Squares, InteractiveHoverButton } from '../../components/ui';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  // Mock data - will be replaced with real data later
  const stats = [
    {
      title: 'Total Invoices',
      value: '12',
    },
    {
      title: 'This Month Revenue',
      value: '£1,240',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Invoice',
      description: 'Generate a custom invoice for a client',
      action: () => window.open('/invoice/create', '_blank'),
      buttonText: 'Create Invoice',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Welcome Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-black mb-4">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-xl text-black font-bold max-w-2xl mx-auto">
              Manage your invoices from your dashboard.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => {
              return (
                <GlassCard key={index} className="p-8 bg-white/90 backdrop-blur-sm border border-gray-200 text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-black">
                    {stat.value}
                  </p>
                </GlassCard>
              );
            })}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold font-heading text-black mb-6 text-center">
              Quick Actions
            </h2>
            <div className="mb-12">
              {quickActions.map((action, index) => {
                return (
                  <GlassCard key={index} className="p-8 bg-white/90 backdrop-blur-sm border border-gray-200 text-center">
                    <h3 className="font-semibold text-black mb-2 text-xl">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {action.description}
                    </p>
                    <InteractiveHoverButton
                      text={action.buttonText}
                      onClick={action.action}
                      className="w-40 h-12 text-black border-black"
                    />
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold font-heading text-black mb-6 text-center">
              Recent Activity
            </h2>
            <GlassCard className="p-8 bg-white/90 backdrop-blur-sm border border-gray-200">
              <div className="text-center py-12">
                <p className="text-xl text-black mb-3 font-semibold">No recent activity</p>
                <p className="text-gray-600 max-w-md mx-auto">
                  Create your first invoice to see activity here.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
    </div>
  );
};

export default DashboardHome;