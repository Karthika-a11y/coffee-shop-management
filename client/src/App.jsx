import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./App.css";
import Orders from "./Orders";
import AdminDashboard from "./AdminDashboard";
import AdminMenu from "./AdminMenu";
import Logout from "./Logout";

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        return response.json();
      })
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load menu");
        setLoading(false);
      });
  }, []);

  const addToCart = (item) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== id)
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const placeOrder = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login before placing an order.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cartTotal,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to place order");
      return;
    }

    alert("Order placed successfully!");
    setCart([]);
  } catch (error) {
    console.error(error);
    alert("Unable to place order.");
  }
};
return (
 <div className="app">
  <Login />
  <Register />
<Logout />
   
      <header className="header">
        <h1>☕ Coffee House</h1>
        <p>Fresh coffee, delicious moments.</p>
      </header>

      <main className="container">
        <div className="cart-summary">
          🛒 Cart: {cart.length} item(s) | Total: ₹{cartTotal}
        </div>

        <h2>Our Menu</h2>
<div className="filters">
  <input
    type="text"
    placeholder="Search menu..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="All">All Categories</option>
    <option value="Coffee">Coffee</option>
    <option value="Tea">Tea</option>
    <option value="Snacks">Snacks</option>
    <option value="Desserts">Desserts</option>
  </select>
</div>
        {loading && <p className="message">Loading menu...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && menuItems.length === 0 && (
          <p className="message">No menu items available.</p>
        )}

       <div className="menu-grid">
  {menuItems
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) =>
      category === "All" ? true : item.category === category
    )
    .map((item) => (
            <div className="menu-card" key={item._id}>
              <div className="coffee-icon">☕</div>

              <div className="menu-content">
                <h3>{item.name}</h3>

                <p className="description">
                  {item.description}
                </p>

                <p className="category">{item.category}</p>

                <div className="card-bottom">
                  <span className="price">₹{item.price}</span>

                  <button
                    className="add-button"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <section className="cart-section">
            <h2>Your Cart</h2>

            {cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
           

            <h3 className="cart-total">
              Total: ₹{cartTotal}
            </h3>
            <button className="order-button" onClick={placeOrder}>
  Place Order
</button>
          </section>
        )}
        <Orders />

{JSON.parse(localStorage.getItem("user"))?.role === "admin" && (
  <>
    <AdminDashboard />
    <AdminMenu />
  </>
)}
      </main>
    </div>
  );
}

export default App;