// Axiom Autonomous Agent Operations - Client Controller
document.addEventListener('DOMContentLoaded', () => {
  // 1. Tagline Word Reveal (Mandatory per B11)
  initTaglineWordReveal();

  // 2. Scroll Reveal Animations (IntersectionObserver per B7)
  initScrollReveals();

  // 3. Floating Nav state & active link tracking
  initNavigation();

  // 4. Live Agent Swarm Telemetry Inspector
  initSwarmInspector();

  // 5. Pricing Billing Period Toggle
  initBillingToggle();

  // 6. Enterprise Demo Modal (<dialog> with light-dismiss & validation)
  initDemoModal();

  // 7. Interactive API Snippet Copy
  initCodeCopy();
});

function initTaglineWordReveal() {
  const container = document.getElementById('tagline-words');
  if (!container) return;

  const text = container.getAttribute('data-text') || container.textContent.trim();
  const words = text.split(/\s+/);
  container.innerHTML = '';

  words.forEach((word) => {
    const span = document.createElement('span');
    span.className = 'tagline-word';
    span.textContent = word;
    container.appendChild(span);
  });

  const wordSpans = container.querySelectorAll('.tagline-word');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          wordSpans.forEach((span, index) => {
            setTimeout(() => {
              span.classList.add('revealed');
            }, index * 45);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    observer.observe(container);
  } else {
    wordSpans.forEach(span => span.classList.add('revealed'));
  }
}

function initScrollReveals() {
  const targets = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

function initNavigation() {
  const nav = document.getElementById('main-nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          nav?.classList.add('scrolled');
        } else {
          nav?.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            currentSectionId = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initSwarmInspector() {
  const agentsCounter = document.getElementById('stat-agents');
  const tokenCounter = document.getElementById('stat-tokens');
  const latencyDisplay = document.getElementById('stat-latency');
  const logFeed = document.getElementById('log-feed');
  const toggleBtn = document.getElementById('toggle-stream-btn');

  if (!agentsCounter || !tokenCounter || !latencyDisplay || !logFeed) return;

  let isStreaming = true;
  let baseAgents = 14280;
  let baseTokens = 284910;
  let baseLatency = 382;

  const logEvents = [
    { agent: 'agent.recon.04', action: 'Schema validated via strict Pydantic model', status: 'PASS', time: '12ms' },
    { agent: 'agent.auth.19', action: 'PII redacted on downstream vector retrieval', status: 'MASK', time: '8ms' },
    { agent: 'agent.fin.02', action: 'Reconciled invoice #INV-8841 via Stripe API', status: 'DONE', time: '410ms' },
    { agent: 'agent.route.08', action: 'Fallback to Anthropic Claude 3.5 Sonnet on rate limit', status: 'ROUTE', time: '185ms' },
    { agent: 'agent.audit.31', action: 'Signed cryptographic batch hash to immutability log', status: 'SIG', time: '3ms' },
    { agent: 'agent.exec.12', action: 'Executed sandbox Python container without network egress', status: 'SECURE', time: '620ms' },
    { agent: 'agent.cache.01', action: 'Semantic cache hit for customer onboarding intent', status: 'CACHE', time: '4ms' }
  ];

  let logIndex = 0;

  const interval = setInterval(() => {
    if (!isStreaming) return;

    // Small jitter simulation
    baseAgents += Math.floor(Math.random() * 5) - 2;
    baseTokens += Math.floor(Math.random() * 320) - 140;
    const currentLatency = baseLatency + Math.floor(Math.random() * 18) - 8;

    agentsCounter.textContent = baseAgents.toLocaleString('en-US');
    tokenCounter.textContent = baseTokens.toLocaleString('en-US') + ' tps';
    latencyDisplay.textContent = currentLatency + 'ms';

    // Add new log entry
    const ev = logEvents[logIndex % logEvents.length];
    logIndex++;

    const row = document.createElement('div');
    row.className = 'font-mono text-xs flex items-center justify-between py-1 border-b border-[var(--border-subtle)]';
    row.style.opacity = '0';
    row.style.transform = 'translateY(-4px)';
    row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    row.innerHTML = `
      <div class="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
        <span class="text-[var(--text-muted)]">${new Date().toISOString().substring(11, 19)}</span>
        <span class="text-[var(--accent-primary)] font-semibold">${ev.agent}</span>
        <span class="text-[var(--text-secondary)]">${ev.action}</span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span class="text-[var(--status-emerald)] px-1.5 py-0.5 rounded bg-[rgba(16,185,129,0.1)] text-[10px]">${ev.status}</span>
        <span class="text-[var(--text-muted)]">${ev.time}</span>
      </div>
    `;

    logFeed.insertBefore(row, logFeed.firstChild);

    // Keep log max length controlled
    if (logFeed.children.length > 6) {
      logFeed.removeChild(logFeed.lastChild);
    }

    requestAnimationFrame(() => {
      row.style.opacity = '1';
      row.style.transform = 'translateY(0)';
    });
  }, 1800);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isStreaming = !isStreaming;
      toggleBtn.textContent = isStreaming ? 'Pause stream' : 'Resume stream';
    });
  }
}

function initBillingToggle() {
  const toggle = document.getElementById('billing-toggle');
  const starterPrice = document.getElementById('price-starter');
  const scalePrice = document.getElementById('price-scale');
  const periodLabels = document.querySelectorAll('.billing-period-label');

  if (!toggle || !starterPrice || !scalePrice) return;

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    if (isAnnual) {
      starterPrice.textContent = '$0';
      scalePrice.textContent = '$384';
      periodLabels.forEach(l => l.textContent = '/ month, billed annually');
    } else {
      starterPrice.textContent = '$0';
      scalePrice.textContent = '$480';
      periodLabels.forEach(l => l.textContent = '/ month');
    }
  });
}

function initDemoModal() {
  const modal = document.getElementById('demo-modal');
  const openButtons = document.querySelectorAll('[data-open-modal="demo-modal"]');
  const closeButton = document.getElementById('close-modal-btn');
  const demoForm = document.getElementById('demo-form');
  const successState = document.getElementById('demo-success');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.showModal();
    });
  });

  closeButton?.addEventListener('click', () => {
    modal.close();
  });

  // Light dismiss: click outside dialog box
  modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      modal.close();
    }
  });

  demoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('demo-email');
    if (!emailInput || !emailInput.checkValidity()) {
      emailInput?.reportValidity();
      return;
    }

    demoForm.style.display = 'none';
    if (successState) {
      successState.style.display = 'block';
    }
  });
}

function initCodeCopy() {
  const copyBtn = document.getElementById('copy-curl-btn');
  const codeBlock = document.getElementById('curl-code');

  if (!copyBtn || !codeBlock) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(codeBlock.textContent.trim());
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied to clipboard';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  });
}
