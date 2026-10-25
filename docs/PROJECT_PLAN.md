# Coffee Shop Management System

## 1. Project Overview

The Coffee Shop Management System is a MERN Stack web application designed to manage coffee shop menu items, customer orders, and basic shop administration.

The system will have two main types of users:

- Customer
- Admin

## 2. Main Objectives

- Allow customers to browse the coffee shop menu.
- Allow customers to search and filter menu items.
- Allow customers to add items to a cart.
- Allow customers to place orders.
- Allow customers to view their order history and order status.
- Allow admins to manage menu items.
- Allow admins to view and manage customer orders.
- Provide a simple dashboard for the administrator.

## 3. User Features

### Customer

- Register an account
- Login and logout
- View menu
- Search menu items
- Filter menu items by category
- View item details
- Add items to cart
- Update cart quantity
- Remove items from cart
- Place an order
- View previous orders
- View order status

### Admin

- Admin login
- View dashboard
- Add menu items
- Edit menu items
- Delete menu items
- View customer orders
- Update order status

## 4. Main Pages

### Customer Pages

1. Home
2. Menu
3. Login
4. Register
5. Cart
6. Checkout
7. My Orders
8. Order Details

### Admin Pages

1. Admin Login
2. Admin Dashboard
3. Manage Menu
4. Add Menu Item
5. Edit Menu Item
6. Manage Orders

## 5. Database Collections

### User

- name
- email
- password
- role

### MenuItem

- name
- description
- price
- category
- image
- availability

### Order

- user
- items
- totalAmount
- status
- createdAt

## 6. Order Status

Orders will use the following statuses:

- Pending
- Confirmed
- Preparing
- Ready
- Completed
- Cancelled

## 7. Technology Stack

### Frontend

- React
- React Router
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- Password hashing

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman

## 8. Main API Features

### Authentication

- Register
- Login
- Get current user

### Menu

- Get all menu items
- Get menu item
- Add menu item
- Update menu item
- Delete menu item

### Orders

- Create order
- Get customer's orders
- Get all orders for admin
- Update order status

### Dashboard

- Total orders
- Total menu items
- Basic sales/order statistics

## 9. Project Structure

The project will be organized into:

- `client` — React frontend
- `server` — Node.js and Express backend
- `docs` — Project documentation
- `screenshots` — Screenshots for final submission

## 10. Final Submission

The final project will include:

- Working MERN Stack application
- GitHub repository
- Hosted project
- Project documentation/report
- Screenshots of major application screens
- README file with setup instructions