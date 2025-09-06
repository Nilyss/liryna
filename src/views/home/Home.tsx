// styles
import "./home.scss";

// assets
import mailBackground from "../../assets/background/mailSectionBckground.webp";

// hooks | library
import { ReactElement } from "react";
import WithAuth from "../../utils/middleware/WithAuth";
import { Link } from "react-router-dom";

// component
import Header from "../../components/header/Header";
import SubNav from "../../components/subNav/SubNav";

function Home(): ReactElement {
  return (
    <div id="home" className="homeContainer">
      <Header />
      <SubNav />
      <main>
        <div className={"mainWrapper"}>
          <section className={"utilsSection"}>
            <Link to={"/mail"}>
              <figure>
                <img src={mailBackground} alt={"Bureau de travail"} />
              </figure>
              <h2>Gestion des courriers</h2>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

const HomeWithAuth = WithAuth(Home);
export default HomeWithAuth;
