const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware")

const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const order = await Order.create({
      user: decoded.id,
      items,
      totalAmount,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// Get logged-in user's orders
router.get("/my-orders", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const orders = await Order.find({
      user: decoded.id,
    })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});
// Admin: Dashboard statistics
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();

      const completedOrders = await Order.countDocuments({
        status: "Completed",
      });

      const revenueResult = await Order.aggregate([
        {
          $match: {
            status: "Completed",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]);

      const totalRevenue =
        revenueResult.length > 0
          ? revenueResult[0].totalRevenue
          : 0;

      res.json({
        totalOrders,
        completedOrders,
        totalRevenue,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch dashboard statistics",
      });
    }
  }
);
// Admin: Get all orders
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email")
        .populate("items.menuItem")
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch all orders",
        error: error.message,
      });
    }
  }
);

// Admin: Update order status
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }
);
module.exports = router;