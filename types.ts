export interface OnboardingData {
  mainProblem: string;
  ideaSources: string[];
  currentPostingFreq: string;
  goalPostingFreq: string;
  consistencyBlocker: string;
  weeklyHours: number;
  primaryGoal: string;
  goalTimeline: string;
  biggestFrustration: string;
  channelId: string;
  youtubeApiKey: string;
  geminiApiKey: string; // Added Gemini API Key
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