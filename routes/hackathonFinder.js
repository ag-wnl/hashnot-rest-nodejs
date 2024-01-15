import  express  from "express";
import { getHackathons } from "../controllers/hackathonfinder.js";

const router = express.Router()

router.get("/", getHackathons)

export default router