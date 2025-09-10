// styles
import "./listeCourriers.scss";

// hooks | libraries
import { ReactElement, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MdArrowBack, 
  MdDownload, 
  MdEdit, 
  MdDelete, 
  MdEmail, 
  MdSearch,
  MdNavigateNext,
  MdNavigateBefore,
  MdVisibility,
  MdArchive,
  MdOutlineMarkEmailRead,
  MdSelectAll,
  MdKeyboardArrowUp
} from "react-icons/md";
import { FiFileText } from "react-icons/fi";

// components
import WithAuth from "../../../utils/middleware/WithAuth.tsx";
import Header from "../../../components/header/Header.tsx";
import SubNav from "../../../components/subNav/SubNav.tsx";
import Button from "../../../components/button/Button.tsx";
import Modal from "../../../components/modal/Modal.tsx";
import Loader from "../../../components/loader/Loader.tsx";
import EmailModal from "../../../components/emailModal/EmailModal.tsx";
import PDFViewer from "../../../components/pdfViewer/PDFViewer.tsx";

// context
import { CourrierContext } from "../../../context/courrier/CourrierContext.tsx";

// services
import { sendCourrierEmailService, downloadBulkCourriersService, sendBulkCourrierEmailService } from "../../../API/services/courrier.service.ts";
import { generateViewUrlService } from "../../../API/services/viewUrl.service.ts";

// utils
import { 
  handleCourrierLoadError, 
  handleCourrierDownloadError, 
  handleCourrierDeleteError, 
  handleCourrierViewError,
  handleCourrierEmailError,
  logError,
  showErrorNotification 
} from "../../../utils/scripts/errorHandling.ts";

// types
import { ICourrier } from "../../../utils/types/courrier.types.ts";

