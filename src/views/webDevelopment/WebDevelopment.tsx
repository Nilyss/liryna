// styles
import "./webDevelopment.scss";

// hooks | libraries
import { ReactElement } from "react";

// components
import WithAuth from "../../utils/middleware/WithAuth.tsx";
import NavBar from "../../components/navBar/NavBar.tsx";
import Footer from "../../components/footer/Footer.tsx";

function WebDevelopment(): ReactElement {
  return (
    <>
      <NavBar />
      <main id={'webDevelopment'}>
      </main>
      <Footer />
    </>
  );
}

const WebDevelopmentWithAuth = WithAuth(WebDevelopment);
export default WebDevelopmentWithAuth;
