// styles
import "./navBar.scss";

// hooks | libraries
import { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar(): ReactElement {
  const location = useLocation();
  const isWebDev: boolean = location.pathname.includes("web_dev");

  return (
    <nav id={"navBar"}>
      <ul>
        <li>
          <Link to={"/home"}>Accueil</Link>
        </li>
        <li>
          <Link to={isWebDev ? "/utils" : "/web_dev"}>
            {isWebDev ? "Utilitaires" : "Web développement"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
