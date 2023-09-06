import { Typography } from "@material-tailwind/react";
import Container from "../common/container";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t p-8 dark:bg-gray-800 dark:border-gray-800 dark:text-gray-50">
      <Container>
        <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between">
          <img src="/logo.png" alt="logo" className="w-10" />
          <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
            <li>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                About Us
              </Typography>
            </li>
            <li>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                License
              </Typography>
            </li>
            <li>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                Contribute
              </Typography>
            </li>
            <li>
              <Typography
                as="a"
                href="#"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                Contact Us
              </Typography>
            </li>
          </ul>
        </div>
      </Container>
      <hr className="my-8 dark:border-gray-900" />
      <Typography className="text-center font-normal">
        &copy; 2023 2VDev
      </Typography>
    </footer>
  );
};

export default Footer;
