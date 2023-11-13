import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import * as Yup from "yup";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  IconButton,
  Button,
  Spinner,
  Typography,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ErrorMessageForm from "../common/error-message-form";
import PostCard from "../post/post-card";

import postService from "../../services/post-service";
import {
  selectRepostModal,
  setRepostModal,
} from "../../redux/features/repost-modal-slice";
import { PostType } from "../../utils/constant";
import { selectUser } from "../../redux/features/user-slice";

interface ReportFormValues {
  content: string;
}

const RepostModal = () => {
  const { repostModal } = useSelector(selectRepostModal);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSubmit, setIsSubmit] = useState(false);

  const handleClose = () =>
    dispatch(setRepostModal({ repostModalOpen: false }));

  const repostForm = useFormik<ReportFormValues>({
    initialValues: {
      content: "",
    },
    validationSchema: Yup.object({
      content: Yup.string()
        .required("Content is required")
        .min(20, "Content contains at least 20 characters")
        .max(5000, "Content must only contain 5000 characters"),
    }),
    onSubmit: async (values: ReportFormValues) => {
      setIsSubmit(true);

      if (repostModal.post) {
        const data = {
          post_id: "",
          parent_id: repostModal.post._id,
          title: null,
          content: values.content,
          type: PostType.RePost,
          hashtags: [],
        };

        const { response, error } = await postService.post(data);

        if (response) {
          console.log("CHECK", response);
          handleClose();
          navigate(`/profile/${user?.username}?tab=my-reposts`);
          toast.success("Repost successfully");
        }

        if (error) toast.error(error.message);
      }

      setIsSubmit(false);
    },
  });

  return (
    <>
      <Dialog
        size="lg"
        open={repostModal.repostModalOpen}
        handler={() => {}}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="flex items-center justify-between">
          Repost
          <IconButton
            variant="text"
            color="red"
            onClick={handleClose}
            className="rounded-full"
          >
            <XMarkIcon className="w-8 h-8" />
          </IconButton>
        </DialogHeader>
        <form onSubmit={repostForm.handleSubmit}>
          <DialogBody className="border-t h-[70vh] overflow-hidden overflow-y-scroll space-y-2">
            <div className="border rounded-lg shadow-md p-2">
              <Typography className="font-medium text-gray-900">
                Content
              </Typography>
              <ReactQuill
                value={repostForm.values.content}
                onChange={(value) => repostForm.setFieldValue("content", value)}
                theme="snow"
                placeholder="Write something..."
              />
              {repostForm.touched.content && repostForm.errors.content && (
                <ErrorMessageForm
                  message={
                    repostForm.touched.content && repostForm.errors.content
                  }
                />
              )}
            </div>

            {repostModal.post && (
              <PostCard post={repostModal.post} isDetail={false} />
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={() => repostForm.submitForm()}
              variant="gradient"
              fullWidth
              disabled={isSubmit}
            >
              {isSubmit ? <Spinner className="h-4 w-4 m-auto" /> : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
};

export default RepostModal;
