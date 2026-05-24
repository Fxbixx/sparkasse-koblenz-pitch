const offers = [
  {
    bank: 'Sparkasse Koblenz',
    type: 'privatkredit',
    title: 'Privatkredit mit regionaler Beratung',
    rateFrom: 6.9,
    speed: 8,
    trust: 10,
    regional: true,
    badge: 'Empfohlen',
    reasons: ['Regional & persönlich', 'Starke Vertrauenssignale', 'Guter Mix aus digital + Beratung'],
    cta: 'Zur Sparkasse-Anfrage'
  },
  {
    bank: 'DirektBank 24',
    type: 'privatkredit',
    title: 'Online-Ratenkredit',
    rateFrom: 5.8,
    speed: 9,
    trust: 6,
    regional: false,
    badge: 'Günstiger Zins',
    reasons: ['Schnelle Online-Strecke', 'Günstiger Zinssatz', 'Wenig persönliche Begleitung'],
    cta: 'Mehr erfahren'
  },
  {
    bank: 'Sparkasse Koblenz',
    type: 'schnellkredit',
    title: 'Schnellkredit mit sicherem Ablauf',
    rateFrom: 7.2,
    speed: 9,
    trust: 10,
    regional: true,
    badge: 'Top für Vertrauen',
    reasons: ['Schneller Einstieg', 'Seriös & regional', 'Ideal für Nutzer mit Beratungsbedarf'],
    cta: 'Schnellkredit ansehen'
  },
  {
    bank: 'FastCredit Online',
    type: 'schnellkredit',
    title: 'Sofortkredit online',
    rateFrom: 6.1,
    speed: 10,
    trust: 5,
    regional: false,
    badge: 'Sehr schnell',
    reasons: ['Starke Geschwindigkeit', 'Digital fokussiert', 'Weniger Vertrauensanker'],
    cta: 'Zum Angebot'
  },
  {
    bank: 'Sparkasse Koblenz',
    type: 'baufinanzierung',
    title: 'Baufinanzierung mit regionalem Ansprechpartner',
    rateFrom: 3.7,
    speed: 7,
    trust: 10,
    regional: true,
    badge: 'Regional stark',
    reasons: ['Komplexe Fälle gut erklärbar', 'Vertrauen bei hoher Summe', 'Persönliche Begleitung wichtig'],
    cta: 'Baufinanzierung starten'
  },
  {
    bank: 'Baufi Direkt',
    type: 'baufinanzierung',
    title: 'Digitale Baufinanzierung',
    rateFrom: 3.4,
    speed: 8,
    trust: 6,
    regional: false,
    badge: 'Zinsfokus',
    reasons: ['Leicht besserer Zins', 'Digitale Strecke', 'Weniger lokale Bindung'],
    cta: 'Mehr erfahren'
  },
  {
    bank: 'Sparkasse Koblenz',
    type: 'modernisierung',
    title: 'Modernisierungskredit vor Ort erklärt',
    rateFrom: 6.4,
    speed: 8,
    trust: 10,
    regional: true,
    badge: 'Empfohlen',
    reasons: ['Förder-/Sanierungsgespräche einfacher', 'Regionaler Kontext', 'Guter Hybrid aus digital und menschlich'],
    cta: 'Modernisierung planen'
  },
  {
    bank: 'AutoLoan Direkt',
    type: 'autokredit',
    title: 'Autokredit online',
    rateFrom: 5.5,
    speed: 9,
    trust: 6,
    regional: false,
    badge: 'Beliebt',
    reasons: ['Niedrige Rate', 'Sehr digital', 'Kaum regionale Bindung'],
    cta: 'Zum Autokredit'
  },
  {
    bank: 'Sparkasse Koblenz',
    type: 'autokredit',
    title: 'Autokredit mit Beratung und klaren Schritten',
    rateFrom: 6.1,
    speed: 8,
    trust: 10,
    regional: true,
    badge: 'Sicher & klar',
    reasons: ['Vertrauensvorsprung', 'Saubere Begleitung', 'Gut für sicherheitsorientierte Nutzer'],
    cta: 'Autokredit ansehen'
  }
];

const loanType = document.getElementById('loanType');
const amount = document.getElementById('amount');
const amountLabel = document.getElementById('amountLabel');
const priority = document.getElementById('priority');
const resultsList = document.getElementById('resultsList');
const resultSummary = document.getElementById('resultSummary');

function formatEuro(value) {
  return new Intl.NumberFormat('de-DE').format(value) + ' €';
}

function monthlyRate(amountValue, apr) {
  const monthly = amountValue * (apr / 100) / 12 + amountValue / 48;
  return Math.round(monthly);
}

function scoreOffer(offer, mode) {
  const base = 100 - offer.rateFrom * 5 + offer.speed * 3 + offer.trust * 4;
  if (mode === 'rate') return 200 - offer.rateFrom * 14 + offer.speed;
  if (mode === 'speed') return offer.speed * 15 + offer.trust * 4 - offer.rateFrom * 3;
  if (mode === 'trust') return offer.trust * 18 + (offer.regional ? 25 : 0) + offer.speed * 2 - offer.rateFrom * 2;
  return base + (offer.regional ? 10 : 0);
}

function render() {
  const type = loanType.value;
  const amountValue = Number(amount.value);
  const mode = priority.value;
  amountLabel.textContent = formatEuro(amountValue);

  let filtered = offers.filter(o => type === 'all' ? true : o.type === type);
  filtered = filtered
    .map(o => ({ ...o, score: scoreOffer(o, mode) }))
    .sort((a, b) => b.score - a.score);

  resultSummary.textContent =
    mode === 'rate' ? 'Sortierung nach möglichst niedriger Rate.' :
    mode === 'speed' ? 'Sortierung nach schneller Entscheidung.' :
    mode === 'trust' ? 'Sortierung nach Vertrauen & Regionalität.' :
    'Sortierung nach ausgewogener Empfehlung.';

  resultsList.innerHTML = filtered.map((offer, index) => {
    const featured = index === 0 ? ' featured-result' : '';
    const sparkasse = offer.bank === 'Sparkasse Koblenz' ? ' sparkasse-result' : '';
    return `
      <article class="result-card${featured}${sparkasse}">
        <div class="result-top">
          <div>
            <span class="badge ${offer.bank === 'Sparkasse Koblenz' ? '' : 'soft'}">${offer.badge}</span>
            <h3>${offer.bank}</h3>
            <p class="result-title">${offer.title}</p>
          </div>
          <div class="rate-box">
            <strong>ab ${offer.rateFrom.toFixed(1).replace('.', ',')} %</strong>
            <span>eff. Jahreszins</span>
          </div>
        </div>
        <div class="result-meta">
          <div><span>Monatsrate</span><strong>ca. ${formatEuro(monthlyRate(amountValue, offer.rateFrom))}</strong></div>
          <div><span>Schnelligkeit</span><strong>${offer.speed}/10</strong></div>
          <div><span>Vertrauen</span><strong>${offer.trust}/10</strong></div>
        </div>
        <ul class="reason-list">
          ${offer.reasons.map(r => `<li>${r}</li>`).join('')}
        </ul>
        <div class="result-actions">
          <button type="button" class="btn btn-primary">${offer.cta}</button>
          <button type="button" class="btn btn-secondary">Details</button>
        </div>
      </article>
    `;
  }).join('');
}

[loanType, amount, priority].forEach(el => el.addEventListener('input', render));
render();