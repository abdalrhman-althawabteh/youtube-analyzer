import { ChannelData, Video, Comment } from '../types';

// Helper to format duration
const parseDuration = (duration: string) => {
  return duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '');
};

const fetchCommentsForVideo = async (videoId: string, apiKey: string): Promise<Comment[]> => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=5&order=relevance&key=${apiKey}`
    );
    const json = await res.json();
    
    if (!json.items) return [];

    return json.items.map((item: any) => ({
      author: item.snippet.topLevelComment.snippet.authorDisplayName,
      text: item.snippet.topLevelComment.snippet.textDisplay,
      likes: item.snippet.topLevelComment.snippet.likeCount
    }));
  } catch (e) {
    console.warn(`Failed to fetch comments for video ${videoId}`, e);
    return [];
  }
};

export const fetchChannelData = async (channelId: string, apiKey: string): Promise<ChannelData> => {
  try {
    // 1. Fetch Channel Statistics
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&id=${channelId}&key=${apiKey}`
    );
    
    if (!channelRes.ok) {
       throw new Error('فشل في جلب بيانات القناة. تأكد من Channel ID ومفتاح API.');
    }

    const channelJson = await channelRes.json();
    if (!channelJson.items || channelJson.items.length === 0) {
      throw new Error('لم يتم العثور على القناة.');
    }

    const item = channelJson.items[0];
    const uploadsPlaylistId = item.contentDetails.relatedPlaylists.uploads;

    // 2. Fetch Recent Videos from Uploads Playlist
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=5&key=${apiKey}`
    );
    const videosJson = await videosRes.json();
    
    // Get details for the top 5 videos
    const videoIds = videosJson.items.map((v: any) => v.contentDetails.videoId).join(',');

    // 3. Fetch Video Details (Stats)
    const videoDetailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`
    );
    const videoDetailsJson = await videoDetailsRes.json();

    // 4. Process Videos and Fetch Comments in Parallel
    const recentVideosPromises = videoDetailsJson.items.map(async (v: any) => {
      // Fetch comments for this specific video
      const comments = await fetchCommentsForVideo(v.id, apiKey);

      return {
        id: v.id,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails.medium?.url || v.snippet.thumbnails.default?.url,
        publishedAt: v.snippet.publishedAt,
        viewCount: parseInt(v.statistics.viewCount) || 0,
        likeCount: parseInt(v.statistics.likeCount) || 0,
        commentCount: parseInt(v.statistics.commentCount) || 0,
        duration: parseDuration(v.contentDetails.duration),
        topComments: comments
      } as Video;
    });

    const recentVideos = await Promise.all(recentVideosPromises);

    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      customUrl: item.snippet.customUrl,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      subscriberCount: parseInt(item.statistics.subscriberCount) || 0,
      videoCount: parseInt(item.statistics.videoCount) || 0,
      viewCount: parseInt(item.statistics.viewCount) || 0,
      recentVideos,
    };

  } catch (error) {
    console.warn("YouTube API failed, returning mock data.", error);
    // Return Mock Data if API fails
    return {
      id: channelId,
      title: "قناة تجريبية (Demo)",
      description: "بيانات تجريبية",
      customUrl: "@demo_user",
      thumbnail: "https://picsum.photos/200",
      subscriberCount: 1000,
      videoCount: 10,
      viewCount: 5000,
      recentVideos: []
    };
  }
};