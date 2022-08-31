const mongoose = require("mongoose");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const Admin = require("../../Models/admin");
const Upload = require("../../service/upload");
const { Validator } = require("node-input-validator");
const User = require("../../Models/user");
function createToken(data) {
  return jwt.sign(data, "admintoken");
}

const getTokenData = async (token) => {
  let adminData = Admin.findOne({ token: token }).exec();
  return adminData;
};

const register = async (req, res) => {
  let v = new Validator(req.body, {
    email: "required|email",
    password: "required",
  });

  let checked = await v.check().then((val) => val);

  if (!checked) {
    res.status(200).json({
      status: false,
      err: v.errors,
    });
  }

  Admin.findOne({ email: req.body.email }).then(async (data) => {
    if (data == null || data == "") {
      let adminData = {
        _id: mongoose.Types.ObjectId(),
        fullname: req.body.fullname,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        token: createToken(req.body),
        created_at: Date.now(),
      };

      if (
        req.body.mobile != "" ||
        req.body.mobile != null ||
        typeof req.body.mobile != "undefined"
      ) {
        adminData.mobile = req.body.mobile;
      }
      if (
        req.body.address != "" ||
        req.body.address != null ||
        typeof req.body.address != "undefined"
      ) {
        adminData.address = req.body.address;
      }

      if (
        req.body.image != "" ||
        req.body.image != null ||
        typeof req.body.image != "undefined"
      ) {
        adminData.image = req.body.image;
      }

      let admin = new Admin(adminData);
      admin
        .save()
        .then((result) => {
          res.status(200).json({
            status: true,
            success: true,
            message: "New admin created successfully",
            data: result,
          });
        })
        .catch((err) => {
          res.status(200).json({
            status: false,
            success: false,
            message: "Server error. Please try again.",
            error: err,
          });
        });
    } else {
      res.status(400).json({
        status: false,
        message: "Email is already registered.",
      });
    }
  });
};

const login = async (req, res) => {
  let v = new Validator(req.body, {
    email: "required|email",
    password: "required",
  });

  let checked = await v.check().then((data) => data);
  if (!checked) {
    return res.status(400).json({
      status: false,
      error: v.errors,
    });
  }

  Admin.findOne({ email: req.body.email }).then((data) => {
    if (data == null || data == "") {
      res.status(400).json({
        status: false,
        message: "Invalid Email",
      });
    } else if (
      data != null &&
      data != "" &&
      data.comparePassword(req.body.password)
    ) {
      res.status(200).json({
        status: true,
        message: "Successfully Logged in",
        data: data,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Invalid password",
      });
    }
  });
};

const uploadImage = async (req, res) => {
  let image_file = "";
  let image_url = await Upload.uploadfile(req, "admin");
  if (req.file != null && req.file != "" && typeof req.file != "undefined") {
    image_file = image_url;

    res.status(200).json({
      status: true,
      image: image_file,
      error: null,
    });
  }
};
const viewAllUserProfile = async (req, res) => {
  return User.aggregate([
    {
      $project: { __v: 0 },
    },
  ])
    .then((profile) => {
      res.status(200).json({
        status: true,
        message: "Users get successfully",
        data: profile,
      });
    })
    .catch((err) => {
      res.status(400).json({
        status: false,
        message: "Server error. Data not available",
      });
    });
};

module.exports = {
  getTokenData,
  register,
  login,
  uploadImage,
  viewAllUserProfile,
};
