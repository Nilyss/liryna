// styles
import "./nouveauCourrier.scss";

// hooks | libraries
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdUploadFile, MdSave, MdCancel } from "react-icons/md";
import { FiMail, FiUser, FiCalendar, FiFileText, FiTag } from "react-icons/fi";

// components
import WithAuth from "../../../utils/middleware/WithAuth.tsx";
import NavBar from "../../../components/navBar/NavBar.tsx";
import Footer from "../../../components/footer/Footer.tsx";

interface CourrierFormData {
  direction: 'entrant' | 'sortant' | 'interne';
  emitter: string;
  recipient: string;
  receptionDate: string;
  courrierDate: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  department: string;
  kind: string;
  description: string;
  fichierJoint?: File;
}

function NouveauCourrier(): ReactElement {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourrierFormData>({
    direction: "entrant",
    emitter: "",
    recipient: "",
    receptionDate: new Date().toISOString().split('T')[0],
    courrierDate: "",
    priority: "normal",
    department: "",
    kind: "",
    description: ""
  });
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (file: File) => {
    setFormData(prev => ({
      ...prev,
      fichierJoint: file
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation de l'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Données du courrier:", formData);
    
    setIsSubmitting(false);
    navigate("/utils/courriers");
  };

  const handleCancel = () => {
    navigate("/utils/courriers");
  };

  return (
    <>
      <NavBar />
      <main className="nouveau-courrier-main">
        <div className="nouveau-courrier-container">
          {/* Header */}
          <header className="nouveau-courrier-header" data-aos="fade-down">
            <button 
              className="back-button"
              onClick={handleCancel}
              type="button"
            >
              <MdArrowBack />
              <span>Retour</span>
            </button>
            <h1 className="page-title">Nouveau courrier</h1>
          </header>

          {/* Form */}
          <form className="courrier-form" onSubmit={handleSubmit} data-aos="fade-up" data-aos-delay="100">
            <div className="form-grid">
              {/* Informations principales */}
              <section className="form-section">
                <h2 className="section-title">
                  <FiMail />
                  Informations principales
                </h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="direction">Direction *</label>
                    <select
                      id="direction"
                      name="direction"
                      value={formData.direction}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="entrant">Entrant</option>
                      <option value="sortant">Sortant</option>
                      <option value="interne">Interne</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="kind">Type de courrier</label>
                    <input
                      type="text"
                      id="kind"
                      name="kind"
                      value={formData.kind}
                      onChange={handleInputChange}
                      placeholder="Facture, Contrat, Note de service..."
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="emitter">
                      <FiUser />
                      Expéditeur
                    </label>
                    <input
                      type="text"
                      id="emitter"
                      name="emitter"
                      value={formData.emitter}
                      onChange={handleInputChange}
                      placeholder="Nom de l'expéditeur"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="recipient">
                      <FiUser />
                      Destinataire
                    </label>
                    <input
                      type="text"
                      id="recipient"
                      name="recipient"
                      value={formData.recipient}
                      onChange={handleInputChange}
                      placeholder="Nom du destinataire"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="department">
                      <FiTag />
                      Service/Département
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Service concerné"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="priority">
                      <FiTag />
                      Priorité
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="low">Basse</option>
                      <option value="normal">Normale</option>
                      <option value="high">Haute</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Dates */}
              <section className="form-section">
                <h2 className="section-title">
                  <FiCalendar />
                  Dates
                </h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="receptionDate">Date de réception</label>
                    <input
                      type="date"
                      id="receptionDate"
                      name="receptionDate"
                      value={formData.receptionDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="courrierDate">Date du courrier</label>
                    <input
                      type="date"
                      id="courrierDate"
                      name="courrierDate"
                      value={formData.courrierDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </section>

              {/* Description */}
              <section className="form-section full-width">
                <h2 className="section-title">
                  <FiFileText />
                  Description
                </h2>
                
                <div className="form-group">
                  <label htmlFor="description">Notes et observations</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez le contenu du courrier, les actions à prendre..."
                    rows={4}
                  />
                </div>
              </section>

              {/* Upload de fichier */}
              <section className="form-section full-width">
                <h2 className="section-title">
                  <MdUploadFile />
                  Document joint
                </h2>
                
                <div 
                  className={`upload-zone ${dragActive ? 'drag-active' : ''} ${formData.fichierJoint ? 'has-file' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    type="file"
                    id="file-input"
                    onChange={handleFileInput}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    hidden
                  />
                  
                  {formData.fichierJoint ? (
                    <div className="file-info">
                      <MdUploadFile className="file-icon" />
                      <div className="file-details">
                        <span className="file-name">{formData.fichierJoint.name}</span>
                        <span className="file-size">
                          {(formData.fichierJoint.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        className="remove-file"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, fichierJoint: undefined }));
                        }}
                      >
                        <MdCancel />
                      </button>
                    </div>
                  ) : (
                    <div className="upload-prompt">
                      <MdUploadFile className="upload-icon" />
                      <div className="upload-text">
                        <span className="primary-text">Cliquez pour sélectionner</span>
                        <span className="secondary-text">ou glissez-déposez votre fichier ici</span>
                        <span className="format-text">PDF, DOC, DOCX, JPG, PNG (max 10MB)</span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Actions */}
            <div className="form-actions" data-aos="fade-up" data-aos-delay="200">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <MdCancel />
                Annuler
              </button>
              
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting || !formData.direction}
              >
                <MdSave />
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

const NouveauCourrierWithAuth = WithAuth(NouveauCourrier);
export default NouveauCourrierWithAuth;