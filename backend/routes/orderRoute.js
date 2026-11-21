import express from "express"
import authMiddleware from  "../middleware/auth.js"
import { userOrders, placeOrder, verifyOrder,listOrders,updateStatus } from "../controllers/orderController.js"

const orderRouter = express.Router();
const userOrdersRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder)
orderRouter.post("/userOrders",authMiddleware,userOrders)
userOrdersRouter.post("/",authMiddleware,userOrders)
orderRouter.get('/list',listOrders)
orderRouter.post("/status",updateStatus)

export { userOrdersRouter };
export default orderRouter;