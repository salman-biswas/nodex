export type CategoryId =
  | 'all'
  | 'economy'
  | 'technology'
  | 'infrastructure'
  | 'climate'
  | 'governance'
  | 'trade';

export interface Category {
  id: CategoryId;
  label: string;
  iconName: string;
  count: number;
  description: string;
}

export type Sentiment = 'positive' | 'negative' | 'neutral' | 'high-impact';

export interface AiEnrichment {
  shortSummary: string;
  mediumSummary: string;
  bulletSummary: string[];
  headlineRewrite: string;
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  importantPersons: string[];
  importantPlaces: string[];
  keywords: string[];
  generatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullContent?: string;
  category: CategoryId;
  source: {
    name: string;
    domain: string;
    verified: boolean;
    logoUrl?: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  impactScore: number; // 1 to 10
  sentiment: Sentiment;
  keyTakeaways: string[];
  entities: string[];
  url: string;
  imageUrl?: string;
  isBreaking?: boolean;
  isTrending?: boolean;
  bookmarkCount: number;
  viewsCount: number;
  aiEnrichment?: AiEnrichment;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  banglaTitle?: string;
  articleCount: number;
  volumeChange: string; // e.g. "+142%"
  sentiment: Sentiment;
  category: CategoryId;
  keyEntities: string[];
}

export interface AiExecutiveBrief {
  generatedAt: string;
  headline: string;
  bulletPoints: {
    title: string;
    detail: string;
    tag: string;
  }[];
  overallSentiment: 'Positive Outlook' | 'Neutral Stability' | 'High Sensitivity' | 'Strategic Opportunity';
  macroImpactScore: number;
  keyEntitiesMentioned: string[];
  recommendedActions: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'breaking' | 'ai_insight' | 'market_alert' | 'system';
  read: boolean;
  newsId?: string;
}

export interface UserPreferences {
  darkMode: boolean;
  language: 'en' | 'bn' | 'es' | 'fr';
  preferredCategories: CategoryId[];
  emailNotifications: boolean;
  autoPlayAudio: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

export interface ReadingHistoryItem {
  articleId: string;
  articleTitle: string;
  category: CategoryId;
  readAt: string;
  readDurationSeconds?: number;
}

export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  isAnonymous: boolean;
  authProvider: 'google' | 'github' | 'email' | 'anonymous';
  createdAt: string;
  lastLoginAt: string;
  bookmarks: string[];
  readingHistory: ReadingHistoryItem[];
  preferences: UserPreferences;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
}
