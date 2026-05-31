export interface WebsiteProduct {
  id: string;
  title: string;
  category: string;
  deliveryTime: string;
  price: number;
  originalPrice: number;
  rating: number;
  ordersCount: number;
  featuresCount: number;
  image: string;
  tags: string[];
  demoUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  priceStarting: string;
  duration: string;
  techs: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  client: string;
  year: string;
  tags: string[];
  demoUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  text: string;
  rating: number;
  type: "readymade" | "custom";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  skills: string[];
  bio: string;
}

export interface NoticeItem {
  id: string;
  iconName: string;
  text: string;
  badge?: string;
  highlight?: string;
}

export interface NoticeConfig {
  show: boolean;
  notices: NoticeItem[];
}

export interface OfferConfig {
  show: boolean;
  badgeText: string;
  urgencyText: string;
  descriptionText: string;
  timerType: "midnight" | "custom_target";
  customTargetDate?: string;
  discountActive?: boolean;
  discountPercentage?: number;
}

export interface ContactConfig {
  officeAddress: string;
  helplineNumbers: string;
  officialEmails: string;
  supportHours: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  bkashNumber?: string;
  nagadNumber?: string;
}



