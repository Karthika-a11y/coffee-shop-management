console.log("MENU ROUTES LOADED");
const express = require("express");
const MenuItem = require("../models/MenuItem");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();


// Get all available menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ available: true }).sort({
      createdAt: -1,
    });

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch menu items",
      error: error.message,
    });
  }
});

// Add a new menu item
router.post("/", authMiddleware,
  adminMiddleware,async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        message: "Please provide name, description, price and category",
      });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image,
      available,
    });

    res.status(201).json({
      message: "Menu item added successfully",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add menu item",
      error: error.message,
    });
  }
});

// Update a menu item
router.put("/:id",authMiddleware,
  adminMiddleware, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.json({
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update menu item",
      error: error.message,
    });
  }
});

// Delete a menu item
router.delete("/:id",authMiddleware,
  adminMiddleware, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete menu item",
      error: error.message,
    });
  }
});

module.exports = router;