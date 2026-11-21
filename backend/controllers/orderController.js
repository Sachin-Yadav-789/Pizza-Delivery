import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Razorpay from "razorpay"
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js"

// placing user order for frontend

const placeOrder = async(req,res) => {

   try {
    const frontendUrl = process.env.FRONTEND_URL || req.get("origin");
    if (!frontendUrl) {
      throw new Error("FRONTEND_URL must be configured to redirect after payment");
    }

    const newOrder = new orderModel({
        userId:req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address,
   })
    await newOrder.save();
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });
    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(newOrder.amount * 100),
      currency: "INR",
      accept_partial: false,
      reference_id: newOrder._id.toString(),
      description: `Pizza order ${newOrder._id}`,
      callback_url: `${frontendUrl.replace(/\/$/, "")}/verify`,
      callback_method: "get",
      customer: {
        name: `${req.body.address.firstName} ${req.body.address.lastName}`,
        email: req.body.address.email,
        contact: req.body.address.phone,
      },
      notify: { sms: false, email: false },
      reminder_enable: false,
    });

    newOrder.paymentLinkId = paymentLink.id;
    await newOrder.save();

    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    res.json({ success: true, session_url: paymentLink.short_url });

   }  catch (error) {
        const message = error?.error?.description || error?.message || "Unable to start payment";
        console.error("Payment link creation failed:", message);
        res.status(500).json({success:false,message})
   }
 }

 const verifyOrder = async (req,res) => {
    try {
       const {
          razorpay_payment_id: payment_id,
          razorpay_payment_link_id: payment_link_id,
          razorpay_payment_link_reference_id: payment_link_reference_id,
          razorpay_payment_link_status: payment_link_status,
          razorpay_signature
       } = req.body;

       if (
          !payment_id ||
          !payment_link_id ||
          !payment_link_reference_id ||
          !payment_link_status ||
          !razorpay_signature ||
          !process.env.RAZORPAY_SECRET_KEY
       ) {
          return res.status(400).json({success:false,message:"Payment callback is incomplete"});
       }

       const order = await orderModel.findById(payment_link_reference_id);
       if (!order || order.paymentLinkId !== payment_link_id) {
          return res.status(400).json({success:false,message:"Payment link does not match the order"});
       }

       const signatureValid = validatePaymentVerification(
          { payment_id, payment_link_id, payment_link_reference_id, payment_link_status },
          razorpay_signature,
          process.env.RAZORPAY_SECRET_KEY
       );

       if (!signatureValid || payment_link_status !== "paid") {
          return res.status(400).json({success:false,message:"Payment could not be verified"});
       }

       order.payment = true;
       await order.save();

       return res.json({success:true,message:"paid"});
    } catch (error) {
       console.error("Payment verification failed:", error);
       return res.status(500).json({success:false,message:"Payment verification failed"});
    }
 }

//user orders for frontend
   const userOrders = async(req,res) => {
      try {
         const orders = await orderModel.find({userId:req.body.userId});
         res.json({success:true,data:orders})
      } catch (error) {
          console.log(error);
          res.json({success:false,message:"Error"})
      }
   }

 //Listing orders for admin pannel
  const listOrders = async (req,res) => {
     try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
     }
  }


 //api for updating order status
 const updateStatus = async (req,res) => {
    try {
       await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
       res.json({success:true,message:"Status Updated"})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
    }
 }


 export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}
