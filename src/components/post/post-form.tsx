import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
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
import PostSection from "./post-section";

import postService from "../../services/post-service";
import mediaService from "../../services/media-service";
import { Post } from "../../utils/types";
import { base64ToFile, fileToBase64 } from "../../utils/file-utils";

interface PostFormProps {
  initialData: Post | null;
}

interface PostFormValues {
  title: string;
  content: string;
  hashtags: string[];
  medias: string[];
  parent_id: string | null;
  type: number;
}

const PostForm: React.FC<PostFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isSubmit, setIsSubmit] = useState(false);
  const [images, setImages] = useState(initialData?.medias || []);

  const convertToBase64 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const validImages = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (validImages.length === 0) {
        toast.error(t("post.Select images only"));
      } else {
        const base64Strings = await Promise.all(
          validImages.map((file) => fileToBase64(file))
        );

        const filteredBase64Strings = base64Strings.filter(
          (base64) => base64 !== null
        ) as string[];

        setImages((prevImages) => [...prevImages, ...filteredBase64Strings]);
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

  const filterArrayImages = (images: string[], availableImages: string[]) => {
    let tempArr = [...availableImages];
    availableImages = availableImages.filter((item) => images.includes(item));
    images = images.filter((item) => !tempArr.includes(item));
    return { images, availableImages };
  };

  const postForm = useFormik<PostFormValues>({
    initialValues: initialData
      ? {
          title: initialData.title,
          content: initialData.content,
          hashtags: initialData.hashtags.map((hashtag) => hashtag.name),
          medias: initialData.medias,
          type: 0,
          parent_id: null,
        }
      : {
          title: "",
          content: "",
          hashtags: [],
          medias: [],
          type: 0,
          parent_id: null,
        },

    validationSchema: Yup.object({
      title: Yup.string()
        .required(t("post.Title is required"))
        .min(10, t("post.Title contains at least 10 characters"))
        .max(255, t("post.Title must only contain 255 characters")),
      content: Yup.string()
        .required(t("post.Content is required"))
        .min(220, t("post.Content contains at least 220 characters"))
        .max(5000, t("post.Content must only contain 5000 characters")),
      hashtags: Yup.array().test(
        "nonEmpty",
        t("post.Tag(s) is required"),
        (value) => value && value.length > 0
      ),
    }),

    onSubmit: async (values: PostFormValues) => {
      setIsSubmit(true);

      let data = { ...values };

      const result = filterArrayImages(images, data.medias);

      const files = result.images.map((base64, index) =>
        base64ToFile(base64, `file-${index}`)
      );

      data.medias = result.availableImages;

      if (files.length > 0) {
        await Promise.all(
          files.map(async (image) => {
            const { response, error } = await mediaService.uploadImage(image);
            if (response) {
              data.medias.push(response.data.result[0].url);
            }
            if (error) toast.error(t("post.Something went wrong"));
          })
        );
      }

      if (initialData) {
        const { response, error } = await postService.editPost({
          ...data,
          post_id: initialData._id,
        });
        if (response) {
          toast.success(t("post.You have successfully edited your question"));
          navigate(`/${initialData._id}`);
        }
        if (error) toast.error(t("post.Something went wrong"));
      } else {
        const { response, error } = await postService.post(data);
        if (response) {
          toast.success(t("post.Your question has been posted"));
          navigate("/");
        }
        if (error) toast.error(t("post.Something went wrong"));
      }

      setIsSubmit(false);
    },
  });

  return (
    <form onSubmit={postForm.handleSubmit} className="space-y-4">
      <Typography className="font-bold text-xl sm:text-2xl">
        {t("post.Ask a public question")}
      </Typography>

      <Alert variant="outlined" className="bg-blue-50">
        <Typography className="font-bold text-lg">
          {t("post.Writing a good question")}
        </Typography>
        <Typography className="mt-2">
          {t("post.Writing a good question description")}
        </Typography>
        <Typography className="font-medium mt-2">{t("Steps")}</Typography>
        <ul className="mt-2 ml-2 list-inside list-disc text-sm">
          <li>{t("post.Steps 1")}</li>
          <li>{t("post.Steps 2")}</li>
          <li>{t("post.Steps 3")}</li>
          <li>{t("post.Steps 4")}</li>
          <li>{t("post.Steps 5")}</li>
        </ul>
      </Alert>

      <Alert variant="outlined">
        <Typography className="font-bold text-lg">
          {t("post.Writing a good title")}
        </Typography>
        <div className="mt-2 flex gap-4">
          <div className="flex items-center">
            <PencilIcon className="w-8 h-8" />
          </div>
          <Typography className="mb-2 text-sm">
            {t("post.Writing a good title description 1")}
            <br />
            {t("post.Writing a good title description 2")}
          </Typography>
        </div>
      </Alert>

      {/* Title input start */}
      <PostSection
        title={t("post.Title")}
        desc={t("post.Title description")}
        children={
          <>
            <Input
              name="title"
              value={postForm.values.title}
              onChange={postForm.handleChange}
              type="text"
              placeholder={t("post.Title e.g")}
              className="!border !border-gray-300 text-gray-900 ring-1 ring-transparent focus:!border-blue-600 focus:!border-t-blue-600 focus:ring-blue-600"
              labelProps={{
                className: "hidden",
              }}
              crossOrigin={""}
              autoFocus
            />
            {postForm.touched.title && postForm.errors.title && (
              <ErrorMessageForm
                message={postForm.touched.title && postForm.errors.title}
              />
            )}
          </>
        }
      />
      {/* Title input end */}

      {/* Tags input start */}
      <PostSection
        title={t("post.Tag(s)")}
        desc={t("post.Tag(s) description")}
        children={
          <>
            <TagsInput
              name="hashtags"
              value={postForm.values.hashtags}
              onChange={(hashtags) =>
                postForm.setFieldValue("hashtags", hashtags)
              }
              classNames={{ tag: "tag-cls", input: "bg-white" }}
              placeHolder={t("post.Tag(s) e.g")}
            />
            {postForm.touched.hashtags && postForm.errors.hashtags && (
              <ErrorMessageForm
                message={
                  postForm.touched.hashtags &&
                  postForm.errors.hashtags.toString()
                }
              />
            )}
          </>
        }
      />
      {/* Tags input end */}

      {/* Content input start */}
      <PostSection
        title={t("post.Content")}
        desc={t("post.Content description")}
        children={
          <>
            <ReactQuill
              value={postForm.values.content}
              onChange={(value) => postForm.setFieldValue("content", value)}
              theme="snow"
              placeholder={t("post.Write something...")}
            />
            {postForm.touched.content && postForm.errors.content && (
              <ErrorMessageForm
                message={postForm.touched.content && postForm.errors.content}
              />
            )}
          </>
        }
      />
      {/* Content input end */}

      {/* Images start */}
      <PostSection
        title={t("post.Image(s)")}
        desc={t("post.Image(s) description")}
        children={
          <>
            <Input
              type="file"
              multiple
              onChange={convertToBase64}
              className="!border !border-gray-300 text-gray-900 ring-1 ring-transparent focus:!border-blue-600 focus:!border-t-blue-600 focus:ring-blue-600"
              labelProps={{
                className: "hidden",
              }}
              crossOrigin={""}
            />
            <div className="mt-2 space-y-2">
              {images.map((image, index) => (
                <div className="relative w-fit" key={index}>
                  <img className="rounded-lg" src={image} alt="uploaded" />
                  <IconButton
                    size="sm"
                    color="red"
                    onClick={() => handleImageDelete(index)}
                    className="!absolute rounded-full z-[2] top-2 right-2"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </IconButton>
                </div>
              ))}
            </div>
          </>
        }
      />
      {/* Images end */}

      <Button
        onClick={postForm.submitForm}
        variant="gradient"
        fullWidth
        disabled={isSubmit}
        className="normal-case"
      >
        {isSubmit ? (
          <Spinner className="h-4 w-4 m-auto" />
        ) : (
          t(`post.${initialData ? "Edit" : "Post"} your question`)
        )}
      </Button>
    </form>
  );
};

export default PostForm;
