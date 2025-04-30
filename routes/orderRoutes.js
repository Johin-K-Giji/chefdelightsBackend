const express = require("express")
const router = express.Router()

const {getOrders,updateOrderStatus} = require("../controllers/orderController")

router.get("/getorder",getOrders)
router.put("/update-order",updateOrderStatus)


module.exports = router