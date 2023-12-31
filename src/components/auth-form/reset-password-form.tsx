import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
  Spinner,
} from "@material-tailwind/react";
import NotificationForm from "./notification-form";
import ErrorMessageForm from "../common/error-message-form";

import userService from "../../services/user-service";

import { setNotification } from "../../redux/features/auth-modal-slice";
import { selectApp } from "../../redux/features/app-state-slice";

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
  const { t } = useTranslation();
  const { themeMode } = useSelector(selectApp);

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
        .min(6, t("auth.Password minimum 6 characters"))
        .required(t("auth.Password is required")),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], t("auth.Confirm password not match"))
        .min(6, t("auth.Confirm password minimum 6 characters"))
        .required(t("auth.Confirm password is required")),
    }),
    onSubmit: async (values: ResetPasswordFormValues) => {
      setErrorMessage("");
      setIsSubmit(true);

      const { response, error } = await userService.resetPassword(values);
      setIsSubmit(false);

      if (response) {
        dispatch(setNotification(t("auth.Reset password successfully")));
        navigate("/");
        switchAuthState("signIn");
      }

      if (error) setErrorMessage(t("post.Something went wrong"));
    },
  });

  return (
    <Card className="mx-auto w-full max-w-[48rem] dark:bg-gray-800 dark:text-gray-300">
      <CardBody className="flex gap-0 md:gap-8">
        <img
          src="/images/auth-sign-in.svg"
          alt="auth"
          className="w-0 md:w-3/6 object-cover"
        />
        <div className="w-full md:w-3/6">
          {/* Form header start */}
          <div className="flex justify-between mb-4">
            <div>
              <Typography color="blue" className="text-lg font-bold">
                {t("auth.reset-password")}
              </Typography>
            </div>

            <div className="text-center">
              <Typography variant="small" className="mt-1">
                {t("auth.no-account")}
              </Typography>
              <Typography
                variant="small"
                className="font-bold cursor-pointer text-blue-500"
                onClick={() => switchAuthState("signUp")}
              >
                {t("auth.sign-up")}
              </Typography>
            </div>
          </div>
          <Typography className="mb-4">
            {t("auth.reset-password-content")}
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
              label={t("auth.password")}
              name="password"
              type={showPassword ? "text" : "password"}
              size="lg"
              icon={
                <div
                  className="cursor-pointer dark:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </div>
              }
              className="dark:text-gray-300"
              color={themeMode ? "white" : "black"}
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
                <ErrorMessageForm
                  message={
                    resetPasswordForm.touched.password &&
                    resetPasswordForm.errors.password
                  }
                />
              )}
            {/* Password input end  */}

            {/* Confirm password input start */}
            <Input
              label={t("auth.confirm-password")}
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              size="lg"
              icon={
                <div
                  className="cursor-pointer dark:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </div>
              }
              className="dark:text-gray-300"
              color={themeMode ? "white" : "black"}
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
                <ErrorMessageForm
                  message={
                    resetPasswordForm.touched.confirm_password &&
                    resetPasswordForm.errors.confirm_password
                  }
                />
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
                {t("auth.back-to-sign-in")}
              </Typography>
            </div>

            <Button
              type="submit"
              className="mt-10"
              variant="filled"
              fullWidth
              disabled={isSubmit}
            >
              {isSubmit ? (
                <Spinner className="h-4 w-4 m-auto" />
              ) : (
                t("auth.send")
              )}
            </Button>
          </form>
          {/* Form body end */}
        </div>
      </CardBody>
    </Card>
  );
};

export default ResetPasswordForm;
