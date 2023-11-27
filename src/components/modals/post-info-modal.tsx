import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  IconButton,
  Button,
  DialogFooter,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import NotFoundAlert from "../common/not-found-alert";
import PostCard from "../post/post-card";

import {
  selectPostInfoModal,
  setPostInfoModal,
} from "../../redux/features/post-info-slice";

const PostInfoModal = () => {
  const { t } = useTranslation();
  const { postInfoModal } = useSelector(selectPostInfoModal);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () =>
    dispatch(setPostInfoModal({ postInfoModalOpen: false }));

  const handleView = () => {
    navigate(`/${postInfoModal.post?._id}`);
    handleClose();
  };

  return (
    <>
      <Dialog
        size="lg"
        open={postInfoModal.postInfoModalOpen}
        handler={() => {}}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="flex items-center justify-between">
          {t("post.Question Detail")}
          <IconButton
            variant="text"
            color="red"
            onClick={handleClose}
            className="rounded-full"
          >
            <XMarkIcon className="w-8 h-8" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="border-t h-[70vh] overflow-hidden overflow-y-scroll space-y-2">
          {postInfoModal.reason && (
            <div>
              <Typography className="font-bold text-gray-900">
                {t("post.Reason")}
              </Typography>
              <Textarea value={postInfoModal.reason} disabled />
            </div>
          )}
          {postInfoModal.post ? (
            <PostCard post={postInfoModal.post} isDetail={true} isView={true} />
          ) : (
            <NotFoundAlert message={t("post.Post not found")} type="error" />
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            className="normal-case"
            onClick={handleView}
            variant="gradient"
            fullWidth
          >
            {t("post.View root question")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default PostInfoModal;