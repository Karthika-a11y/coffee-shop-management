import { useEffect, useState } from "react";
const API_URL = "https://coffee-shop-management-6flv.onrender.com";
function AdminMenu() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Coffee");
  const [message, setMessage] = useState("");

  const [menuItems, setMenuItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {fetch(`${API_URL}/api/menu`);

        const data = await response.json();

        if (response.ok) {
          setMenuItems(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMenuItems();
  }, []);

  const updatePrice = async (itemId) => {
    const token = localStorage.getItem("token");

    try {
    const response = await fetch(
  `${API_URL}/api/menu/${itemId}`,
  {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            price: Number(editPrice),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update menu item");
        return;
      }

      setMenuItems((currentItems) =>
        currentItems.map((menuItem) =>
          menuItem._id === itemId ? data.menuItem : menuItem
        )
      );

      setEditingId(null);
      setEditPrice("");

      alert("Menu item updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to update menu item");
    }
  };

  const addMenuItem = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
     const response = await fetch(`${API_URL}/api/menu`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            price: Number(price),
            category,
            available: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add menu item");
        return;
      }

      setMessage("Menu item added successfully!");

      setName("");
      setDescription("");
      setPrice("");
      setCategory("Coffee");

      setMenuItems((currentItems) => [
        data.menuItem,
        ...currentItems,
      ]);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  const deleteMenuItem = async (itemId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/menu/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete menu item");
        return;
      }

      setMenuItems((currentItems) =>
        currentItems.filter(
          (menuItem) => menuItem._id !== itemId
        )
      );

      alert("Menu item deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Unable to delete menu item");
    }
  };

  return (
    <section className="admin-menu">
      <h2>Manage Menu</h2>

      <form onSubmit={addMenuItem}>
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Coffee">Coffee</option>
          <option value="Tea">Tea</option>
          <option value="Snacks">Snacks</option>
          <option value="Desserts">Desserts</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit">
          Add Menu Item
        </button>
      </form>

      {message && <p>{message}</p>}

      <div className="admin-menu-list">
        <h3>Current Menu Items</h3>

        {menuItems.map((item) => (
          <div className="admin-menu-item" key={item._id}>
            <div>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
              <span>
                ₹{item.price} • {item.category}
              </span>
            </div>

            {editingId === item._id ? (
              <div>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(e.target.value)
                  }
                  min="0"
                />

                <button
                  onClick={() => updatePrice(item._id)}
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditPrice("");
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => {
                    setEditingId(item._id);
                    setEditPrice(item.price);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-menu-button"
                  onClick={() =>
                    deleteMenuItem(item._id)
                  }
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminMenu;