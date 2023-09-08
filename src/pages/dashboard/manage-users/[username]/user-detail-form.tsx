import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import AvatarEdit from "react-avatar-edit";

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

import userService from "../../../../services/user-service";
import mediaService from "../../../../services/media-service";

import { base64ToFile, fileToBase64 } from "../../../../utils/file-utils";
import { User } from "../../../../utils/types";
import { USER_LEVELS } from "../../../../utils/constant";

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
    onSubmit: async (values: UserDetailFormValues) => {
      setIsSubmit(true);
      setErrorMessage("");

      let data = { ...values, level: +level, verify: +verify, role: +admin };

      // If avatar changed then upload avatar and return url
      if (avatar !== user.avatar) {
        const { response, error } = await mediaService.uploadImage(
          base64ToFile(avatar)
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
      console.log("data", data);

      const { response, error } = await userService.updateUser(data);
      if (response) {
        console.log("RES", response);
        navigate("/dashboard/manage-users");
        toast.success("Edit User Success");
      }
      if (error) setErrorMessage(error.message);

      setIsSubmit(false);
    },
  });

  return (
    <div>
      <Typography className="font-bold text-2xl">
        Edit User {user.name}
      </Typography>

      <form onSubmit={userDetailForm.handleSubmit}>
        {/* Edit avatar start */}
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <Typography className="font-bold">Avatar</Typography>
            <Button
              onClick={() => setChangeAvatar(!changeAvatar)}
              variant="outlined"
            >
              Change
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
            <Typography className="font-bold">Cover Photo</Typography>
            <Button
              onClick={() => setChangeCoverPhoto(!changeCoverPhoto)}
              variant="outlined"
            >
              Change
            </Button>
          </div>
          {changeCoverPhoto && (
            <Input
              className="cursor-pointer"
              variant="standard"
              name="cover_photo"
              type="file"
              size="lg"
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

          <Typography className="font-bold">Personal Information</Typography>
          <div className="grid grid-cols-2 gap-4">
            <Input
              containerProps={{ className: "col-span-2 sm:col-span-1" }}
              label="Name"
              name="name"
              type="text"
              size="lg"
              crossOrigin=""
              value={userDetailForm.values.name}
              onChange={userDetailForm.handleChange}
            />

            <Input
              containerProps={{ className: "col-span-2 sm:col-span-1" }}
              label="User name"
              name="username"
              type="text"
              size="lg"
              crossOrigin=""
              value={userDetailForm.values.username}
              onChange={userDetailForm.handleChange}
            />
          </div>

          <Textarea
            size="md"
            label="Biography"
            name="bio"
            value={userDetailForm.values.bio}
            onChange={userDetailForm.handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              containerProps={{ className: "col-span-2 sm:col-span-1" }}
              label="Date of birth"
              name="date_of_birth"
              type="date"
              size="lg"
              crossOrigin=""
              value={userDetailForm.values.date_of_birth}
              onChange={userDetailForm.handleChange}
            />

            <Input
              containerProps={{ className: "col-span-2 sm:col-span-1" }}
              label="Website"
              name="website"
              type="text"
              size="lg"
              crossOrigin=""
              icon={<GlobeAltIcon className="w-4 h-4 text-black" />}
              value={userDetailForm.values.website}
              onChange={userDetailForm.handleChange}
            />
          </div>

          <Input
            label="Address"
            name="location"
            type="text"
            size="lg"
            crossOrigin=""
            icon={<MapPinIcon className="w-4 h-4 text-black" />}
            value={userDetailForm.values.location}
            onChange={userDetailForm.handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Select level start */}
            <div className="col-span-2 sm:col-span-1">
              <Select
                name="level"
                label="Select Level"
                size="lg"
                value={userDetailForm.values.level}
                onChange={userDetailForm.handleChange}
              >
                {USER_LEVELS.map((item, key) => (
                  <Option
                    value={key.toString()}
                    key={key}
                    onClick={() => setLevel(key)}
                  >
                    {item}
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
                    Admin
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
                    Email Verify
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
            Cancel
          </Button>
          <Button type="submit" variant="gradient" disabled={isSubmit}>
            {isSubmit ? <Spinner className="h-4 w-4 m-auto" /> : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailForm;
