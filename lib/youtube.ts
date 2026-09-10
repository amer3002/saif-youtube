import { VideoItem } from '@/types/video';

const CHANNEL_ID = 'UChQN1z1T5kk-Fh9Nr5HKjUQ';

export const CHANNEL_INFO = {
  id: CHANNEL_ID,
  name: 'Saif Gamer Football',
  arabicName: 'سيف لاعب كرة',
  handle: '@saifgamerfootball',
  url: 'https://www.youtube.com/@saifgamerfootball',
};

function parseViews(statisticsText: string): number {
  return statisticsText ? parseInt(statisticsText, 10) || 0 : 0;
}

export async function fetchVideos(): Promise<VideoItem[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }
    const xmlText = await response.text();

    const entries: string[] = xmlText.split('<entry>').slice(1);

    const videos: VideoItem[] = entries.map((entry) => {
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<media:title>([^<]*)<\/media:title>/);
      const thumbnailMatch = entry.match(/<media:thumbnail url="([^"]+)"/);
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const viewsMatch = entry.match(/<media:statistics views="(\d+)"/);
      const ratingMatch = entry.match(/<media:starRating count="(\d+)"/);
      const linkMatch = entry.match(/<link rel="alternate" href="([^"]+)"/);

      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      const link = linkMatch ? linkMatch[1] : '';

      return {
        videoId,
        title: titleMatch ? titleMatch[1].trim() : 'Untitled',
        thumbnail: thumbnailMatch ? thumbnailMatch[1] : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        publishedDate: publishedMatch ? publishedMatch[1] : '',
        views: parseViews(viewsMatch ? viewsMatch[1] : '0'),
        likes: ratingMatch ? parseInt(ratingMatch[1], 10) || 0 : 0,
        url: link,
        isShort: link.includes('/shorts/'),
      };
    });

    return videos;
  } catch (error) {
    throw error;
  }
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M views`;
  }
  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}K views`;
  }
  return `${views} views`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return 'Just now';
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

export function getHighQualityThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getMediumQualityThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
