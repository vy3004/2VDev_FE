export const USER_LEVELS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

export const POSTS_TYPE = ["new", "follow", "trending", "popular", "hot"];

export const USERS_TYPE = ["all", "follower", "following"];

export const USERS_HEADER_PAGE = [
  {
    type: USERS_TYPE[0],
    title: "All Users",
    desc: "See information about all users",
  },
  {
    type: USERS_TYPE[1],
    title: "All Followers",
    desc: "See information about all followers",
  },
  {
    type: USERS_TYPE[2],
    title: "All Following",
    desc: "See information about all the users you're following",
  },
];

export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned, // bị khóa
}

export enum UserRoleStatus {
  User, // tào khoản người dùng, mặc định = 0
  Admin, // tài khoản admin
}

export enum MediaType {
  Image,
  Video,
}

export enum PostType {
  Post,
  RePost,
  Comment,
}

export enum ResolvedType {
  unResolved,
  Resolved,
}
