import  express  from "express";
import { getSkills } from "../controllers/skills.js";

const router = express.Router()
   
router.get("/", getSkills)

export default router