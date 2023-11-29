import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
  Spinner,
  Typography,
  DialogFooter,
} from "@material-tailwind/react";

import {
  selectConfirmModal,
  setConfirmModal,
} from "../../redux/features/confirm-modal-slice";
import postService from "../../services/post-service";
import userService from "../../services/user-service";
import { setUser } from "../../redux/features/user-slice";

const ConfirmModal = () => {
  const { t } = useTranslation();
  const { confirmModal } = useSelector(selectConfirmModal);
  const dispatch = useDispatch();

  const [isSubmit, setIsSubmit] = useState(false);

  const handleClose = () =>
    dispatch(
      setConfirmModal({ confirmModalOpen: false, type: 0, postId: "", role: 0 })
    );

  const handleDelete = async () => {
    setIsSubmit(true);
    if (confirmModal.postId) {
      const serviceFunction =
        confirmModal.role === 1
          ? postService.deletePostForAdmin
          : postService.deletePost;

      const { response, error } = await serviceFunction({
        post_id: confirmModal.postId,
      });
      if (response) {
        handleClose();
        window.location.reload();
        toast.success(t("post.You have deleted successfully"));
      }

      if (error) {
        toast.error(t("post.Something went wrong"));
      }
    }
    setIsSubmit(false);
  };

  const handleLogout = async () => {
    const { response } = await userService.logout();
    if (response) {
      dispatch(setUser(null));
      handleClose();
      toast.success(t("auth.Logout Success"));
    }
  };

  const contentModal = [
    {
      title: t("post.Delete Your Question"),
      content: t("post.Delete Your Question content"),
      warning: t("post.Delete Your Question warning"),
      handleSubmit: handleDelete,
      submitButton: t("post.Yes, Delete"),
    },
    {
      title: t("post.Delete Your Answer"),
      content: t("post.Delete Your Answer content"),
      warning: t("post.Delete Your Answer warning"),
      handleSubmit: handleDelete,
      submitButton: t("post.Yes, Delete"),
    },
    {
      title: t("auth.Logout"),
      content: t("auth.Are you sure you want to logout?"),
      handleSubmit: handleLogout,
      submitButton: t("auth.Yes, Logout"),
    },
  ];

  const modal = contentModal[confirmModal.type];

  return (
    <>
      <Dialog
        size="xs"
        open={confirmModal.confirmModalOpen}
        handler={() => {}}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="p-4 dark:bg-gray-800"
      >
        <DialogHeader>
          <Typography className="text-center text-2xl font-bold w-full dark:text-gray-300">
            {modal.title}
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography className="font-bold text-center text-lg text-gray-900 w-full dark:text-gray-300">
            {modal.content}
          </Typography>
          {modal.warning && (
            <div className="border-l-8 border-red-500 text-red-500 bg-red-50 p-2 mt-2">
              <Typography>{modal.warning}</Typography>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-center gap-4">
          <Button
            size="lg"
            variant="text"
            onClick={handleClose}
            className="normal-case dark:text-gray-300"
          >
            <span>{t("auth.No, Cancel")}</span>
          </Button>
          <Button
            size="lg"
            className="normal-case flex items-center gap-2"
            variant="gradient"
            color="red"
            onClick={modal.handleSubmit}
          >
            {isSubmit && <Spinner className="w-4 h-4" />}
            <span>{modal.submitButton}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ConfirmModal;
