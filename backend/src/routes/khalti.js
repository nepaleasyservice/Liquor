import express from "express";
import axios from "axios";
import Order from "../models/Order.js";
import { PAYMENTMETHOD, PAYMENTSTATUS } from "../utils/constants.js";

const router = express.Router();

const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL;
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;

router.post("/initiate", async (req, res) => {
    const {
        amountPaisa,
        customer_info,
        product_details,
        purchase_order_id,
        purchase_order_name,
    } = req.body;
    try {

        // if (!Number.isInteger(amountPaisa) || amountPaisa < 1000) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Amount must be >= 1000 paisa (Rs 10).",
        //     });
        // }

        const payload = {
            return_url: `${FRONTEND_URL}/khalti/callback`,
            website_url: FRONTEND_URL,
            amount: amountPaisa,
            purchase_order_id,
            purchase_order_name,
            customer_info,
            product_details,
        };

        const resp = await axios.post(
            `${KHALTI_BASE_URL}/epayment/initiate/`,
            payload,
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const pidx = resp.data.pidx;
        await Order.findOneAndUpdate(
            { orderId: purchase_order_id },
            {
                paymentMethod: PAYMENTMETHOD.KHALTI,
                paymentStatus: PAYMENTSTATUS.PENDING,
                "khalti.pidx": pidx,
                "khalti.status": "Initiated",
            }
        );

        return res.json({ success: true, data: resp.data });
    } catch (err) {
        await Order.findOneAndUpdate(
            { orderId: purchase_order_id },
            {
                paymentMethod: PAYMENTMETHOD.KHALTI,
                paymentStatus: PAYMENTSTATUS.FAILED,
                "khalti.status": "Initiated",
            }
        );
        return res.status(400).json({
            success: false,
            message: err?.response?.data || err.message,
        });
    }
});

router.post("/lookup", async (req, res) => {
    try {
        const { pidx } = req.body;

        let data;
        try {
            const resp = await axios.post(
                `${KHALTI_BASE_URL}/epayment/lookup/`,
                { pidx },
                {
                    headers: {
                        Authorization: `Key ${KHALTI_SECRET_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            data = resp.data;
        } catch (err) {
            data = err?.response?.data;
            if (!data) throw err;
        }

        if (data.status === "Completed") {
            await Order.findOneAndUpdate(
                { "khalti.pidx": data.pidx },
                {
                    paymentStatus: PAYMENTSTATUS.SUCCESS,
                    paymentMethod: PAYMENTMETHOD.KHALTI,
                    khalti: {
                        pidx: data.pidx,
                        status: data.status,
                        transaction_id: data.transaction_id,
                        amountPaisa: data.total_amount,
                        raw: data,
                    },
                }
            );
        } else if (["Expired", "User canceled"].includes(data.status)) {
            await Order.findOneAndUpdate(
                { "khalti.pidx": data.pidx },
                {
                    paymentStatus: PAYMENTSTATUS.FAILED,
                    khalti: {
                        pidx: data.pidx,
                        status: data.status,
                        raw: data,
                    },
                }
            );
        } else {
            await Order.findOneAndUpdate(
                { "khalti.pidx": data.pidx },
                { "khalti.status": data.status, "khalti.raw": data }
            );
        }

        return res.json({ success: true, data });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err?.response?.data || err.message,
        });
    }
});


export default router;