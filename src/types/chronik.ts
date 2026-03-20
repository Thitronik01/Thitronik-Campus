export interface ChronikEntry {
  id: string;
  year: number;
  title: string;
  description: string | null;
  video_url: string | null;
  sort_order: number;
  created_at: string;
  images: ChronikImage[];
  comments: ChronikComment[];
}

export interface ChronikImage {
  id: string;
  chronik_id: string;
  storage_path: string;
  caption: string | null;
  sort_order: number;
  publicUrl?: string;
}

export interface ChronikComment {
  id: string;
  chronik_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}
