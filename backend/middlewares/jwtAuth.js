import jwt from "jsonwebtoken";
import UserModel from "../features/User/user.schema.js";

export const auth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  console.log(authorizationHeader)
  if (!authorizationHeader) {
    return res.status(401).json({ error: "Unauthorized! Bearer token missing." });
  }
  const token = authorizationHeader;
  try {
    const decoded = jwt.verify(token,  process.env.SECRETKEY);
    const user = await UserModel.findOne({
      _id: decoded._id,
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized! Invalid token." });
    }
    req.user = user;
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized! Invalid token." });
  }
};