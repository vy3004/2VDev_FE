import { useState } from "react";
import { useFormik } from "formik";
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
} from "@material-tailwind/react";

interface SignUpFormProps {
  switchAuthState: () => void;
}

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ switchAuthState }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const signInForm = useFormik<SignUpFormValues>({
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
      console.log("CHECK===", values);
    },
  });

  return (
    <Card className="mx-auto w-full max-w-[48rem]">
      <CardBody className="flex gap-0 md:gap-8">
        <img
          src="auth-sign-up.svg"
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
              <Typography className="text-4xl font-bold">Sign Up</Typography>
            </div>

            <Typography variant="small" className="mt-1">
              Have an Account?
              <Typography
                as="a"
                href="#signUp"
                variant="small"
                color="blue"
                className="font-bold"
                onClick={() => switchAuthState()}
              >
                Sign in
              </Typography>
            </Typography>
          </div>
          {/* Form header end */}

          {/* Form body start */}
          <form onSubmit={signInForm.handleSubmit} className="w-full space-y-4">
            <Input
              label="Name"
              name="name"
              type="text"
              size="lg"
              crossOrigin=""
              value={signInForm.values.name}
              onChange={signInForm.handleChange}
            />
            {signInForm.touched.name && signInForm.errors.name && (
              <Typography
                className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                color="red"
                variant="small"
              >
                <InformationCircleIcon className="h-4 w-4" />
                {signInForm.touched.name && signInForm.errors.name}
              </Typography>
            )}

            <Input
              label="Email"
              name="email"
              type="text"
              size="lg"
              crossOrigin=""
              value={signInForm.values.email}
              onChange={signInForm.handleChange}
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

            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              size="lg"
              icon={
                <button onClick={handleClickShowPassword}>
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </button>
              }
              crossOrigin=""
              value={signInForm.values.password}
              onChange={signInForm.handleChange}
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

            <Input
              label="Confirm Password"
              name="confirm_password"
              type={showPassword ? "text" : "password"}
              size="lg"
              icon={
                <button onClick={handleClickShowPassword}>
                  {showPassword ? (
                    <EyeIcon className="h-4 w-4" />
                  ) : (
                    <EyeSlashIcon className="h-4 w-4" />
                  )}
                </button>
              }
              crossOrigin=""
              value={signInForm.values.confirm_password}
              onChange={signInForm.handleChange}
            />
            {signInForm.touched.confirm_password &&
              signInForm.errors.confirm_password && (
                <Typography
                  className="!mt-1 ml-3 flex items-center gap-1 font-normal"
                  color="red"
                  variant="small"
                >
                  <InformationCircleIcon className="h-4 w-4" />
                  {signInForm.touched.confirm_password &&
                    signInForm.errors.confirm_password}
                </Typography>
              )}

            <br />

            <Button
              type="submit"
              className="mt-10"
              variant="gradient"
              fullWidth
            >
              Sign Up
            </Button>
          </form>
          {/* Form body end */}
        </div>
      </CardBody>
    </Card>
  );
};

export default SignUpForm;
