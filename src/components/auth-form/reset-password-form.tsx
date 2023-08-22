import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
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
import { useDispatch } from "react-redux";
import { setNotification } from "../../redux/features/auth-modal-slice";

interface ResetPasswordFormProps {
  switchAuthState: (name: string) => void;
}

interface ResetPasswordFormValues {
  password: string;
  confirm_password: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  switchAuthState,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordForm = useFormik<ResetPasswordFormValues>({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password minimum 8 characters")
        .required("Password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Confirm password not match")
        .min(8, "Confirm password minimum 8 characters")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values: ResetPasswordFormValues) => {
      setErrorMessage("");
      setIsSubmit(true);

      const { response, error } = await userService.resetPassword(values);
      setIsSubmit(false);

      if (response) {
        dispatch(setNotification(response.data.message));
        navigate("/");
        switchAuthState("signIn");
      }

      if (error) setErrorMessage(error.message);
    },
  });

  return (
    <Card className="mx-auto w-full max-w-[48rem]">
      <CardBody className="flex gap-0 md:gap-8">
        <img
          src="auth-sign-in.svg"
          alt="auth"
          className="w-0 md:w-3/6 object-cover"
        />
        <div className="w-full md:w-3/6">
          {/* Form header start */}
          <div className="flex justify-between mb-4">
            <div>
              <Typography color="blue" className="text-lg font-bold">
                Reset Password
              </Typography>
            </div>

            <Typography variant="small" className="mt-1">
              No Account?
              <Typography
                as="a"
                variant="small"
                color="blue"
                className="font-bold cursor-pointer"
                onClick={() => switchAuthState("signIn")}
              >
                Sign up
              </Typography>
            </Typography>
          </div>
          <Typography className="mb-4">
            Enter a new password, be careful not to match the old password
          </Typography>
          {/* Form header end */}

          {/* Form error message start */}
          {errorMessage && (
            <NotificationForm type="error" message={errorMessage} />
          )}
          {/* Form error message end */}

          {/* Form body start */}
          <form
            onSubmit={resetPasswordForm.handleSubmit}
            className="w-full space-y-4"
          >
            {/* Password input start*/}
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              size="lg"
              icon={
                <button onClick={() => setShowPassword((show) => !show)}>
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </button>
              }
              crossOrigin=""
              value={resetPasswordForm.values.password}
              onChange={resetPasswordForm.handleChange}
              error={
                resetPasswordForm.touched.password &&
                resetPasswordForm.errors.password !== undefined
              }
            />
            {resetPasswordForm.touched.password &&
              resetPasswordForm.errors.password && (
                <Typography
                  className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                  color="red"
                  variant="small"
                >
                  <InformationCircleIcon className="h-4 w-4" />
                  {resetPasswordForm.touched.password &&
                    resetPasswordForm.errors.password}
                </Typography>
              )}
            {/* Password input end  */}

            {/* Confirm password input start */}
            <Input
              label="Confirm Password"
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              size="lg"
              icon={
                <button onClick={() => setShowConfirmPassword((show) => !show)}>
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </button>
              }
              crossOrigin=""
              value={resetPasswordForm.values.confirm_password}
              onChange={resetPasswordForm.handleChange}
              error={
                resetPasswordForm.touched.confirm_password &&
                resetPasswordForm.errors.confirm_password !== undefined
              }
            />
            {resetPasswordForm.touched.confirm_password &&
              resetPasswordForm.errors.confirm_password && (
                <Typography
                  className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                  color="red"
                  variant="small"
                >
                  <InformationCircleIcon className="h-4 w-4" />
                  {resetPasswordForm.touched.confirm_password &&
                    resetPasswordForm.errors.confirm_password}
                </Typography>
              )}
            {/* Confirm password input end*/}

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

export default ResetPasswordForm;
