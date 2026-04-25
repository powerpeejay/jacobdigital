/* ============================================================
   AI Buddy — Home + Sidebar + shared components
   ============================================================ */

const { useState, useEffect, useRef, useMemo } = React;

// ── Sidebar ─────────────────────────────────────────────
function Sidebar({ route, onNavigate }) {
  const items = [
    { id: 'home',    label: 'Start',        icon: I.home },
    { id: 'chat',    label: 'Chat',         icon: I.chat },
    { id: 'tools',   label: 'Tool-Übersicht', icon: I.grid },
    { id: 'compare', label: 'Vergleich',    icon: I.compare },
    { id: 'finder',  label: 'Tool-Finder',  icon: I.compass },
  ];
  return (
    <aside className="sidebar">
      <a href="#" className="sb-brand" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
        <span className="dot" />
        <span>Jacob Digital</span>
      </a>

      <div className="sb-peter">
        <div className="avatar"><img src="../Peter.jpg" alt="Peter Jacob" /></div>
        <div className="who">
          <span className="name">Peter Jacob</span>
          <span className="status">Ihr AI-Guide</span>
        </div>
      </div>

      <div>
        <div className="sb-section-label">Navigation</div>
        <nav className="sb-nav">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                className="sb-nav-item"
                data-active={route === it.id ? '' : undefined}
                onClick={() => onNavigate(it.id)}
              >
                <Icon />
                <span>{it.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sb-footer">
        Kostenloses Erstgespräch — keine Verpflichtung.<br />
        <a href="mailto:peter@jacobdigital.de">peter@jacobdigital.de</a>
      </div>
    </aside>
  );
}

// ── Peter greeting block ────────────────────────────────
function PeterGreet({ children }) {
  return (
    <div className="peter-greet">
      <div className="pg-avatar"><img src="../Peter.jpg" alt="Peter Jacob" /></div>
      <div className="pg-text">
        {children}
      </div>
    </div>
  );
}

// ── Peter tip footer block ──────────────────────────────
function PeterTip({ children }) {
  return (
    <div className="peter-tip">
      <div className="pt-avatar"><img src="../Peter.jpg" alt="Peter Jacob" /></div>
      <div>
        <div className="pt-label">Peters Tipp</div>
        <p className="pt-text">{children}</p>
      </div>
    </div>
  );
}

// ── Tool mini card (used on Home) ───────────────────────
function ToolMini({ tool, onClick }) {
  return (
    <button className="tool-mini" onClick={onClick}>
      <div className="tool-mini-head">
        <div className="tool-mini-logo" style={{ background: tool.logoBg }}>{tool.logoMark}</div>
        <div>
          <div className="tool-mini-name">{tool.name}</div>
          <div className="tool-mini-maker">{tool.maker}</div>
        </div>
      </div>
      <p className="tool-mini-body">{tool.oneLine}</p>
      <div className="tool-mini-tag">{tool.tags[0]}</div>
    </button>
  );
}

// ── Home screen ─────────────────────────────────────────
function HomeScreen({ onNavigate, onOpenTool }) {
  const featured = useMemo(() => TOOLS.filter(t => ['claude', 'gamma', 'n8n'].includes(t.id)), []);
  const quickActions = [
    {
      title: 'Welches Tool für meine Aufgabe?',
      body: 'Beschreiben Sie, was Sie konkret erledigen wollen — ich empfehle das passende Tool.',
      cta: 'Tool-Finder starten',
      icon: I.compass,
      go: () => onNavigate('finder'),
    },
    {
      title: 'Claude, GPT, Gemini — was passt?',
      body: 'Direkter Vergleich der großen Chat-Modelle: Kontext, Preis, Stärken, deutsche Qualität.',
      cta: 'Zur Vergleichstabelle',
      icon: I.compare,
      go: () => onNavigate('compare'),
    },
    {
      title: 'Frage an Peter stellen',
      body: 'Freie Fragen zum Thema AI, Tools, Einstieg. Antwort in Jacob-Digital-Stimme, auf den Punkt.',
      cta: 'Chat öffnen',
      icon: I.chat,
      go: () => onNavigate('chat'),
    },
  ];

  return (
    <main className="main">
      <div className="page-head">
        <div className="page-eyebrow">AI Buddy — Ihr Einstieg in AI</div>
        <h1 className="page-title">
          AI ist kein Hype. Es ist <em>Handwerkszeug</em>.
        </h1>
        <p className="page-lede">
          Ich zeige Ihnen, welche Tools heute wirklich Zeit sparen — und welche nur Buzzword sind.
          Kein Pitch, keine Agentur-Sprache. Nur das, was in Ihrem Betrieb morgen funktioniert.
        </p>
      </div>

      <PeterGreet>
        Willkommen. Ich bin Peter Jacob und begleite Sie hier durch die AI-Tool-Landschaft.
        Sagen Sie mir, was Sie vorhaben — und ich zeige Ihnen, welches Tool den größten
        Hebel bringt, was es kostet und wo die Stolpersteine liegen.
        <span className="sig">— Peter Jacob, Hamburg</span>
      </PeterGreet>

      <div className="quick-grid">
        {quickActions.map((qa, i) => {
          const Icon = qa.icon;
          return (
            <button key={i} className="quick-card" onClick={qa.go}>
              <Icon className="qc-icon" />
              <div className="qc-title">{qa.title}</div>
              <div className="qc-body">{qa.body}</div>
              <div className="qc-cta">{qa.cta} <I.arrow style={{ width: 14, height: 14 }} /></div>
            </button>
          );
        })}
      </div>

      <div className="section-heading">
        <div>
          <div className="st-eyebrow">Empfohlen für den Einstieg</div>
          <div className="st-title">Drei Tools, die sofort wirken</div>
        </div>
        <a className="st-link" onClick={() => onNavigate('tools')}>Alle {TOOLS.length} Tools ansehen →</a>
      </div>

      <div className="featured-row">
        {featured.map((t) => <ToolMini key={t.id} tool={t} onClick={() => onOpenTool(t.id)} />)}
      </div>

      <PeterTip>
        Fangen Sie <em>klein</em> an. Ein Tool, eine Aufgabe, zwei Wochen testen — dann entscheiden,
        ob es bleibt. Wer versucht, alles gleichzeitig einzuführen, kommt am Ende nirgendwo an.
      </PeterTip>
    </main>
  );
}

window.Sidebar = Sidebar;
window.HomeScreen = HomeScreen;
window.PeterGreet = PeterGreet;
window.PeterTip = PeterTip;
window.ToolMini = ToolMini;
