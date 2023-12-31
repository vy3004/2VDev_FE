import { useState } from "react";
import { useFormik } from "formik";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import AvatarEdit from "react-avatar-edit";

import { GlobeAltIcon, MapPinIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Input,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import NotificationForm from "../../../components/auth-form/notification-form";

import mediaService from "../../../services/media-service";
import userService from "../../../services/user-service";

import { base64ToFile, fileToBase64 } from "../../../utils/file-utils";

import { setEditMyProfileModalOpen } from "../../../redux/features/edit-my-profile-modal-slice";
import { selectApp } from "../../../redux/features/app-state-slice";

interface EditProfileFormProps {
  user: any;
}

interface EditMyProfileFormValues {
  name?: string;
  date_of_birth?: string;
  bio?: string;
  location?: string;
  website?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { themeMode } = useSelector(selectApp);

  const [avatar, setAvatar] = useState(user.avatar);
  const [coverPhoto, setCoverPhoto] = useState(user.cover_photo);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File>();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [changeAvatar, setChangeAvatar] = useState(false);
  const [changeCoverPhoto, setChangeCoverPhoto] = useState(false);

  const onClose = () => {
    setAvatar(user.avatar);
  };

  const onCrop = (preview: string) => {
    setAvatar(preview);
  };

  const covertToBase64 = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      fileToBase64(file)
        .then((base64String) => {
          setCoverPhoto(base64String);
        })
        .catch((error) => {
          console.error(error);
        });

      setCoverPhotoFile(file);
    }
  };

  const editMyProfileForm = useFormik<EditMyProfileFormValues>({
    initialValues: {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      cover_photo: user.cover_photo,
      bio: user.bio,
      date_of_birth: format(new Date(user.date_of_birth), "yyyy-MM-dd"),
      website: user.website,
      location: user.location,
    },
    onSubmit: async (values: EditMyProfileFormValues) => {
      setIsSubmit(true);
      setErrorMessage("");

      let data = { ...values };

      // If avatar changed then upload avatar and return url
      if (avatar !== user.avatar) {
        const { response, error } = await mediaService.uploadImage(
          base64ToFile(avatar, user.username)
        );
        if (response) data = { ...data, avatar: response.data.result[0].url };

        if (error) setErrorMessage(t(`auth.${error.message}`));
      }

      // If cover photo changed then upload cover photo and return url
      if (coverPhoto !== user.cover_photo) {
        if (coverPhotoFile) {
          const { response, error } = await mediaService.uploadImage(
            coverPhotoFile
          );
          if (response)
            data = { ...data, cover_photo: response.data.result[0].url };

          if (error) setErrorMessage(t(`auth.${error.message}`));
        }
      }

      const { response, error } = await userService.updateMe(data);
      if (response) {
        dispatch(setEditMyProfileModalOpen(false));
        data.username === user.username
          ? window.location.reload()
          : (window.location.href = `/profile/${data.username}`);
        toast.success("Edit Profile Success");
      }
      if (error) setErrorMessage(t(`auth.${error.message}`));

      setIsSubmit(false);
    },
  });

  return (
    <form onSubmit={editMyProfileForm.handleSubmit}>
      {/* Error message form start */}
      {errorMessage && (
        <div className="px-4 py-2">
          <NotificationForm type="error" message={errorMessage} />
        </div>
      )}
      {/* Error message form end */}

      {/* Edit avatar start */}
      <div className="h-[500px] overflow-hidden overflow-y-auto p-4 space-y-4 dark:text-gray-300">
        <div className="flex items-center justify-between">
          <Typography className="font-bold">{t("user.Avatar")}</Typography>
          <Button
            onClick={() => setChangeAvatar(!changeAvatar)}
            variant="outlined"
            className="dark:text-gray-300 dark:bg-gray-900"
          >
            {t("user.Change")}
          </Button>
        </div>
        <div className="flex items-center justify-around flex-col sm:flex-row gap-4">
          <img
            className="border-4 border-black rounded-full w-20 h-20 sm:w-32 sm:h-32 p-0.5"
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
          <Typography className="font-bold">{t("user.Cover Photo")}</Typography>
          <Button
            onClick={() => setChangeCoverPhoto(!changeCoverPhoto)}
            variant="outlined"
            className="dark:text-gray-300 dark:bg-gray-900"
          >
            {t("user.Change")}
          </Button>
        </div>
        {changeCoverPhoto && (
          <Input
            className="cursor-pointer dark:text-gray-300"
            variant="standard"
            name="cover_photo"
            type="file"
            size="lg"
            crossOrigin=""
            onChange={covertToBase64}
          />
        )}

        <img
          className="h-60 w-full border rounded-lg object-cover object-center dark:border-gray-800"
          alt="cover"
          src={coverPhoto}
        />
        {/* Edit cover photo start */}

        <Typography className="font-bold">
          {t("user.Personal Information")}
        </Typography>
        <div className="grid grid-cols-2 gap-4">
          <Input
            containerProps={{ className: "col-span-2 sm:col-span-1" }}
            label={t("user.Name")}
            name="name"
            type="text"
            size="lg"
            className="dark:text-gray-300"
            color={themeMode ? "white" : "black"}
            crossOrigin=""
            value={editMyProfileForm.values.name}
            onChange={editMyProfileForm.handleChange}
          />
          <Input
            containerProps={{ className: "col-span-2 sm:col-span-1" }}
            label={t("user.Username")}
            name="username"
            type="text"
            size="lg"
            className="dark:text-gray-300"
            color={themeMode ? "white" : "black"}
            crossOrigin=""
            value={editMyProfileForm.values.username}
            onChange={editMyProfileForm.handleChange}
          />
        </div>

        <Textarea
          size="md"
          label={t("user.Biography")}
          name="bio"
          value={editMyProfileForm.values.bio}
          onChange={editMyProfileForm.handleChange}
          className="dark:text-gray-300"
          labelProps={{ className: "dark:!text-gray-300" }}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            containerProps={{ className: "col-span-2 sm:col-span-1" }}
            label={t("user.Date of birth")}
            name="date_of_birth"
            type="date"
            size="lg"
            className="dark:text-gray-300"
            color={themeMode ? "white" : "black"}
            crossOrigin=""
            value={editMyProfileForm.values.date_of_birth}
            onChange={editMyProfileForm.handleChange}
          />
          <Input
            containerProps={{ className: "col-span-2 sm:col-span-1" }}
            label={t("user.Website")}
            name="website"
            type="text"
            size="lg"
            className="dark:text-gray-300"
            color={themeMode ? "white" : "black"}
            crossOrigin=""
            icon={<GlobeAltIcon className="w-4 h-4 text-black" />}
            value={editMyProfileForm.values.website}
            onChange={editMyProfileForm.handleChange}
          />
        </div>
        <Input
          label={t("user.Address")}
          name="location"
          type="text"
          size="lg"
          className="dark:text-gray-300"
          color={themeMode ? "white" : "black"}
          crossOrigin=""
          icon={<MapPinIcon className="w-4 h-4 text-black" />}
          value={editMyProfileForm.values.location}
          onChange={editMyProfileForm.handleChange}
        />
      </div>

      <div className="border-t rounded-b-lg sticky bottom-0 p-4">
        <Button type="submit" variant="filled" fullWidth disabled={isSubmit}>
          {isSubmit ? <Spinner className="h-4 w-4 m-auto" /> : t("user.Submit")}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
