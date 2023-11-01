import { MediaType, PostType } from "./constant";

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  date_of_birth?: string;
  verify: number;
  role: number;
  level: number;
  point: number;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  cover_photo?: string;
}

export interface Media {
  url: string;
  type: MediaType; // 0 = image, 1 = video
}

export interface Tag {
  _id: string;
  name: string;
}

export interface Post {
  _id: string;
  parent_id: null | string;
  user_detail: User;
  title: string;
  content: string;
  medias: string[];
  type: PostType;
  hashtags: Tag[];
  resolved?: string | number;
  votes_count: number;
  comments_count: number;
  repost_count: number;
  reports_count: number;
  bookmarks_count: number;
  views_count: number;
  guest_views?: number;
  user_views?: number;
  reply_comment?: Post[];
  is_voted: boolean;
  is_reported: boolean;
  resolved_id: string;
  created_at: string;
  updated_at: string;
}
