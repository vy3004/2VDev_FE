import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
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

import {
  selectAuthModal,
  setAuthModalOpen,
} from "../../redux/features/auth-modal-slice";
import { selectApp } from "../../redux/features/app-state-slice";

import { getOauthGoogleUrl } from "../../utils/oauth-google-url";

interface SignInFormProps {
  switchAuthState: (name: string) => void;
  authUser: () => Promise<boolean>;
}

interface SignInFormValues {
  email: string;
  password: string;
}

const SignInForm: React.FC<SignInFormProps> = ({
  switchAuthState,
  authUser,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { notification } = useSelector(selectAuthModal);
  const { themeMode } = useSelector(selectApp);

  const [isSubmit, setIsSubmit] = useState(false);
  const [successMessage] = useState(notification);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const oauthURL = getOauthGoogleUrl();

  const signInForm = useFormik<SignInFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          // eslint-disable-next-line no-useless-escape
          /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
          t("auth.Invalid email address")
        )
        .required(t("auth.Email is required")),
      password: Yup.string()
        .min(6, t("auth.Password minimum 6 characters"))
        .required(t("auth.Password is required")),
    }),
    onSubmit: async (values: SignInFormValues) => {
      setErrorMessage("");
      setIsSubmit(true);

      const { response, error } = await userService.login(values);
      setIsSubmit(false);

      if (response) {
        signInForm.resetForm();
        const auth = await authUser();
        if (auth) {
          dispatch(setAuthModalOpen(false));
          toast.success(t("auth.Sign In Success"));
        } else {
          setErrorMessage(t("auth.Sorry, your account has been locked"));
        }
      }

      if (error) setErrorMessage(t("auth.Email or password is incorrect"));
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
          <div className="flex justify-between mb-10">
            <div>
              <Typography className="font-bold text-lg">
                {t("auth.welcome-to")}{" "}
                <span className="text-blue-500">{t("header.logo")}</span>
              </Typography>
              <Typography className="text-4xl font-bold">
                {t("auth.sign-in")}
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
          {/* Form header end */}

          {/* Form success message start */}
          {successMessage && (
            <div className="mb-8">
              <NotificationForm type="success" message={successMessage} />
            </div>
          )}
          {/* Form success message end */}

          {/* Form error message start */}
          {errorMessage && (
            <div className="mb-8">
              <NotificationForm type="error" message={errorMessage} />
            </div>
          )}
          {/* Form error message end */}

          {/* Form body start */}
          <form onSubmit={signInForm.handleSubmit} className="w-full space-y-4">
            {/* Email input start */}
            <Input
              label={t("auth.email")}
              name="email"
              type="text"
              size="lg"
              className="dark:text-gray-300"
              color={themeMode ? "white" : "black"}
              crossOrigin=""
              value={signInForm.values.email}
              onChange={signInForm.handleChange}
              error={
                signInForm.touched.email &&
                signInForm.errors.email !== undefined
              }
            />
            {signInForm.touched.email && signInForm.errors.email && (
              <ErrorMessageForm
                message={signInForm.touched.email && signInForm.errors.email}
              />
            )}
            {/* Email input end */}

            {/* Password input start */}
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
              value={signInForm.values.password}
              onChange={signInForm.handleChange}
              error={
                signInForm.touched.password &&
                signInForm.errors.password !== undefined
              }
            />
            {signInForm.touched.password && signInForm.errors.password && (
              <ErrorMessageForm
                message={
                  signInForm.touched.password && signInForm.errors.password
                }
              />
            )}
            {/* Password input end */}

            <div className="flex justify-end">
              <Typography
                as="a"
                variant="small"
                color="blue"
                className="cursor-pointer"
                onClick={() => switchAuthState("forgotPassword")}
              >
                {t("auth.forgot-password")}
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
                t("auth.sign-in")
              )}
            </Button>

            <div className="flex items-center justify-between gap-4">
              <div className="w-full border" />
              <Typography className="text-center text-sm">
                {t("auth.or")}
              </Typography>
              <div className="w-full border" />
            </div>

            <Button
              variant="outlined"
              fullWidth
              className="dark:bg-gray-400 dark:border-gray-800 dark:text-gray-900"
            >
              <Link
                to={oauthURL}
                className="flex justify-center items-center gap-2"
              >
                <img
                  className="w-4 h-4"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  loading="lazy"
                  alt="google logo"
                />
                <span>{t("auth.sign-in-with-google")}</span>
              </Link>
            </Button>
          </form>
          {/* Form body end */}
        </div>
      </CardBody>
    </Card>
  );
};

export default SignInForm;
