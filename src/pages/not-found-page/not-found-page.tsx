import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <img src="/404.gif" alt="gif" />

      <div className="absolute w-full top-0 text-center backdrop-blur-[1px]">
        <Typography className="text-xl md:text-3xl font-bold">
          Oh No! Error 404
        </Typography>
        <Typography className="md:text-xl font-bold">
          Sorry we couldn't find the page you're looking for
        </Typography>
      </div>
      <div className="absolute w-full bottom-0 flex justify-center">
        <Button onClick={() => navigate("/")}>Back to home page</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
