import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import { InformationCircleIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
  Spinner,
} from "@material-tailwind/react";
import NotificationForm from "./notification-form";

import userService from "../../services/user-service";
import { setAuthModalOpen } from "../../redux/features/auth-modal-slice";

interface ForgotPasswordFormProps {
  switchAuthState: (name: string) => void;
}

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  switchAuthState,
}) => {
  const dispatch = useDispatch();

  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const forgotPasswordForm = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          // eslint-disable-next-line no-useless-escape
          /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address"
        )
        .required("Email is required"),
    }),
    onSubmit: async (values: ForgotPasswordFormValues) => {
      setErrorMessage("");
      setIsSubmit(true);

      const { response, error } = await userService.forgotPassword(values);
      setIsSubmit(false);

      if (response) {
        forgotPasswordForm.resetForm();
        dispatch(setAuthModalOpen(false));
        toast.success(response.data.message);
      }

      if (error) setErrorMessage(error.message);
    },
  });

  return (
    <Card className="mx-auto w-full max-w-[48rem]">
      <CardBody className="flex gap-0 md:gap-8">
        <img
          src="/auth-sign-in.svg"
          alt="auth"
          className="w-0 md:w-3/6 object-cover"
        />
        <div className="w-full md:w-3/6">
          {/* Form header start */}
          <div className="flex justify-between mb-4">
            <div>
              <Typography color="blue" className="text-lg font-bold">
                Forgot Password
              </Typography>
            </div>

            <Typography variant="small" className="mt-1">
              No Account?
              <Typography
                as="a"
                variant="small"
                color="blue"
                className="font-bold cursor-pointer"
                onClick={() => switchAuthState("signUp")}
              >
                Sign up
              </Typography>
            </Typography>
          </div>
          <Typography className="mb-4">
            Enter the email address associated with your account to receive the
            reset link
          </Typography>
          {/* Form header end */}

          {/* Form error message start */}
          {errorMessage && (
            <NotificationForm type="error" message={errorMessage} />
          )}
          {/* Form error message end */}

          {/* Form body start */}
          <form
            onSubmit={forgotPasswordForm.handleSubmit}
            className="w-full space-y-4"
          >
            {/* Email input start */}
            <Input
              label="Email"
              name="email"
              type="text"
              size="lg"
              crossOrigin=""
              value={forgotPasswordForm.values.email}
              onChange={forgotPasswordForm.handleChange}
              error={
                forgotPasswordForm.touched.email &&
                forgotPasswordForm.errors.email !== undefined
              }
            />
            {forgotPasswordForm.touched.email &&
              forgotPasswordForm.errors.email && (
                <Typography
                  className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                  color="red"
                  variant="small"
                >
                  <InformationCircleIcon className="h-4 w-4" />
                  {forgotPasswordForm.touched.email &&
                    forgotPasswordForm.errors.email}
                </Typography>
              )}
            {/* Email input end */}

            <div className="flex justify-end">
              <Typography
                as="a"
                variant="small"
                color="blue"
                className="cursor-pointer"
                onClick={() => switchAuthState("signIn")}
              >
                Back to Sign In
              </Typography>
            </div>

            <Button
              type="submit"
              className="mt-10"
              variant="gradient"
              fullWidth
              disabled={isSubmit}
            >
              {isSubmit ? <Spinner className="h-4 w-4 m-auto" /> : "Send"}
            </Button>
          </form>
          {/* Form body end */}
        </div>
      </CardBody>
    </Card>
  );
};

export default ForgotPasswordForm;
