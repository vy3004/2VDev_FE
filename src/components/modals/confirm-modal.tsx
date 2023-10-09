import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const { confirmModal } = useSelector(selectConfirmModal);
  const dispatch = useDispatch();

  const [isSubmit, setIsSubmit] = useState(false);

  const handleClose = () =>
    dispatch(setConfirmModal({ confirmModalOpen: false, type: 0, postId: "" }));

  const handleDelete = async () => {
    setIsSubmit(true);
    if (confirmModal.postId) {
      const { response, error } = await postService.deletePost({
        post_id: confirmModal.postId,
      });
      if (response) {
        handleClose();
        window.location.reload();
        toast.success("Deleted Successfully");
      }

      if (error) {
        toast.error("Delete Failed");
      }
    }
    setIsSubmit(false);
  };

  const handleLogout = async () => {
    const { response } = await userService.logout();
    if (response) {
      dispatch(setUser(null));
      handleClose();
      toast.success("Sign Out Success");
    }
  };

  const contentModal = [
    {
      title: "Delete Your Post",
      content: "Are you sure you want to delete the post?",
      warning:
        "All information and comments on the post will be deleted. You will not be able to restore them.",
      handleSubmit: handleDelete,
      submitButton: "Yes, Delete",
    },
    {
      title: "Delete Your Comment",
      content: "Are you sure you want to delete the comment?",
      warning:
        "All information and replies on comment will be deleted. You will not be able to restore them.",
      handleSubmit: handleDelete,
      submitButton: "Yes, Delete",
    },
    {
      title: "Log out",
      content: "Are you sure you want to log out?",
      handleSubmit: handleLogout,
      submitButton: "Yes, Log out",
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
        className="p-4"
      >
        <DialogHeader>
          <Typography className="text-center text-2xl font-bold w-full">
            {modal.title}
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography className="font-bold text-center text-lg text-gray-900 w-full">
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
            className="normal-case"
          >
            <span>No, Cancel</span>
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
