import React, { useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { Spinner, Button } from "@material-tailwind/react";
import ErrorMessageForm from "../common/error-message-form";

import postService from "../../services/post-service";

import { POST_TYPE } from "../../utils/constant";

interface CommentFormProps {
  post_id: string;
  parent_id: string;
  type: POST_TYPE;
  content: string;
  medias?: string[];
  hashtags?: string[];
  getCommentsAfterComment: () => Promise<void>;
}

interface CommentFormValues {
  post_id: string;
  parent_id: string;
  type: POST_TYPE;
  content: string;
  medias?: string[];
  hashtags?: string[];
}

const CommentForm: React.FC<CommentFormProps> = ({
  post_id,
  parent_id,
  type,
  content,
  medias,
  hashtags,
  getCommentsAfterComment,
}) => {
  const { t } = useTranslation();

  const [isSubmit, setIsSubmit] = useState(false);

  const commentForm = useFormik<CommentFormValues>({
    initialValues: {
      post_id: post_id,
      parent_id: parent_id,
      type: type,
      content: content,
      medias: [],
      hashtags: [],
    },
    validationSchema: Yup.object({
      content: Yup.string()
        .required(t("post.Answer is required"))
        .min(20, t("post.Answer contains at least 20 characters"))
        .max(5000, t("post.Answer must only contain 5000 characters")),
    }),

    onSubmit: async (values: CommentFormValues) => {
      setIsSubmit(true);
      let data = { ...values };

      if (post_id) {
        const { response, error } = await postService.editPost(data);
        if (response) {
          toast.success(t("post.Your answer has been edited"));
          getCommentsAfterComment();
        }
        if (error) toast.error(t("post.Something went wrong"));
      } else {
        const { response, error } = await postService.post({
          ...data,
          title: null,
        });
        if (response) {
          toast.success(t("post.Your answer has been posted"));
          getCommentsAfterComment();
        }
        if (error) toast.error(t("post.Something went wrong"));
      }

      setIsSubmit(false);
    },
  });

  return (
    <form
      onSubmit={commentForm.handleSubmit}
      className="space-y-2 p-2 rounded-md dark:bg-gray-100"
    >
      <ReactQuill
        value={commentForm.values.content}
        onChange={(value) => commentForm.setFieldValue("content", value)}
        theme="snow"
        placeholder={t("post.Write something...")}
        className="dark:text-gray-900"
      />
      {commentForm.touched.content && commentForm.errors.content && (
        <ErrorMessageForm
          message={commentForm.touched.content && commentForm.errors.content}
        />
      )}
      <div className="flex justify-end">
        <Button
          onClick={commentForm.submitForm}
          className="normal-case"
          variant="gradient"
          disabled={isSubmit}
        >
          {isSubmit ? (
            <Spinner className="h-4 w-4 m-auto" />
          ) : post_id ? (
            t("post.Edit")
          ) : (
            t("post.Answer")
          )}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
