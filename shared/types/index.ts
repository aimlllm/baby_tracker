// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  autoApprove: boolean;
  notifications: boolean;
  timezone: string;
  dateFormat: string;
  units: 'metric' | 'imperial';
}

export interface Baby {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  medical_info?: MedicalInfo;
  avatar_url?: string;
  created_at: string;
}

export interface MedicalInfo {
  blood_type?: string;
  allergies?: string[];
  medications?: string[];
  conditions?: string[];
  pediatrician?: string;
}

export interface Caregiver {
  id: string;
  user_id: string;
  baby_id: string;
  caregiver_email: string;
  role: 'parent' | 'guardian' | 'babysitter' | 'other';
  permissions: CaregiverPermissions;
  created_at: string;
}

export interface CaregiverPermissions {
  can_add_entries: boolean;
  can_edit_entries: boolean;
  can_delete_entries: boolean;
  can_view_analytics: boolean;
}

// Activity Log Types
export interface FeedingLog {
  id: string;
  baby_id: string;
  time: string;
  type: 'breast' | 'formula' | 'solid';
  amount_ml?: number;
  duration_minutes?: number;
  food_type?: string;
  breast_side?: 'left' | 'right' | 'both';
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface DiaperLog {
  id: string;
  baby_id: string;
  time: string;
  type: 'wet' | 'dirty' | 'both';
  color?: string;
  consistency?: 'normal' | 'soft' | 'hard' | 'watery';
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface SleepLog {
  id: string;
  baby_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  quality?: 'good' | 'fair' | 'poor';
  location?: string;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  baby_id: string;
  time: string;
  activity_type: string;
  location?: string;
  details?: ActivityDetails;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface ActivityDetails {
  duration_minutes?: number;
  participants?: string[];
  mood?: 'happy' | 'neutral' | 'fussy' | 'crying';
  milestones?: string[];
  photos?: string[];
}

// OCR and NLP Types
export interface OCRUpload {
  id: string;
  user_id: string;
  file_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  extracted_text?: string;
  extracted_data?: ExtractedData;
  error_message?: string;
  processed_at?: string;
  created_at: string;
}

export interface ExtractedData {
  entries: ParsedEntry[];
  confidence: number;
  original_text: string;
}

export interface ParsedEntry {
  type: 'feeding' | 'diaper' | 'sleep' | 'activity';
  data: any;
  confidence: number;
  original_text: string;
  requires_approval: boolean;
}

export interface NLPParseRequest {
  text: string;
  context?: {
    baby_id: string;
    timezone: string;
    date_hint?: string;
  };
}

export interface NLPParseResponse {
  success: boolean;
  entries: ParsedEntry[];
  interpretation: string;
  requires_approval: boolean;
}

// Analytics Types
export interface DailySummary {
  date: string;
  baby_id: string;
  feeding_count: number;
  feeding_total_ml: number;
  diaper_count: number;
  diaper_wet: number;
  diaper_dirty: number;
  sleep_total_minutes: number;
  sleep_sessions: number;
  activities: ActivitySummary[];
}

export interface ActivitySummary {
  type: string;
  count: number;
  total_duration_minutes: number;
}

export interface TrendData {
  period: 'daily' | 'weekly' | 'monthly';
  metric: string;
  data: DataPoint[];
}

export interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface GrowthData {
  date: string;
  weight_kg?: number;
  height_cm?: number;
  head_circumference_cm?: number;
  percentile_weight?: number;
  percentile_height?: number;
  percentile_head?: number;
}

// Media Types
export interface MediaAttachment {
  id: string;
  baby_id: string;
  url: string;
  type: 'photo' | 'document';
  thumbnail_url?: string;
  metadata?: MediaMetadata;
  created_at: string;
}

export interface MediaMetadata {
  filename: string;
  size_bytes: number;
  mime_type: string;
  width?: number;
  height?: number;
  duration_seconds?: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  has_more?: boolean;
}

// Form Types
export interface FeedingFormData {
  time: Date;
  type: 'breast' | 'formula' | 'solid';
  amount_ml?: number;
  duration_minutes?: number;
  food_type?: string;
  breast_side?: 'left' | 'right' | 'both';
  notes?: string;
}

export interface DiaperFormData {
  time: Date;
  type: 'wet' | 'dirty' | 'both';
  color?: string;
  consistency?: 'normal' | 'soft' | 'hard' | 'watery';
  notes?: string;
}

export interface SleepFormData {
  start_time: Date;
  end_time?: Date;
  quality?: 'good' | 'fair' | 'poor';
  location?: string;
  notes?: string;
}

export interface ActivityFormData {
  time: Date;
  activity_type: string;
  location?: string;
  duration_minutes?: number;
  mood?: 'happy' | 'neutral' | 'fussy' | 'crying';
  notes?: string;
}

// Filter and Query Types
export interface LogFilter {
  baby_id: string;
  start_date?: string;
  end_date?: string;
  type?: string[];
  limit?: number;
  offset?: number;
  sort_by?: 'time' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface AnalyticsQuery {
  baby_id: string;
  metric: 'feeding' | 'sleep' | 'diapers' | 'growth' | 'activities';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  group_by?: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: 'reminder' | 'milestone' | 'alert' | 'share';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export interface ReminderSettings {
  feeding_interval_hours?: number;
  diaper_interval_hours?: number;
  sleep_reminder?: boolean;
  medication_reminders?: MedicationReminder[];
}

export interface MedicationReminder {
  name: string;
  times: string[];
  days: string[];
  active: boolean;
}

// Export Types
export interface ExportRequest {
  baby_id: string;
  format: 'pdf' | 'csv' | 'json';
  start_date: string;
  end_date: string;
  include_photos: boolean;
  include_analytics: boolean;
}

export interface ExportResponse {
  url: string;
  filename: string;
  expires_at: string;
}
