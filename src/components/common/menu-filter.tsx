import { t } from "i18next";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import {
  Menu,
  MenuHandler,
  IconButton,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

interface MenuFilterProps {
  content: {
    label: string;
    value: string;
  }[];
  handleChange: (value: string) => void;
}

const MenuFilter: React.FC<MenuFilterProps> = ({ content, handleChange }) => {
  return (
    <Menu
      placement="bottom-end"
      allowHover
      animate={{
        mount: { y: 0 },
        unmount: { y: 25 },
      }}
    >
      <MenuHandler>
        <IconButton className="mr-5 mb-1" size="sm" variant="outlined">
          <AdjustmentsHorizontalIcon className="w-6 h-6 transition-transform hover:rotate-180" />
        </IconButton>
      </MenuHandler>
      <MenuList className="min-w-10">
        {content.map((type, key) => (
          <MenuItem
            key={key}
            className="capitalize"
            onClick={() => handleChange(type.value)}
          >
            {t(`${type.label}`)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default MenuFilter;
