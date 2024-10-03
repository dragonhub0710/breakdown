import React from "react";
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "@/actions/auth";

const Header = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleSignOut = () => {
    dispatch(signout());
  };

  const navList = (
    <MenuList className="min-w-[150px] rounded-xl border-none bg-[white] shadow-[0_10px_20px_10px_rgb(0,0,0)]">
      <MenuItem>
        <div onClick={handleSignOut} className="flex items-center gap-3">
          <div className="h-auto w-[18px] rounded-none text-[#26262b]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6562 12.25V13.5C10.6562 14.5355 9.81678 15.375 8.78125 15.375H2.5C1.46447 15.375 0.625 14.5355 0.625 13.5V2.5C0.625 1.46447 1.46447 0.625002 2.5 0.625002H8.78125C9.81678 0.625002 10.6562 1.46447 10.6562 2.5V3.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.2187 8.03125H6.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.7008 10.0938L15.1004 8.69416C15.4665 8.32803 15.4665 7.73447 15.1004 7.36834L13.7008 5.96875"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Typography className="text-base text-[#26262b]">Sign Out</Typography>
        </div>
      </MenuItem>
    </MenuList>
  );

  return (
    <div className="fixed top-0 z-40 flex h-[80px] w-full border-b-[2px] bg-white">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="hidden w-24 lg:block"></div>
        <a href="/">
          <Typography className="font-custom text-lg font-semibold uppercase tracking-[0.05em] text-black">
            BREAKDOWN BOT
          </Typography>
        </a>
        {auth.isAuthenticated ? (
          <Menu
            placement="bottom-end"
            animate={{
              mount: { y: 10 },
              unmount: { y: 0 },
            }}
          >
            <MenuHandler>
              <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#4728f8] text-lg font-medium uppercase text-white hover:shadow-lg">
                {auth.user.firstname[0]}
                {auth.user.lastname[0]}
              </div>
            </MenuHandler>
            {navList}
          </Menu>
        ) : (
          <a href="/signin">
            <div className="text-md flex h-12 w-24 cursor-pointer items-center justify-center rounded-full bg-[#4728f8] font-medium text-white hover:shadow-lg">
              Sign In
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default Header;
