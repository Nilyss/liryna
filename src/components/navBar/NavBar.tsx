// styles
import "./navBar.scss";

// hooks | libraries
import { ReactElement, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar(): ReactElement {
  const location = useLocation();
  const [showUtilsDropdown, setShowUtilsDropdown] = useState(false);
  
  const isWebDev: boolean = location.pathname.includes("web_dev");
  const isUtils: boolean = location.pathname.includes("utils");
  const isHome: boolean = location.pathname === "/home" || location.pathname === "/";

  return (
    <nav id={"navBar"}>
      <ul>
        <li>
          <Link 
            to={"/home"}
            className={isHome ? "active" : ""}
          >
            Accueil
          </Link>
        </li>
        <li>
          <Link 
            to={"/web_dev"}
            className={isWebDev ? "active" : ""}
          >
            Web développement
          </Link>
        </li>
        <li 
          className="dropdown-container"
          onMouseEnter={() => setShowUtilsDropdown(true)}
          onMouseLeave={() => setShowUtilsDropdown(false)}
        >
          <Link 
            to={"/utils"}
            className={isUtils ? "active" : ""}
          >
            Utilitaires
          </Link>
          {showUtilsDropdown && (
            <div className="dropdown-menu">
              <Link to="/utils/courriers" className="dropdown-item">
                Courriers
              </Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
