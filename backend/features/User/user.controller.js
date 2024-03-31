import { userLoginRepo, userRegisterationRepo } from "./user.repository.js";
import { customErrorHandler } from "../../utils/errorHandler.js";
import { hashPassword } from "../../utils/hashPassword.js";
import jwt from "jsonwebtoken";
import UserModel from "./user.schema.js";
import { sendEmails } from "../../utils/SOS_Email_Sender.js";

export const userRegisteration = async (req, res, next) => {
  const hashedPassword = await hashPassword(req.body.password);
  const resp = await userRegisterationRepo({
    ...req.body,
    password: hashedPassword,
  });
  if (resp.success) {
    res.status(201).json({
      success: true,
      msg: "user registration successful",
      res: resp.res,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const resp = await userLoginRepo(req.body);

    if (resp.success) {
      const token = jwt.sign({ _id: resp.res._id }, process.env.SECRETKEY, {
        expiresIn: "1h",
      });
      console.log(token);
      res.json({ success: true, msg: "User login successful", token, user: {
        _id: resp.res._id,
        name: resp.res.name,
        email: resp.res.email,
      } });
    } else {
      if (resp.error.statusCode) {
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      } else {
        next(new customErrorHandler(500, "Internal Server Error"));
      }
    }
  } catch (error) {
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};

export const userDetails = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({ success: true, user });
  } catch (error) {
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};
export const userSosEmails = async (req, res, next) => {
  try {
    const SOS_EMAILS = req.user.SOSEmails;
    res.json({ success: true, SOS_EMAILS });
  } catch (error) {
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};
export const userSosEmailsUpdation = async (req, res, next) => {
  try {
    const SOS_EMAILS = req.body.emails;
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.SOSEmails = SOS_EMAILS;
    await user.save();

    res.json({ success: true, SOS_EMAILS });
  } catch (error) {
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};

export const userSosEmergency = async (req, res, next) => {
  try {
    const SOS_EMAILS = req.user.SOSEmails;
    const userName = req.user.name;
    

    const { longitude, latitude } = req.params;

    await sendEmails(
      SOS_EMAILS,
      "SOS Emergency",
      `This is an SOS emergency call from ${userName}`,
      parseFloat(latitude),
      parseFloat(longitude)
    );

    res.json({ success: true, SOS_EMAILS });
  } catch (error) {
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};