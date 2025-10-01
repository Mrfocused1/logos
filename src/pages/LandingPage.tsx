import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { ArrowRight, Palette, Sparkles, Zap, Star, CheckCircle, Users, Award, TrendingUp } from 'lucide-react';
import { Button, GlassCard, DisplayCards, TextRotate, SlideButton, Squares, TextRevealByWord, AnimatedCounter } from '../components/ui';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const floatVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, 0, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Service data
const services = [
  {
    id: '1',
    title: 'Brand Identity',
    description: 'Create a distinctive visual identity that captures your brand essence and resonates with your audience.',
    icon: Palette,
    features: ['Logo Design', 'Brand Guidelines', 'Color Palettes', 'Typography'],
  },
  {
    id: '2',
    title: 'Graphic Design',
    description: 'From marketing materials to social media graphics, we bring your vision to life with stunning visuals.',
    icon: Sparkles,
    features: ['Marketing Collateral', 'Social Media Graphics', 'Print Design', 'Digital Assets'],
  },
  {
    id: '3',
    title: 'Creative Solutions',
    description: 'Innovative design solutions tailored to your unique needs and business goals.',
    icon: Zap,
    features: ['Custom Illustrations', 'Packaging Design', 'Presentation Design', 'Infographics'],
  },
];

// Testimonial data
const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc',
    content: 'BOLA LOGOS transformed our brand identity with exceptional creativity and professionalism. The results exceeded our expectations!',
    avatar: 'SJ',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Marketing Director',
    company: 'GrowthLab',
    content: 'Outstanding work! The team delivered high-quality designs that perfectly captured our vision. Highly recommended!',
    avatar: 'MC',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Founder',
    company: 'Creative Hub',
    content: 'Working with BOLA LOGOS was a game-changer for our business. Their attention to detail is unmatched.',
    avatar: 'ER',
    rating: 5,
  },
  {
    id: '4',
    name: 'David Thompson',
    role: 'Brand Manager',
    company: 'Innovate Co',
    content: 'Professional, responsive, and incredibly talented. They brought our brand to life in ways we never imagined.',
    avatar: 'DT',
    rating: 5,
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePayNow = () => {
    navigate('/invoice/create');
  };

  const handleLearnMore = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated grid background */}
      <div className="fixed inset-0 z-0 opacity-10">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(0, 0, 0, 0.2)"
          squareSize={60}
          hoverFillColor="rgba(0, 0, 0, 0.1)"
        />
      </div>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-primary focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      {/* Hero Section */}
      <section id="main-content" className="relative min-h-screen flex items-start justify-center px-4 pt-16 pb-8 sm:pt-24 sm:pb-20 overflow-hidden z-10">
        {/* @ts-expect-error - Framer Motion type inference issue with className */}
        <motion.div
          className="max-w-6xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-8">

            <LayoutGroup>
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-6 leading-tight flex flex-wrap items-center justify-center gap-4"
                layout
              >
                <motion.span
                  className="block"
                  layout
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                >
                  BOLA
                </motion.span>
                <TextRotate
                  texts={[
                    "LOGOS",
                    "BRANDS",
                    "DESIGNS",
                    "VISUALS",
                    "IDENTITY",
                    "CREATIVE",
                    "STORIES"
                  ]}
                  mainClassName="text-white px-3 sm:px-4 md:px-6 bg-black overflow-hidden py-2 sm:py-3 md:py-4 rounded-full shadow-lg shadow-black/25"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2500}
                />
              </motion.h1>
            </LayoutGroup>
            <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto font-medium">
              Inspiring Visual Storytelling
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Transforming ideas into compelling visual narratives that captivate and inspire
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center mb-16"
          >
            <SlideButton
              onSlideComplete={handlePayNow}
              aria-label="Slide to navigate to invoice payment"
            />
          </motion.div>


          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto mb-2"
          >
            <div className="text-center p-2 sm:p-6">
              <div className="flex flex-col items-center">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={100} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Happy Clients</div>
              </div>
            </div>
            <div className="text-center p-2 sm:p-6">
              <div className="flex flex-col items-center">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={5} suffix="" />
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Design Versions</div>
              </div>
            </div>
            <div className="text-center p-2 sm:p-6">
              <div className="flex flex-col items-center">
                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={3} suffix="" />
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Revisions</div>
              </div>
            </div>
          </motion.div>

        </motion.div>

      </section>

      {/* Text Reveal Section */}
      <TextRevealByWord
        text="I believe exceptional design transforms businesses and captivates audiences. Every project begins with understanding your vision and translating it into powerful visual narratives that resonate with your target market. My commitment to excellence drives me to deliver designs that not only look stunning but also achieve measurable results. From concept to completion, I collaborate closely with clients to ensure every detail reflects their brand identity and exceeds expectations. Design is not just what I create, it is how I solve problems and tell stories that inspire action."
        className="relative z-10"
      />

      {/* Services Section */}
      <section id="services" className="relative px-4 py-20 sm:py-32 overflow-visible z-10" aria-labelledby="services-heading">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="text-center mb-12 sm:mb-16"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-300/30 backdrop-blur-sm mb-4"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">What We Offer</span>
            </motion.div>
            <motion.h2
              id="services-heading"
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-4"
            >
              Our Services
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Comprehensive graphic design solutions tailored to elevate your brand
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="flex justify-center items-center py-16 overflow-visible"
          >
            <DisplayCards services={services} />
          </motion.div>
        </div>

      </section>


      {/* CTA Section */}
      <section className="relative px-4 py-16 sm:py-24 overflow-hidden z-10">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard variant="strong" className="text-center relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-3xl" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-300/30 backdrop-blur-sm mb-6"
                >
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">Start Your Journey Today</span>
                </motion.div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-4">
                  Ready to Transform Your Brand?
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Let's work together to create something extraordinary that captivates your audience
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePayNow}
                    className="group shadow-xl shadow-purple-500/20"
                    aria-label="Get started with invoice payment"
                  >
                    Get Started
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </div>

                {/* Features row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Fast Turnaround</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">5 Designs</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">3 Revisions</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

      </section>

      {/* Footer */}
      <footer className="px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600 mb-2">
            © 2025 BOLA LOGOS. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Inspiring Visual Storytelling
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;