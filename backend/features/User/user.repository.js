import UserModel from "./user.schema.js";
import { compareHashedPassword } from "../../utils/hashPassword.js";

export const userRegisterationRepo = async (userData) => {
  try {
    const isUserExist = await UserModel.findOne({ email: userData.email });
    if (isUserExist) throw new Error("User Already Exist");
    const newUser = new UserModel(userData);
    await newUser.save();
    return { success: true, res: newUser };
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
};

export const userLoginRepo = async (userData) => {
  try {
    const { email, password } = userData;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      let passwordValidation = await compareHashedPassword(
        password,
        user.password
      );
      if (passwordValidation) {
        return { success: true, res: user };
      } else {
        return {
          success: false,
          error: { statusCode: 400, msg: "invalid credentials" },
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};