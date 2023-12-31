import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

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

import { setAuthModalOpen } from "../../redux/features/auth-modal-slice";
import { selectApp } from "../../redux/features/app-state-slice";

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
  const { t } = useTranslation();
  const { themeMode } = useSelector(selectApp);

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
          t("auth.Invalid email address")
        )
        .required(t("auth.Email is required")),
    }),
    onSubmit: async (values: ForgotPasswordFormValues) => {
      setErrorMessage("");
      setIsSubmit(true);

      const { response, error } = await userService.forgotPassword(values);
      setIsSubmit(false);

      if (response) {
        forgotPasswordForm.resetForm();
        dispatch(setAuthModalOpen(false));
        toast.success(t("auth.Please check your email to reset your password"));
      }

      if (error) setErrorMessage(t("auth.Email address is incorrect"));
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
                {t("auth.forgot-password")}
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
            {t("auth.forgot-password-content")}
          </Typography>
          {/* Form header end */}

          {/* Form error message start */}
          {errorMessage && (
            <div className="mb-8">
              <NotificationForm type="error" message={errorMessage} />
            </div>
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
              className="dark:text-gray-300"
              color={themeMode ? "white" : "black"}
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
                <ErrorMessageForm
                  message={
                    forgotPasswordForm.touched.email &&
                    forgotPasswordForm.errors.email
                  }
                />
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

export default ForgotPasswordForm;
