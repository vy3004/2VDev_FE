export const USER_LEVELS = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

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
