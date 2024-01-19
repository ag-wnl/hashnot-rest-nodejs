import  express  from "express";
import { getUser, getUserByUserName, updateUser } from "../controllers/user.js";

const router = express.Router()
   
router.get("/find/:uid", getUser)
router.put("/", updateUser)
router.get("/findUserByUserName/:username", getUserByUserName)

export default router