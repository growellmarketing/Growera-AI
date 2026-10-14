export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  default_reply_tone: 'professional' | 'empathetic' | 'friendly' | 'concise';
  default_language: string;
  created_by: string;
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: Role;
  created_at: string;
  user?: UserProfile;
}

export interface GoogleConnection {
  id: string;
  workspace_id: string;
  google_account_id: string;
  account_name: string;
  email: string;
  status: 'active' | 'expired' | 'revoked' | 'error';
  last_sync_at: string | null;
  created_at: string;
}

export interface BusinessLocation {
  id: string;
  workspace_id: string;
  google_connection_id?: string;
  google_location_id: string;
  location_name: string;
  store_code?: string;
  address_line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country_code?: string;
  phone_number?: string;
  primary_category?: string;
  is_verified: boolean;
  average_rating: number;
  total_review_count: number;
  last_sync_at: string | null;
  created_at: string;
}

export type ReviewSentiment = 'positive' | 'neutral' | 'negative';

export interface Review {
  id: string;
  workspace_id: string;
  location_id: string;
  google_review_id: string;
  reviewer_name: string;
  reviewer_photo_url?: string;
  star_rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  review_timestamp: string;
  has_reply: boolean;
  existing_reply_text?: string;
  existing_reply_timestamp?: string;
  sentiment?: ReviewSentiment;
  sentiment_score?: number;
  is_sensitive?: boolean;
  sensitive_reason?: string;
  created_at: string;
  location?: BusinessLocation;
  draft?: ReviewReplyDraft;
}

export interface ReviewReplyDraft {
  id: string;
  workspace_id: string;
  review_id: string;
  draft_text: string;
  tone: 'professional' | 'empathetic' | 'friendly' | 'concise';
  language: string;
  status: 'draft' | 'approved' | 'rejected' | 'published';
  generated_by_ai: boolean;
  created_by?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PublishedReply {
  id: string;
  workspace_id: string;
  review_id: string;
  draft_id?: string;
  reply_text: string;
  published_by: string;
  published_at: string;
  google_response_status?: number;
  error_message?: string;
}

export interface PlanConfig {
  id: 'free_trial' | 'starter' | 'growth' | 'agency';
  name: string;
  priceMonthly: number;
  maxLocations: number;
  monthlyAiReplies: number;
  features: string[];
}
