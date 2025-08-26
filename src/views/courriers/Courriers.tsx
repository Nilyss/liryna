// styles
import "./courriers.scss";

// hooks | libraries
import { ReactElement, useState } from "react";

// components
import WithAuth from "../../utils/middleware/WithAuth.tsx";
import Header from "../../components/header/Header.tsx";
import NavBar from "../../components/navBar/NavBar.tsx";
import Footer from "../../components/footer/Footer.tsx";

function Courriers(): ReactElement {
  const [activeSection, setActiveSection] = useState<string>("");

  return (
    <>
      <Header />
      <NavBar />
      <main className="courriers-main">
        <section className="courriers-content">
          <h1 className="courriers-title">Gestion des courriers</h1>
          
          <div className="courriers-actions">
            <button className="action-btn primary">Nouveau courrier</button>
            <button className="action-btn">Liste des courriers</button>
            <button className="action-btn">Rechercher</button>
            <button className="action-btn">Archives</button>
          </div>

          <div className="courriers-stats">
            <div className="stat-card">
              <div className="stat-icon">📄</div>
              <div className="stat-info">
                <h3>Total courriers</h3>
                <p>125</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📥</div>
              <div className="stat-info">
                <h3>Entrants</h3>
                <p>78</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📤</div>
              <div className="stat-info">
                <h3>Sortants</h3>
                <p>47</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🕒</div>
              <div className="stat-info">
                <h3>Ce mois</h3>
                <p>23</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const CourriersWithAuth = WithAuth(Courriers);
export default CourriersWithAuth;