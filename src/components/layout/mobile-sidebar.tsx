import React from "react";
import { Drawer, Button } from "@material-tailwind/react";
import Sidebar from "./sidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";

const MobileSidebar = () => {
  const [open, setOpen] = React.useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <>
      <Button onClick={openDrawer} className="xl:hidden mr-2">
        <Bars3Icon className="w-5 h-5" />
      </Button>
      <Drawer open={open} onClose={closeDrawer}>
        <Sidebar />
      </Drawer>
    </>
  );
};

export default MobileSidebar;
