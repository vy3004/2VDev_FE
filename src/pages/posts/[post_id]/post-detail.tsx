import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import {
  ClockIcon,
  EyeIcon,
  BookmarkIcon,
  BookmarkSlashIcon,
  ExclamationTriangleIcon,
  UserMinusIcon,
  UserPlusIcon,
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon, StarIcon } from "@heroicons/react/24/solid";

import LevelChip from "../../../components/common/level-chip";
import NotFoundAlert from "../../../components/common/not-found-alert";
import TagButton from "../../../components/common/tag-button";
import Comment from "../components/comment";
import CommentForm from "../components/comment-form";

import voteService from "../../../services/vote-service";
import { selectUser } from "../../../redux/features/user-slice";
import {
  formatTimeDistanceToNow,
  formatTime,
} from "../../../utils/string-utils";
import { Post } from "../../../utils/types";
import { PostType } from "../../../utils/constant";

interface PostDetailProps {
  post: Post;
  comments?: Post[];
}

const PostDetail: React.FC<PostDetailProps> = ({ post, comments }) => {
  const { i18n } = useTranslation();
  const { user } = useSelector(selectUser);

  const [vote, setVote] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [showFormAnswer, setShowFormAnswer] = useState(false);

  const handleVote = async () => {
    try {
      if (post._id) {
        if (!vote) {
          const { response } = await voteService.votePost({
            post_id: post._id,
          });

          if (response) {
            toast.success(response.data.message);
            setVote(true);
          }
        } else {
          const { response } = await voteService.removeVotePost({
            post_id: post._id,
          });

          if (response) {
            toast.success(response.data.message);
            setVote(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return post && user ? (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            {/* Info user start */}
            <div className="flex items-center gap-4">
              <Avatar
                src={post.user_detail[0].avatar}
                size="lg"
                alt="avatar"
                withBorder={true}
                className="p-0.5"
              />
              <div>
                <div className="flex items-center gap-4">
                  <Typography
                    as="a"
                    href="#"
                    className="font-bold text-blue-500 hover:text-gray-900"
                  >
                    {post.user_detail[0].name}
                  </Typography>
                  <LevelChip level={post.user_detail[0].point} />
                </div>

                <div className="text-orange-500 flex gap-1">
                  <StarIcon className="w-4 h-4" />
                  <Typography className="text-sm font-semibold">
                    {post.user_detail[0].point} points
                  </Typography>
                </div>
              </div>
            </div>
            {/* Info user end */}

            <Menu>
              <MenuHandler>
                <IconButton variant="text" className="rounded-full">
                  <EllipsisHorizontalIcon className="w-8 h-8" />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem
                  className="flex items-center gap-2"
                  onClick={() => setBookmark(!bookmark)}
                >
                  {bookmark ? (
                    <>
                      <BookmarkSlashIcon className="w-5 h-5" /> Unmark the post
                    </>
                  ) : (
                    <>
                      <BookmarkIcon className="w-5 h-5" /> Bookmark the post
                    </>
                  )}
                </MenuItem>
                <MenuItem
                  className="flex items-center gap-2"
                  onClick={() => setBookmark(!bookmark)}
                >
                  {bookmark ? (
                    <>
                      <UserMinusIcon className="w-5 h-5" /> Unfollow{" "}
                      {post.user_detail[0].name}
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-5 h-5" /> Follow{" "}
                      {post.user_detail[0].name}
                    </>
                  )}
                </MenuItem>
                <MenuItem className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-5 h-5" /> Report
                </MenuItem>
              </MenuList>
            </Menu>
          </div>

          <div className="space-y-4">
            {/* Post title start */}
            <div>
              <div className="flex items-center justify-end gap-4">
                <Tooltip content={formatTime(post.created_at, i18n.language)}>
                  <Typography className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {formatTimeDistanceToNow(post.created_at, i18n.language)}
                  </Typography>
                </Tooltip>
                <Typography className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  {post.views_count} views
                </Typography>
              </div>

              <Typography
                as="a"
                href="#"
                className="font-bold text-lg text-gary-900 hover:text-blue-500"
              >
                {post.title}
              </Typography>
            </div>
            {/* Post title end */}

            <hr />

            {/* Content start */}
            <div
              className="p-2 rounded-lg bg-gray-50"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            {/* Content end */}

            {/* Tag list start */}
            {post.hashtags.map((tag) => (
              <TagButton key={tag._id} id={tag._id} name={tag.name} />
            ))}
            {/* Tag list end */}

            <hr />

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleVote}
                variant="text"
                fullWidth
                className={`flex items-center justify-center gap-2 normal-case text-base ${
                  vote ? "text-blue-500" : "text-gray-900 dark:text-gray-50"
                }`}
              >
                <HandThumbUpIcon className="w-5 h-5" />
                {post.votes_count > 0 && post.votes_count} Like
              </Button>

              <Button
                onClick={() => setShowFormAnswer(!showFormAnswer)}
                variant="text"
                fullWidth
                className="flex items-center justify-center gap-2 normal-case text-base"
              >
                <ChatBubbleLeftIcon className="w-5 h-5" />
                {post.comment_count > 0 && post.comment_count} Comment
              </Button>

              <Button
                variant="text"
                fullWidth
                className="flex items-center justify-center gap-2 normal-case text-base"
              >
                <ShareIcon className="w-5 h-5" />
                {post.repost_count > 0 && post.repost_count} Repost
              </Button>
            </div>

            <hr />

            {/* Comment form start */}
            {showFormAnswer && (
              <CommentForm
                user_id={user._id}
                parent_id={post._id}
                type={PostType.Comment}
                content=""
              />
            )}
            {/* Comment form end */}

            {/* Comments start */}
            {comments &&
              comments.map((item) => (
                <Comment key={item._id} comment={item} user_id={user._id} />
              ))}
            {/* Comments end */}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <NotFoundAlert message="Post not found!" />
  );
};

export default PostDetail;
