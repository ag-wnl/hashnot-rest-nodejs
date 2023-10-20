import  express  from "express";
import { getLinkPreview } from "../controllers/linkprevs.js";

const router = express.Router()
   

router.get("/", getLinkPreview)

export default router