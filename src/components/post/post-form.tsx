import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";

import {
  Alert,
  Button,
  IconButton,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { TagsInput } from "react-tag-input-component";
import ErrorMessageForm from "../common/error-message-form";

import postService from "../../services/post-service";
import mediaService from "../../services/media-service";
import { selectUser } from "../../redux/features/user-slice";

interface PostFormValues {
  user_id: string;
  title: string;
  content: string;
  hashtags: string[];
  medias: string[];
  parent_id: string | null;
  type: number;
}

const PostForm = () => {
  const { user } = useSelector(selectUser);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isSubmit, setIsSubmit] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const validImages = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      const duplicateFiles = validImages.filter((file) =>
        images.some((image) => image.name === file.name)
      );

      if (validImages.length === 0) {
        toast.error("Select images only");
      } else if (duplicateFiles.length > 0) {
        toast.error("Images do not repeat");
      } else {
        setImages((prevImages) => [...prevImages, ...validImages]);
      }
    }
  };

  const handleImageDelete = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);

      return updatedImages;
    });
  };

  const postForm = useFormik<PostFormValues>({
    initialValues: {
      user_id: user?._id || "",
      title: "",
      content: "",
      hashtags: [],
      medias: [],
      type: 0,
      parent_id: null,
    },

    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(10, "Title contains at least 10 characters")
        .max(255, "Title must only contain 255 characters"),
      content: Yup.string()
        .required("Content is required")
        .min(220, "Content contains at least 220 characters")
        .max(5000, "Content must only contain 5000 characters"),
      hashtags: Yup.array().test(
        "nonEmpty",
        "Tag(s) is required",
        (value) => value && value.length > 0
      ),
    }),

    onSubmit: async (values: PostFormValues) => {
      setIsSubmit(true);

      let data = { ...values };

      await Promise.all(
        images.map(async (image) => {
          const { response, error } = await mediaService.uploadImage(image);
          if (response) {
            data.medias.push(response.data.result[0].url);
          }
          if (error) {
            toast.error(error.message);
          }
        })
      );

      const { response, error } = await postService.post(values);
      if (response) {
        console.log("RES", response);
        toast.success("Your question has been posted");
        navigate("/");
      }
      if (error) toast.error(error.message);

      setIsSubmit(false);
    },
  });

  return (
    <form onSubmit={postForm.handleSubmit} className="space-y-4">
      <Typography className="font-bold text-2xl">
        Ask a public question
      </Typography>

      <Alert variant="outlined" className="bg-blue-50">
        <Typography className="font-medium text-xl">
          Writing a good question
        </Typography>
        <Typography className="mt-2">
          You’re ready to ask a programming-related question and this form will
          help guide you through the process.
        </Typography>
        <Typography className="font-medium mt-2">Steps</Typography>
        <ul className="mt-2 ml-2 list-inside list-disc text-sm">
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>
            Add “tags” which help surface your question to members of the
            community.
          </li>
          <li>Review your question and post it to the site.</li>
        </ul>
      </Alert>

      <Alert variant="outlined">
        <Typography className="font-medium text-lg">
          Writing a good title
        </Typography>
        <div className="mt-2 flex gap-4">
          <div className="flex items-center">
            <PencilIcon className="w-8 h-8" />
          </div>
          <Typography className="mb-2 text-sm">
            Your title should summarize the problem.
            <br />
            You might find that you have a better idea of your title after
            writing out the rest of the question.
          </Typography>
        </div>
      </Alert>

      {/* Title input start */}
      <div className="border border-black rounded-lg p-4">
        <Typography className="font-medium">Title</Typography>
        <Typography className="mb-2 text-sm">
          Be specific and imagine you’re asking a question to another person.
        </Typography>
        <Input
          name="title"
          value={postForm.values.title}
          onChange={postForm.handleChange}
          type="text"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          className="!border !border-gray-300 text-gray-900 ring-1 ring-transparent focus:!border-blue-600 focus:!border-t-blue-600 focus:ring-blue-600"
          labelProps={{
            className: "hidden",
          }}
          crossOrigin={""}
        />
        {postForm.touched.title && postForm.errors.title && (
          <ErrorMessageForm
            message={postForm.touched.title && postForm.errors.title}
          />
        )}
      </div>
      {/* Title input end */}

      {/* Tags input start */}
      <div className="border border-black rounded-lg p-4">
        <Typography className="font-medium">Tag(s)</Typography>
        <Typography className="mb-2 text-sm">
          Add at least 1 tag to describe the content of your question.
        </Typography>
        <TagsInput
          name="hashtags"
          value={postForm.values.hashtags}
          onChange={(hashtags) => postForm.setFieldValue("hashtags", hashtags)}
          classNames={{ tag: "tag-cls", input: "bg-white" }}
          placeHolder="e.g. (javascript + Enter)"
        />
        {postForm.touched.hashtags && postForm.errors.hashtags && (
          <ErrorMessageForm
            message={
              postForm.touched.hashtags && postForm.errors.hashtags.toString()
            }
          />
        )}
      </div>
      {/* Tags input end */}

      {/* Content input start */}
      <div className="border border-black rounded-lg p-4">
        <Typography className="font-medium">Content</Typography>
        <Typography className="mb-2 text-sm">
          The content of your question contains your problem details and
          results. Minimum 220 characters.
        </Typography>
        <ReactQuill
          value={postForm.values.content}
          onChange={(value) => postForm.setFieldValue("content", value)}
          theme="snow"
          placeholder="Write something..."
        />
        {postForm.touched.content && postForm.errors.content && (
          <ErrorMessageForm
            message={postForm.touched.content && postForm.errors.content}
          />
        )}
      </div>
      {/* Content input end */}

      {/* Images start */}
      <div className="border border-black rounded-lg p-4">
        <Typography className="font-medium">Image(s)</Typography>
        <Typography className="mb-2 text-sm">
          Add a descriptive image(s) for your question (optional).
        </Typography>
        <Input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="!border !border-gray-300 text-gray-900 ring-1 ring-transparent focus:!border-blue-600 focus:!border-t-blue-600 focus:ring-blue-600"
          labelProps={{
            className: "hidden",
          }}
          crossOrigin={""}
        />
        <div className="mt-2 space-y-2">
          {images.map((image, index) => (
            <div className="relative w-fit" key={index}>
              <img
                className="rounded-lg"
                src={URL.createObjectURL(image)}
                alt="uploaded"
              />
              <IconButton
                size="sm"
                color="red"
                onClick={() => handleImageDelete(index)}
                className="!absolute rounded-full z-10 top-2 right-2"
              >
                <XMarkIcon className="w-4 h-4" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
      {/* Images end */}

      <Button
        onClick={postForm.submitForm}
        variant="gradient"
        fullWidth
        disabled={isSubmit}
      >
        {isSubmit ? (
          <Spinner className="h-4 w-4 m-auto" />
        ) : (
          "Post your question"
        )}
      </Button>
    </form>
  );
};

export default PostForm;
