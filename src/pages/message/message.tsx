import {
  Cog6ToothIcon,
  CogIcon,
  FaceSmileIcon,
  PhoneIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import {
  Avatar,
  Badge,
  IconButton,
  Textarea,
  Typography,
} from "@material-tailwind/react";

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
      <hr />
      <div className="h-[calc(100vh-300px)] overflow-hidden overflow-y-scroll">
        <div className="h-screen">message</div>
      </div>
      <hr />

      <div className="h-fit sticky bottom-0 px-2 flex items-center">
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
            // resize={true}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
