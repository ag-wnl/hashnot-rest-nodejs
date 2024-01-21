import  express  from "express";
import { getRelations, addRelations, deleteRelations } from "../controllers/relation.js";
import {verifyFirebaseToken} from "../middleware/firebaseAuthMiddleware.js"

const router = express.Router()
   
router.get("/", verifyFirebaseToken, getRelations)
router.post("/", verifyFirebaseToken, addRelations)
router.delete("/", verifyFirebaseToken, deleteRelations)

export default router