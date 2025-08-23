// Unsplash API service for fetching real-time photos
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_BASE = 'https://api.unsplash.com';

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  location: {
    title?: string;
    name?: string;
    city?: string;
    country?: string;
  };
  user: {
    name: string;
    username: string;
  };
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  description: string;
}

// Sample locations with search terms for Unsplash
const locationSearchTerms = [
  { name: "Paris, France", search: "paris france eiffel tower", latitude: 48.8566, longitude: 2.3522 },
  { name: "Tokyo, Japan", search: "tokyo japan cityscape", latitude: 35.6762, longitude: 139.6503 },
  { name: "New York, USA", search: "new york city skyline", latitude: 40.7128, longitude: -74.0060 },
  { name: "Sydney, Australia", search: "sydney australia opera house", latitude: -33.8688, longitude: 151.2093 },
  { name: "Cairo, Egypt", search: "cairo egypt pyramids", latitude: 30.0444, longitude: 31.2357 },
  { name: "London, UK", search: "london uk big ben", latitude: 51.5074, longitude: -0.1278 },
  { name: "Rio de Janeiro, Brazil", search: "rio de janeiro christ the redeemer", latitude: -22.9068, longitude: -43.1729 },
  { name: "Moscow, Russia", search: "moscow russia red square", latitude: 55.7558, longitude: 37.6176 },
  { name: "Cape Town, South Africa", search: "cape town table mountain", latitude: -33.9249, longitude: 18.4241 },
  { name: "Bangkok, Thailand", search: "bangkok thailand temples", latitude: 13.7563, longitude: 100.5018 }
];

// Fetch a random photo for a specific location
export async function fetchLocationPhoto(searchTerm: string): Promise<UnsplashPhoto | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not found. Using fallback images.');
    console.log('To enable real-time photos, set NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in your .env.local file');
    return null;
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?query=${encodeURIComponent(searchTerm)}&orientation=landscape&per_page=30`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Get a random photo from the results
      const randomIndex = Math.floor(Math.random() * data.results.length);
      return data.results[randomIndex];
    }

    return null;
  } catch (error) {
    console.error('Error fetching photo from Unsplash:', error);
    return null;
  }
}

// Convert Unsplash photo to our Location format
export function convertUnsplashPhotoToLocation(
  unsplashPhoto: UnsplashPhoto, 
  locationData: typeof locationSearchTerms[0]
): Location {
  return {
    id: unsplashPhoto.id,
    name: locationData.name,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    imageUrl: unsplashPhoto.urls.regular,
    description: unsplashPhoto.alt_description || locationData.name
  };
}

// Get a random location with a real photo
export async function getRandomLocation(): Promise<Location> {
  const randomLocationData = locationSearchTerms[Math.floor(Math.random() * locationSearchTerms.length)];
  
  const unsplashPhoto = await fetchLocationPhoto(randomLocationData.search);
  
  if (unsplashPhoto) {
    return convertUnsplashPhotoToLocation(unsplashPhoto, randomLocationData);
  }
  
  // Fallback to working default images if API fails
  const fallbackImages = [
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1520106212299-d99c43e79618?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1508009603885-50cf7c079365?w=800&h=600&fit=crop"
  ];
  
  const randomFallbackIndex = Math.floor(Math.random() * fallbackImages.length);
  
  return {
    id: `fallback-${Math.floor(Math.random() * 1000)}`,
    name: randomLocationData.name,
    latitude: randomLocationData.latitude,
    longitude: randomLocationData.longitude,
    imageUrl: fallbackImages[randomFallbackIndex],
    description: randomLocationData.name
  };
}

// Get multiple random locations for the game
export async function getRandomLocations(count: number = 5): Promise<Location[]> {
  const locations: Location[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < count; i++) {
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * locationSearchTerms.length);
    } while (usedIndices.has(randomIndex));
    
    usedIndices.add(randomIndex);
    const locationData = locationSearchTerms[randomIndex];
    
    const unsplashPhoto = await fetchLocationPhoto(locationData.search);
    
    if (unsplashPhoto) {
      locations.push(convertUnsplashPhotoToLocation(unsplashPhoto, locationData));
    } else {
      // Fallback to working default images
      const fallbackImages = [
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1520106212299-d99c43e79618?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1508009603885-50cf7c079365?w=800&h=600&fit=crop"
      ];
      
      const randomFallbackIndex = Math.floor(Math.random() * fallbackImages.length);
      
      locations.push({
        id: `fallback-${Math.floor(Math.random() * 1000)}`,
        name: locationData.name,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        imageUrl: fallbackImages[randomFallbackIndex],
        description: locationData.name
      });
    }
  }

  return locations;
}
