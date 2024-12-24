  import React, { useState } from "react";
  import PropTypes from "prop-types";
  import List from "@mui/material/List";
  import { useDispatch } from "react-redux";
  import { deleteCookie } from 'cookies-next';
  import { persistor } from '@/app/store';
  import { useRouter } from "next/navigation";
  import { setToken } from '../../Actions/authActions';
  import {ICONS} from '@/app/utils/icons';

  const UserCard = ({ icon, name, email }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
      dispatch(setToken(null));
      localStorage.removeItem('x-access-token');
      localStorage.removeItem('activeItem');
      localStorage.removeItem('activePath');
      deleteCookie('x-access-token');
      // router.replace('/login');
      //window.location.reload();
      persistor.purge()
      localStorage.removeItem("persist:root");
      router.replace('/login');
    };

    const getInitials = (name) => {
      return name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    };

    const handleOpenDialog = () => {
      setOpen(!open);
    };

    const handleCloseDialog = (action) => {
      setOpen(false);
      if (action === "logout") {
        handleLogout();
      }
    };

    return (
      <div className="relative w-full">
        <div
          className="flex items-center gap-3 border border-stroke -ml-2 rounded-lg px-2 py-2 w-[95%] cursor-pointer"
          onClick={handleOpenDialog}
        >
          {/* Icon Section */}
          <div className="w-8 h-8 flex-shrink-0">
            {icon ? (
              <img
                src={icon}
                alt={`${name} icon`}
                className="w-full h-full object-cover rounded-[8px]"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full rounded-[8px] bg-red-light font-bold text-white text-sm">
                {getInitials(name)}
              </div>
            )}
          </div>

          {/* Name and Email Section */}
          <div className="flex flex-col">
            <p className="text-sm font-semibold truncate">{name}</p>
            <p className="text-xs text-gray-600 truncate">{email}</p>
          </div>
        </div>

        {/* Dialog Component */}
        {open && (
          <div
            className="absolute left-0 bottom-full mb-2 bg-white w-[13.44rem] border rounded-lg shadow-lg z-50"
          >
            <List sx={{ pt: 0 }}>
              {/* <ListItem disablePadding>
                <ListItemButton onClick={() => handleCloseDialog("profile")}>
                  <ListItemText primary="Profile Settings" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleCloseDialog("logout")}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem> */}
              <ul className="px-2 py-2">
              <li className="flex gap-2 mb-2 p-2 hover:bg-gray-2  rounded-lg">
                  {ICONS.profile}
                  <button
                    className="w-full text-sm font-medium  text-left flex items-center text-dark "
                    onClick={() => handleCloseDialog("profile")}
                  >
                    Profile Settings
                  </button>
                </li>
                <li className="flex gap-2 p-2 hover:bg-gray-2  rounded-lg">
                  {ICONS.logout}
                  <button
                    className="w-full text-sm font-medium  text-left flex items-center text-dark "
                    onClick={() => handleCloseDialog("logout")}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </List>
          </div>
        )}
      </div>
    );
  };

  UserCard.propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  export default UserCard;
