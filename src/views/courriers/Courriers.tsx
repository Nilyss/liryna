// styles
import "./courriers.scss";

// hooks | libraries
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdList, MdSearch, MdArchive } from "react-icons/md";
import { IoMail, IoMailOpen } from "react-icons/io5";
import { FiCalendar, FiFileText } from "react-icons/fi";

// components
import WithAuth from "../../utils/middleware/WithAuth.tsx";
import NavBar from "../../components/navBar/NavBar.tsx";
import Footer from "../../components/footer/Footer.tsx";

function Courriers(): ReactElement {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<string>("");

  const actions = [
    {
      id: 'new',
      label: 'Nouveau courrier',
      icon: <MdAdd />,
      primary: true
    },
    {
      id: 'list',
      label: 'Liste des courriers',
      icon: <MdList />,
      primary: false
    },
    {
      id: 'search',
      label: 'Rechercher',
      icon: <MdSearch />,
      primary: false
    },
    {
      id: 'archive',
      label: 'Archives',
      icon: <MdArchive />,
      primary: false
    }
  ];

  const stats = [
    {
      id: 'total',
      label: 'Total courriers',
      value: '125',
      icon: <FiFileText />,
      color: 'primary'
    },
    {
      id: 'incoming',
      label: 'Entrants',
      value: '78',
      icon: <IoMail />,
      color: 'info'
    },
    {
      id: 'outgoing',
      label: 'Sortants',
      value: '47',
      icon: <IoMailOpen />,
      color: 'success'
    },
    {
      id: 'monthly',
      label: 'Ce mois',
      value: '23',
      icon: <FiCalendar />,
      color: 'warning'
    }
  ];

  const handleActionClick = (actionId: string) => {
    if (actionId === 'new') {
      navigate('/utils/courriers/nouveau');
    } else {
      setActiveAction(actionId);
    }
  };

  return (
    <>
      <NavBar />
      <main className="courriers-main">
        <div className="courriers-container">
          <section className="courriers-header" data-aos="fade-down">
            <h1 className="courriers-title">Gestion des courriers</h1>
            <p className="courriers-subtitle">Organisez et suivez vos courriers efficacement</p>
          </section>

          <section className="courriers-actions" data-aos="fade-up" data-aos-delay="100">
            <div className="actions-grid">
              {actions.map((action, index) => (
                <button
                  key={action.id}
                  className={`action-btn ${action.primary ? 'primary' : ''} ${activeAction === action.id ? 'active' : ''}`}
                  onClick={() => handleActionClick(action.id)}
                  data-aos="fade-up"
                  data-aos-delay={150 + index * 50}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-text">{action.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="courriers-stats" data-aos="fade-up" data-aos-delay="200">
            <h2 className="stats-title">Statistiques</h2>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div
                  key={stat.id}
                  className={`stat-card ${stat.color}`}
                  data-aos="zoom-in"
                  data-aos-delay={250 + index * 100}
                >
                  <div className="stat-icon">
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {activeAction && (
            <section className="courriers-content" data-aos="fade-up" data-aos-delay="300">
              <div className="content-card">
                <h3>Section: {actions.find(a => a.id === activeAction)?.label}</h3>
                <p>Le contenu de cette section sera développé selon vos besoins spécifiques.</p>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

const CourriersWithAuth = WithAuth(Courriers);
export default CourriersWithAuth;