function ListeCourriers(): ReactElement {
  const navigate = useNavigate();
  const { courriers, pagination, getAllCourriers, downloadCourrier, deleteCourrier, isLoading } = useContext(CourrierContext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tooltip, setTooltip] = useState<{ visible: boolean; content: string; x: number; y: number }>({
    visible: false,
    content: "",
    x: 0,
    y: 0
  });
  const [pdfModal, setPdfModal] = useState<{ visible: boolean; pdfUrl: string; fileName: string; fileType: 'pdf' | 'image' }>({
    visible: false,
    pdfUrl: "",
    fileName: "",
    fileType: 'pdf'
  });
  const [emailModal, setEmailModal] = useState<{ visible: boolean; courrier: ICourrier | null; isLoading: boolean }>({
    visible: false,
    courrier: null,
    isLoading: false
  });
  const [selectedCourriers, setSelectedCourriers] = useState<Set<number>>(new Set());
  const [bulkEmailModal, setBulkEmailModal] = useState<{ visible: boolean; courriers: ICourrier[]; isLoading: boolean }>({
    visible: false,
    courriers: [],
    isLoading: false
  });
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    if (searchTerm.trim() && searchTerm.trim().length >= 3) {
      // Si recherche active avec au moins 3 caractères, charger avec limite backend max
      loadCourriers(1, 100); // Utiliser la limite maximum autorisée par le backend
    } else if (!searchTerm.trim()) {
      // Si pas de recherche, pagination normale
      loadCourriers(currentPage);
    }
    // Si recherche < 3 caractères, ne rien faire
  }, [currentPage, searchTerm]);

  // Gérer l'affichage du bouton Back to Top
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300); // Afficher après 300px de scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gérer le changement de terme de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    // Si on passe de recherche à pas de recherche, revenir à la page 1
    if (!newSearchTerm.trim() && currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const loadCourriers = async (page: number, limit: number = 10) => {
    try {
      await getAllCourriers(page, limit);
    } catch (error: unknown) {
      logError('loadCourriers', error);
      const errorMessage = handleCourrierLoadError(error);
      showErrorNotification(errorMessage);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleBackClick = () => {
    navigate("/mail");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getDirectionBadge = (direction: string): string => {
    switch (direction) {
      case 'entrant': return 'badge-entrant';
      case 'sortant': return 'badge-sortant'; 
      case 'interne': return 'badge-interne';
      default: return '';
    }
  };

  const handleDownload = async (courrierid: number) => {
    try {
      // Trouver le courrier pour obtenir son fileName
      const courrier = courriers.find(c => c.id === courrierid);
      const fileName = courrier?.fileName || 'courrier.pdf';
      
      const blob = await downloadCourrier(courrierid);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: unknown) {
      logError('handleDownload', error);
      const errorMessage = handleCourrierDownloadError(error);
      showErrorNotification(errorMessage);
    }
  };

  const handleEdit = (courrierid: number) => {
    navigate(`/mail/update/${courrierid}`);
  };

  const handleEmail = (courrierid: number) => {
    const courrier = courriers.find(c => c.id === courrierid);
    
    if (courrier) {
      setEmailModal({
        visible: true,
        courrier,
        isLoading: false
      });
    } else {
      console.error('Courrier not found for ID:', courrierid);
    }
  };

  const handleSendEmail = async (emailData: { to: string; subject: string; message: string }) => {
    if (!emailModal.courrier) return;
    
    setEmailModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      await sendCourrierEmailService(emailModal.courrier.id, emailData);
      showErrorNotification('Email envoyé avec succès !', 'info');
      setEmailModal({ visible: false, courrier: null, isLoading: false });
    } catch (error: unknown) {
      logError('handleSendEmail', error);
      const errorMessage = handleCourrierEmailError(error);
      showErrorNotification(errorMessage);
    } finally {
      setEmailModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const closeEmailModal = () => {
    setEmailModal({ visible: false, courrier: null, isLoading: false });
  };

  const closeBulkEmailModal = () => {
    setBulkEmailModal({ visible: false, courriers: [], isLoading: false });
  };

  const handleSelectCourrier = (courrierId: number, checked: boolean) => {
    setSelectedCourriers(prev => {
      const newSelection = new Set(prev);
      if (checked) {
        newSelection.add(courrierId);
      } else {
        newSelection.delete(courrierId);
      }
      return newSelection;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCourriers(new Set(filteredCourriers.map(c => c.id)));
    } else {
      setSelectedCourriers(new Set());
    }
  };

  const handleBulkDownload = async () => {
    if (selectedCourriers.size === 0) {
      showErrorNotification('Aucun courrier sélectionné');
      return;
    }
    
    try {
      const courrierIds = Array.from(selectedCourriers);
      
      // Utiliser le service au lieu de fetch direct
      const blob = await downloadBulkCourriersService(courrierIds);
      const url = window.URL.createObjectURL(blob);
      
      // Nom de fichier par défaut
      const fileName = `courriers_${new Date().toISOString().slice(0, 10)}.zip`;
      
      // Télécharger le fichier
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showErrorNotification(`Archive ZIP téléchargée: ${courrierIds.length} courrier${courrierIds.length > 1 ? 's' : ''}`, 'info');
      setSelectedCourriers(new Set()); // Clear selection after successful download
    } catch (error: unknown) {
      logError('handleBulkDownload', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du téléchargement groupé';
      showErrorNotification(errorMessage);
    }
  };

  const handleBulkEmail = () => {
    if (selectedCourriers.size === 0) {
      showErrorNotification('Aucun courrier sélectionné');
      return;
    }
    
    const selectedCourriersData = filteredCourriers.filter(c => selectedCourriers.has(c.id));
    setBulkEmailModal({
      visible: true,
      courriers: selectedCourriersData,
      isLoading: false
    });
  };

  const handleSendBulkEmail = async (emailData: { to: string; subject: string; message: string }) => {
    setBulkEmailModal(prev => ({ ...prev, isLoading: true }));
    
    try {
      const courrierIds = bulkEmailModal.courriers.map(c => c.id);
      
      // Utiliser le service au lieu de fetch direct
      const result = await sendBulkCourrierEmailService(courrierIds, emailData);
      showErrorNotification(`Email groupé envoyé avec succès: ${result.courriersCount} courrier${result.courriersCount > 1 ? 's' : ''}`, 'info');
      setBulkEmailModal({ visible: false, courriers: [], isLoading: false });
      setSelectedCourriers(new Set()); // Clear selection after successful send
    } catch (error: unknown) {
      logError('handleSendBulkEmail', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'envoi groupé';
      showErrorNotification(errorMessage);
    } finally {
      setBulkEmailModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleAdaptiveDownload = async (courrierId: number) => {
    if (selectedCourriers.size === 0) {
      // Téléchargement simple
      await handleDownload(courrierId);
    } else if (selectedCourriers.size === 1) {
      // Téléchargement du courrier sélectionné
      const selectedId = Array.from(selectedCourriers)[0];
      await handleDownload(selectedId);
    } else {
      // Téléchargement multiple (ZIP)
      await handleBulkDownload();
    }
  };

  const handleAdaptiveEmail = (courrierId: number) => {
    if (selectedCourriers.size === 0) {
      // Email simple
      handleEmail(courrierId);
    } else if (selectedCourriers.size === 1) {
      // Email du courrier sélectionné
      const selectedId = Array.from(selectedCourriers)[0];
      handleEmail(selectedId);
    } else {
      // Email multiple
      handleBulkEmail();
    }
  };

  const getDownloadTooltip = (): string => {
    if (selectedCourriers.size === 0) {
      return "Télécharger ce courrier";
    } else if (selectedCourriers.size === 1) {
      return "Télécharger le courrier sélectionné";
    } else {
      return `Télécharger les ${selectedCourriers.size} courriers (ZIP)`;
    }
  };

  const getEmailTooltip = (): string => {
    if (selectedCourriers.size === 0) {
      return "Envoyer ce courrier par email";
    } else if (selectedCourriers.size === 1) {
      return "Envoyer le courrier sélectionné par email";
    } else {
      return `Envoyer les ${selectedCourriers.size} courriers par email`;
    }
  };

  const handleDelete = async (courrierid: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce courrier ?')) {
      try {
        await deleteCourrier(courrierid);
        // Recharger les courriers après suppression réussie
        await loadCourriers(currentPage);
        showErrorNotification('Courrier supprimé avec succès', 'info');
      } catch (error: unknown) {
        logError('handleDelete', error);
        const errorMessage = handleCourrierDeleteError(error);
        showErrorNotification(errorMessage);
      }
    }
  };

  const handleViewPdf = async (courrier: ICourrier) => {
    try {
      // Détecter le type de fichier basé sur l'extension
      const isImage = courrier.fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);
      
      if (isImage) {
        // Pour les images, générer aussi une URL signée pour cohérence
        const viewUrlData = await generateViewUrlService(courrier.id, 10);
        
        setPdfModal({
          visible: true,
          pdfUrl: viewUrlData.viewUrl,
          fileName: courrier.fileName,
          fileType: 'image'
        });
      } else {
        // Pour les PDFs, utiliser l'URL signée pour éviter les problèmes d'authentification iframe
        const viewUrlData = await generateViewUrlService(courrier.id, 10);
        
        setPdfModal({
          visible: true,
          pdfUrl: viewUrlData.viewUrl,
          fileName: courrier.fileName,
          fileType: 'pdf'
        });
      }
    } catch (error: unknown) {
      logError('handleViewPdf', error);
      const errorMessage = handleCourrierViewError(error);
      showErrorNotification(errorMessage);
    }
  };

  const closePdfModal = () => {
    // Plus besoin de nettoyer les blob URLs puisqu'on utilise l'API directement
    setPdfModal({
      visible: false,
      pdfUrl: "",
      fileName: "",
      fileType: 'pdf'
    });
  };

  const handleMouseEnter = (event: React.MouseEvent, content: string) => {
    if (content && content !== "N/A" && content.length > 20) {
      setTooltip({
        visible: true,
        content: content,
        x: event.clientX + 10,
        y: event.clientY - 10
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip(prev => ({
        ...prev,
        x: event.clientX + 10,
        y: event.clientY - 10
      }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      content: "",
      x: 0,
      y: 0
    });
  };

  const filteredCourriers = courriers.filter(courrier =>
    courrier.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courrier.kind?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courrier.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    courrier.emitter?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <SubNav />
      <main id="listeCourriers" className="listeCourrierMain">
        {/* Barre de recherche mobile sticky - en dehors du container */}
        <div className="mobileSearchContainer mobileOnly">
          <div className="searchWrapper">
            <MdSearch className="searchIcon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="searchInput"
            />
          </div>
        </div>
        
        <div className="listeCourrierContainer">
          {/* Header */}
          <header className="listeCourrierHeader" data-aos="fade-down">
            <Button 
              style="back"
              onClick={handleBackClick}
              type="button"
            >
              <MdArrowBack />
              <span>Retour</span>
            </Button>
            <h1 className="pageTitle">Liste des courriers</h1>
          </header>

          {/* Search and Pagination */}
          <section className="searchSection" data-aos="fade-up" data-aos-delay="100">

            {/* Barre de recherche desktop */}
            <div className="searchContainer desktopOnly">
              <MdSearch className="searchIcon" />
              <input
                type="text"
                placeholder="Rechercher par nom de fichier, type, service..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="searchInput"
              />
            </div>
            
            {/* Résultats de recherche */}
            {searchTerm.trim() && (
              <div className="searchResults">
                <span className="resultsCount">
                  {filteredCourriers.length} résultat{filteredCourriers.length > 1 ? 's' : ''} trouvé{filteredCourriers.length > 1 ? 's' : ''} pour "{searchTerm}"
                </span>
              </div>
            )}
            
            
            {/* Pagination Controls - Masquée pendant la recherche */}
            {!searchTerm.trim() && pagination && pagination.totalPages > 1 && (
              <div className="paginationControls">
                <button
                  className="paginationBtn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <MdNavigateBefore /> 
                  Précédent
                </button>
                
                <div className="paginationInfo">
                  <span>Page {currentPage} sur {pagination.totalPages}</span>
                  <span className="totalItems">{pagination.total} courrier{pagination.total > 1 ? 's' : ''}</span>
                </div>
                
                <button
                  className="paginationBtn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  Suivant
                  <MdNavigateNext />
                </button>
              </div>
            )}
          </section>

          {/* Courriers List */}
          <section className="courriersSection" data-aos="fade-up" data-aos-delay="200">
            {isLoading ? (
              <div className="loadingState">
                <Loader 
                  size="large" 
                  message="Chargement des courriers..."
                />
              </div>
            ) : filteredCourriers.length === 0 ? (
              <div className="emptyState">
                <FiFileText className="emptyIcon" />
                <p>Aucun courrier trouvé</p>
              </div>
            ) : (
              <>
                {/* Vue Mobile - Cartes */}
                <div className="courriersCards mobileOnly">
                  {/* Header de sélection globale mobile */}
                  <div className="mobileSelectAll">
                    <label className="checkboxWrapper">
                      <input
                        type="checkbox"
                        checked={selectedCourriers.size > 0 && selectedCourriers.size === filteredCourriers.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="selectAllCheckbox"
                      />
                      <span className="checkboxLabel">
                        <MdSelectAll />
                      </span>
                    </label>
                    <span className="selectAllText">
                      {selectedCourriers.size > 0 
                        ? `${selectedCourriers.size} sélectionné${selectedCourriers.size > 1 ? 's' : ''}`
                        : 'Tout sélectionner'
                      }
                    </span>
                  </div>

                  {/* Liste des cartes */}
                  <div className="cardsList">
                    {filteredCourriers.map((courrier: ICourrier) => (
                      <div 
                        key={courrier.id} 
                        className={`courrierCard ${selectedCourriers.has(courrier.id) ? 'selected' : ''}`}
                      >
                        {/* En-tête de la carte */}
                        <div className="cardHeader">
                          <div className="cardSelect">
                            <label className="checkboxWrapper">
                              <input
                                type="checkbox"
                                checked={selectedCourriers.has(courrier.id)}
                                onChange={(e) => handleSelectCourrier(courrier.id, e.target.checked)}
                                className="selectCheckbox"
                              />
                              <span className="checkmark"></span>
                            </label>
                          </div>
                          <div className="cardTitle">
                            <FiFileText className="fileIcon" />
                            <h3 className="fileName" title={courrier.fileName}>{courrier.fileName}</h3>
                          </div>
                          <div className="cardDirection">
                            <span className={`directionBadge ${getDirectionBadge(courrier.direction)}`}>
                              {courrier.direction}
                            </span>
                          </div>
                        </div>

                        {/* Corps de la carte */}
                        <div className="cardBody">
                          <div className="cardInfo">
                            <div className="infoRow">
                              <span className="infoLabel">Type:</span>
                              <span className="infoValue">{courrier.kind || "N/A"}</span>
                            </div>
                            <div className="infoRow">
                              <span className="infoLabel">Service:</span>
                              <span className="infoValue">{courrier.department || "N/A"}</span>
                            </div>
                            <div className="infoRow">
                              <span className="infoLabel">Expéditeur:</span>
                              <span className="infoValue">{courrier.emitter || "N/A"}</span>
                            </div>
                            <div className="infoRow">
                              <span className="infoLabel">Date:</span>
                              <span className="infoValue">{formatDate(courrier.courrierDate)}</span>
                            </div>
                            {courrier.description && (
                              <div className="infoRow description">
                                <span className="infoLabel">Description:</span>
                                <span className="infoValue">{courrier.description}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions de la carte */}
                        <div className="cardActions">
                          <button 
                            className={`actionBtn view ${selectedCourriers.size > 0 ? 'disabled' : ''}`}
                            onClick={() => selectedCourriers.size === 0 && handleViewPdf(courrier)}
                            title={selectedCourriers.size > 0 ? "Désactivé pendant la sélection" : "Visualiser"}
                            disabled={selectedCourriers.size > 0}
                          >
                            <MdVisibility />
                          </button>
                          <button 
                            className="actionBtn download"
                            onClick={() => handleAdaptiveDownload(courrier.id)}
                            title={getDownloadTooltip()}
                          >
                            {selectedCourriers.size > 1 ? <MdArchive /> : <MdDownload />}
                          </button>
                          <button 
                            className={`actionBtn edit ${selectedCourriers.size > 0 ? 'disabled' : ''}`}
                            onClick={() => selectedCourriers.size === 0 && handleEdit(courrier.id)}
                            title={selectedCourriers.size > 0 ? "Désactivé pendant la sélection" : "Modifier"}
                            disabled={selectedCourriers.size > 0}
                          >
                            <MdEdit />
                          </button>
                          <button 
                            className="actionBtn email"
                            onClick={() => handleAdaptiveEmail(courrier.id)}
                            title={getEmailTooltip()}
                          >
                            {selectedCourriers.size > 1 ? <MdOutlineMarkEmailRead /> : <MdEmail />}
                          </button>
                          <button 
                            className={`actionBtn delete ${selectedCourriers.size > 0 ? 'disabled' : ''}`}
                            onClick={() => selectedCourriers.size === 0 && handleDelete(courrier.id)}
                            title={selectedCourriers.size > 0 ? "Désactivé pendant la sélection" : "Supprimer"}
                            disabled={selectedCourriers.size > 0}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vue Desktop/Tablette - Tableau */}
                <div className="courriersTable desktopOnly">
                  <div className="tableWrapper">
                    <table className="courriersGrid">
                    <thead>
                      <tr>
                        <th className="selectColumn">
                          <label className="checkboxWrapper">
                            <input
                              type="checkbox"
                              checked={selectedCourriers.size > 0 && selectedCourriers.size === filteredCourriers.length}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              className="selectAllCheckbox"
                            />
                          </label>
                        </th>
                        <th>Nom du fichier</th>
                        <th>Direction</th>
                        <th>Type</th>
                        <th>Service</th>
                        <th>Expéditeur</th>
                        <th className="dateColumn">Date courrier</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourriers.map((courrier: ICourrier) => (
                        <tr key={courrier.id} className={`courrierRow ${selectedCourriers.has(courrier.id) ? 'selected' : ''}`}>
                          <td className="selectColumn">
                            <label className="checkboxWrapper">
                              <input
                                type="checkbox"
                                checked={selectedCourriers.has(courrier.id)}
                                onChange={(e) => handleSelectCourrier(courrier.id, e.target.checked)}
                                className="selectCheckbox"
                              />
                              <span className="checkmark"></span>
                            </label>
                          </td>
                          <td className="fileName">
                            <div className="fileNameWrapper">
                              <FiFileText className="fileIcon" />
                              <span 
                                className="fileNameText"
                                onMouseEnter={(e) => handleMouseEnter(e, courrier.fileName)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                              >
                                {courrier.fileName}
                              </span>
                            </div>
                          </td>
                          <td className="direction">
                            <span className={`directionBadge ${getDirectionBadge(courrier.direction)}`}>
                              {courrier.direction}
                            </span>
                          </td>
                          <td 
                            className="kind"
                            onMouseEnter={(e) => handleMouseEnter(e, courrier.kind || "N/A")}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                          >
                            {courrier.kind || "N/A"}
                          </td>
                          <td 
                            className="department"
                            onMouseEnter={(e) => handleMouseEnter(e, courrier.department || "N/A")}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                          >
                            {courrier.department || "N/A"}
                          </td>
                          <td 
                            className="emitter"
                            onMouseEnter={(e) => handleMouseEnter(e, courrier.emitter || "N/A")}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                          >
                            {courrier.emitter || "N/A"}
                          </td>
                          <td className="courrierDate">{formatDate(courrier.courrierDate)}</td>
                          <td 
                            className="description"
                            onMouseEnter={(e) => handleMouseEnter(e, courrier.description || "N/A")}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                          >
                            {courrier.description || "N/A"}
                          </td>
                          <td className="actions">
                            <div className="actionButtons">
                              <button 
                                className={`actionBtn view ${selectedCourriers.size > 0 ? 'disabled' : ''}`}
                                onClick={() => selectedCourriers.size === 0 && handleViewPdf(courrier)}
                                title={selectedCourriers.size > 0 ? "Désactivé pendant la sélection" : "Visualiser"}
                                disabled={selectedCourriers.size > 0}
                              >
                                <MdVisibility />
                              </button>
                              <button 
                                className="actionBtn download"
                                onClick={() => handleAdaptiveDownload(courrier.id)}
                                title={getDownloadTooltip()}
                              >
                                {selectedCourriers.size > 1 ? <MdArchive /> : <MdDownload />}
                              </button>
                              <button 
                                className={`actionBtn edit ${selectedCourriers.size > 0 ? 'disabled' : ''}`}
                                onClick={() => selectedCourriers.size === 0 && handleEdit(courrier.id)}
                                title={selectedCourriers.size > 0 ? "Désactivé pendant la sélection" : "Modifier"}
                                disabled={selectedCourriers.size > 0}
                              >
                                <MdEdit />
                              </button>
                              <button 
                                className="actionBtn email"
                                onClick={() => handleAdaptiveEmail(courrier.id)}
                                title={getEmailTooltip()}
                              >
                                {selectedCourriers.size > 1 ? <MdOutlineMarkEmailRead /> : <MdEmail />}
                              </button>
                              <button 
                                className={`actionBtn delete ${selectedCourriers.size > 0 ? 'disabled' : ''}`}
                                onClick={() => selectedCourriers.size === 0 && handleDelete(courrier.id)}
                                title={selectedCourriers.size > 0 ? "Désactivé pendant la sélection" : "Supprimer"}
                                disabled={selectedCourriers.size > 0}
                              >
                                <MdDelete />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </section>

        </div>
        
        {/* Pagination mobile en bas */}
        {!searchTerm.trim() && pagination && pagination.totalPages > 1 && (
          <div className="mobilePagination mobileOnly">
            <div className="paginationControls">
              <button
                className="paginationBtn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <MdNavigateBefore /> 
                Précédent
              </button>
              
              <div className="paginationInfo">
                <span>Page {currentPage} sur {pagination.totalPages}</span>
                <span className="totalItems">{pagination.total} courrier{pagination.total > 1 ? 's' : ''}</span>
              </div>
              
              <button
                className="paginationBtn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Suivant
                <MdNavigateNext />
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Tooltip personnalisé */}
      {tooltip.visible && (
        <div 
          className="tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Modale PDF/Image */}
      <Modal 
        isVisible={pdfModal.visible}
        onClose={closePdfModal}
        title={pdfModal.fileName || `Visualisation ${pdfModal.fileType.toUpperCase()}`}
      >
        {pdfModal.fileType === 'image' ? (
          <img
            src={pdfModal.pdfUrl}
            alt={pdfModal.fileName}
            className="modal-content-image"
          />
        ) : (
          // Utiliser PDF.js pour un rendu optimal des PDFs
          <div id="pdfViewer">
            <PDFViewer 
              pdfUrl={pdfModal.pdfUrl}
              fileName={pdfModal.fileName || 'document.pdf'}
            />
          </div>
        )}
      </Modal>

      {/* Modale Email */}
      <EmailModal
        isVisible={emailModal.visible}
        courrier={emailModal.courrier}
        onClose={closeEmailModal}
        onSend={handleSendEmail}
        isLoading={emailModal.isLoading}
      />

      {/* Modale Email Groupé */}
      <EmailModal
        isVisible={bulkEmailModal.visible}
        courrier={bulkEmailModal.courriers[0] || null}
        onClose={closeBulkEmailModal}
        onSend={handleSendBulkEmail}
        isLoading={bulkEmailModal.isLoading}
        bulkMode={true}
        selectedCount={bulkEmailModal.courriers.length}
      />

      {/* Bouton Back to Top */}
      {showBackToTop && (
        <button
          className="backToTopBtn mobileOnly"
          onClick={scrollToTop}
          title="Retour en haut"
        >
          <MdKeyboardArrowUp />
        </button>
      )}
    </>
  );
}

const ListeCourriersWithAuth = WithAuth(ListeCourriers);
export default ListeCourriersWithAuth;