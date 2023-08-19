import { Button, Typography } from "@material-tailwind/react";

const NotFoundPage = () => {
  return (
    <div className="relative">
      <img src="/404.gif" alt="gif" className="border" />

      <div className="absolute top-0 font-bold">
        <Typography className="text-6xl">Page Not Found</Typography>
        <Typography className="text-3xl">Oh No! Error 404</Typography>
        <Button>Back to home page</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
