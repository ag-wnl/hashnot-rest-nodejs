import  express  from "express";
import { searchPosts } from "../controllers/searches.js";

const router = express.Router()
   

router.get("/", searchPosts)

export default router