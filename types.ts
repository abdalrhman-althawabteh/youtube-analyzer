// Refactored Onboarding Data for better personalization
export interface OnboardingData {
  creatorLevel: 'Beginner' | 'Intermediate' | 'Pro'; // New: Experience level
  passionNiche: string; // New: What do they love?
  contentStyle: string; // New: Vlog, Educational, Gaming, etc.
  
  weeklyHours: number;
  primaryGoal: string; // Keeping this but maybe reframing options
  consistencyBlocker: string; // Keeping this
  
  channelId: string;
  youtubeApiKey: string;
  geminiApiKey: string;
}

export interface Comment {
  author: string;
  text: string;
  likes: number;
  sentiment?: 'positive' | 'negative' | 'neutral'; // Optional for AI analysis
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  topComments: Comment[]; // Added comments for AI analysis
}

export interface ChannelData {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  thumbnail: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  recentVideos: Video[];
}

export interface StrategyStep {
  phase: string;
  timeline: string;
  actions: string[];
  focus: string;
}

export interface ContentIdea {
  title: string;
  format: 'Video' | 'Short' | 'Community';
  whyItWorks: string;
  score: number;
  basedOnComment?: string; // If derived from a specific user comment
}

export interface AIAnalysis {
  channelHealthScore: number;
  healthBreakdown: {
    growth: number;
    consistency: number;
    engagement: number;
    contentQuality: number;
  };
  keyInsights: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  actionItems: {
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    description: string;
  }[];
  contentIdeas: ContentIdea[];
  strategyPlan: StrategyStep[]; // New structured strategy
}

export type ViewState = 'onboarding' | 'loading' | 'dashboard';