import { Category, NewsItem, TrendingTopic, AiExecutiveBrief, NotificationItem } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All Intelligence', iconName: 'Layers', count: 48, description: 'Unified live feed across all sectors in Bangladesh' },
  { id: 'economy', label: 'Economy & Finance', iconName: 'TrendingUp', count: 14, description: 'Central bank policies, inflation, forex reserves & RMG exports' },
  { id: 'technology', label: 'Tech & Startups', iconName: 'Cpu', count: 9, description: 'Digital transformation, AI adoption, fintech & IT exporters' },
  { id: 'infrastructure', label: 'Infrastructure & Energy', iconName: 'Building2', count: 11, description: 'Mega projects, Dhaka Metro, port expansions & power grids' },
  { id: 'climate', label: 'Climate & Delta', iconName: 'Globe2', count: 6, description: 'Bay of Bengal weather, renewable transition & delta plans' },
  { id: 'governance', label: 'Policy & Governance', iconName: 'ShieldCheck', count: 5, description: 'Regulatory frameworks, fiscal policy & institutional reforms' },
  { id: 'trade', label: 'Trade & Logistics', iconName: 'Ship', count: 3, description: 'Chittagong Port logistics, bilateral pacts & customs automation' },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-001',
    title: 'Bangladesh Bank Forex Reserves Surge Past $21.8B Following Record Remittance Inflow',
    summary: 'Foreign exchange reserves gained significant momentum following a $2.4 billion monthly inflow from expatriates, bolstering import buffer capacity to 4.8 months.',
    fullContent: `Dhaka — Foreign currency reserves in Bangladesh Bank saw a notable recovery, climbing above $21.8 billion following unprecedented monthly inward remittance figures recorded across major international banking corridors.

The central bank confirmed that streamlined official banking channels, competitive exchange rates, and digital remittance integrations with MFS platforms like bKash and Nagad significantly cut down informal hundi transactions.

Economists at the Bangladesh Institute of Development Studies (BIDS) noted that the enlarged reserves provide critical breathing room for essential import payments including refined petroleum, industrial raw materials, and agricultural fertilizer over the upcoming fiscal quarters.`,
    category: 'economy',
    source: {
      name: 'The Business Standard',
      domain: 'tbsnews.net',
      verified: true,
    },
    publishedAt: '12 mins ago',
    readTimeMinutes: 3,
    impactScore: 9.2,
    sentiment: 'positive',
    isBreaking: true,
    isTrending: true,
    keyTakeaways: [
      'Remittances surged by 22% year-on-year reaching $2.4B in July/August.',
      'Import cover expanded to 4.8 months, reducing external solvency pressure.',
      'MFS integrations played a major role in curbing informal currency channels.'
    ],
    entities: ['Bangladesh Bank', 'Remittance', 'Forex Reserves', 'bKash', 'BIDS'],
    url: 'https://tbsnews.net/economy/forex-reserves-surge-2026',
    bookmarkCount: 142,
    viewsCount: 3890,
  },
  {
    id: 'news-002',
    title: 'Dhaka Metro Rail Line-6 Extends Commercial Operations to 24/7 Schedule',
    summary: 'DMTCL announces full night service capability with automated signaling upgrades, reducing peak commuter congestion across Mirpur-Motijheel corridor by 38%.',
    fullContent: `Dhaka Mass Transit Company Limited (DMTCL) has officially initiated expanded operations on MRT Line-6, establishing a continuous schedule that integrates late-night urban transit for shift workers, IT services, and commercial hubs.

With signaling upgrades supplied by Japanese engineering consortiums, headway times during morning and evening rush hours will drop from 8 minutes to just 4.5 minutes. Station footfall data indicates over 420,000 daily passenger trips are currently processed across 16 stations.`,
    category: 'infrastructure',
    source: {
      name: 'The Daily Star',
      domain: 'thedailystar.net',
      verified: true,
    },
    publishedAt: '35 mins ago',
    readTimeMinutes: 4,
    impactScore: 8.7,
    sentiment: 'positive',
    isBreaking: false,
    isTrending: true,
    keyTakeaways: [
      'Headway reduced to 4.5 minutes during peak urban hours.',
      'Expected daily throughput capacity raised to 500,000 commuters.',
      'Automated smart ticketing syncs with national RFID transit passes.'
    ],
    entities: ['DMTCL', 'MRT Line-6', 'Dhaka Metro Rail', 'Motijheel', 'Urban Transit'],
    url: 'https://thedailystar.net/metro-rail-line-6-247-schedule',
    bookmarkCount: 98,
    viewsCount: 2910,
  },
  {
    id: 'news-003',
    title: 'RMG Export Revenue Touches $4.1B in Single Month as High-Value Garment Orders Expand',
    summary: 'Ready-Made Garment (RMG) exporters record strong European and US market gains due to green factory certifications and technical textile diversification.',
    fullContent: `Bangladesh’s apparel manufacturing sector achieved a major milestone as monthly exports touched $4.1 billion, driven by accelerated demand for sustainable activewear and functional outerwear.

Data from BGMEA reveals that over 220 LEED-certified green factories are now active across Gazipur, Narayanganj, and Chattogram EPZs. International buyers are prioritizing long-term contracts with compliance-rated manufacturers in South Asia.`,
    category: 'trade',
    source: {
      name: 'Financial Express Bangladesh',
      domain: 'thefinancialexpress.com.bd',
      verified: true,
    },
    publishedAt: '1 hour ago',
    readTimeMinutes: 5,
    impactScore: 8.9,
    sentiment: 'positive',
    isBreaking: false,
    isTrending: true,
    keyTakeaways: [
      'Green certified RMG units now account for over 45% of high-margin orders.',
      'Man-made fiber (MMF) shipment share increased to 31% of total exports.',
      'EU market demand stabilized despite global inflationary headwinds.'
    ],
    entities: ['BGMEA', 'RMG Exports', 'EPZ', 'Green Factories', 'LEED'],
    url: 'https://thefinancialexpress.com.bd/trade/rmg-export-4-billion',
    bookmarkCount: 210,
    viewsCount: 4120,
  },
  {
    id: 'news-004',
    title: 'Bangladeshi AI & Software Startups Secure $45M in Cross-Border Venture Capital',
    summary: 'Regional tech hubs in Dhaka and Sylhet draw global investors targeting B2B SaaS, localized LLMs, and automated agritech supply networks.',
    fullContent: `Venture capital investment into Bangladeshi technology ventures experienced a sharp upswing in Q3, with $45 million deployed across early-stage and Series A rounds.

Key deals were led by Southeast Asian and Silicon Valley venture funds focusing on localized AI tools tailored for Bangla language processing, supply chain optimization for micro-retailers, and credit-scoring APIs for unbanked SMEs.`,
    category: 'technology',
    source: {
      name: 'Dhaka Tribune',
      domain: 'dhakatribune.com',
      verified: true,
    },
    publishedAt: '2 hours ago',
    readTimeMinutes: 3,
    impactScore: 8.1,
    sentiment: 'positive',
    isBreaking: false,
    isTrending: false,
    keyTakeaways: [
      'Foreign VC inflows increased 64% year-over-year in the software sector.',
      'Bangla NLP models and micro-merchant fintech apps attracted majority funding.',
      'Dhaka tech ecosystem ranked among top 5 emerging South Asian startup hubs.'
    ],
    entities: ['Startups', 'Venture Capital', 'Bangla LLM', 'Dhaka Tech', 'Fintech'],
    url: 'https://dhakatribune.com/tech/bangladesh-startups-vc-funding',
    bookmarkCount: 165,
    viewsCount: 1840,
  },
  {
    id: 'news-005',
    title: 'Matarbari Deep Sea Port Completes Trial Docking of 300m Large Container Vessels',
    summary: 'Deep-draft maritime infrastructure unlocks direct shipping routes to Europe and East Asia, cutting transshipment delays through Singapore by up to 8 days.',
    fullContent: `The Matarbari Deep Sea Port project reached a decisive milestone as a 300-meter container vessel successfully docked alongside the newly completed primary berth with a 16-meter draft.

Port authorities and maritime logistics experts emphasize that Matarbari eliminates sole reliance on feeder ships operating via Singapore and Port Klang, reducing sea-freight costs for Bangladeshi importers by an estimated 15-20%.`,
    category: 'infrastructure',
    source: {
      name: 'Prothom Alo English',
      domain: 'en.prothomalo.com',
      verified: true,
    },
    publishedAt: '3 hours ago',
    readTimeMinutes: 4,
    impactScore: 9.0,
    sentiment: 'high-impact',
    isBreaking: false,
    isTrending: true,
    keyTakeaways: [
      'Direct main-line vessel calls save 7 to 10 days in transshipment time.',
      'Logistics cost savings estimated at $220 per TEU container.',
      'Phase 1 terminal capacity will handle 1.1 million TEUs annually.'
    ],
    entities: ['Matarbari Port', 'JICA', 'Chattogram', 'Deep Sea Port', 'Maritime Trade'],
    url: 'https://en.prothomalo.com/business/matarbari-port-trial-docking',
    bookmarkCount: 188,
    viewsCount: 3200,
  },
  {
    id: 'news-006',
    title: 'Bay of Bengal Cyclone Advisory: Cyclone Preparedness Units Activated in Coastal Belt',
    summary: 'Bangladesh Meteorological Department issues Warning Signal No. 4; automated weather radar arrays monitor low-pressure development off Cox’s Bazar coast.',
    fullContent: `The Bangladesh Meteorological Department (BMD) has issued maritime warning signal number 4 for maritime ports at Chittagong, Cox's Bazar, Mongla, and Payra as a deep depression over the east-central Bay of Bengal intensifies.

The Ministry of Disaster Management has mobilized 78,000 Cyclone Preparedness Programme (CPP) volunteers across coastal districts with real-time satellite telemetry mapping shelter capacities.`,
    category: 'climate',
    source: {
      name: 'The Daily Star',
      domain: 'thedailystar.net',
      verified: true,
    },
    publishedAt: '4 hours ago',
    readTimeMinutes: 2,
    impactScore: 8.5,
    sentiment: 'negative',
    isBreaking: true,
    isTrending: false,
    keyTakeaways: [
      'Maritime Signal No. 4 issued for Chittagong and Cox’s Bazar ports.',
      '78,000 CPP volunteers deployed along coastal hazard zones.',
      'Automated satellite weather tracking operational 24/7.'
    ],
    entities: ['BMD', 'Bay of Bengal', 'Cyclone Warning', 'Coastal Safety', 'Cox’s Bazar'],
    url: 'https://thedailystar.net/news/bay-of-bengal-cyclone-signal-4',
    bookmarkCount: 76,
    viewsCount: 4100,
  },
  {
    id: 'news-007',
    title: 'NBR Rolls Out Automated E-Tax Clearance Portal for Corporate and Individual Payers',
    summary: 'National Board of Revenue targets tax-to-GDP ratio improvement with instant digital TIN generation and algorithmic tax assessment validation.',
    fullContent: `In an initiative aimed at expanding the national tax net, the National Board of Revenue (NBR) launched its modernized e-Return 2.0 system featuring automatic income verification via banking databases.

NBR officials project a 35% increase in e-filings as taxpayers receive digital clearance certificates within minutes of submission.`,
    category: 'governance',
    source: {
      name: 'Financial Express Bangladesh',
      domain: 'thefinancialexpress.com.bd',
      verified: true,
    },
    publishedAt: '5 hours ago',
    readTimeMinutes: 3,
    impactScore: 7.8,
    sentiment: 'neutral',
    isBreaking: false,
    isTrending: false,
    keyTakeaways: [
      'e-Return portal processes digital submissions without physical interaction.',
      'Integration with NID and bank databases streamlines income cross-matching.',
      'Aims to onboard 1.2 million new registered taxpayers by fiscal year end.'
    ],
    entities: ['NBR', 'Taxation', 'e-Return', 'Fiscal Reform', 'Digital Bangladesh'],
    url: 'https://thefinancialexpress.com.bd/economy/nbr-e-tax-portal',
    bookmarkCount: 84,
    viewsCount: 1530,
  },
  {
    id: 'news-008',
    title: 'Solar & Wind Capacity Crosses 1,800MW as Off-Grid Solar Pumps Expand in Northern Districts',
    summary: 'SREDA reports rapid renewable energy adoption in Rangpur and Rajshahi divisions, replacing 45,000 diesel irrigation pumps with solar-powered systems.',
    fullContent: `The Sustainable and Renewable Energy Development Authority (SREDA) reported that Bangladesh’s installed solar and wind capacity reached 1,820 megawatts following the commissioning of a 100MW grid-tied solar plant in Teesta.

Simultaneously, the solar irrigation initiative in northern agricultural belts has cut national diesel import demand by 38,000 metric tons per harvesting season.`,
    category: 'climate',
    source: {
      name: 'The Business Standard',
      domain: 'tbsnews.net',
      verified: true,
    },
    publishedAt: '6 hours ago',
    readTimeMinutes: 3,
    impactScore: 8.2,
    sentiment: 'positive',
    isBreaking: false,
    isTrending: false,
    keyTakeaways: [
      'Installed renewable capacity surpassed 1.8 GW national threshold.',
      '45,000 diesel pumps replaced with clean solar irrigation systems.',
      'Reduces agricultural fuel import bill by $34 million annually.'
    ],
    entities: ['SREDA', 'Solar Irrigation', 'Renewable Energy', 'Rangpur', 'Teesta'],
    url: 'https://tbsnews.net/energy/solar-capacity-1800mw',
    bookmarkCount: 112,
    viewsCount: 2040,
  }
];

