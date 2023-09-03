import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
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
import {
  selectAuthModal,
  setAuthModalOpen,
} from "../../redux/features/auth-modal-slice";
import { getOauthGoogleUrl } from "../../utils/oauth-google-url";

interface SignInFormProps {
  switchAuthState: (name: string) => void;
  authUser: () => void;
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
  const { notification } = useSelector(selectAuthModal);
  const oauthURL = getOauthGoogleUrl();

  const [isSubmit, setIsSubmit] = useState(false);
  const [successMessage] = useState(notification);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
          "Invalid email address"
        )
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password minimum 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values: SignInFormValues) => {
      setErrorMessage("");
      setIsSubmit(true);

      const { response, error } = await userService.login(values);
      setIsSubmit(false);

      if (response) {
        authUser();
        signInForm.resetForm();
        dispatch(setAuthModalOpen(false));
        toast.success("Sign In Success");
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
          <div className="flex justify-between mb-10">
            <div>
              <div className="flex font-bold text-lg">
                Welcome to
                <Typography color="blue" className="ml-1 font-bold text-lg">
                  2VDev
                </Typography>
              </div>
              <Typography className="text-4xl font-bold">Sign In</Typography>
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
              label="Email"
              name="email"
              type="text"
              size="lg"
              crossOrigin=""
              value={signInForm.values.email}
              onChange={signInForm.handleChange}
              error={
                signInForm.touched.email &&
                signInForm.errors.email !== undefined
              }
            />
            {signInForm.touched.email && signInForm.errors.email && (
              <Typography
                className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                color="red"
                variant="small"
              >
                <InformationCircleIcon className="h-4 w-4" />
                {signInForm.touched.email && signInForm.errors.email}
              </Typography>
            )}
            {/* Email input end */}

            {/* Password input start */}
            <Input
              label="Password"
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
              value={signInForm.values.password}
              onChange={signInForm.handleChange}
              error={
                signInForm.touched.password &&
                signInForm.errors.password !== undefined
              }
            />
            {signInForm.touched.password && signInForm.errors.password && (
              <Typography
                className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                color="red"
                variant="small"
              >
                <InformationCircleIcon className="h-4 w-4" />
                {signInForm.touched.password && signInForm.errors.password}
              </Typography>
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
                Forgot Password
              </Typography>
            </div>

            <Button
              // type="submit"
              onClick={signInForm.submitForm}
              className="mt-10"
              variant="gradient"
              fullWidth
              disabled={isSubmit}
            >
              {isSubmit ? <Spinner className="h-4 w-4 m-auto" /> : "Sign In"}
            </Button>

            <div className="flex items-center justify-between gap-4">
              <div className="w-full border" />
              <Typography className="text-center text-sm">OR</Typography>
              <div className="w-full border" />
            </div>

            <Button variant="outlined" fullWidth>
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
                <span>Sign In with Google</span>
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
