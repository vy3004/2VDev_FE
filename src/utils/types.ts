import { MediaType, PostType } from "./constant";

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  verify: number;
  role: number;
  point: number;
  date_of_birth?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  cover_photo?: string;
  questions: number;
  answers: number;
  following: number;
  followers: number;
  created_at: string;
  updated_at: string;
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
  reposts_count: number;
  reports_count: number;
  bookmarks_count: number;
  views_count: number;
  guest_views?: number;
  user_views?: number;
  reply_comment?: Post[];
  is_voted: boolean;
  is_reported: boolean;
  is_bookmarked: boolean;
  resolved_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserCardType {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  point: number;
  is_followed: boolean;
  followers?: number;
  following?: number;
}
