"use strict";

const user = {};

// const UserController = require("../Controller/Auth/User");
// const AdminController = require("../Controller/Auth/Admin");

const permission = [
  {
    url: "/user/register",
  },
  {
    url: "/user/profileimage",
  },
  {
    url: "/user/login",
  },
  {
    url: "/admin/register",
  },
  {
    url: "/admin/uploadimage",
  },
  {
    url: "/admin/login",
  },
];

user.middleware = async (req, res, next) => {
  console.log(req.url);
  if (permission.filter((val) => val.url == req.url).length > 0) {
    next();
  } else {
    if (!req.headers.authorization) {
      return res.status(200).json({
        error: "No credentials sent!",
        status: false,
        credentials: false,
      });
    } else {
      let authorization = req.headers.authorization;
      let userData = null;
      let userType =
        typeof req.headers.userType != "undefined"
          ? req.headers.userType
          : "User";
      if (userType == "User") {
        userData = UserController.getTokenData(authorization);
      }

      if (userType == "Admin") {
        userData = AdminController.getTokenData(authorization);
      }

      if (userData && userData != null) {
        userData.password = null;
        userData.token = null;
        req.user = userData;
        req.userType = userType;
        (req.token = req.headers.authorization), next();
      } else {
        res.status(200).json({
          error: "credentials not match",
          status: false,
          credentials: false,
        });
      }
    }
  }
};

module.exports = user;
