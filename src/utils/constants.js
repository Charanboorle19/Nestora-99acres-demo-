export const BRAND = {
  name: 'Nestora',
  tagline: 'Homes that fit your life',
  otp: '123456',
}

export const CITIES = [
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { id: 'delhi-ncr', name: 'Delhi NCR', state: 'Delhi', lat: 28.6139, lng: 77.209 },
]

export const SEARCH_TABS = [
  { id: 'buy', label: 'Buy', listingType: 'sale' },
  { id: 'rent', label: 'Rent', listingType: 'rent' },
  { id: 'pg', label: 'PG/Co-living', listingType: 'pg' },
  { id: 'commercial', label: 'Commercial', propertyCategory: 'commercial' },
  { id: 'plots', label: 'Plots', propertyType: 'plot' },
  { id: 'projects', label: 'New Projects', isProject: true },
]

export const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Independent House',
  'Builder Floor',
  'Plot',
  'Studio',
  'Penthouse',
  'Office',
  'Shop',
  'Warehouse',
]

export const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK']

export const FURNISHING_OPTIONS = ['Unfurnished', 'Semi-furnished', 'Fully furnished']

export const POSSESSION_OPTIONS = ['Ready to move', 'Under construction', 'New launch']

export const POSTED_BY_OPTIONS = ['owner', 'agent', 'builder']

export const AMENITIES = [
  'Lift',
  'Parking',
  'Power Backup',
  'Security',
  'Gym',
  'Swimming Pool',
  'Clubhouse',
  'Park',
  'Children Play Area',
  'Indoor Games',
  'Jogging Track',
  'CCTV',
  'Water Supply',
  'Gas Pipeline',
  'Intercom',
  'Fire Safety',
  'Visitor Parking',
  'Rainwater Harvesting',
  'Sewage Treatment',
  'Wi-Fi',
]

export const LISTING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    durationDays: 30,
    photoLimit: 5,
    leadLimit: 10,
    featuredSlots: 0,
    highlights: ['Basic listing', '5 photos', '10 leads'],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 999,
    durationDays: 60,
    photoLimit: 15,
    leadLimit: 40,
    featuredSlots: 0,
    highlights: ['60-day listing', '15 photos', '40 leads', 'Priority support'],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 2499,
    durationDays: 90,
    photoLimit: 30,
    leadLimit: 100,
    featuredSlots: 1,
    popular: true,
    highlights: ['90-day listing', '30 photos', '100 leads', '1 featured slot'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4999,
    durationDays: 180,
    photoLimit: 50,
    leadLimit: 300,
    featuredSlots: 3,
    highlights: ['180-day listing', '50 photos', '300 leads', '3 featured slots', 'Verified boost'],
  },
]

export const QUICK_REPLY_TEMPLATES = [
  'Thanks for your interest. When can we schedule a site visit?',
  'The property is available. Happy to share more details.',
  'Please share your preferred budget and move-in timeline.',
  'I can arrange a virtual tour this week if convenient.',
]

export const ROLES = [
  { id: 'buyer', label: 'Buyer / Tenant', description: 'Search, shortlist and enquire' },
  { id: 'owner', label: 'Owner', description: 'List and manage your property' },
  { id: 'agent', label: 'Agent', description: 'Manage listings and leads' },
  { id: 'builder', label: 'Builder', description: 'Showcase projects and units' },
]
