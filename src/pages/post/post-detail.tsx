import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import postService from "../../services/post-service";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Spinner,
  Tooltip,
  Typography,
} from "@material-tailwind/react";
import LevelChip from "../../components/common/level-chip";
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
import Loading from "../../components/common/loading";
import NotFoundAlert from "../../components/common/not-found-alert";
import { Post } from "../../utils/types";
import TagButton from "../../components/common/tag-button";
import { formatTimeDistanceToNow, formatTime } from "../../utils/string-utils";
import { useTranslation } from "react-i18next";
import voteService from "../../services/vote-service";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";

const PostDetail = () => {
  const { post_id } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Post[]>();
  const [vote, setVote] = useState(false);
  const [showFormAnswer, setShowFormAnswer] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);

        if (post_id) {
          const postData = await postService.getPost({
            post_id: post_id,
          });

          if (postData.response) {
            setPost(postData.response.data.result);
          }

          const commentsData = await postService.getComments({
            post_id: post_id,
            limit: 20,
            page: 1,
          });

          if (commentsData.response) {
            let data = [...commentsData.response.data.result.post_children];

            await Promise.all(
              data.map(async (item) => {
                if (item.comment_count > 0) {
                  const replyData = await postService.getComments({
                    post_id: item._id,
                    limit: 20,
                    page: 1,
                  });
                  if (replyData.response) {
                    item.reply_comment =
                      replyData.response.data.result.post_children;
                  }
                }
                return item;
              })
            );

            setComments(data);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [post_id]);

  const handleVote = async () => {
    try {
      if (post_id) {
        if (!vote) {
          const { response } = await voteService.votePost({
            post_id: post_id,
          });

          if (response) {
            toast.success(response.data.message);
            setVote(true);
          }
        } else {
          const { response } = await voteService.removeVotePost({
            post_id: post_id,
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

  console.log("POST", post);
  console.log("comments", comments);

  return loading ? (
    <div className="relative h-96">
      <Loading />
    </div>
  ) : post ? (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="space-y-2">
          <div className="flex justify-between">
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

                <Typography className="text-sm text-orange-500 font-semibold flex items-center gap-1">
                  <StarIcon className="w-4 h-4" />
                  {post.user_detail[0].point} points
                </Typography>
              </div>
            </div>

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

            {showFormAnswer && (
              <form className="space-y-2">
                <ReactQuill
                  // value={postQuestionForm.values.content}
                  // onChange={(value) => postQuestionForm.setFieldValue("content", value)}
                  theme="snow"
                  placeholder="Write something..."
                />
                <div className="flex justify-end">
                  <Button
                    // onClick={postQuestionForm.submitForm}
                    className="normal-case"
                    variant="gradient"
                    disabled={isSubmit}
                  >
                    {isSubmit ? (
                      <Spinner className="h-4 w-4 m-auto" />
                    ) : (
                      "Comment"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {comments &&
              comments.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <Avatar
                    src={item.user_detail[0].avatar}
                    size="sm"
                    alt="avatar"
                    withBorder={true}
                    className="p-0.5"
                  />
                  <div className="space-y-2 border rounded-lg p-2">
                    <div className="flex items-center gap-4">
                      <Typography
                        as="a"
                        href="#"
                        className="font-bold text-sm text-blue-500 hover:text-gray-900"
                      >
                        {item.user_detail[0].name}
                      </Typography>

                      <LevelChip level={item.user_detail[0].point} />

                      <Typography className="text-sm text-orange-500 font-semibold flex items-center gap-1">
                        <StarIcon className="w-4 h-4" />
                        {item.user_detail[0].point} points
                      </Typography>

                      <Tooltip
                        content={formatTime(item.created_at, i18n.language)}
                      >
                        <Typography className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {formatTimeDistanceToNow(
                            item.created_at,
                            i18n.language
                          )}
                        </Typography>
                      </Tooltip>
                    </div>

                    <div dangerouslySetInnerHTML={{ __html: item.content }} />

                    <div className="flex items-center gap-4">
                      <Button
                        variant="text"
                        className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
                      >
                        <HandThumbUpIcon className="w-4 h-4" />
                        {item.votes_count > 0 && item.votes_count} Like
                      </Button>

                      <Button
                        variant="text"
                        className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
                      >
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        {item.comment_count > 0 && item.comment_count} Reply
                      </Button>

                      <Button
                        variant="text"
                        className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
                      >
                        {bookmark ? (
                          <>
                            <UserMinusIcon className="w-4 h-4" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="w-4 h-4" />
                            Follow
                          </>
                        )}
                      </Button>

                      <Button
                        variant="text"
                        className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
                      >
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        Report
                      </Button>
                    </div>

                    {item.comment_count > 0 &&
                      item.reply_comment &&
                      item.reply_comment.map((i) => (
                        <div key={i._id} className="flex gap-4">
                          <Avatar
                            src={i.user_detail[0].avatar}
                            size="sm"
                            alt="avatar"
                            withBorder={true}
                            className="p-0.5"
                          />
                          <div className="space-y-2 border rounded-lg p-2">
                            <div className="flex items-center gap-4">
                              <Typography
                                as="a"
                                href="#"
                                className="font-bold text-sm text-blue-500 hover:text-gray-900"
                              >
                                {i.user_detail[0].name}
                              </Typography>

                              <LevelChip level={i.user_detail[0].point} />

                              <Typography className="text-sm text-orange-500 font-semibold flex items-center gap-1">
                                <StarIcon className="w-4 h-4" />
                                {i.user_detail[0].point} points
                              </Typography>

                              <Tooltip
                                content={formatTime(
                                  i.created_at,
                                  i18n.language
                                )}
                              >
                                <Typography className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  {formatTimeDistanceToNow(
                                    i.created_at,
                                    i18n.language
                                  )}
                                </Typography>
                              </Tooltip>
                            </div>

                            <div
                              dangerouslySetInnerHTML={{
                                __html: i.content,
                              }}
                            />

                            <div className="flex items-center gap-4">
                              <Button
                                variant="text"
                                className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
                              >
                                <HandThumbUpIcon className="w-4 h-4" />
                                {i.votes_count > 0 && i.votes_count}
                                Like
                              </Button>

                              <Button
                                variant="text"
                                className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
                              >
                                {bookmark ? (
                                  <>
                                    <UserMinusIcon className="w-4 h-4" />
                                    Unfollow
                                  </>
                                ) : (
                                  <>
                                    <UserPlusIcon className="w-4 h-4" />
                                    Follow
                                  </>
                                )}
                              </Button>

                              <Button
                                variant="text"
                                className="p-2 flex items-center justify-center gap-2 normal-case text-xs"
                              >
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                Report
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <NotFoundAlert message="Question not found!" />
  );
};

export default PostDetail;
