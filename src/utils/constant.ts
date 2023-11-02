export const USER_LEVELS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

export const POSTS_TYPE = [
  {
    label: "all",
    value: "all",
  },
  {
    label: "followed",
    value: "follow",
  },
];

export const POSTS_SORT = [
  {
    label: "newest",
    value: "created_at",
  },
  {
    label: "most views",
    value: "views_count",
  },
  {
    label: "most votes",
    value: "votes_count",
  },
  {
    label: "most interactions",
    value: "comment_count",
  },
];

export const COMMENTS_SORT = [
  {
    label: "newest",
    value: "created_at",
  },
  {
    label: "most votes",
    value: "votes_count",
  },
  {
    label: "most relies",
    value: "comment_count",
  },
];

export const USERS_TYPE = [
  {
    label: "all",
    value: "all",
  },
  {
    label: "most points",
    value: "point",
  },
  {
    label: "most followed",
    value: "followers",
  },
  {
    label: "follower",
    value: "follower",
  },
  {
    label: "following",
    value: "following",
  },
];

export const USERS_HEADER_PAGE = [
  {
    type: USERS_TYPE[0].value,
    title: "All Users",
    desc: "See information about all users",
  },
  {
    type: USERS_TYPE[1].value,
    title: "Most Points Users",
    desc: "See information about users with the most points",
  },
  {
    type: USERS_TYPE[2].value,
    title: "Most Followed Users",
    desc: "See information about most followed users",
  },
  {
    type: USERS_TYPE[3].value,
    title: "All Followers",
    desc: "See information about all followers",
  },
  {
    type: USERS_TYPE[4].value,
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
