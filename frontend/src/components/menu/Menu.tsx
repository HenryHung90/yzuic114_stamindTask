import React, {useState} from "react";
// style
import {Button, Menu, MenuHandler, MenuItem, MenuList} from "@material-tailwind/react";
import {ChevronUpIcon} from "@heroicons/react/24/solid";

// API

// components

// interface
interface IMenuProps {
  menuHandler: string;
  menuItems: Array<IMenuItems>
}

interface IMenuItems {
  name?: string;
  handleClick?: React.MouseEventHandler<HTMLButtonElement | HTMLLIElement>;
  subMenu?: JSX.Element;
}

const MenuComponent = (props: IMenuProps) => {
  const {menuHandler, menuItems} = props

  return (
    <Menu>
      <MenuHandler>
        <Button placeholder={undefined}>{menuHandler}</Button>
      </MenuHandler>
      <MenuList placeholder={undefined}>
        {menuItems.map(({name, handleClick, subMenu}, index) => (
          subMenu === undefined ?
            <MenuItem key={index} placeholder={undefined} onClick={handleClick}>{name}</MenuItem> :
            React.Children.map(subMenu, (child, subIndex) =>
              React.cloneElement(child, {key: `${index}-${subIndex}`}) // 為子元素添加唯一的 key
            )
        ))}
      </MenuList>
    </Menu>
  )
}
export type {IMenuItems}
export default MenuComponent;