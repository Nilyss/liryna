// styles
import "./navBar.scss";

// hooks | libraries
import { ReactElement, useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX, HiHome } from "react-icons/hi";
import { MdDeveloperMode, MdBuild } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { UserContext } from "../../context/user/UserContext.tsx";

interface SubApp {
  id: string;
  name: string;
  path: string;
  icon: ReactElement;
}

interface Section {
  id: string;
  name: string;
  path: string;
  icon: ReactElement;
  color: 'webdev' | 'utils';
  subApps?: SubApp[];
}

export default function NavBar(): ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { user, logout } = useContext(UserContext);
  
  const isAuthRoute: boolean = location.pathname === "/auth";
  
  const handleLogout = () => {
    logout();
  };

  const sections: Section[] = [
    {
      id: "home",
      name: "Accueil",
      path: "/home",
      icon: <HiHome />,
      color: "utils",
    },
    {
      id: "webdev",
      name: "Web Dev",
      path: "/web_dev",
      icon: <MdDeveloperMode />,
      color: "webdev",
      subApps: [],
    },
    {
      id: "utils",
      name: "Utilitaires",
      path: "/utils",
      icon: <MdBuild />,
      color: "utils",
      subApps: [
        {
          id: "courriers",
          name: "Courriers",
          path: "/utils/mail",
          icon: <IoMail />,
        },
      ],
    },
  ];

  // Determine current section and sub-app
  useEffect(() => {
    const currentPath = location.pathname;
    
    if (currentPath === '/' || currentPath === '/home') {
      setActiveSection('home');
    } else if (currentPath.includes('/web_dev')) {
      setActiveSection('webdev');
    } else if (currentPath.includes('/utils')) {
      setActiveSection('utils');
    }
  }, [location.pathname]);

  const getCurrentSection = (): Section | undefined => {
    return sections.find(section => section.id === activeSection);
  };

  const getCurrentSubApp = (): SubApp | undefined => {
    const currentSection = getCurrentSection();
    if (!currentSection?.subApps) return undefined;
    
    return currentSection.subApps.find(subApp => 
      location.pathname === subApp.path
    );
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section.id);
    navigate(section.path);
    setIsMobileMenuOpen(false);
  };

  const handleSubAppChange = (subApp: SubApp) => {
    navigate(subApp.path);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const currentSection = getCurrentSection();
  const currentSubApp = getCurrentSubApp();

  return (
    <>
      <nav className={`navbar ${currentSection?.color || 'utils'}`}>
        <div className="navbar-container">
          {/* Logo/Brand */}
          <Link 
            to={isAuthRoute ? "/auth" : "/home"} 
            className="navbar-brand" 
            onClick={closeMobileMenu}
            title={isAuthRoute ? "" : "Home"}
          >
            <h1 className="brand-title">
              <span className="what">What</span> a{" "}
              <span className="tool">tool!</span>
            </h1>
          </Link>

          {/* User Info & Desktop Navigation */}
          <div className="navbar-right">
            {user && !isAuthRoute && (
              <div className="user-info">
                <span className="user-greeting">Bonjour {user.firstName}</span>
                <button onClick={handleLogout} className="logout-button">
                  Déconnexion
                </button>
              </div>
            )}
            
            {/* Desktop Navigation */}
            <div className="navbar-desktop">
              {!isAuthRoute && sections.map((section) => (
                <button
                  key={section.id}
                  className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => handleSectionChange(section)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-text">{section.name}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            {!isAuthRoute && (
              <button
                className="navbar-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <HiX /> : <HiMenu />}
              </button>
            )}
          </div>
        </div>

        {/* Sub-navigation for sub-apps */}
        {!isAuthRoute && currentSection?.subApps && currentSection.subApps.length > 0 && (
          <div className="navbar-subnavs">
            <div className="subnav-container">
              {currentSection.subApps.map((subApp) => (
                <button
                  key={subApp.id}
                  className={`subnav-item ${currentSubApp?.id === subApp.id ? 'active' : ''}`}
                  onClick={() => handleSubAppChange(subApp)}
                >
                  <span className="subnav-icon">{subApp.icon}</span>
                  <span className="subnav-text">{subApp.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && !isAuthRoute && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <div className={`mobile-menu ${currentSection?.color || 'utils'}`} onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Navigation</span>
              <button 
                className="mobile-menu-close"
                onClick={closeMobileMenu}
              >
                <HiX />
              </button>
            </div>

            <div className="mobile-menu-content">
              {/* User info in mobile menu */}
              {user && (
                <div className="mobile-user-info">
                  <span className="mobile-user-greeting">Bonjour {user.firstName}</span>
                  <button onClick={handleLogout} className="mobile-logout-button">
                    Déconnexion
                  </button>
                </div>
              )}
              
              {sections.map((section) => (
                <div key={section.id} className="mobile-section">
                  <button
                    className={`mobile-nav-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => handleSectionChange(section)}
                  >
                    <span className="mobile-nav-icon">{section.icon}</span>
                    <span className="mobile-nav-text">{section.name}</span>
                  </button>

                  {/* Sub-apps for current section */}
                  {activeSection === section.id && section.subApps && section.subApps.length > 0 && (
                    <div className="mobile-subapps">
                      {section.subApps.map((subApp) => (
                        <button
                          key={subApp.id}
                          className={`mobile-subapp-item ${currentSubApp?.id === subApp.id ? 'active' : ''}`}
                          onClick={() => handleSubAppChange(subApp)}
                        >
                          <span className="mobile-subapp-icon">{subApp.icon}</span>
                          <span className="mobile-subapp-text">{subApp.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
