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

// Dynamic location search terms - can be expanded by users
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
    throw new Error('Unsplash API key not found. Please set NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in your .env.local file');
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

    throw new Error(`No photos found for search term: ${searchTerm}`);
  } catch (error) {
    console.error('Error fetching photo from Unsplash:', error);
    throw error;
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
  
  if (!unsplashPhoto) {
    throw new Error(`Failed to fetch photo for ${randomLocationData.name}`);
  }
  
  return convertUnsplashPhotoToLocation(unsplashPhoto, randomLocationData);
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
    
    if (!unsplashPhoto) {
      throw new Error(`Failed to fetch photo for ${locationData.name}`);
    }
    
    locations.push(convertUnsplashPhotoToLocation(unsplashPhoto, locationData));
  }

  return locations;
}
