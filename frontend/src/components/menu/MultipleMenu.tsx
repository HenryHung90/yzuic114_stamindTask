import React, {useState} from "react";
// style
import {Menu, MenuHandler, MenuItem, MenuList} from "@material-tailwind/react";
import {ChevronUpIcon} from "@heroicons/react/24/solid";

// API

// components

// interface
interface IMultipleMenu {
  menuTitle: string;
  menuItems: Array<{
    name: string;
    handleClick?: React.MouseEventHandler<HTMLButtonElement | HTMLLIElement>
  }>
}

const MultipleMenuComponent = (props: IMultipleMenu) => {
  const {menuTitle, menuItems} = props
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Menu
      placement="right-start"
      open={openMenu}
      handler={setOpenMenu}
      allowHover
      offset={15}
    >
      <MenuHandler className="flex items-center justify-between">
        <MenuItem placeholder={undefined}>
          {menuTitle}
          <ChevronUpIcon
            strokeWidth={2.5}
            className={`h-3.5 w-3.5 transition-transform ${
              openMenu ? "rotate-90" : ""
            }`}
          />
        </MenuItem>
      </MenuHandler>
      <MenuList placeholder={undefined}>
        {menuItems.map(({handleClick, name}, index) => (
          <MenuItem key={index} onClick={handleClick} placeholder={undefined}>{name}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
export default MultipleMenuComponent;