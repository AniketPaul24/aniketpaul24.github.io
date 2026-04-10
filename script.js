// ===== TAB SWITCHING ENGINE =====
const navBtns = document.querySelectorAll('.nav-btn');
const tabs = document.querySelectorAll('.tab');
const topbarTitle = document.getElementById('topbarTitle');
const sidebar = document.getElementById('sidebar');
const burger = document.getElementById('burger');

const labelMap = {
  dashboard: 'Dashboard', about: 'About', education: 'Education',
  experience: 'Experience', skills: 'Skills', projects: 'Projects',
  research: 'Research', contact: 'Contact'
};

function switchTab(tabId) {
  // Deactivate all
  tabs.forEach(t => t.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));

  // Activate target
  const targetTab = document.getElementById('tab-' + tabId);
  const targetBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
  if (targetTab) { targetTab.classList.add('active'); }
  if (targetBtn) { targetBtn.classList.add('active'); }

  // Scroll main back to top
  document.getElementById('main').scrollTop = 0;

  // Update mobile topbar title
  if (topbarTitle) topbarTitle.textContent = labelMap[tabId] || tabId;

  // Close mobile sidebar
  sidebar.classList.remove('open');
}

// Sidebar nav buttons
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// Dashboard CTA / quick card buttons
document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', () => {
    switchTab(el.dataset.goto);
  });
});

// Mobile burger
burger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== burger) {
    sidebar.classList.remove('open');
  }
});

// ===== TERMINAL TYPEWRITER =====
const lines = [
  { type: 'cmd', text: '$ whoami' },
  { type: 'hi',  text: 'aniket.paul' },
  { type: 'cmd', text: '$ cat roles.txt' },
  { type: 'out', text: 'Assistant Professor' },
  { type: 'out', text: 'Cybersecurity Educator' },
  { type: 'out', text: 'Linux Enthusiast' },
  { type: 'cmd', text: '$ nmap --skills self' },
  { type: 'out', text: 'Open: Digital Forensics' },
  { type: 'out', text: 'Open: OSINT / Threat Intel' },
  { type: 'out', text: 'Open: Python / Java / C' },
  { type: 'cmd', text: '$ echo $PHILOSOPHY' },
  { type: 'hi',  text: '"Break it. Learn it. Defend it."' },
];

const termBody = document.getElementById('terminalBody');
let lineIdx = 0, charIdx = 0, currentEl = null;

function typeChar() {
  if (!termBody) return;
  if (lineIdx >= lines.length) {
    setTimeout(() => {
      termBody.innerHTML = '';
      lineIdx = 0; charIdx = 0; currentEl = null;
      typeChar();
    }, 3200);
    return;
  }
  const line = lines[lineIdx];
  if (charIdx === 0) {
    currentEl = document.createElement('div');
    currentEl.className = 't-' + line.type;
    termBody.appendChild(currentEl);
  }
  currentEl.textContent = line.text.slice(0, charIdx + 1);
  charIdx++;
  if (charIdx < line.text.length) {
    setTimeout(typeChar, line.type === 'cmd' ? 52 : 28);
  } else {
    charIdx = 0; lineIdx++;
    termBody.scrollTop = termBody.scrollHeight;
    setTimeout(typeChar, line.type === 'cmd' ? 380 : 110);
  }
}

typeChar();
