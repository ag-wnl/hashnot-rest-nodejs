import  express  from "express";
import { getChats, postChats, getChatList } from "../controllers/chats.js";

const router = express.Router()
   

router.get("/", getChats);
router.get("/getChatList/", getChatList);
router.post("/", postChats);

export default router