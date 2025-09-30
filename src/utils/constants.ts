export const FIRESTORE_COLLECTIONS = {
  TESTIMONIALS: 'testimonials',
  INVOICES: 'invoices',
};

export const ROUTES = {
  HOME: '/',
  LOGO_PAYMENT: '/logo-payment',
  INVOICE: '/invoice/:slug',
  TERMS: '/terms',
  REFUND_POLICY: '/refund-policy',
  SAFETY: '/safety',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_TESTIMONIALS: '/admin/testimonials',
  ADMIN_INVOICES: '/admin/invoices',
};

export const COLORS = {
  PRIMARY: '#8B5CF6',
  PRIMARY_LIGHT: '#A78BFA',
  PRIMARY_DARK: '#7C3AED',
  SECONDARY: '#EC4899',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const VALIDATION_LIMITS = {
  TESTIMONIAL_NAME_MIN: 2,
  TESTIMONIAL_NAME_MAX: 50,
  TESTIMONIAL_COMPANY_MIN: 2,
  TESTIMONIAL_COMPANY_MAX: 100,
  TESTIMONIAL_QUOTE_MIN: 10,
  TESTIMONIAL_QUOTE_MAX: 300,
  INVOICE_TITLE_MIN: 5,
  INVOICE_TITLE_MAX: 150,
  INVOICE_AMOUNT_MAX: 10000,
  INVOICE_SLUG_MIN: 3,
  INVOICE_SLUG_MAX: 50,
  INVOICE_NOTES_MAX: 500,
};

export const SERVICES = [
  {
    id: 'logo',
    title: 'Logo Design',
    description: 'I specialise in creating unique and memorable logo designs that reflect your brand\'s identity.',
    price: 70,
    icon: 'Sparkles',
    cta: 'Get Started - £70',
    link: '/logo-payment',
  },
  {
    id: 'brand',
    title: 'Brand Identity Design',
    description: 'I am dedicated to crafting unique and cohesive brand identities that not only capture attention but also inspire loyalty.',
    price: null,
    icon: 'Palette',
    cta: 'Request Consultation',
    link: 'mailto:logosbola@gmail.com?subject=Brand Identity Consultation',
  },
  {
    id: 'menu',
    title: 'Menu Design',
    description: 'I pride myself on understanding your brand\'s voice and translating it into a captivating menu that will entice customers.',
    price: null,
    icon: 'FileText',
    cta: 'Request Consultation',
    link: 'mailto:logosbola@gmail.com?subject=Menu Design Consultation',
  },
  {
    id: 'flyer',
    title: 'Flyer Design',
    description: 'Whether you need flyers for an event, promotion, or business, I am here to help you make a statement.',
    price: null,
    icon: 'Newspaper',
    cta: 'Request Consultation',
    link: 'mailto:logosbola@gmail.com?subject=Flyer Design Consultation',
  },
  {
    id: 'pitch',
    title: 'Pitch Deck Design',
    description: 'Let me help you convey your message clearly and effectively, ensuring you make a lasting impression.',
    price: null,
    icon: 'Presentation',
    cta: 'Request Consultation',
    link: 'mailto:logosbola@gmail.com?subject=Pitch Deck Consultation',
  },
  {
    id: 'npk',
    title: 'NPK/Ratecard Design',
    description: 'I am dedicated to providing you with high-quality designs that make a lasting impact.',
    price: null,
    icon: 'BarChart',
    cta: 'Request Consultation',
    link: 'mailto:logosbola@gmail.com?subject=NPK Design Consultation',
  },
];

export const CONTACT = {
  EMAIL: 'logosbola@gmail.com',
  DOMAIN: 'bolalogos.com',
};