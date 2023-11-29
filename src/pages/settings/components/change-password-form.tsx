import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, Input, Spinner } from "@material-tailwind/react";
import ErrorMessageForm from "../../../components/common/error-message-form";
import NotificationForm from "../../../components/auth-form/notification-form";

import userService from "../../../services/user-service";

import { selectUser } from "../../../redux/features/user-slice";
import { selectApp } from "../../../redux/features/app-state-slice";

interface ChangePasswordFormValues {
  old_password: string;
  password: string;
  confirm_password: string;
}

const ChangePasswordForm = () => {
  const { user } = useSelector(selectUser);
  const { t } = useTranslation();
  const { themeMode } = useSelector(selectApp);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const changePasswordForm = useFormik<ChangePasswordFormValues>({
    initialValues: {
      old_password: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      old_password: Yup.string()
        .min(6, t("auth.Old password minimum 6 characters"))
        .required(t("auth.Old password is required")),
      password: Yup.string()
        .notOneOf(
          [Yup.ref("old_password")],
          t("auth.New password must be different from old password")
        )
        .min(6, t("auth.New password minimum 6 characters"))
        .required(t("auth.New password is required")),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], t("auth.Confirm new password not match"))
        .min(6, t("auth.Confirm new password minimum 6 characters"))
        .required(t("auth.Confirm new password is required")),
    }),
    onSubmit: async (values: ChangePasswordFormValues) => {
      setSuccessMessage("");
      setErrorMessage("");
      setIsSubmit(true);

      const { response, error } = await userService.changePassword(values);

      if (response) {
        changePasswordForm.resetForm();
        setSuccessMessage(t("auth.Password changed successfully"));
        setIsChangingPassword(!isChangingPassword);
      }

      if (error) setErrorMessage(t("auth.Password change failed"));
      setIsSubmit(false);
    },
  });

  return (
    user && (
      <div className="space-y-4">
        {successMessage && (
          <div className="mb-8">
            <NotificationForm type="success" message={successMessage} />
          </div>
        )}
        {errorMessage && (
          <div className="mb-8">
            <NotificationForm type="error" message={errorMessage} />
          </div>
        )}
        <Input
          type="email"
          label={t("auth.email")}
          value={user.email}
          disabled
          crossOrigin={""}
        />

        {isChangingPassword ? (
          <form
            onSubmit={changePasswordForm.handleSubmit}
            className="space-y-4"
          >
            <Input
              name="old_password"
              type="password"
              label={t("auth.Old Password")}
              className="dark:text-gray-300"
              color={themeMode ? "white" : "black"}
              crossOrigin={""}
              value={changePasswordForm.values.old_password}
              onChange={changePasswordForm.handleChange}
              error={
                changePasswordForm.touched.old_password &&
                changePasswordForm.errors.old_password !== undefined
              }
            />
            {changePasswordForm.touched.old_password &&
              changePasswordForm.errors.old_password && (
                <ErrorMessageForm
                  message={
                    changePasswordForm.touched.old_password &&
                    changePasswordForm.errors.old_password
                  }
                />
              )}

            <div className="md:grid md:grid-cols-2 md:gap-4 md:space-y-0 space-y-4">
              <div>
                <Input
                  name="password"
                  type="password"
                  label={t("auth.New Password")}
                  className="dark:text-gray-300"
                  color={themeMode ? "white" : "black"}
                  crossOrigin={""}
                  value={changePasswordForm.values.password}
                  onChange={changePasswordForm.handleChange}
                  error={
                    changePasswordForm.touched.password &&
                    changePasswordForm.errors.password !== undefined
                  }
                />
                {changePasswordForm.touched.password &&
                  changePasswordForm.errors.password && (
                    <ErrorMessageForm
                      message={
                        changePasswordForm.touched.password &&
                        changePasswordForm.errors.password
                      }
                    />
                  )}
              </div>
              <div>
                <Input
                  name="confirm_password"
                  type="password"
                  label={t("auth.Confirm New Password")}
                  className="dark:text-gray-300"
                  color={themeMode ? "white" : "black"}
                  crossOrigin={""}
                  value={changePasswordForm.values.confirm_password}
                  onChange={changePasswordForm.handleChange}
                  error={
                    changePasswordForm.touched.confirm_password &&
                    changePasswordForm.errors.confirm_password !== undefined
                  }
                />
                {changePasswordForm.touched.confirm_password &&
                  changePasswordForm.errors.confirm_password && (
                    <ErrorMessageForm
                      message={
                        changePasswordForm.touched.confirm_password &&
                        changePasswordForm.errors.confirm_password
                      }
                    />
                  )}
              </div>
            </div>

            <div className="space-x-2">
              <Button
                className="bg-gray-50 text-gray-900 border border-gray-900 normal-case"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
              >
                {t("auth.Cancel")}
              </Button>
              <Button
                className="border border-gray-900 normal-case"
                type="submit"
              >
                {isSubmit ? (
                  <Spinner className="h-4 w-4 m-auto" />
                ) : (
                  t("auth.Save")
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <Input
              type="password"
              label={t("auth.password")}
              value={user.email}
              disabled
              crossOrigin={""}
            />
            <Button
              className="normal-case"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              {t("auth.Change Password")}
            </Button>
          </div>
        )}
      </div>
    )
  );
};

export default ChangePasswordForm;
