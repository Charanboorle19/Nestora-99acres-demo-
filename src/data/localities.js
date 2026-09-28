export const localities = [
  // Hyderabad
  { id: 'hyd-gachibowli', cityId: 'hyderabad', name: 'Gachibowli', lat: 17.4401, lng: 78.3489, avgPricePerSqft: 7200, rating: 4.5 },
  { id: 'hyd-hitech', cityId: 'hyderabad', name: 'Hitech City', lat: 17.4435, lng: 78.3772, avgPricePerSqft: 7800, rating: 4.6 },
  { id: 'hyd-kondapur', cityId: 'hyderabad', name: 'Kondapur', lat: 17.4647, lng: 78.3671, avgPricePerSqft: 6900, rating: 4.3 },
  { id: 'hyd-jubilee', cityId: 'hyderabad', name: 'Jubilee Hills', lat: 17.4326, lng: 78.4071, avgPricePerSqft: 14500, rating: 4.7 },
  { id: 'hyd-banjara', cityId: 'hyderabad', name: 'Banjara Hills', lat: 17.4141, lng: 78.4346, avgPricePerSqft: 13200, rating: 4.6 },
  { id: 'hyd-madhapur', cityId: 'hyderabad', name: 'Madhapur', lat: 17.4483, lng: 78.3915, avgPricePerSqft: 7500, rating: 4.4 },
  { id: 'hyd-kukatpally', cityId: 'hyderabad', name: 'Kukatpally', lat: 17.4948, lng: 78.3996, avgPricePerSqft: 5800, rating: 4.1 },
  { id: 'hyd-secunderabad', cityId: 'hyderabad', name: 'Secunderabad', lat: 17.4399, lng: 78.4983, avgPricePerSqft: 6200, rating: 4.0 },
  // Bengaluru
  { id: 'blr-whitefield', cityId: 'bengaluru', name: 'Whitefield', lat: 12.9698, lng: 77.75, avgPricePerSqft: 8200, rating: 4.4 },
  { id: 'blr-koramangala', cityId: 'bengaluru', name: 'Koramangala', lat: 12.9352, lng: 77.6245, avgPricePerSqft: 14500, rating: 4.6 },
  { id: 'blr-indiranagar', cityId: 'bengaluru', name: 'Indiranagar', lat: 12.9784, lng: 77.6408, avgPricePerSqft: 16000, rating: 4.7 },
  { id: 'blr-hsr', cityId: 'bengaluru', name: 'HSR Layout', lat: 12.9116, lng: 77.6473, avgPricePerSqft: 11000, rating: 4.5 },
  { id: 'blr-electronic', cityId: 'bengaluru', name: 'Electronic City', lat: 12.8399, lng: 77.677, avgPricePerSqft: 6200, rating: 4.1 },
  { id: 'blr-hebbal', cityId: 'bengaluru', name: 'Hebbal', lat: 13.0358, lng: 77.597, avgPricePerSqft: 9800, rating: 4.3 },
  { id: 'blr-jp-nagar', cityId: 'bengaluru', name: 'JP Nagar', lat: 12.9063, lng: 77.5857, avgPricePerSqft: 9000, rating: 4.2 },
  { id: 'blr-sarjapur', cityId: 'bengaluru', name: 'Sarjapur Road', lat: 12.9078, lng: 77.685, avgPricePerSqft: 7600, rating: 4.3 },
  // Mumbai
  { id: 'mum-andheri', cityId: 'mumbai', name: 'Andheri West', lat: 19.1364, lng: 72.8277, avgPricePerSqft: 28000, rating: 4.4 },
  { id: 'mum-bandra', cityId: 'mumbai', name: 'Bandra West', lat: 19.0596, lng: 72.8295, avgPricePerSqft: 45000, rating: 4.8 },
  { id: 'mum-powai', cityId: 'mumbai', name: 'Powai', lat: 19.1176, lng: 72.906, avgPricePerSqft: 26000, rating: 4.5 },
  { id: 'mum-thane', cityId: 'mumbai', name: 'Thane West', lat: 19.2183, lng: 72.9781, avgPricePerSqft: 16000, rating: 4.2 },
  { id: 'mum-navi', cityId: 'mumbai', name: 'Navi Mumbai', lat: 19.033, lng: 73.0297, avgPricePerSqft: 14000, rating: 4.3 },
  { id: 'mum-worli', cityId: 'mumbai', name: 'Worli', lat: 19.0178, lng: 72.817, avgPricePerSqft: 52000, rating: 4.7 },
  { id: 'mum-goregaon', cityId: 'mumbai', name: 'Goregaon East', lat: 19.1663, lng: 72.8526, avgPricePerSqft: 22000, rating: 4.1 },
  // Pune
  { id: 'pune-hinjewadi', cityId: 'pune', name: 'Hinjewadi', lat: 18.5912, lng: 73.7389, avgPricePerSqft: 7200, rating: 4.3 },
  { id: 'pune-baner', cityId: 'pune', name: 'Baner', lat: 18.559, lng: 73.7868, avgPricePerSqft: 9800, rating: 4.5 },
  { id: 'pune-kharadi', cityId: 'pune', name: 'Kharadi', lat: 18.5516, lng: 73.9382, avgPricePerSqft: 8600, rating: 4.4 },
  { id: 'pune-wakad', cityId: 'pune', name: 'Wakad', lat: 18.597, lng: 73.763, avgPricePerSqft: 7800, rating: 4.2 },
  { id: 'pune-koregaon', cityId: 'pune', name: 'Koregaon Park', lat: 18.5362, lng: 73.8938, avgPricePerSqft: 14000, rating: 4.6 },
  { id: 'pune-hadapsar', cityId: 'pune', name: 'Hadapsar', lat: 18.5089, lng: 73.926, avgPricePerSqft: 7400, rating: 4.1 },
  // Delhi NCR
  { id: 'del-dwarka', cityId: 'delhi-ncr', name: 'Dwarka', lat: 28.5921, lng: 77.046, avgPricePerSqft: 11000, rating: 4.2 },
  { id: 'del-saket', cityId: 'delhi-ncr', name: 'Saket', lat: 28.5244, lng: 77.2066, avgPricePerSqft: 18000, rating: 4.5 },
  { id: 'del-gurgaon-sector', cityId: 'delhi-ncr', name: 'Sector 54, Gurugram', lat: 28.441, lng: 77.098, avgPricePerSqft: 14000, rating: 4.4 },
  { id: 'del-noida-62', cityId: 'delhi-ncr', name: 'Sector 62, Noida', lat: 28.628, lng: 77.3649, avgPricePerSqft: 9000, rating: 4.3 },
  { id: 'del-vaishali', cityId: 'delhi-ncr', name: 'Vaishali, Ghaziabad', lat: 28.642, lng: 77.338, avgPricePerSqft: 6500, rating: 4.0 },
  { id: 'del-greater-noida', cityId: 'delhi-ncr', name: 'Greater Noida West', lat: 28.564, lng: 77.452, avgPricePerSqft: 5800, rating: 4.1 },
  { id: 'del-vasant', cityId: 'delhi-ncr', name: 'Vasant Kunj', lat: 28.5245, lng: 77.155, avgPricePerSqft: 16000, rating: 4.5 },
]

