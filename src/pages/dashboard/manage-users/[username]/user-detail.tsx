import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AvatarEdit from "react-avatar-edit";

import userService from "../../../../services/user-service";

import { User } from "../../../../utils/types";
import { useFormik } from "formik";
import { format } from "date-fns";
import { base64ToFile, fileToBase64 } from "../../../../utils/file-utils";
import mediaService from "../../../../services/media-service";
import { toast } from "react-hot-toast";
import NotificationForm from "../../../../components/auth-form/notification-form";
import {
  Button,
  Input,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { GlobeAltIcon, MapPinIcon } from "@heroicons/react/24/solid";

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

const UserDetail = () => {
  const { username } = useParams();

  const [user, setUser] = useState<User>();

  const [avatar, setAvatar] = useState();
  const [coverPhoto, setCoverPhoto] = useState();
  const [coverPhotoFile, setCoverPhotoFile] = useState<File>();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [changeAvatar, setChangeAvatar] = useState(false);
  const [changeCoverPhoto, setChangeCoverPhoto] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      if (username) {
        const { response } = await userService.getUser({
          username,
        });

        if (response) {
          setUser(response.data.result);
        }
      }
    };

    getUser();
  }, [username]);

  //   const onClose = () => {
  //     setAvatar(user.avatar);
  //   };

  //   const onCrop = (preview: string) => {
  //     setAvatar(preview);
  //   };

  //   const covertToBase64 = (e: any) => {
  //     const file = e.target.files[0];

  //     if (file) {
  //       fileToBase64(file)
  //         .then((base64String) => {
  //           setCoverPhoto(base64String);
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });

  //       setCoverPhotoFile(file);
  //     }
  //   };

  if (!user) {
    return null;
  }

  //   const editMyProfileForm = useFormik<EditMyProfileFormValues>({
  //     initialValues: {
  //       name: user.name,
  //       username: user.username,
  //       avatar: user.avatar,
  //       cover_photo: user.cover_photo,
  //       bio: user.bio,
  //       date_of_birth: format(new Date(user.date_of_birth), "yyyy-MM-dd"),
  //       website: user.website,
  //       location: user.location,
  //     },
  //     onSubmit: async (values: EditMyProfileFormValues) => {
  //       setIsSubmit(true);
  //       setErrorMessage("");

  //       let data = { ...values };

  //       // If avatar changed then upload avatar and return url
  //       if (avatar !== user.avatar) {
  //         const { response, error } = await mediaService.uploadImage(
  //           base64ToFile(avatar)
  //         );
  //         if (response) data = { ...data, avatar: response.data.result[0].url };

  //         if (error) setErrorMessage(error.message);
  //       }

  //       // If cover photo changed then upload cover photo and return url
  //       if (coverPhoto !== user.cover_photo) {
  //         if (coverPhotoFile) {
  //           const { response, error } = await mediaService.uploadImage(
  //             coverPhotoFile
  //           );
  //           if (response)
  //             data = { ...data, cover_photo: response.data.result[0].url };

  //           if (error) setErrorMessage(error.message);
  //         }
  //       }

  //       const { response, error } = await userService.updateMe(data);
  //       if (response) {
  //         data.username === user.username
  //           ? window.location.reload()
  //           : (window.location.href = `/profile/${data.username}`);
  //         toast.success("Edit Profile Success");
  //       }
  //       if (error) setErrorMessage(error.message);

  //       setIsSubmit(false);
  //     },
  //   });

  //   console.log("USER", user);

  return (
    <div>
      {/* <form onSubmit={editMyProfileForm.handleSubmit}> */}
      {/* Error message form start */}
      {errorMessage && (
        <div className="px-4 py-2">
          <NotificationForm type="error" message={errorMessage} />
        </div>
      )}
      {/* Error message form end */}

      {/* Edit avatar start */}
      <div className="h-[500px] overflow-hidden overflow-y-scroll p-4 space-y-4">
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
              //   onCrop={onCrop}
              //   onClose={onClose}
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
            // onChange={covertToBase64}
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
            //   value={editMyProfileForm.values.name}
            //   onChange={editMyProfileForm.handleChange}
          />
          <Input
            containerProps={{ className: "col-span-2 sm:col-span-1" }}
            label="User name"
            name="username"
            type="text"
            size="lg"
            crossOrigin=""
            //   value={editMyProfileForm.values.username}
            //   onChange={editMyProfileForm.handleChange}
          />
        </div>

        <Textarea
          size="md"
          label="Biography"
          name="bio"
          // value={editMyProfileForm.values.bio}
          // onChange={editMyProfileForm.handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            containerProps={{ className: "col-span-2 sm:col-span-1" }}
            label="Date of birth"
            name="date_of_birth"
            type="date"
            size="lg"
            crossOrigin=""
            //   value={editMyProfileForm.values.date_of_birth}
            //   onChange={editMyProfileForm.handleChange}
          />
          <Input
            containerProps={{ className: "col-span-2 sm:col-span-1" }}
            label="Website"
            name="website"
            type="text"
            size="lg"
            crossOrigin=""
            icon={<GlobeAltIcon className="w-4 h-4 text-black" />}
            //   value={editMyProfileForm.values.website}
            //   onChange={editMyProfileForm.handleChange}
          />
        </div>
        <Input
          label="Address"
          name="location"
          type="text"
          size="lg"
          crossOrigin=""
          icon={<MapPinIcon className="w-4 h-4 text-black" />}
          // value={editMyProfileForm.values.location}
          // onChange={editMyProfileForm.handleChange}
        />
      </div>

      <div className="border-t rounded-b-lg sticky bottom-0 p-4">
        <Button type="submit" variant="gradient" fullWidth disabled={isSubmit}>
          {isSubmit ? <Spinner className="h-4 w-4 m-auto" /> : "Submit"}
        </Button>
      </div>
      {/* </form> */}
    </div>
  );
};

export default UserDetail;
