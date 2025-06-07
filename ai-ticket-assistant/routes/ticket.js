import express from "express"
import {authenticate} from "../middlewares/auth.js"
import { getTicket , getTickets , createTicket} from "../controllers/ticket.js"

const router = express.Router()

router.get("/" , authenticate , getTickets); 
router.get("/:id" , authenticate , getTicket); 
router.post("/" , authenticate , createTicket);

export default router 
