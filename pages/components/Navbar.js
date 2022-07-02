import Link from "next/link";
import React, { useState, useEffect } from "react";
import "../../configureAmplify";
import { Auth, Hub } from "aws-amplify";

const menuItems = [
  {
    name: "Home",
    url: "/",
    authRequired: false,
  },
  {
    name: "Create Post",
    url: "/create-post",
    authRequired: false,
  },
  {
    name: "Profile",
    url: "/profile",
    authRequired: false,
  },
  {
    name: "My Post",
    url: "/profile",
    authRequired: true,
  },
];

const NavBar = () => {
  const [isUserLoggedIn, SetUserLoggedIn] = useState(false);

  useEffect(() => {
    const authListener = async () => {
      Hub.listen("auth", (data) => {
        switch (data.payload.event) {
          case "signIn":
            return SetUserLoggedIn(true);
          case "signIn":
            return SetUserLoggedIn(false);
          default:
            return SetUserLoggedIn(false);
        }
      });

      try {
        await Auth.currentAuthenticatedUser();
        SetUserLoggedIn(true);
      } catch (err) {
        console.log(err);
      }
    };
    authListener();
  }, []);

  return (
    <nav className="flex justify-center pt-3 pb-3 space-x-4 border-b bg-cyan-500 border-gray-300">
      {menuItems.map(
        (item, index) =>
          (!item.authRequired || !!isUserLoggedIn) && (
            <Link href={item.url} key={index}>
              <a className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slat e-100 hover:text-slate-900">
                {item.name}
              </a>
            </Link>
          )
      )}
    </nav>
  );
};

export default NavBar;
