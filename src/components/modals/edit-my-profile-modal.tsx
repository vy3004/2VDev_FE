import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Avatar,
} from "@material-tailwind/react";

import {
  selectEditMyProfileModal,
  setEditMyProfileModalOpen,
} from "../../redux/features/edit-my-profile-modal-slice";
import { selectUser } from "../../redux/features/user-slice";

const EditMyProfileModal = () => {
  const { editMyProfileModalOpen } = useSelector(selectEditMyProfileModal);
  const { user } = useSelector(selectUser);

  console.log(user);

  const dispatch = useDispatch();

  if (!user) dispatch(setEditMyProfileModalOpen(false));

  const handleClose = () => dispatch(setEditMyProfileModalOpen(false));

  return (
    <>
      <Dialog
        size="md"
        open={editMyProfileModalOpen}
        handler={handleClose}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Edit Profile</DialogHeader>
        <DialogBody divider className="text-black">
          <Typography className="font-bold">Avatar</Typography>
          <Avatar
            src={
              user?.avatar ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmkp9a2rrD1Sskb9HLt5mDaTt4QaIs8CcBg&usqp=CAU"
            }
            alt="avatar"
            withBorder={true}
            className="w-20 h-20 sm:w-32 sm:h-32 p-0.5 hover:bg-blue-500 hover:border-blue-300 cursor-pointer"
          />
          <Typography className="font-bold">Cover Photo</Typography>
          <img
            className="h-60 w-full border rounded-lg object-cover object-center"
            src={user?.cover_photo || "/cover-photo.svg"}
            alt="cover"
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleClose}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" onClick={handleClose}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default EditMyProfileModal;
