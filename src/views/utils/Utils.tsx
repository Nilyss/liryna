// styles
import "./utils.scss";

// hooks | libraries
import { ReactElement } from "react";

// components
import WithAuth from "../../utils/middleware/WithAuth.tsx";
import Header from "../../components/header/Header.tsx";
import NavBar from "../../components/navBar/NavBar.tsx";
import Footer from "../../components/footer/Footer.tsx";

function Utils(): ReactElement {
  return (
    <>
      <Header />
      <main>
        <NavBar />
      </main>
      <Footer />
    </>
  );
}

const UtilsWithAuth = WithAuth(Utils);
export default UtilsWithAuth;
