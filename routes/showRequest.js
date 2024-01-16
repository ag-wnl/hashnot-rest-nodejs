import  express  from "express";
import { getRequests } from "../controllers/showRequests.js";

const router = express.Router()
   

router.get("/", getRequests)

export default router