export const TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 'trend-1',
    topic: 'Bangladesh Bank Forex Surge',
    banglaTitle: 'রেমিট্যান্স ও রিজার্ভ বৃদ্ধি',
    articleCount: 18,
    volumeChange: '+210%',
    sentiment: 'positive',
    category: 'economy',
    keyEntities: ['Bangladesh Bank', 'Forex', 'Remittance', 'bKash'],
  },
  {
    id: 'trend-2',
    topic: 'Matarbari Deep Sea Port Trial',
    banglaTitle: 'মাতারবাড়ী গভীর সমুদ্র বন্দর',
    articleCount: 14,
    volumeChange: '+145%',
    sentiment: 'high-impact',
    category: 'infrastructure',
    keyEntities: ['Matarbari', 'JICA', 'Chattogram Port', 'TEU Shipping'],
  },
  {
    id: 'trend-3',
    topic: 'RMG Export High-Value Trend',
    banglaTitle: 'পোশাক রপ্তানিতে নতুন মাইলফলক',
    articleCount: 12,
    volumeChange: '+88%',
    sentiment: 'positive',
    category: 'trade',
    keyEntities: ['BGMEA', 'LEED Green', 'Apparel Exports', 'EU Market'],
  },
  {
    id: 'trend-4',
    topic: 'Bay of Bengal Cyclone Watch',
    banglaTitle: 'বঙ্গোপসাগরে নিম্নচাপ ও সতর্কসংকেত',
    articleCount: 9,
    volumeChange: '+310%',
    sentiment: 'negative',
    category: 'climate',
    keyEntities: ['BMD', 'Signal No. 4', 'Coastal Belt', 'CPP Volunteers'],
  },
  {
    id: 'trend-5',
    topic: 'Dhaka Metro 24/7 Schedule',
    banglaTitle: 'মেট্রোরেলে রাত্রিকালীন যাত্রা',
    articleCount: 8,
    volumeChange: '+64%',
    sentiment: 'positive',
    category: 'infrastructure',
    keyEntities: ['DMTCL', 'MRT Line-6', 'Motijheel', 'Commuter Flow'],
  }
];

