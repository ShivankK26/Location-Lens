// Pexels API service for fetching real-time videos
const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
const PEXELS_API_BASE = 'https://api.pexels.com/videos';

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
    nr: number;
  }>;
  user: {
    id: number;
    name: string;
    url: string;
  };
}

export interface VideoLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  videoUrl: string;
  description: string;
  mediaType: 'video';
}

// Fetch a random video for a specific location
export async function fetchLocationVideo(searchTerm: string): Promise<PexelsVideo | null> {
  if (!PEXELS_API_KEY) {
    console.warn('Pexels API key not found. Videos will not be available.');
    return null;
  }

  try {
    const response = await fetch(
      `${PEXELS_API_BASE}/search?query=${encodeURIComponent(searchTerm)}&per_page=15&orientation=landscape`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.videos && data.videos.length > 0) {
      // Get a random video from the results
      const randomIndex = Math.floor(Math.random() * data.videos.length);
      return data.videos[randomIndex];
    }

    return null;
  } catch (error) {
    console.error('Error fetching video from Pexels:', error);
    return null;
  }
}

// Convert Pexels video to our Location format
export function convertPexelsVideoToLocation(
  pexelsVideo: PexelsVideo,
  locationData: { name: string; latitude: number; longitude: number }
): VideoLocation {
  // Get the best quality video file (HD or SD)
  const videoFile = pexelsVideo.video_files.find(file => 
    file.quality === 'hd' || file.quality === 'sd'
  ) || pexelsVideo.video_files[0];

  return {
    id: pexelsVideo.id.toString(),
    name: locationData.name,
    latitude: locationData.latitude,
    longitude: locationData.longitude,
    imageUrl: pexelsVideo.image, // Thumbnail image
    videoUrl: videoFile?.link || '',
    description: "A beautiful location waiting to be discovered",
    mediaType: 'video'
  };
}

// Get a random video location
export async function getRandomVideoLocation(
  locationData: { name: string; search: string; latitude: number; longitude: number }
): Promise<VideoLocation | null> {
  const pexelsVideo = await fetchLocationVideo(locationData.search);
  
  if (pexelsVideo) {
    return convertPexelsVideoToLocation(pexelsVideo, locationData);
  }
  
  return null;
}
