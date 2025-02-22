// styles
import "./webDevelopment.scss";

// hooks | libraries
import { ReactElement } from "react";

// components
import WithAuth from "../../utils/middleware/WithAuth.tsx";
import Header from "../../components/header/Header.tsx";
import NavBar from "../../components/navBar/NavBar.tsx";
import Footer from "../../components/footer/Footer.tsx";

function WebDevelopment(): ReactElement {
  return (
    <>
      <Header />
      <main id={'webDevelopment'}>
        <NavBar />
      </main>
      <Footer />
    </>
  );
}

const WebDevelopmentWithAuth = WithAuth(WebDevelopment);
export default WebDevelopmentWithAuth;
