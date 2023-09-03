export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  date_of_birth?: Date;
  verify: number;
  role: number;
  level: number;
  point?: number;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  cover_photo?: string;
}
