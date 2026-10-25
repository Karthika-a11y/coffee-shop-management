import { useEffect, useState } from "react";
const API_URL = "https://coffee-shop-management-6flv.onrender.com";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/orders/my-orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Orders response:", response.status, data);

        if (!response.ok) {
          setMessage(data.message || "Failed to load orders");
          setLoading(false);
          return;
        }

        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setMessage("Unable to connect to server");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="message">Loading your orders...</p>;
  }

  if (message) {
    return <p className="error">{message}</p>;
  }

  return (
    <section className="orders-section">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p className="message">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-header">
              <strong>Order #{order._id.slice(-6)}</strong>
              <span>{order.status}</span>
            </div>

            {order.items.map((item, index) => (
              <div className="order-item" key={index}>
                <span>
                  {item.menuItem?.name || "Menu item"} × {item.quantity}
                </span>

                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="order-total">
              Total: ₹{order.totalAmount}
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default Orders;