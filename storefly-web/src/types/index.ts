export interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
  status: 'active' | 'inactive';
  last_login?: string;
}

export interface HeroData {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  button_url: string;
  background_image?: string;
  overlay_opacity: number;
  status: number;
}

export interface Announcement {
  id: number;
  title: string;
  message: string;
  badge_text?: string;
  link_url?: string;
  link_text?: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  status: number;
  start_date?: string;
  end_date?: string;
}

export interface Statistic {
  id: number;
  value: string;
  label: string;
  icon?: string;
  sort_order: number;
  status: number;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort_order: number;
  status: number;
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  image?: string;
  icon?: string;
  price?: string;
  availability?: 'available' | 'coming_soon' | 'unavailable';
  featured: number;
  status: number;
  sort_order: number;
  category_name?: string;
  created_at?: string;
}

export interface Booking {
  id: number;
  service_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  city?: string;
  preferred_date: string;
  preferred_time?: string;
  issue_description?: string;
  device_type?: string;
  device_brand?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  service_name?: string;
  created_at: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon?: string;
  badge?: string;
  sort_order: number;
  status: number;
}

export interface HowItWorks {
  id: number;
  step_number: number;
  title: string;
  description: string;
  icon?: string;
  status: number;
}

export interface Founder {
  id: number;
  name: string;
  title: string;
  bio: string;
  experience_years?: string;
  image?: string;
  quote?: string;
  skills?: string;
  status: number;
}

export interface Testimonial {
  id: number;
  customer_name: string;
  customer_role?: string;
  review: string;
  rating: number;
  photo?: string;
  location?: string;
  sort_order: number;
  status: number;
  created_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

export interface ComingSoonItem {
  id: number;
  title: string;
  description: string;
  launch_date?: string;
  image?: string;
  category?: string;
  status: number;
}

export interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  alt_text?: string;
  created_at: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon?: string;
  status: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
