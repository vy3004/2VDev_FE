import React, { useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import { useFormik } from "formik";

import { Spinner, Button } from "@material-tailwind/react";

import postService from "../../../services/post-service";
import { PostType } from "../../../utils/constant";

interface CommentFormProps {
  user_id: string;
  parent_id: string;
  type: PostType;
  content: string;
  medias?: string[];
  hashtags?: string[];
}

const CommentForm: React.FC<CommentFormProps> = ({
  user_id,
  parent_id,
  type,
  content,
  medias,
  hashtags,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const commentForm = useFormik<CommentFormProps>({
    initialValues: {
      user_id: user_id,
      parent_id: parent_id,
      type: type,
      content: content,
      medias: [],
      hashtags: [],
    },

    onSubmit: async (values: CommentFormProps) => {
      setIsSubmit(true);
      let data = { ...values, title: null };

      const { response, error } = await postService.post(data);
      if (response) {
        toast.success("Your comment has been posted");
        window.location.reload();
      }
      if (error) toast.error(error.message);

      setIsSubmit(false);
    },
  });

  return (
    <form onSubmit={commentForm.handleSubmit} className="space-y-2">
      <ReactQuill
        value={commentForm.values.content}
        onChange={(value) => commentForm.setFieldValue("content", value)}
        theme="snow"
        placeholder="Write something..."
      />
      <div className="flex justify-end">
        <Button
          onClick={commentForm.submitForm}
          className="normal-case"
          variant="gradient"
          disabled={isSubmit}
        >
          {isSubmit ? <Spinner className="h-4 w-4 m-auto" /> : "Comment"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
