// styles
import "./utils.scss";

// hooks | libraries
import { ReactElement, useState } from "react";

// components
import WithAuth from "../../utils/middleware/WithAuth.tsx";
import Header from "../../components/header/Header.tsx";
import NavBar from "../../components/navBar/NavBar.tsx";
import Footer from "../../components/footer/Footer.tsx";

function Utils(): ReactElement {
  return (
    <>
      <Header />
      <NavBar />
      <main className="utils-main">
        <section className="utils-content">
          <h1 className="utils-title">Outils utilitaires</h1>
          <div className="utils-welcome">
            <p>Bienvenue dans la section utilitaires. Utilisez la navigation pour accéder aux différents outils disponibles.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const UtilsWithAuth = WithAuth(Utils);
export default UtilsWithAuth;
