import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import AvatarEdit from "react-avatar-edit";
import * as Yup from "yup";

import {
  Button,
  Checkbox,
  Input,
  List,
  ListItem,
  Option,
  Select,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { GlobeAltIcon, MapPinIcon } from "@heroicons/react/24/solid";
import NotificationForm from "../../../../components/auth-form/notification-form";
import ErrorMessageForm from "../../../../components/common/error-message-form";

import userService from "../../../../services/user-service";
import mediaService from "../../../../services/media-service";

import { base64ToFile, fileToBase64 } from "../../../../utils/file-utils";
import { User } from "../../../../utils/types";
import { USER_LEVELS } from "../../../../utils/constant";
import { selectApp } from "../../../../redux/features/app-state-slice";

interface UserDetailFormProps {
  user: User;
}

interface UserDetailFormValues {
  name: string;
  verify: number;
  role: number;
  level: string;
  date_of_birth?: string;
  bio?: string;
  location?: string;
  website?: string;
  username: string;
  avatar?: string;
  cover_photo?: string;
}

const UserDetailForm: React.FC<UserDetailFormProps> = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { themeMode } = useSelector(selectApp);
  console.log(themeMode);

  const [avatar, setAvatar] = useState(user.avatar || "/user.svg");
  const [coverPhoto, setCoverPhoto] = useState(
    user.avatar || "/cover-photo.svg"
  );
  const [coverPhotoFile, setCoverPhotoFile] = useState<File>();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [changeAvatar, setChangeAvatar] = useState(false);
  const [changeCoverPhoto, setChangeCoverPhoto] = useState(false);
  const [level, setLevel] = useState(user.level);
  const [verify, setVerify] = useState(user.verify === 1);
  const [admin, setAdmin] = useState(user.role === 1);

  const onClose = () => {
    setAvatar(user.avatar || "");
  };

  const onCrop = (preview: string) => {
    setAvatar(preview);
  };

  const covertToBase64 = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      fileToBase64(file)
        .then((base64String) => {
          setCoverPhoto(base64String + "");
        })
        .catch((error) => {
          console.error(error);
        });

      setCoverPhotoFile(file);
    }
  };

  const userDetailForm = useFormik<UserDetailFormValues>({
    initialValues: {
      name: user.name,
      username: user.username,
      verify: user.verify,
      role: user.role,
      level: level.toString(),
      avatar: user.avatar,
      cover_photo: coverPhoto,
      bio: user.bio,
      date_of_birth: format(new Date(user.date_of_birth || ""), "yyyy-MM-dd"),
      website: user.website,
      location: user.location,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("auth.Name is required")),
      username: Yup.string()
        .matches(/^[a-zA-Z0-9-_]{4,12}$/, t("user.username_validate"))
        .required(t("user.Username is required")),
      bio: Yup.string()
        .required(t("user.Biography is required"))
        .max(200, t("user.Bio must only contain 1-200 characters")),
      website: Yup.string()
        .url("Invalid website link")
        .required(t("user.Website is required")),
      location: Yup.string()
        .required(t("user.Address is required"))
        .max(200, t("user.Address must only contain 1-200 characters")),
    }),
    onSubmit: async (values: UserDetailFormValues) => {
      setIsSubmit(true);
      setErrorMessage("");

      let data = {
        ...values,
        user_id: user._id,
        level: +level,
        verify: +verify,
        role: +admin,
      };

      // If avatar changed then upload avatar and return url
      if (avatar !== user.avatar) {
        const { response, error } = await mediaService.uploadImage(
          base64ToFile(avatar, user.username)
        );
        if (response) data = { ...data, avatar: response.data.result[0].url };

        if (error) setErrorMessage(error.message);
      }

      // If cover photo changed then upload cover photo and return url
      if (coverPhoto !== user.cover_photo) {
        if (coverPhotoFile) {
          const { response, error } = await mediaService.uploadImage(
            coverPhotoFile
          );
          if (response)
            data = { ...data, cover_photo: response.data.result[0].url };

          if (error) setErrorMessage(error.message);
        }
      }

      const { response, error } = await userService.updateUser(data);
      if (response) {
        console.log("RES", response);
        navigate("/dashboard/manage-users");
        toast.success(t("user.User editing successful"));
      }
      if (error) setErrorMessage(error.message);

      setIsSubmit(false);
    },
  });

  return (
    <div className="p-4 rounded-lg dark:bg-gray-700 dark:text-gray-50">
      <Typography className="font-bold text-2xl">
        {t("user.Edit User")} {user.name}
      </Typography>

      <form onSubmit={userDetailForm.handleSubmit}>
        {/* Edit avatar start */}
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <Typography className="font-bold">{t("user.Avatar")}</Typography>
            <Button
              onClick={() => setChangeAvatar(!changeAvatar)}
              variant="gradient"
            >
              {t("user.Change")}
            </Button>
          </div>
          <div className="flex items-center justify-around flex-col sm:flex-row gap-4">
            <img
              className="border-4 border-black rounded-full w-20 h-20 sm:w-32 sm:h-32 p-0.5 dark:border-gray-50"
              src={avatar}
              alt="avatar"
            />
            {changeAvatar && (
              <AvatarEdit
                width={350}
                height={300}
                onCrop={onCrop}
                onClose={onClose}
              />
            )}
          </div>
          {/* Edit avatar end */}

          {/* Edit cover photo start */}
          <div className="flex items-center justify-between">
            <Typography className="font-bold">
              {t("user.Cover Photo")}
            </Typography>
            <Button
              onClick={() => setChangeCoverPhoto(!changeCoverPhoto)}
              variant="gradient"
            >
              {t("user.Change")}
            </Button>
          </div>
          {changeCoverPhoto && (
            <Input
              className="cursor-pointer"
              variant="standard"
              name="cover_photo"
              type="file"
              size="lg"
              color={themeMode ? "white" : "black"}
              crossOrigin=""
              onChange={covertToBase64}
            />
          )}

          <img
            className="h-60 w-full border rounded-lg object-cover object-center"
            alt="cover"
            src={coverPhoto}
          />
          {/* Edit cover photo start */}

          <Typography className="font-bold">
            {t("user.Personal Information")}
          </Typography>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* Name input start */}
              <Input
                containerProps={{ className: "col-span-2 sm:col-span-1" }}
                label={t("auth.name")}
                name="name"
                type="text"
                size="lg"
                color={themeMode ? "white" : "black"}
                crossOrigin=""
                value={userDetailForm.values.name}
                onChange={userDetailForm.handleChange}
                error={
                  userDetailForm.touched.name &&
                  userDetailForm.errors.name !== undefined
                }
              />
              {userDetailForm.touched.name && userDetailForm.errors.name && (
                <ErrorMessageForm
                  message={
                    userDetailForm.touched.name && userDetailForm.errors.name
                  }
                />
              )}
              {/* Name input end */}
            </div>

            <div>
              {/* Username input start */}
              <Input
                containerProps={{ className: "col-span-2 sm:col-span-1" }}
                label={t("user.Username")}
                name="username"
                type="text"
                size="lg"
                color={themeMode ? "white" : "black"}
                crossOrigin=""
                value={userDetailForm.values.username}
                onChange={userDetailForm.handleChange}
                error={
                  userDetailForm.touched.username &&
                  userDetailForm.errors.username !== undefined
                }
              />
              {userDetailForm.touched.username &&
                userDetailForm.errors.username && (
                  <ErrorMessageForm
                    message={
                      userDetailForm.touched.username &&
                      userDetailForm.errors.username
                    }
                  />
                )}
              {/* Username input end */}
            </div>
          </div>

          <div>
            {/* Biography text area start */}
            <Textarea
              className="dark:text-gray-50"
              labelProps={{ className: "dark:!text-gray-50" }}
              label={t("user.Biography")}
              name="bio"
              size="md"
              value={userDetailForm.values.bio}
              onChange={userDetailForm.handleChange}
              error={
                userDetailForm.touched.bio &&
                userDetailForm.errors.bio !== undefined
              }
            />
            {userDetailForm.touched.bio && userDetailForm.errors.bio && (
              <ErrorMessageForm
                message={
                  userDetailForm.touched.bio && userDetailForm.errors.bio
                }
              />
            )}
            {/* Biography text area end */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date of birth input start */}
            <Input
              label={t("user.Date of birth")}
              name="date_of_birth"
              type="date"
              size="lg"
              color={themeMode ? "white" : "black"}
              crossOrigin=""
              value={userDetailForm.values.date_of_birth}
              onChange={userDetailForm.handleChange}
            />
            {/* Date of birth input end */}

            <div className="col-span-2 sm:col-span-1">
              {/* Website input start */}
              <Input
                label={t("user.Website")}
                name="website"
                type="text"
                size="lg"
                color={themeMode ? "white" : "black"}
                crossOrigin=""
                icon={
                  <GlobeAltIcon className="w-4 h-4 text-black dark:text-gray-50" />
                }
                value={userDetailForm.values.website}
                onChange={userDetailForm.handleChange}
                error={
                  userDetailForm.touched.website &&
                  userDetailForm.errors.website !== undefined
                }
              />
              {userDetailForm.touched.website &&
                userDetailForm.errors.website && (
                  <ErrorMessageForm
                    message={
                      userDetailForm.touched.website &&
                      userDetailForm.errors.website
                    }
                  />
                )}
              {/* Website input end */}
            </div>
          </div>

          <div>
            {/* Address input start */}
            <Input
              label={t("user.Address")}
              name="location"
              type="text"
              size="lg"
              color={themeMode ? "white" : "black"}
              crossOrigin=""
              icon={
                <MapPinIcon className="w-4 h-4 text-black dark:text-gray-50" />
              }
              value={userDetailForm.values.location}
              onChange={userDetailForm.handleChange}
              error={
                userDetailForm.touched.location &&
                userDetailForm.errors.location !== undefined
              }
            />
            {userDetailForm.touched.location &&
              userDetailForm.errors.location && (
                <ErrorMessageForm
                  message={
                    userDetailForm.touched.location &&
                    userDetailForm.errors.location
                  }
                />
              )}
            {/* Address input end */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Select level start */}
            <div className="col-span-2 sm:col-span-1">
              <Select
                name="level"
                label={t("user.Select Level")}
                size="lg"
                color="red"
                value={userDetailForm.values.level}
                onChange={userDetailForm.handleChange}
              >
                {USER_LEVELS.map((item, key) => (
                  <Option
                    value={key.toString()}
                    key={key}
                    onClick={() => setLevel(key)}
                  >
                    {t(`user.${item}`)}
                  </Option>
                ))}
              </Select>
            </div>
            {/* Select level end */}

            <div className="col-span-2 sm:col-span-1">
              <List className="flex-row gap-4 p-0">
                {/* Role checkbox start */}
                <ListItem className="p-0" onClick={() => setAdmin(!admin)}>
                  <Checkbox
                    checked={admin}
                    readOnly
                    className="hover:before:opacity-0"
                    crossOrigin={""}
                  />
                  <Typography className="font-medium select-none">
                    {t("user.Admin")}
                  </Typography>
                </ListItem>
                {/* Role checkbox end */}

                {/* Verify checkbox start */}
                <ListItem className="p-0" onClick={() => setVerify(!verify)}>
                  <Checkbox
                    checked={verify}
                    readOnly
                    className="hover:before:opacity-0"
                    crossOrigin={""}
                  />
                  <Typography className="font-medium select-none">
                    {t("user.Email Verify")}
                  </Typography>
                </ListItem>
                {/* Verify checkbox start */}
              </List>
            </div>
          </div>
        </div>
        {/* Error message form start */}
        {errorMessage && (
          <div className="py-2">
            <NotificationForm type="error" message={errorMessage} />
          </div>
        )}
        {/* Error message form end */}

        <div className="mt-8 flex items-center justify-center gap-8">
          <Button
            onClick={() => navigate("/dashboard/manage-users")}
            variant="outlined"
            color="red"
          >
            {t("user.Cancel")}
          </Button>
          <Button type="submit" variant="gradient" disabled={isSubmit}>
            {isSubmit ? (
              <Spinner className="h-4 w-4 m-auto" />
            ) : (
              t("user.Submit")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailForm;