export const AI_EXECUTIVE_BRIEF: AiExecutiveBrief = {
  generatedAt: 'Updated 5 minutes ago via Gemini 2.5 Intelligence Engine',
  headline: 'Macro Intelligence Outlook: Remittance Inflow Cushion Stabilizes Monetary Policy as Infrastructure Upgrades Accelerate Trade Velocity',
  bulletPoints: [
    {
      title: 'Monetary Solvency Reinforced',
      detail: 'Monthly remittance touchpoint of $2.4B elevates foreign currency buffer to nearly 5 months of imports, easing dollar supply pressure for industrial importers.',
      tag: 'Macro Economy'
    },
    {
      title: 'Strategic Maritime Advantage Unlocked',
      detail: 'Matarbari Deep Sea Port vessel trials mark a major structural transition from feeder dependency to direct main-line shipping, reducing transit times to European hubs by 8 days.',
      tag: 'Logistics & Trade'
    },
    {
      title: 'High-Value Manufacturing Pivot',
      detail: 'Over 220 green-certified RMG units are capturing premium order flows in technical garments and man-made fiber products, insulating sector revenue.',
      tag: 'Export Sector'
    },
    {
      title: 'Environmental Preparedness Active',
      detail: 'Coastal disaster telemetry arrays and early-warning signal 4 protocols in the Bay of Bengal are actively monitored to safeguard maritime supply chains.',
      tag: 'Climate Resilience'
    }
  ],
  overallSentiment: 'Positive Outlook',
  macroImpactScore: 8.8,
  keyEntitiesMentioned: ['Bangladesh Bank', 'Matarbari Port', 'BGMEA', 'DMTCL', 'BMD Weather'],
  recommendedActions: [
    'Monitor central bank policy rate announcements scheduled for Q3.',
    'Track logistics cost savings for export shipments via Matarbari direct routes.',
    'Evaluate renewable solar energy duty incentives for industrial plants.'
  ]
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'BREAKING: Bay of Bengal Signal 4',
    description: 'Meteorological department elevates warning signal to No. 4 for Chittagong & Cox’s Bazar ports.',
    timestamp: '15m ago',
    type: 'breaking',
    read: false,
    newsId: 'news-006'
  },
  {
    id: 'notif-2',
    title: 'AI Intelligence Brief Complete',
    description: 'Gemini 2.5 analysis of Q3 Bangladesh macro indicators and export forecasts is ready.',
    timestamp: '42m ago',
    type: 'ai_insight',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Forex Reserves Alert',
    description: 'Bangladesh Bank foreign exchange reserves surpassed $21.8B threshold.',
    timestamp: '1h ago',
    type: 'market_alert',
    read: true,
    newsId: 'news-001'
  },
  {
    id: 'notif-4',
    title: 'Matarbari Deep Port Milestones',
    description: '300m trial container vessel successfully berthed with 16m draft capacity.',
    timestamp: '3h ago',
    type: 'system',
    read: true,
    newsId: 'news-005'
  }
];
