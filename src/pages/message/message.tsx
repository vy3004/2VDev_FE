import {
  Cog6ToothIcon,
  FaceSmileIcon,
  PhoneIcon,
  PhotoIcon,
  VideoCameraIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import {
  Avatar,
  Badge,
  IconButton,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import Divider from "../../components/common/divider";

const Message = () => {
  return (
    <div className="border rounded-lg h-[calc(100vh-163px)]">
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge overlap="circular" color="green" placement="bottom-end">
            <Avatar
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80"
              alt="profile picture"
            />
          </Badge>
          <Typography className="font-bold">Kha Vy</Typography>
        </div>
        <div className="space-x-2">
          <IconButton variant="text" className="rounded-full">
            <PhoneIcon className="w-6 h-6" />
          </IconButton>
          <IconButton variant="text" className="rounded-full">
            <VideoCameraIcon className="w-6 h-6" />
          </IconButton>
          <IconButton variant="text" className="rounded-full">
            <Cog6ToothIcon className="w-6 h-6" />
          </IconButton>
        </div>
      </div>
      <Divider />
      <div className="h-[calc(100vh-300px)] overflow-hidden overflow-y-auto">
        <div className="h-screen">message</div>
      </div>
      <Divider />

      <div className="h-fit sticky bottom-0 px-2 py-1 flex items-center">
        <div className="flex w-full flex-row items-center gap-2 rounded-full border border-gray-900/10 p-2">
          <div className="flex">
            <IconButton variant="text" className="rounded-full">
              <PhotoIcon className="h-6 w-6" />
            </IconButton>
            <IconButton variant="text" className="rounded-full">
              <FaceSmileIcon className="h-6 w-6" />
            </IconButton>
          </div>
          <Textarea
            rows={1}
            placeholder="Your Message"
            className="min-h-full !border-0 focus:border-transparent"
            containerProps={{
              className: "grid h-full",
            }}
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <div>
            <IconButton variant="text" className="rounded-full">
              <PaperAirplaneIcon className="h-6 w-6" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