export const builders = [
  { id: 'bld-aether', name: 'Aether Spaces', slug: 'aether-spaces', cityIds: ['hyderabad', 'bengaluru'], established: 2008, projectsCompleted: 42, rating: 4.6 },
  { id: 'bld-lotus', name: 'Lotus Habitat', slug: 'lotus-habitat', cityIds: ['mumbai', 'pune'], established: 2001, projectsCompleted: 67, rating: 4.5 },
  { id: 'bld-northstar', name: 'Northstar Realty', slug: 'northstar-realty', cityIds: ['delhi-ncr', 'bengaluru'], established: 1998, projectsCompleted: 89, rating: 4.4 },
  { id: 'bld-cascade', name: 'Cascade Homes', slug: 'cascade-homes', cityIds: ['hyderabad', 'pune'], established: 2012, projectsCompleted: 28, rating: 4.3 },
  { id: 'bld-meridian', name: 'Meridian Living', slug: 'meridian-living', cityIds: ['mumbai', 'delhi-ncr'], established: 2005, projectsCompleted: 51, rating: 4.7 },
]

export const agents = [
  { id: 'agt-1', name: 'Priya Sharma', phone: '+91 98XXX 41201', cityId: 'hyderabad', firm: 'Orbit Realty' },
  { id: 'agt-2', name: 'Rahul Mehta', phone: '+91 98XXX 41202', cityId: 'bengaluru', firm: 'Skyline Advisors' },
  { id: 'agt-3', name: 'Ananya Iyer', phone: '+91 98XXX 41203', cityId: 'mumbai', firm: 'Harbour Homes' },
  { id: 'agt-4', name: 'Vikram Singh', phone: '+91 98XXX 41204', cityId: 'delhi-ncr', firm: 'Capital Nest' },
  { id: 'agt-5', name: 'Sneha Patil', phone: '+91 98XXX 41205', cityId: 'pune', firm: 'Deccan Estates' },
]

export const owners = [
  { id: 'own-1', name: 'Ravi Kumar', phone: '+91 97XXX 88011' },
  { id: 'own-2', name: 'Meera Joshi', phone: '+91 97XXX 88012' },
  { id: 'own-3', name: 'Arjun Reddy', phone: '+91 97XXX 88013' },
  { id: 'own-4', name: 'Fatima Khan', phone: '+91 97XXX 88014' },
  { id: 'own-5', name: 'Suresh Nair', phone: '+91 97XXX 88015' },
]
