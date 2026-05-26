const offers = {
  privatkredit: {
    title: 'Privatkredit der Sparkasse Koblenz',
    rate: 'ab 6,9 %',
    reason: 'stark für freie Verwendung, planbare Monatsraten und vertrauensvolle regionale Beratung',
    speed: '8/10',
    trust: '10/10',
    payment: amount => `ca. ${formatEuro(Math.round(amount / 48 + amount * 0.069 / 12))}/Monat`
  },
  schnellkredit: {
    title: 'Schnellkredit der Sparkasse Koblenz',
    rate: 'ab 7,2 %',
    reason: 'stark wenn Tempo, Klarheit und ein sicherer digitaler Einstieg wichtig sind',
    speed: '9/10',
    trust: '10/10',
    payment: amount => `ca. ${formatEuro(Math.round(amount / 42 + amount * 0.072 / 12))}/Monat`
  },
  baufinanzierung: {
    title: 'Baufinanzierung der Sparkasse Koblenz',
    rate: 'ab 3,7 %',
    reason: 'ideal für größere Entscheidungen mit Beratungsbedarf, regionaler Expertise und persönlichem Ansprechpartner',
    speed: '7/10',
    trust: '10/10',
    payment: amount => `ab ${formatEuro(Math.round(amount * 0.0031))}/Monat*`
  },
  modernisierung: {
    title: 'Modernisierungskredit der Sparkasse Koblenz',
    rate: 'ab 6,4 %',
    reason: 'passt gut bei Renovierung, Sanierung oder energetischen Maßnahmen mit Förder- und Beratungsbedarf',
    speed: '8/10',
    trust: '10/10',
    payment: amount => `ca. ${formatEuro(Math.round(amount / 54 + amount * 0.064 / 12))}/Monat`
  }
};

const loanType = document.getElementById('loanType');
const amount = document.getElementById('amount');
const amountLabel = document.getElementById('amountLabel');
const priority = document.getElementById('priority');
const recommendation = document.getElementById('recommendation');
const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const leadForm = document.getElementById('leadForm');
const leadStatus = document.getElementById('leadStatus');

function formatEuro(n) {
  return new Intl.NumberFormat('de-DE').format(n) + ' €';
}

function renderRecommendation() {
  const type = loanType.value;
  const amountValue = Number(amount.value);
  const selected = offers[type];
  amountLabel.textContent = formatEuro(amountValue);

  const priorityLine = {
    balanced: 'Ausgewogene Empfehlung aus Vertrauen, Klarheit und digitalem Einstieg.',
    speed: 'Gewichtung auf schnelle Entscheidung und zügigen Prozess.',
    trust: 'Gewichtung auf regionale Sicherheit und persönliche Begleitung.',
    rate: 'Gewichtung stärker auf planbare Monatsrate.'
  }[priority.value];

  recommendation.innerHTML = `
    <div class="recommendation-card">
      <h3>${selected.title}</h3>
      <p>${selected.reason}</p>
      <div class="recommendation-meta">
        <div><span>Zins</span><strong>${selected.rate}</strong></div>
        <div><span>Geschwindigkeit</span><strong>${selected.speed}</strong></div>
        <div><span>Monatsrate</span><strong>${selected.payment(amountValue)}</strong></div>
      </div>
      <p><strong>Warum oben?</strong> ${priorityLine}</p>
      <button class="btn btn-primary" onclick="document.getElementById('lead').scrollIntoView({behavior:'smooth'})">Beratung anfragen</button>
    </div>
  `;
}

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function answerQuestion(q) {
  const text = q.toLowerCase();
  if (text.includes('renov') || text.includes('modern')) return 'Für Renovierung oder Sanierung wäre in dieser Demo meist der Modernisierungskredit passend. Die Sparkasse Koblenz kann hier zusätzlich mit regionaler Beratung und Förderhinweisen punkten.';
  if (text.includes('unterschied') || text.includes('privatkredit') || text.includes('schnellkredit')) return 'Ein Privatkredit ist meist der breitere Standardfall mit planbaren Raten. Ein Schnellkredit ist stärker auf Tempo und einfachen digitalen Einstieg ausgelegt. In der Demo soll die KI genau solche Unterschiede schnell erklären.';
  if (text.includes('bau') || text.includes('unterlagen')) return 'Bei Baufinanzierung sind meist Einkommensnachweise, Objektunterlagen, Eigenkapitalübersicht und bestehende Finanzierungen relevant. Die echte KI könnte hier eine Unterlagen-Checkliste vorbereiten.';
  if (text.includes('welcher kredit')) return 'Das hängt vor allem von Verwendungszweck, Höhe und gewünschter Geschwindigkeit ab. Genau dafür ist der Kreditfinder gedacht.';
  return 'Die Demo-KI würde hier den Bedarf einordnen, passende Kreditarten erklären und den Nutzer in Anfrage, Rückruf oder Beratung weiterführen.';
}

function sendQuestion(prefill) {
  const q = prefill || chatInput.value.trim();
  if (!q) return;
  addMessage('user', q);
  chatInput.value = '';
  setTimeout(() => addMessage('bot', answerQuestion(q)), 250);
}

loanType.addEventListener('input', renderRecommendation);
amount.addEventListener('input', renderRecommendation);
priority.addEventListener('input', renderRecommendation);
sendBtn.addEventListener('click', () => sendQuestion());
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendQuestion(); });
document.querySelectorAll('.suggestion').forEach(btn => btn.addEventListener('click', () => sendQuestion(btn.dataset.q)));
leadForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('leadName').value.trim();
  const email = document.getElementById('leadEmail').value.trim();
  const interest = document.getElementById('leadInterest').value;
  if (!name || !email) {
    leadStatus.textContent = 'Bitte Name und E-Mail ausfüllen.';
    return;
  }
  leadStatus.textContent = `Demo gespeichert: ${name} (${email}) mit Interesse an ${interest}. In einer echten Version würde das jetzt ins Backend/CRM laufen.`;
  leadForm.reset();
});

renderRecommendation();