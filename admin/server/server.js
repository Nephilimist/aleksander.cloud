const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'offers.json');
const ASSETS_PATH = path.join(__dirname, '../../assets');

app.use(cors());
app.use(bodyParser.json());

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeJsonSync(DATA_FILE, []);
}

// Get all offers
app.get('/api/offers', async (req, res) => {
    const offers = await fs.readJson(DATA_FILE);
    res.json(offers);
});

// Create offer
app.post('/api/offers', async (req, res) => {
    const offers = await fs.readJson(DATA_FILE);
    const newOffer = { ...req.body, id: uuidv4(), createdAt: new Date() };
    offers.push(newOffer);
    await fs.writeJson(DATA_FILE, offers);
    res.status(201).json(newOffer);
});

// Update offer
app.put('/api/offers/:id', async (req, res) => {
    const { id } = req.params;
    let offers = await fs.readJson(DATA_FILE);
    const index = offers.findIndex(o => o.id === id);
    if (index === -1) return res.status(404).send('Offer not found');
    
    offers[index] = { ...offers[index], ...req.body };
    await fs.writeJson(DATA_FILE, offers);
    res.json(offers[index]);
});

// Delete offer
app.delete('/api/offers/:id', async (req, res) => {
    const { id } = req.params;
    let offers = await fs.readJson(DATA_FILE);
    offers = offers.filter(o => o.id !== id);
    await fs.writeJson(DATA_FILE, offers);
    res.status(204).send();
});

// Generate PDF
app.get('/api/offers/:id/pdf', async (req, res) => {
    const { id } = req.params;
    const offers = await fs.readJson(DATA_FILE);
    const offer = offers.find(o => o.id === id);
    if (!offer) return res.status(404).send('Offer not found');

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Injected HTML template (simplified based on the previous work)
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
            <meta charset="UTF-8" />
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <style>
                ${fs.readFileSync(path.join(__dirname, '../../assets/css/offer.css'), 'utf8')}
                @media print {
                    html, body.offer-body {
                        background: linear-gradient(135deg, #0d1021 0%, #05060f 100%) !important;
                        -webkit-print-color-adjust: exact !important;
                    }
                }
                body.offer-body { background: #05060f; }
            </style>
        </head>
        <body class="offer-body">
            <main class="offer-document">
                <section class="offer-page">
                    <section class="offer-main">
                        <header class="offer-header-main">
                            <div class="header-flex">
                                <div>
                                    <h1 class="offer-title">Oferta Współpracy</h1>
                                    <p class="offer-subtitle">PERSONALIZOWANE ROZWIĄZANIA WEBOWE</p>
                                </div>
                                <div class="offer-contact-header">
                                    <p><strong>Aleksander Banaszak</strong></p>
                                    <p>a.m.banaszak@icloud.com</p>
                                    <p>+48 881 548 644</p>
                                    <p>aleksander.cloud</p>
                                </div>
                            </div>
                        </header>

                        <section class="offer-section">
                            <h2 class="offer-section-title">Dla kogo: ${offer.clientName}</h2>
                            <p class="offer-date">Data przygotowania: ${new Date(offer.createdAt).toLocaleDateString('pl-PL')}</p>
                        </section>

                        <section class="offer-section">
                            <h2 class="offer-section-title">Wstępna propozycja</h2>
                            <p class="offer-text">${offer.proposal}</p>
                        </section>

                        <section class="offer-section">
                            <h2 class="offer-section-title">Co robimy / Zakres prac</h2>
                            <div class="offer-list-grid">
                                ${offer.scope.map(item => `
                                    <div class="offer-list-item">
                                        <h3>${item.title}</h3>
                                        <p>${item.description}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </section>

                        <section class="offer-section">
                            <h2 class="offer-section-title">Harmonogram prac</h2>
                            <div class="offer-timeline">
                                ${offer.timeline.map((step, idx) => `
                                    <div class="timeline-step">
                                        <span class="step-num">0${idx + 1}</span>
                                        <div class="step-content">
                                            <strong>${step.title}</strong>
                                            <p>${step.duration}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </section>

                        <section class="offer-section">
                            <h2 class="offer-section-title">Szczegółowa wycena</h2>
                            <table class="offer-table">
                                <thead>
                                    <tr>
                                        <th>Usługa / Etap</th>
                                        <th>Zakres</th>
                                        <th class="text-right">Koszt (Netto)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${offer.pricing.map(item => `
                                        <tr>
                                            <td>${item.service}</td>
                                            <td>${item.scope}</td>
                                            <td class="text-right">${item.cost} PLN</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colspan="2">Suma całkowita:</th>
                                        <th class="text-right">${offer.totalCost} PLN</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </section>

                        <section class="offer-section footer-note">
                            <p class="offer-text italic">
                                * Podane ceny są kwotami netto. Oferta jest ważna przez 14 dni od daty wystawienia.
                            </p>
                        </section>
                    </section>
                </section>
            </main>
        </body>
        </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        await browser.close();

        res.contentType("application/pdf");
        res.send(pdf);
    } catch (err) {
        console.error(err);
        await browser.close();
        res.status(500).send('Error generating PDF');
    }
});

app.listen(PORT, () => {
    console.log(`Admin Backend running on http://localhost:${PORT}`);
});
