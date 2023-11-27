export const LANGUAGES = [
  {
    name: "English",
    value: "en",
    flag: "/images/uk.webp",
  },
  {
    name: "Việt Nam",
    value: "vi",
    flag: "/images/vn.webp",
  },
];

export const STATISTICS_DURATION = 500;

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
    value: "comments_count",
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
    label: "most replies",
    value: "comments_count",
  },
];

export const USER_UPDATE_POINT = {
  vote: 5,
  unVote: -5,
  bookmark: 10,
  unBookmark: -10,
  pinComment: 20,
  unpinComment: -20,
  follow: 5,
  unFollow: -5,
  report: -10,
};

export const USER_LEVELS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

export const USERS_TYPE = [
  {
    label: "new",
    value: "new",
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

export enum USER_VERIFY {
  Unverified,
  Verified,
  Banned,
}

export enum USER_ROLE {
  User,
  Admin,
}

export enum MEDIA_TYPE {
  Image,
  Video,
}

export enum POST_TYPE {
  Post,
  RePost,
  Comment,
}

export enum NOTIFICATION_TYPE {
  VotePost,
  VoteRepost,
  VoteComment,
  Comment,
  Repost,
  Pin,
  Bookmark,
  Follow,
}

export const NOTIFICATION_CONTENT = [
  "voted for your question",
  "voted for your repost",
  "voted for your answer",
  "has answered your question",
  "has reposted your question",
  "has pinned your answer",
  "has marked your question",
  "has followed you",
];
