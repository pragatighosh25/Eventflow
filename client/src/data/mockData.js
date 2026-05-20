export const DEFAULT_CUSTOM_FIELDS = [
  { id: 'phone', label: 'Phone number', type: 'tel', required: true },
  { id: 'dietary', label: 'Dietary preference', type: 'select', required: true, options: ['Vegetarian', 'Non-vegetarian', 'Vegan'] },
];

export const FIELD_TYPES = [
  { value: 'text', label: 'Short text' },
  { value: 'email', label: 'Email' },
  { value: 'number', label: 'Number' },
  { value: 'tel', label: 'Phone' },
  { value: 'textarea', label: 'Long text' },
  { value: 'select', label: 'Dropdown' },
];

export const SEED_USERS = [
  {
    id: 'org-1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'demo123',
    role: 'organizer',
    profile: {
      age: 28,
      location: 'Mumbai, India',
      dietary: 'Vegetarian',
      phone: '+91 98765 43210',
    },
  },
  {
    id: 'att-1',
    name: 'Alex Kumar',
    email: 'alex@example.com',
    password: 'demo123',
    role: 'attendee',
    profile: {
      age: 24,
      location: 'Bangalore, India',
      dietary: 'Non-vegetarian',
      phone: '+91 91234 56780',
    },
  },
];

const now = new Date();
const day = 86400000;

export const SEED_EVENTS = [
  {
    id: 'evt-1',
    organizerId: 'org-1',
    title: 'React Summit 2026',
    description:
      'A full-day conference for React developers. Talks, workshops, and networking with industry leaders.',
    location: 'Convention Center, Mumbai',
    startDate: new Date(now.getTime() + 14 * day).toISOString(),
    endDate: new Date(now.getTime() + 14 * day + 8 * 3600000).toISOString(),
    capacity: 200,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1540575467067-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    customFields: [
      { id: 'company', label: 'Company / College', type: 'text', required: true },
      { id: 'experience', label: 'Years of experience with React', type: 'number', required: false },
      ...DEFAULT_CUSTOM_FIELDS,
    ],
    registrations: [
      {
        id: 'reg-1',
        userId: 'att-1',
        registeredAt: new Date(now.getTime() - 2 * day).toISOString(),
        responses: {
          name: 'Alex Kumar',
          email: 'alex@example.com',
          age: '24',
          location: 'Bangalore, India',
          dietary: 'Non-vegetarian',
          phone: '+91 91234 56780',
          company: 'TechStart',
          experience: '2',
        },
      },
    ],
  },
  {
    id: 'evt-2',
    organizerId: 'org-1',
    title: 'Startup Pitch Night',
    description: 'Watch early-stage founders pitch to investors. Open networking after the session.',
    location: 'WeWork, Bandra',
    startDate: new Date(now.getTime() - 1 * day).toISOString(),
    endDate: new Date(now.getTime() + 1 * day).toISOString(),
    capacity: 80,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    customFields: [
      { id: 'linkedin', label: 'LinkedIn profile URL', type: 'text', required: true },
      ...DEFAULT_CUSTOM_FIELDS,
    ],
    registrations: [],
  },
  {
    id: 'evt-3',
    organizerId: 'org-1',
    title: 'Design Systems Workshop',
    description: 'Hands-on workshop building scalable design systems with Figma and React.',
    location: 'Online (Zoom)',
    startDate: new Date(now.getTime() - 30 * day).toISOString(),
    endDate: new Date(now.getTime() - 29 * day).toISOString(),
    capacity: 50,
    status: 'finished',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    customFields: DEFAULT_CUSTOM_FIELDS,
    registrations: [],
  },
  {
    id: 'evt-4',
    organizerId: 'org-1',
    title: 'Tech-athon 2026',
    description: 'A 48-hour hackathon for developers, designers, and entrepreneurs to build innovative solutions.',
    location: 'Online (Zoom)',
    startDate: new Date(now.getTime() +2 * day).toISOString(),
    endDate: new Date(now.getTime() + 4 * day).toISOString(),
    capacity: 50,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    customFields: DEFAULT_CUSTOM_FIELDS,
    registrations: [],
  },
];
