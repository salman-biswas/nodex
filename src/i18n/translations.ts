export type Language = 'en' | 'bn';

export const translations = {
  en: {
    // Top Nav & Header
    appTitle: 'Nodex',
    subtitle: 'Bangladesh AI Insights',
    searchPlaceholder: 'Search news, topics, or ask Gemini AI...',
    askAi: 'Ask Gemini AI',
    commandK: '⌘K',
    liveStream: 'Live Stream',
    livePipeline: 'Live Pipeline',
    notifications: 'Notifications',
    switchLanguage: 'বাংলা',
    
    // Main Tabs
    newsFeed: 'News Feed',
    analytics: 'Analytics',
    trending: 'Trending Topics',
    systemMonitor: 'System & Pipeline',
    
    // Categories
    catAll: 'All News',
    catEconomy: 'Economy & Finance',
    catTechnology: 'Tech & Startups',
    catInfrastructure: 'Infrastructure & Energy',
    catClimate: 'Climate & Delta',
    catGovernance: 'Policy & Governance',
    catTrade: 'Trade & Logistics',
    
    // Filters & Sorting
    sortBy: 'Sort By',
    latestFirst: 'Latest First',
    highImpact: 'High Impact',
    trendingFirst: 'Trending First',
    filterSentiment: 'Filter Sentiment',
    allSentiments: 'All',
    positive: 'Positive',
    critical: 'Critical',
    neutral: 'Neutral',
    breakingOnly: 'Breaking Only',
    
    // AI Executive Brief
    aiBriefTitle: 'AI Daily Brief',
    aiBriefSubtitle: 'Synthesized by Gemini 3.6 Flash from live Bangladesh media sources',
    macroOutlook: 'Macro Outlook',
    impactScore: 'Impact Score',
    keyTakeaways: 'Key Bullet Takeaways',
    readFullReport: 'Read Full Report',
    hideDetails: 'Hide Details',
    expandBrief: 'Expand Full AI Brief',
    
    // News Card
    breaking: 'BREAKING',
    minRead: 'min read',
    impact: 'Impact',
    verified: 'Verified',
    aiTakeaways: 'AI Takeaways',
    hideTakeaways: 'Hide Takeaways',
    shareLink: 'Share',
    copied: 'Copied!',
    
    // Trending Panel
    trendingTitle: 'Trending Topics',
    volumeChange: 'Volume',
    reports: 'reports',
    verifiedSources: 'Verified Media Outlets',
    statusOnline: 'Online',
    
    // Analytics
    macroDashboard: 'Macro Intelligence Overview',
    totalArticles: 'Total Articles',
    avgImpact: 'Avg Impact Score',
    breakingAlerts: 'Breaking Alerts',
    sentimentDistribution: 'Sentiment Breakdown',
    sectorShare: 'Category Coverage',
    topEntities: 'Top Mentioned Entities',
    refreshData: 'Refresh Data',
    
    // System / Pipeline Panel
    pipelineTitle: 'Automation & Pipeline Monitor',
    pipelineSubtitle: '10m Interval Cron • RSS & Web Scrapers • Deduplication Engine',
    schedulerActive: 'Scheduler Active',
    nextRun: 'Next Run',
    runNow: 'Run Pipeline Now',
    enrichGemini: 'Enrich with Gemini AI',
    sourcesCount: 'Configured Sources',
    supabaseConnected: 'Supabase Connected',
    localFallback: 'Local Fallback Storage',
    viewLogs: 'View Pipeline Logs',
    
    // Search Modal
    searchModalTitle: 'Gemini AI Search & Quick Filter',
    aiSearchTab: 'Gemini AI Search',
    keywordFilterTab: 'Keyword Search',
    suggestedQueries: 'Suggested Queries',
    askAiPrompt: 'Ask any question about Bangladesh news today...',
    synthesizing: 'Synthesizing response...',
    executiveSynthesis: 'Executive Synthesis',
    referencedSources: 'Referenced News Reports',
    
    // Detail Modal
    originalSource: 'Read Original Source',
    aiAnalysisReport: 'Gemini AI Analysis Report',
    executiveSummary: 'Executive Summary',
    detailedSummary: 'Detailed Overview',
    keyTopics: 'Key Topics',
    persons: 'Persons Referenced',
    places: 'Places',
    keywords: 'Keywords',
    
    // Empty & Loading
    noArticlesFound: 'No news reports found matching your criteria.',
    resetFilters: 'Reset Filters',
    loading: 'Loading news intelligence...',
    
    // Footer
    footerCopyright: '© 2026 Nodex. Bangladesh AI Insights in Seconds.',
    dhakaTime: 'Dhaka Standard Time (GMT+6)',
  },
  bn: {
    // Top Nav & Header
    appTitle: 'নোডেক্স (Nodex)',
    subtitle: 'বাংলাদেশ এআই ইনসাইটস ড্যাশবোর্ড',
    searchPlaceholder: 'সংবাদ খুঁজুন বা জেমিনাই এআই-কে প্রশ্ন করুন...',
    askAi: 'এআই প্রশ্ন করুন',
    commandK: '⌘K',
    liveStream: 'লাইভ সংবাদ',
    livePipeline: 'সক্রিয় পাইপলাইন',
    notifications: 'নোটিফিকেশন',
    switchLanguage: 'English',
    
    // Main Tabs
    newsFeed: 'সংবাদ ফিড',
    analytics: 'এনালাইটিক্স',
    trending: 'ট্রেন্ডিং বিষয়সমূহ',
    systemMonitor: 'সিস্টেম মনিটর',
    
    // Categories
    catAll: 'সব খবর',
    catEconomy: 'অর্থনীতি ও ব্যাংক',
    catTechnology: 'তথ্যপ্রযুক্তি ও স্টার্টআপ',
    catInfrastructure: 'মেগা প্রকল্প ও জ্বালানি',
    catClimate: 'জলবায়ু ও ডেল্টা',
    catGovernance: 'নীতিমালা ও শাসন',
    catTrade: 'বাণিজ্য ও পোশাকখাত',
    
    // Filters & Sorting
    sortBy: 'সাজান',
    latestFirst: 'সর্বশেষ খবর',
    highImpact: 'গুরুত্বপূর্ণ খবর',
    trendingFirst: 'জনপ্রিয় খবর',
    filterSentiment: 'ধরণ অনুযায়ী',
    allSentiments: 'সব ধরণ',
    positive: 'ইতিবাচক',
    critical: 'জরুরি/নেতিবাচক',
    neutral: 'নিরপেক্ষ',
    breakingOnly: 'শুধুমাত্র ব্রেকিং',
    
    // AI Executive Brief
    aiBriefTitle: 'দৈনিক এআই সামারি',
    aiBriefSubtitle: 'বাংলাদেশের শীর্ষ গণমাধ্যম থেকে জেমিনাই ৩.৬ ফ্ল্যাশ দ্বারা সংক্ষেপিত',
    macroOutlook: 'সামগ্রিক প্রভাব',
    impactScore: 'প্রভাব স্কোর',
    keyTakeaways: 'মূল সারসংক্ষেপ',
    readFullReport: 'বিস্তারিত খবর দেখুন',
    hideDetails: 'সংক্ষেপ করুন',
    expandBrief: 'সম্পূর্ণ এআই রিপোর্ট দেখুন',
    
    // News Card
    breaking: 'ব্রেকিং',
    minRead: 'মিনিট পড়া',
    impact: 'প্রভাব',
    verified: 'সত্যায়িত',
    aiTakeaways: 'এআই সারসংক্ষেপ',
    hideTakeaways: 'লুকান',
    shareLink: 'শেয়ার',
    copied: 'কপি হয়েছে!',
    
    // Trending Panel
    trendingTitle: 'ট্রেন্ডিং বিষয়সমূহ',
    volumeChange: 'প্রবৃদ্ধি',
    reports: 'টি প্রতিবেদন',
    verifiedSources: 'সত্যায়িত গণমাধ্যম',
    statusOnline: 'অনলাইন',
    
    // Analytics
    macroDashboard: 'সংবাদ বিশ্লেষণ ড্যাশবোর্ড',
    totalArticles: 'মোট সংবাদ',
    avgImpact: 'গড় প্রভাব স্কোর',
    breakingAlerts: 'ব্রেকিং অ্যালার্ট',
    sentimentDistribution: 'সংবাদের ধরণ বিশ্লেষণ',
    sectorShare: 'খাতভিত্তিক খবর',
    topEntities: 'সর্বাধিক আলোচিত বিষয়সমূহ',
    refreshData: 'রিফ্রেশ করুন',
    
    // System / Pipeline Panel
    pipelineTitle: 'সংবাদ সংগ্রহ ও পাইপলাইন মনিটর',
    pipelineSubtitle: '১০ মিনিট পর পর স্বয়ংক্রিয় খবর সংগ্রহ • আরএসএস ও ওয়েব স্ক্র্যাপার',
    schedulerActive: 'শিডিউলার সক্রিয়',
    nextRun: 'পরবর্তী রান',
    runNow: 'এখনই রান করুন',
    enrichGemini: 'এআই বিশ্লেষণ যুক্ত করুন',
    sourcesCount: 'সংযুক্ত সোর্স',
    supabaseConnected: 'সুপাবেজ সংযুক্ত',
    localFallback: 'লোকাল স্টোরেজ সক্রিয়',
    viewLogs: 'লগ দেখুন',
    
    // Search Modal
    searchModalTitle: 'জেমিনাই এআই সার্চ ও ফিল্টার',
    aiSearchTab: 'জেমিনাই এআই সার্চ',
    keywordFilterTab: 'কীওয়ার্ড সার্চ',
    suggestedQueries: 'সুপারিশকৃত প্রশ্নসমূহ',
    askAiPrompt: 'আজকের খবর সম্পর্কে যেকোনো প্রশ্ন করুন...',
    synthesizing: 'উত্তরের জন্য এআই বিশ্লেষণ চলছে...',
    executiveSynthesis: 'এআই উত্তর ও সারসংক্ষেপ',
    referencedSources: 'সংযুক্ত সংবাদ সূত্রসমূহ',
    
    // Detail Modal
    originalSource: 'মূল সংবাদের উৎসে যান',
    aiAnalysisReport: 'জেমিনাই ৩.৬ ফ্ল্যাশ বিশ্লেষণ রিপোর্ট',
    executiveSummary: 'সংক্ষিপ্ত সারসংক্ষেপ',
    detailedSummary: 'বিস্তারিত বিবরণ',
    keyTopics: 'প্রধান বিষয়',
    persons: 'আলোচিত ব্যক্তি',
    places: 'আলোচিত স্থান',
    keywords: 'কীওয়ার্ড',
    
    // Empty & Loading
    noArticlesFound: 'আপনার ফিল্টার অনুযায়ী কোনো সংবাদ পাওয়া যায়নি।',
    resetFilters: 'ফিল্টার মুছুন',
    loading: 'সংবাদ লোড হচ্ছে...',
    
    // Footer
    footerCopyright: '© ২০২৬ বাংলাদেশ নিউজ ইনটেলিজেন্স। সহজ, দ্রুত ও নির্ভুল।',
    dhakaTime: 'ঢাকা সময় (GMT+6)',
  }
};
