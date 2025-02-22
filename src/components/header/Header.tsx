// styles
import "./header.scss";

// hooks | libraries
import { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header(): ReactElement {
  const location = useLocation();
  const isAuthRoute: boolean = location.pathname === "/auth";

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
    </header>
  );
}
