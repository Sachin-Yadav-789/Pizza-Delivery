import { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import "./Verify.css"
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const Verify = () => {
     const [searchParams] = useSearchParams();
     const {url} = useContext(StoreContext);
     const navigate = useNavigate();
     const [message, setMessage] = useState("Verifying your payment...");

     const paymentId = searchParams.get("razorpay_payment_id");
     const paymentLinkId = searchParams.get("razorpay_payment_link_id");
     const paymentLinkReferenceId = searchParams.get("razorpay_payment_link_reference_id");
     const paymentLinkStatus = searchParams.get("razorpay_payment_link_status");
     const signature = searchParams.get("razorpay_signature");

     useEffect(() => {
        const verifyPayment = async () => {
           try {
              const paymentData = {
                 razorpay_payment_id: paymentId,
                 razorpay_payment_link_id: paymentLinkId,
                 razorpay_payment_link_reference_id: paymentLinkReferenceId,
                 razorpay_payment_link_status: paymentLinkStatus,
                 razorpay_signature: signature
              };
              const response = await axios.post(`${url}/api/order/verify`, paymentData);
              if (response.data.success) {
                 navigate("/myorders", { replace: true });
              } else {
                 setMessage(response.data.message || "Payment could not be verified.");
              }
           } catch (error) {
              setMessage(error.response?.data?.message || "Payment verification failed. Please contact support.");
           }
        };

        verifyPayment();
     }, [url, navigate, paymentId, paymentLinkId, paymentLinkReferenceId, paymentLinkStatus, signature]);


   return (
    <div className='verify'>
        {message === "Verifying your payment..." && <div className="spinner" />}
        <p>{message}</p>
    </div>
  )
}

export default Verify
