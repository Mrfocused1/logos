import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { CheckCircle, Palette, Users, CreditCard, FileText, BookOpen } from 'lucide-react';
import {
  SlideButton,
  GlassCard,
  TextRotate,
  TextRevealByWord,
  AnimatedCounter,
  AvatarGroup,
  TypewriterEffect,
  ServicesColumn,
  ContactForm,
  Squares
} from '../components/ui';

const LandingPage: React.FC = () => {
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

  const handlePayNow = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const clientAvatars = [
    {
      id: 1,
      name: "Sarah Johnson",
      designation: "CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b96a7e4c?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      designation: "Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      designation: "Marketing",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "David Kim",
      designation: "Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Lisa Wang",
      designation: "Product Manager",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "James Wilson",
      designation: "Founder",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const servicesData = [
    {
      text: "Professional logo design that captures your brand essence",
      icon: <Palette className="w-6 h-6 text-black" />,
      name: "Logo Design",
      features: ["Multiple concepts", "Vector files", "Brand guidelines"]
    },
    {
      text: "Complete brand identity systems for cohesive visual presence",
      icon: <Users className="w-6 h-6 text-black" />,
      name: "Brand Identity",
      features: ["Color palette", "Typography", "Style guide"]
    },
    {
      text: "Professional business cards that make lasting impressions",
      icon: <CreditCard className="w-6 h-6 text-black" />,
      name: "Business Cards",
      features: ["Print-ready", "Double-sided", "Premium finishes"]
    },
    {
      text: "Custom letterheads for professional correspondence",
      icon: <FileText className="w-6 h-6 text-black" />,
      name: "Letterheads",
      features: ["Corporate design", "Print templates", "Digital versions"]
    },
    {
      text: "Eye-catching brochures that tell your story effectively",
      icon: <BookOpen className="w-6 h-6 text-black" />,
      name: "Brochures",
      features: ["Tri-fold design", "High-quality images", "Compelling copy"]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(0, 0, 0, 0.008)"
          squareSize={40}
          hoverFillColor="rgba(0, 0, 0, 0.005)"
        />
      </div>

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <section id="main-content" className="relative min-h-screen flex items-start justify-center px-4 pt-16 pb-8 sm:pt-24 sm:pb-20 overflow-hidden z-10">
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
            className="flex justify-center items-center space-x-4 sm:space-x-8 max-w-full mx-auto mb-4 px-4"
          >
            <div className="text-center flex-1">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                100+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                5
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Design Versions</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                3
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Revisions</div>
            </div>
          </motion.div>

          {/* Popular Clients */}
          <motion.div
            variants={itemVariants}
            className="mt-8 mb-4"
          >
            <p className="text-lg text-gray-600 mb-4">Popular clients</p>
            <AvatarGroup
              items={clientAvatars}
              maxVisible={5}
              size="lg"
              className="justify-center"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Text Reveal Section */}
      <TextRevealByWord
        text="I believe exceptional design transforms businesses and captivates audiences. Every project begins with understanding your vision and translating it into powerful visual narratives that drive results and inspire action."
        className="relative z-10"
      />

      {/* Services Section with Typewriter Effect */}
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
              className="mb-8"
            >
              <TypewriterEffect
                words={[
                  { text: "My" },
                  { text: "Services", className: "text-black" },
                ]}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading"
                cursorClassName="bg-black"
              />
            </motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-12"
            >
              Comprehensive graphic design solutions tailored to elevate your brand
            </motion.p>

            {/* Animated Services Columns */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-6 max-w-6xl mx-auto overflow-hidden"
              style={{ height: '400px' }}
            >
              <ServicesColumn
                services={servicesData}
                duration={35}
                className="flex-1 max-w-xs"
              />
              <ServicesColumn
                services={[...servicesData].reverse()}
                duration={30}
                className="flex-1 max-w-xs hidden md:block"
              />
              <ServicesColumn
                services={servicesData}
                duration={40}
                className="flex-1 max-w-xs hidden lg:block"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative px-4 py-16 sm:py-24 overflow-hidden z-10">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard variant="strong" className="text-center relative overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-gray-600/5 to-gray-700/5 rounded-3xl" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-4">
                  Ready to Transform Your Brand?
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Let's work together to create something extraordinary that captivates your audience
                </p>

                {/* Contact Form */}
                <ContactForm
                  onSubmit={(data) => {
                    console.log('Contact form submitted:', data);
                    // Handle form submission here
                  }}
                  className="text-left"
                />

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