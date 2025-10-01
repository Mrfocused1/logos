import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard, Button } from '../../components/ui';
import { Users, FileText, BarChart3, Plus } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();

  // Mock data - will be replaced with real data later
  const stats = [
    {
      title: 'Total Testimonials',
      value: '4',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Invoices',
      value: '12',
      icon: FileText,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'This Month Revenue',
      value: '£1,240',
      icon: BarChart3,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Invoice',
      description: 'Generate a custom invoice for a client',
      icon: Plus,
      action: () => window.open('/invoice/create', '_blank'),
      buttonText: 'Create Invoice',
    },
    {
      title: 'Add Testimonial',
      description: 'Add a new client testimonial with photo',
      icon: Users,
      action: () => console.log('Navigate to add testimonial'),
      buttonText: 'Add Testimonial',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-gray-600">
          Manage your testimonials and invoices from your dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold font-heading text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <GlassCard key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {action.description}
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={action.action}
                    >
                      {action.buttonText}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold font-heading text-gray-900 mb-4">
          Recent Activity
        </h2>
        <GlassCard className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No recent activity</p>
            <p className="text-sm text-gray-500">
              Create your first invoice or add a testimonial to see activity here.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardHome;