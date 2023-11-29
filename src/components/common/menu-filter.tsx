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
  selected: string;
  handleChange: (value: string) => void;
}

const MenuFilter: React.FC<MenuFilterProps> = ({
  content,
  selected,
  handleChange,
}) => {
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
        <IconButton
          className="mr-5 w-20 h-20 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-300"
          variant="outlined"
        >
          <AdjustmentsHorizontalIcon className="w-6 h-6 transition-transform hover:rotate-180" />
        </IconButton>
      </MenuHandler>
      <MenuList className="min-w-10 space-y-1 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300">
        {content.map((type, key) => (
          <MenuItem
            className={`flex items-center justify-between gap-2 ${
              selected === type.value && "bg-gray-200 font-bold text-gray-900"
            }`}
            key={key}
            onClick={() => handleChange(type.value)}
          >
            {t(`menu.${type.label}`)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default MenuFilter;
