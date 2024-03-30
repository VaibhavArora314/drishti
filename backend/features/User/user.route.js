import express from "express";
import {
  userDetails,
  userLogin,
  userRegisteration,
  userSosEmails,
  userSosEmailsUpdation,
  userSosEmergency
} from "./user.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.post("/signup", userRegisteration);
router.post("/signin", userLogin);
router.get("/get-details", auth, userDetails);
router.get("/get-sos-emails", auth, userSosEmails);
router.post("/set-sos-emails", auth, userSosEmailsUpdation);
router.post("/sos-detected/:longitude/:latitude", auth, userSosEmergency);

export default router;