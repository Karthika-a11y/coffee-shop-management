function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;