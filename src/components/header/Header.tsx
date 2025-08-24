// styles
import "./header.scss";

// hooks | libraries
import { ReactElement, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../context/user/UserContext.tsx";

export default function Header(): ReactElement {
  const location = useLocation();
  const isAuthRoute: boolean = location.pathname === "/auth";
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <Link
        to={isAuthRoute ? "/auth" : "/home"}
        title={isAuthRoute ? "" : "Home"}
      >
        <h1>
          <span className={"what"}>What</span> a{" "}
          <span className={"tool"}>tool!</span>
        </h1>
      </Link>
      {user && !isAuthRoute && (
        <div className="userInfo">
          <span>Bonjour {user.firstName}</span>
          <button onClick={handleLogout} className="logoutButton">
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}
