import { useState } from "react";
import {
  Alert,
  Button,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import ErrorMessageForm from "../../components/common/error-message-form";
import { PencilIcon } from "@heroicons/react/24/outline";
import { TagsInput } from "react-tag-input-component";
import { fileToBase64 } from "../../utils/file-utils";
import { useFormik } from "formik";
import { selectUser } from "../../redux/features/user-slice";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import postService from "../../services/post-service";
import toast from "react-hot-toast";

interface PostQuestionFormValues {
  user_id: string;
  title: string;
  content: string;
  hashtags: string[];
  medias?: string[];
  parent_id: string | null;
  type: number;
}

const Posts = () => {
  const { user } = useSelector(selectUser);

  const [images, setImages] = useState();
  const [isSubmit, setIsSubmit] = useState(false);

  const covertToBase64 = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      fileToBase64(file)
        .then((base64String) => {
          // setCoverPhoto(base64String);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const postQuestionForm = useFormik<PostQuestionFormValues>({
    initialValues: {
      user_id: user?._id || "",
      title: "",
      content: "",
      hashtags: [],
      medias: [],
      type: 0,
      parent_id: null,
    },

    onSubmit: async (values: PostQuestionFormValues) => {
      setIsSubmit(true);
      // let data = { ...values, hashtags: selected };
      console.log("CHECK_DATA", values);

      const { response, error } = await postService.post(values);
      if (response) {
        console.log("RES", response);
        toast.success("Your question has been posted");
      }
      if (error) console.log(error.message);

      setIsSubmit(false);
    },
  });

  return (
    <form onSubmit={postQuestionForm.handleSubmit} className="space-y-4">
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

      <div className="border border-black rounded-lg p-4">
        <Typography className="font-medium">Title</Typography>
        <Typography className="mb-2 text-sm">
          Be specific and imagine you’re asking a question to another person.
        </Typography>
        <Input
          name="title"
          value={postQuestionForm.values.title}
          onChange={postQuestionForm.handleChange}
          type="text"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          className="!border !border-gray-300 text-gray-900 ring-1 ring-transparent focus:!border-blue-600 focus:!border-t-blue-600 focus:ring-blue-600"
          labelProps={{
            className: "hidden",
          }}
          crossOrigin={""}
        />
        {/* <ErrorMessageForm message="test" /> */}
      </div>

      <div className="border border-black rounded-lg p-4">
        <Typography className="font-medium">Tags</Typography>
        <Typography className="mb-2 text-sm">
          Add up to 5 tags to describe what your question is about.
        </Typography>
        <TagsInput
          name="hashtags"
          value={postQuestionForm.values.hashtags}
          onChange={(hashtags) =>
            postQuestionForm.setFieldValue("hashtags", hashtags)
          }
          classNames={{ tag: "tag-cls", input: "bg-white" }}
          placeHolder="e.g. (javascript + Enter)"
        />
      </div>

      <div className="border border-black rounded-lg p-4">
        <Typography className="font-medium">Content</Typography>
        <Typography className="mb-2 text-sm">
          The content of your question contains your problem details and
          results. Minimum 220 characters.
        </Typography>
        <ReactQuill
          value={postQuestionForm.values.content}
          onChange={(value) => postQuestionForm.setFieldValue("content", value)}
          theme="snow"
          placeholder="Write something..."
        />
      </div>

      {/* <div className="border border-black rounded-lg p-4">
        <Typography className="font-medium">Images</Typography>
        <Typography className="mb-2 text-sm">
          Add a descriptive images for your question (optional).
        </Typography>
        <Input
          type="file"
          multiple
          className="!border !border-gray-300 text-gray-900 ring-1 ring-transparent focus:!border-blue-600 focus:!border-t-blue-600 focus:ring-blue-600"
          labelProps={{
            className: "hidden",
          }}
          onChange={covertToBase64}
          crossOrigin={""}
        />
        <img
          className="h-60 w-full border rounded-lg object-cover object-center"
          alt="images"
          src={images}
        />
      </div> */}

      <Button
        onClick={postQuestionForm.submitForm}
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

export default Posts;
