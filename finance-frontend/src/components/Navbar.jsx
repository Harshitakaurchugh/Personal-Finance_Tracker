import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ padding: "10px", background: "#eee" }}>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/add")}>Add</button>
      <button onClick={() => {
        logout();
        navigate("/login");
      }}>Logout</button>
    </div>
  );
};

export default Navbar;