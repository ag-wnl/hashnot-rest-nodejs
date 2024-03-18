import  express  from "express";
import { getPosts, getCurrentUserPosts, addPost, deletePost } from "../controllers/post.js";
import {verifyFirebaseToken} from "../middleware/firebaseAuthMiddleware.js"
const router = express.Router()
   

router.get("/", getPosts)
router.get("/UserPosts", getCurrentUserPosts)
router.post("/", addPost)
router.delete("/:id",  deletePost);

export default router