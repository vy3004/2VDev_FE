import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
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
        toast.success(response.data.message);
      }

      if (error) setErrorMessage(error.message);
    },
  });

  return (
    <Card className="mx-auto w-full max-w-[48rem]">
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

            <Typography variant="small" className="mt-1 text-center">
              {t("auth.no-account")}
              <Typography
                variant="small"
                color="blue"
                className="font-bold cursor-pointer"
                onClick={() => switchAuthState("signUp")}
              >
                {t("auth.sign-up")}
              </Typography>
            </Typography>
          </div>
          <Typography className="mb-4">
            {t("auth.forgot-password-content")}
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
              variant="gradient"
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
