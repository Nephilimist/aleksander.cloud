import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Download, Edit, Save, X, ArrowLeft } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const App = () => {
  const [offers, setOffers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);

  const emptyOffer = {
    clientName: 'Emilia Walczak',
    proposal: 'Poniżej przedstawiam propozycję realizacji projektu, opartą na naszych wstępnych ustaleniach. Moim celem jest dostarczenie rozwiązania, które nie tylko estetycznie się prezentuje, ale przede wszystkim jest szybkie, bezpieczne i łatwe w zarządzaniu.',
    scope: [
      { title: 'Analiza i Architektura', description: 'Mapowanie potrzeb, dobór technologii.' },
      { title: 'Custom Development', description: 'Budowa dedykowanego motywu WordPress od zera, bez zbędnego kodu ("bloat").' }
    ],
    timeline: [
      { title: 'Start & Discovery', duration: '1-2 dni' },
      { title: 'Design & Feedback', duration: '2-3 dni' },
      { title: 'Development', duration: '4-5 dni' },
      { title: 'Launch', duration: '1-2 dni' }
    ],
    pricing: [{ service: 'Budowa strony głównej + podstrony', scope: 'Projekt RWD, implementacja, optymalizacja speed/SEO', cost: '2850' }],
    totalCost: '2850'
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/offers`);
      setOffers(res.data);
    } catch (err) {
      console.error("Error fetching offers", err);
    }
  };

  const handleCreate = () => {
    setCurrentOffer({ ...emptyOffer, id: null, createdAt: new Date() });
    setIsEditing(true);
  };

  const handleEdit = (offer) => {
    setCurrentOffer(offer);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę ofertę?')) {
      await axios.delete(`${API_BASE}/offers/${id}`);
      fetchOffers();
    }
  };

  const handleSave = async () => {
    try {
      if (currentOffer.id) {
        await axios.put(`${API_BASE}/offers/${currentOffer.id}`, currentOffer);
      } else {
        await axios.post(`${API_BASE}/offers`, currentOffer);
      }
      setIsEditing(false);
      fetchOffers();
    } catch (err) {
      alert("Błąd podczas zapisywania");
    }
  };

  const handleDownload = (id) => {
    window.open(`${API_BASE}/offers/${id}/pdf`, '_blank');
  };

  const updateField = (field, value) => {
    setCurrentOffer({ ...currentOffer, [field]: value });
  };

  const updateArrayField = (field, index, key, value) => {
    const newArr = [...currentOffer[field]];
    newArr[index][key] = value;
    setCurrentOffer({ ...currentOffer, [field]: newArr });
  };

  const addArrayItem = (field, template) => {
    setCurrentOffer({ ...currentOffer, [field]: [...currentOffer[field], template] });
  };

  const removeArrayItem = (field, index) => {
    const newArr = currentOffer[field].filter((_, i) => i !== index);
    setCurrentOffer({ ...currentOffer, [field]: newArr });
  };

  if (isEditing) {
    return (
      <div className="wysiwyg-editor">
        <div className="editor-toolbar">
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}><ArrowLeft size={18} /> Powrót</button>
          <div className="toolbar-right">
            <button className="btn btn-primary" onClick={handleSave}><Save size={18} /> Zapisz zmiany</button>
          </div>
        </div>

        <div className="offer-preview-container">
          {/* Virtual A4 Page */}
          <div className="offer-page">
            <div className="offer-main">
              <header className="offer-header-main">
                <div className="header-flex">
                  <div>
                    <h1 className="offer-title">Oferta Współpracy</h1>
                    <p className="offer-subtitle">PERSONALIZOWANE ROZWIĄZANIA WEBOWE</p>
                  </div>
                  <div className="offer-contact-header">
                    <p><strong>Aleksander Banaszak</strong></p>
                    <p>a.m.banaszak@icloud.com</p>
                    <p>+48 881 548 644</p>
                    <p>aleksander.cloud</p>
                  </div>
                </div>
              </header>

              <section className="offer-section">
                <h2 className="offer-section-title">Dla kogo:</h2>
                <input 
                  className="wysiwyg-input client-name" 
                  value={currentOffer.clientName} 
                  onChange={(e) => updateField('clientName', e.target.value)}
                  placeholder="[Nazwa Klienta]"
                />
                <p className="offer-date">Data przygotowania: {new Date(currentOffer.createdAt).toLocaleDateString('pl-PL')}</p>
              </section>

              <section className="offer-section">
                <h2 className="offer-section-title">Wstępna propozycja</h2>
                <textarea 
                  className="wysiwyg-textarea" 
                  value={currentOffer.proposal} 
                  onChange={(e) => updateField('proposal', e.target.value)}
                  rows={4}
                />
              </section>

              <section className="offer-section">
                <div className="section-header-flex">
                  <h2 className="offer-section-title">Co robimy / Zakres prac</h2>
                  <button className="btn-add" onClick={() => addArrayItem('scope', { title: '', description: '' })}><Plus size={14} /> Dodaj punkt</button>
                </div>
                <div className="offer-list-grid">
                  {currentOffer.scope.map((item, i) => (
                    <div key={i} className="offer-list-item wysiwyg-item-container">
                      <input 
                        className="wysiwyg-item-title" 
                        value={item.title} 
                        onChange={(e) => updateArrayField('scope', i, 'title', e.target.value)}
                        placeholder="Tytuł usługi"
                      />
                      <textarea 
                        className="wysiwyg-item-desc" 
                        value={item.description} 
                        onChange={(e) => updateArrayField('scope', i, 'description', e.target.value)}
                        placeholder="Opis co wchodzi w skład..."
                        rows={2}
                      />
                      <button className="btn-remove" onClick={() => removeArrayItem('scope', i)}><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="offer-section">
                <div className="section-header-flex">
                  <h2 className="offer-section-title">Harmonogram prac</h2>
                  <button className="btn-add" onClick={() => addArrayItem('timeline', { title: '', duration: '' })}><Plus size={14} /> Dodaj etap</button>
                </div>
                <div className="offer-timeline">
                  {currentOffer.timeline.map((step, i) => (
                    <div key={i} className="timeline-step wysiwyg-item-container">
                      <span className="step-num">0{i + 1}</span>
                      <div className="step-content">
                        <input 
                          className="wysiwyg-timeline-title" 
                          value={step.title} 
                          onChange={(e) => updateArrayField('timeline', i, 'title', e.target.value)}
                          placeholder="Nazwa etapu"
                        />
                        <input 
                          className="wysiwyg-timeline-duration" 
                          value={step.duration} 
                          onChange={(e) => updateArrayField('timeline', i, 'duration', e.target.value)}
                          placeholder="Czas trwania"
                        />
                      </div>
                      <button className="btn-remove" onClick={() => removeArrayItem('timeline', i)}><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="offer-section">
                <div className="section-header-flex">
                  <h2 className="offer-section-title">Szczegółowa wycena</h2>
                  <button className="btn-add" onClick={() => addArrayItem('pricing', { service: '', scope: '', cost: '' })}><Plus size={14} /> Dodaj wiersz</button>
                </div>
                <table className="offer-table">
                  <thead>
                    <tr>
                      <th>Usługa / Etap</th>
                      <th>Zakres</th>
                      <th className="text-right">Koszt (Netto)</th>
                      <th style={{width: '40px'}}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOffer.pricing.map((p, i) => (
                      <tr key={i} className="wysiwyg-table-row">
                        <td><input className="table-input" value={p.service} onChange={(e) => updateArrayField('pricing', i, 'service', e.target.value)} /></td>
                        <td><input className="table-input" value={p.scope} onChange={(e) => updateArrayField('pricing', i, 'scope', e.target.value)} /></td>
                        <td className="text-right"><input className="table-input text-right" value={p.cost} onChange={(e) => updateArrayField('pricing', i, 'cost', e.target.value)} /></td>
                        <td><button className="btn-remove-inline" onClick={() => removeArrayItem('pricing', i)}><Trash2 size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colspan="2">Suma całkowita:</th>
                      <th className="text-right">
                        <input className="table-input text-right total-cost-input" value={currentOffer.totalCost} onChange={(e) => updateField('totalCost', e.target.value)} />
                      </th>
                      <th>PLN</th>
                    </tr>
                  </tfoot>
                </table>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h1>Generator Ofert</h1>
          <p>Witaj, Aleksander</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}><Plus size={18} /> Nowa Oferta</button>
      </header>

      <div className="offer-grid">
        {offers.length === 0 ? (
          <div className="empty-state">
            <p>Nie masz jeszcze żadnych ofert.</p>
            <button className="btn btn-secondary" onClick={handleCreate}>Stwórz swoją pierwszą ofertę</button>
          </div>
        ) : (
          offers.map(offer => (
            <div key={offer.id} className="offer-card">
              <div className="card-content">
                <div className="card-info">
                  <h3>{offer.clientName || 'Klient nienazwany'}</h3>
                  <p>{new Date(offer.createdAt).toLocaleDateString('pl-PL')}</p>
                </div>
                <div className="card-meta">
                  <span>Suma: {offer.totalCost} PLN</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="action-btn" onClick={() => handleDownload(offer.id)} title="Pobierz PDF">
                  <Download size={18} />
                </button>
                <button className="action-btn" onClick={() => handleEdit(offer)} title="Edytuj">
                  <Edit size={18} />
                </button>
                <button className="action-btn btn-danger" onClick={() => handleDelete(offer.id)} title="Usuń">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        :root {
          --bg: #05060f;
          --surface: #0d1021;
          --surface-soft: #161a31;
          --accent: #a5ffcb;
          --text: #ffffff;
          --text-muted: rgba(255, 255, 255, 0.6);
          --danger: #ff4d4d;
        }

        body { margin: 0; background: var(--bg); font-family: 'Space Grotesk', sans-serif; color: var(--text); }

        /* Dashboard Styles */
        .admin-dashboard { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; }
        .logo h1 { font-size: 2.2rem; margin: 0; letter-spacing: -1px; }
        .logo p { margin: 5px 0 0; color: var(--text-muted); font-size: 1rem; }

        .offer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; }
        .offer-card { 
          background: var(--surface); 
          border-radius: 16px; 
          border: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .offer-card:hover { transform: translateY(-5px); border-color: var(--accent); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .card-content { padding: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
        .card-info h3 { margin: 0 0 8px; font-size: 1.3rem; }
        .card-info p { margin: 0; color: var(--text-muted); font-size: 0.9rem; }
        .card-meta { text-align: right; }
        .card-meta span { color: var(--accent); font-weight: 700; font-size: 1.1rem; }
        .card-actions { background: rgba(255,255,255,0.02); padding: 12px 24px; display: flex; gap: 15px; border-top: 1px solid rgba(255,255,255,0.05); }
        .action-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 5px; transition: 0.2s; }
        .action-btn:hover { color: var(--accent); }
        .action-btn.btn-danger:hover { color: var(--danger); }

        /* WYSIWYG Editor Styles */
        .wysiwyg-editor { background: #000; min-height: 100vh; }
        .editor-toolbar { 
          position: sticky; top: 0; z-index: 100;
          background: rgba(13, 16, 33, 0.9); backdrop-filter: blur(10px);
          padding: 15px 30px; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(165, 255, 203, 0.2);
        }
        .offer-preview-container { padding: 40px 20px; display: flex; justify-content: center; }

        /* Virtual A4 mimics the PDF output exactly */
        .offer-page {
          width: 210mm; min-height: 297mm;
          background: linear-gradient(135deg, #0d1021 0%, #05060f 100%);
          box-shadow: 0 0 50px rgba(0,0,0,0.8);
          color: #fff;
        }
        .offer-main { padding: 20mm 18mm; display: flex; flex-direction: column; gap: 25px; }

        /* Direct Input Styling */
        .wysiwyg-input, .wysiwyg-textarea, .table-input {
          background: transparent; border: 1px solid transparent; color: #fff;
          font-family: inherit; width: 100%; transition: 0.2s;
        }
        .wysiwyg-input:hover, .wysiwyg-textarea:hover, .table-input:hover { 
          border-color: rgba(165, 255, 203, 0.2); background: rgba(255,255,255,0.02); 
        }
        .wysiwyg-input:focus, .wysiwyg-textarea:focus, .table-input:focus { 
          outline: none; border-color: var(--accent); background: rgba(255,255,255,0.05); 
        }

        .client-name { font-size: 1.1rem; font-weight: 500; margin-top: 10px; }
        .wysiwyg-textarea { resize: vertical; line-height: 1.6; font-size: 0.9rem; }
        
        .section-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .btn-add { background: transparent; border: 1px dashed var(--accent); color: var(--accent); font-size: 0.8rem; padding: 4px 10px; border-radius: 4px; cursor: pointer; }
        
        .wysiwyg-item-container { position: relative; padding-right: 30px; }
        .btn-remove { position: absolute; right: 0; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--danger); opacity: 0; cursor: pointer; transition: 0.2s; }
        .wysiwyg-item-container:hover .btn-remove { opacity: 0.7; }
        .btn-remove:hover { opacity: 1; }

        .wysiwyg-item-title { font-weight: 700; font-size: 0.95rem; margin-bottom: 4px; color: #fff; }
        .wysiwyg-item-desc { font-size: 0.8rem; color: var(--text-muted); }

        .wysiwyg-timeline-title { font-weight: 700; font-size: 0.95rem; }
        .wysiwyg-timeline-duration { font-size: 0.85rem; color: var(--text-muted); }

        .table-input { font-size: 0.9rem; padding: 4px; }
        .total-cost-input { font-weight: 700; font-size: 1.1rem; color: var(--accent); }
        .btn-remove-inline { background: transparent; border: none; color: var(--danger); cursor: pointer; opacity: 0.5; }
        .btn-remove-inline:hover { opacity: 1; }

        /* Legacy Classes compatibility */
        .offer-header-main { border-bottom: 2px solid var(--accent); padding-bottom: 15px; margin-bottom: 10px; }
        .header-flex { display: flex; justify-content: space-between; align-items: flex-end; }
        .offer-contact-header { text-align: right; font-size: 0.8rem; color: var(--text-light); }
        .offer-contact-header p { margin: 2px 0; }
        .offer-title { font-size: 2.4rem; line-height: 1.05; margin: 0; color: #fff; }
        .offer-subtitle { margin: 6px 0 0; font-size: 0.9rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); }
        .offer-section-title { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.16em; color: var(--accent); margin: 0 0 12px; border-left: 3px solid var(--accent); padding-left: 12px; }
        .offer-date { font-size: 0.85rem; color: var(--text-muted); }
        .offer-list-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .offer-timeline { display: flex; flex-direction: column; gap: 15px; }
        .timeline-step { display: flex; align-items: flex-start; gap: 20px; }
        .step-num { font-size: 1.3rem; font-weight: 700; color: var(--accent); opacity: 0.6; min-width: 35px; }
        .offer-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9rem; }
        .offer-table th, .offer-table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(165,255,203,0.1); }
        .offer-table th { color: var(--accent); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.05em; }
        .text-right { text-align: right !important; }

        /* Common Components */
        .btn { display: flex; align-items: center; gap: 8px; padding: 10px 24px; border-radius: 99px; cursor: pointer; font-weight: 600; border: none; transition: 0.2s; font-family: inherit; }
        .btn-primary { background: var(--accent); color: #000; }
        .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(165,255,203,0.2); }
      `}</style>
    </div>
  );
};

export default App;
