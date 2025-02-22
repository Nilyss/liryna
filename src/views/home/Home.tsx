// styles
import "./home.scss";

// assets
import devBackground from "../../assets/background/devSection.webp";
import utilsBackground from "../../assets/background/utilsSection.webp";

// hooks | library
import { ReactElement } from "react";
import WithAuth from "../../utils/middleware/WithAuth";
import { Link } from "react-router-dom";

// component
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ChatBot from "../../components/chatBot/ChatBot";

function Home(): ReactElement {
  return (
    <>
      <Header />
      <main>
        <div className={"mainWrapper"}>
          <section className={"leftSection"}>
            <Link to={"/web_dev"}>
              <figure>
                <img src={devBackground} alt={"Éditeur de code"} />
              </figure>
              <h2>Développement Web</h2>
            </Link>
          </section>
          <section className={"rightSection"}>
            <Link to={"/utils"}>
              <figure>
                <img src={utilsBackground} alt={"Bureau de travail"} />
              </figure>
              <h2>Utilitaires</h2>
            </Link>
          </section>
        </div>
        <ChatBot />
      </main>
      <Footer />
    </>
  );
}

const HomeWithAuth = WithAuth(Home);
export default HomeWithAuth;
