import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
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
import { setAuthModalOpen } from "../../redux/features/auth-modal-slice";

interface SignUpFormProps {
  switchAuthState: (name: string) => void;
  authUser: () => void;
}

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  switchAuthState,
  authUser,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signUpForm = useFormik<SignUpFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .matches(
          // eslint-disable-next-line no-useless-escape
          /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address"
        )
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password minimum 8 characters")
        .required("Password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Confirm password not match")
        .min(8, "Confirm password minimum 8 characters")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values: SignUpFormValues) => {
      setErrorMessage("");
      setIsSubmit(true);

      const { response, error } = await userService.register(values);
      setIsSubmit(false);

      if (response) {
        authUser();
        signUpForm.resetForm();
        dispatch(setAuthModalOpen(false));
        toast.success("Sign Up success");
      }

      if (error) setErrorMessage(error.message);
    },
  });

  return (
    <Card className="mx-auto w-full max-w-[48rem]">
      <CardBody className="flex gap-0 md:gap-8">
        <img
          src="/auth-sign-up.svg"
          alt="auth"
          className="w-0 md:w-3/6 object-cover"
        />
        <div className="w-full md:w-3/6">
          {/* Form header start */}
          <div className="flex justify-between mb-10">
            <div>
              <div className="flex items-end font-bold">
                {t("auth.welcome-to")}
                <Typography color="blue" className="ml-1 font-bold text-lg">
                  2VDev
                </Typography>
              </div>
              <Typography className="text-4xl font-bold">
                {t("auth.sign-up")}
              </Typography>
            </div>

            <Typography variant="small" className="mt-1">
              {t("auth.have-an-account")}
              <Typography
                as="a"
                variant="small"
                color="blue"
                className="font-bold cursor-pointer"
                onClick={() => switchAuthState("signIn")}
              >
                {t("auth.sign-in")}
              </Typography>
            </Typography>
          </div>
          {/* Form header end */}

          {/* Form error message start */}
          {errorMessage && (
            <NotificationForm type="error" message={errorMessage} />
          )}
          {/* Form error message end */}

          {/* Form body start */}
          <form onSubmit={signUpForm.handleSubmit} className="w-full space-y-4">
            {/* Name input start */}
            <Input
              label={t("auth.name")}
              name="name"
              type="text"
              size="lg"
              crossOrigin=""
              value={signUpForm.values.name}
              onChange={signUpForm.handleChange}
              error={
                signUpForm.touched.name && signUpForm.errors.name !== undefined
              }
            />
            {signUpForm.touched.name && signUpForm.errors.name && (
              <Typography
                className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                color="red"
                variant="small"
              >
                <InformationCircleIcon className="h-4 w-4" />
                {signUpForm.touched.name && signUpForm.errors.name}
              </Typography>
            )}
            {/* Name input end */}

            {/* Email address input start */}
            <Input
              label={t("auth.email")}
              name="email"
              type="text"
              size="lg"
              crossOrigin=""
              value={signUpForm.values.email}
              onChange={signUpForm.handleChange}
              error={
                signUpForm.touched.email &&
                signUpForm.errors.email !== undefined
              }
            />
            {signUpForm.touched.email && signUpForm.errors.email && (
              <Typography
                className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                color="red"
                variant="small"
              >
                <InformationCircleIcon className="h-4 w-4" />
                {signUpForm.touched.email && signUpForm.errors.email}
              </Typography>
            )}
            {/* Email address input end */}

            {/* Password input start*/}
            <Input
              label={t("auth.password")}
              name="password"
              type={showPassword ? "text" : "password"}
              size="lg"
              icon={
                <div
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </div>
              }
              crossOrigin=""
              value={signUpForm.values.password}
              onChange={signUpForm.handleChange}
              error={
                signUpForm.touched.password &&
                signUpForm.errors.password !== undefined
              }
            />
            {signUpForm.touched.password && signUpForm.errors.password && (
              <Typography
                className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                color="red"
                variant="small"
              >
                <InformationCircleIcon className="h-4 w-4" />
                {signUpForm.touched.password && signUpForm.errors.password}
              </Typography>
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
                  className="cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </div>
              }
              crossOrigin=""
              value={signUpForm.values.confirm_password}
              onChange={signUpForm.handleChange}
              error={
                signUpForm.touched.confirm_password &&
                signUpForm.errors.confirm_password !== undefined
              }
            />
            {signUpForm.touched.confirm_password &&
              signUpForm.errors.confirm_password && (
                <Typography
                  className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                  color="red"
                  variant="small"
                >
                  <InformationCircleIcon className="h-4 w-4" />
                  {signUpForm.touched.confirm_password &&
                    signUpForm.errors.confirm_password}
                </Typography>
              )}
            {/* Confirm password input end*/}

            <br />

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
                t("auth.sign-up")
              )}
            </Button>
          </form>
          {/* Form body end */}
        </div>
      </CardBody>
    </Card>
  );
};

export default SignUpForm;
