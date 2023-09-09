import  express  from "express";
import { getVotes, addVote, deleteVote } from "../controllers/upvote.js";


const router = express.Router()
   
router.get("/", getVotes)
router.post("/", addVote)
router.delete("/", deleteVote)

export default router