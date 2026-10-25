import { useEffect, useState } from "react";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
const [stats, setStats] = useState({
  totalOrders: 0,
  completedOrders: 0,
  totalRevenue: 0,
});
const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load orders");
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };
const fetchStats = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://localhost:5000/api/orders/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Failed to load statistics");
      return;
    }

    setStats(data);
  } catch (error) {
    console.error(error);
    setMessage("Unable to load dashboard statistics");
  }
};
 useEffect(() => {
  fetchOrders();
  fetchStats();
}, []);

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update status");
        return;
      }

      alert("Order status updated!");
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Unable to update order status");
    }
  };

  return (
    <section className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="stats-container">
  <div className="stat-card">
    <h3>Total Orders</h3>
    <p>{stats.totalOrders}</p>
  </div>

  <div className="stat-card">
    <h3>Completed Orders</h3>
    <p>{stats.completedOrders}</p>
  </div>

  <div className="stat-card">
    <h3>Total Revenue</h3>
    <p>₹{stats.totalRevenue}</p>
  </div>
</div>

      {message && <p className="error">{message}</p>}

      {orders.length === 0 ? (
        <p className="message">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div className="admin-order-card" key={order._id}>
            <div className="admin-order-header">
              <strong>Order #{order._id.slice(-6)}</strong>
              <span>{order.status}</span>
            </div>

            <p>
              Customer: {order.user?.name || "Unknown"}
            </p>

            <p>
              Email: {order.user?.email || "Unknown"}
            </p>

            {order.items.map((item, index) => (
              <div className="admin-order-item" key={index}>
                {item.menuItem?.name || "Menu item"} × {item.quantity}
              </div>
            ))}

            <p className="admin-order-total">
              Total: ₹{order.totalAmount}
            </p>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
            >
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready">Ready</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ))
      )}
    </section>
  );
}

export default AdminDashboard;