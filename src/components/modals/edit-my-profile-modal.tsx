import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import EditProfileForm from "../../pages/profile/components/edit-profile-form";

import {
  selectEditMyProfileModal,
  setEditMyProfileModalOpen,
} from "../../redux/features/edit-my-profile-modal-slice";
import userService from "../../services/user-service";

const EditMyProfileModal = () => {
  const { username } = useParams();
  const { editMyProfileModalOpen } = useSelector(selectEditMyProfileModal);

  const [user, setUser] = useState();

  const dispatch = useDispatch();

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

  const handleClose = () => dispatch(setEditMyProfileModalOpen(false));

  return (
    <>
      <Dialog
        size="md"
        open={editMyProfileModalOpen}
        handler={() => {}}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="flex items-center justify-between">
          Edit Profile
          <IconButton
            variant="text"
            color="red"
            onClick={handleClose}
            className="rounded-full"
          >
            <XMarkIcon className="w-8 h-8" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-0 border-t">
          {user ? <EditProfileForm user={user} /> : <></>}
        </DialogBody>
      </Dialog>
    </>
  );
};

export default EditMyProfileModal;
