/* ============================================================
   AI Buddy — Chat, Tools overview, Detail, Compare, Finder
   ============================================================ */

// ── Chat screen ─────────────────────────────────────────
function ChatScreen({ onNavigate, seedPrompt }) {
  const [messages, setMessages] = useState(() => ([
    {
      role: 'peter',
      text: (
        <>
          <p>Guten Tag. Ich bin Peter. Fragen Sie mich, was Sie zum Thema AI-Tools wissen möchten — direkt, konkret, ohne Marketing-Sprache.</p>
          <p>Ein paar Startpunkte, falls Sie unsicher sind:</p>
        </>
      ),
      chips: [
        'Welches Tool zum Start?',
        'Was ist der Unterschied zwischen Claude und ChatGPT?',
        'Wie füge ich AI in meinen Prozess ein?',
        'Was kostet mich das im Monat realistisch?',
      ],
    },
  ]));
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    if (seedPrompt) send(seedPrompt);
    // eslint-disable-next-line
  }, [seedPrompt]);

  function canned(q) {
    const lower = q.toLowerCase();
    if (lower.includes('start') || lower.includes('einstieg') || lower.includes('anfang')) {
      return (
        <>
          <p>Klare Empfehlung: fangen Sie mit <strong>ChatGPT oder Claude</strong> an. Ein Abo, 20 € im Monat, zwei Wochen konsequent nutzen.</p>
          <p>Regel: <em>Eine echte Aufgabe pro Woche</em> damit erledigen, die Sie sonst gemacht hätten. Nach vier Wochen wissen Sie, ob es für Ihren Betrieb etwas taugt.</p>
          <p>Womit würden Sie anfangen — Text-Arbeit, Recherche, oder Automatisierung?</p>
        </>
      );
    }
    if (lower.includes('claude') && (lower.includes('chatgpt') || lower.includes('gpt'))) {
      return (
        <>
          <p>Kurz: <strong>Claude</strong> ist der nüchterne Analyst, <strong>ChatGPT</strong> das Schweizer Taschenmesser.</p>
          <p>Claude nehme ich, wenn ich lange Texte präzise analysieren muss — Verträge, Angebote, 200-Seiten-PDFs. ChatGPT, wenn ich viel gleichzeitig brauche — Text, Bild, Excel, Voice.</p>
          <p>Wenn Sie sich <em>nur für eins entscheiden</em> müssen: ChatGPT. Wenn Text-Präzision Ihre Kern-Aufgabe ist: Claude.</p>
        </>
      );
    }
    if (lower.includes('kost') || lower.includes('preis') || lower.includes('budget')) {
      return (
        <>
          <p>Realistisches Budget für einen Einzelnen: <strong>20–40 € pro Monat</strong>. Ein Chat-Tool (ChatGPT oder Claude), dazu Perplexity wenn Sie viel recherchieren.</p>
          <p>Für ein kleines Team (5–10 Leute): rechnen Sie mit <strong>150–300 € im Monat</strong> — lohnt sich oft schon nach einer eingesparten Arbeitsstunde pro Woche.</p>
          <p>Teurer wird es erst, wenn Sie in Richtung Automatisierung und API-Nutzung gehen. Da schauen wir dann konkret auf Ihren Fall.</p>
        </>
      );
    }
    if (lower.includes('präsentat') || lower.includes('folie') || lower.includes('deck') || lower.includes('pitch')) {
      return (
        <>
          <p>Dafür gibt es ein Spezial-Tool: <strong>Gamma</strong>. Prompt rein, 30 Sekunden später ein bearbeitbares Deck, Export nach PowerPoint funktioniert sauber.</p>
          <p>Mein Workflow: Stichpunkte in Claude strukturieren → Struktur in Gamma → in PowerPoint feinschleifen. Spart mir pro Deck <em>1–2 Stunden</em>.</p>
        </>
      );
    }
    if (lower.includes('automat') || lower.includes('prozess') || lower.includes('workflow')) {
      return (
        <>
          <p>Der größte Hebel in Ihrem Betrieb sitzt meistens hier. Tool der Wahl: <strong>n8n</strong>.</p>
          <p>Typisches Beispiel: E-Mail kommt rein → Claude extrahiert die Daten → Eintrag im CRM → Kalender-Termin → Bestätigung raus. Vorher 15 Minuten, jetzt 30 Sekunden.</p>
          <p>Bevor wir loslegen: <em>welcher Prozess kostet Sie am meisten Zeit?</em> Dort anfangen.</p>
        </>
      );
    }
    return (
      <>
        <p>Gute Frage. In einem echten Gespräch würde ich Ihnen jetzt drei Gegenfragen stellen: Welche Aufgabe genau, welches Tool-Ökosystem nutzen Sie heute, wie viel Zeit wollen Sie sparen?</p>
        <p>Dieser Buddy ist als Prototyp angelegt — für eine konkrete Empfehlung schreiben Sie mir direkt: <strong>peter@jacobdigital.de</strong>.</p>
      </>
    );
  }

  function send(text) {
    const value = (text || input).trim();
    if (!value) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: value }]);
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'peter', text: canned(value) }]);
      setBusy(false);
    }, 900);
  }

  return (
    <main className="main">
      <div className="page-head">
        <div className="page-eyebrow">Chat mit Peter</div>
        <h1 className="page-title">Fragen Sie <em>direkt</em>.</h1>
        <p className="page-lede">Kein Bot-Geschwätz, keine Disclaimer. Konkrete Antworten zu Tools, Einstieg, Kosten und Einsatzszenarien.</p>
      </div>

      <div className="chat-wrap">
        <div className="chat-head">
          <div className="avatar"><img src="../Peter.jpg" alt="Peter Jacob" /></div>
          <div className="who">
            <div className="name">Peter Jacob</div>
            <div className="sub">Antwortet in der Regel in &lt;1 Minute</div>
          </div>
        </div>

        <div className="chat-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <Message key={i} msg={m} onChip={send} />
          ))}
          {busy && (
            <div className="msg">
              <div className="msg-avatar"><img src="../Peter.jpg" alt="" /></div>
              <div className="msg-bubble"><div className="typing"><span/><span/><span/></div></div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder="Ihre Frage — z.B. «Ich brauche ein Tool für Angebote schreiben»"
          />
          <button onClick={() => send()} disabled={!input.trim() || busy}>
            Senden <I.send style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </main>
  );
}

function Message({ msg, onChip }) {
  if (msg.role === 'user') {
    return (
      <div className="msg msg--user">
        <div className="msg-avatar">SIE</div>
        <div className="msg-bubble"><p>{msg.text}</p></div>
      </div>
    );
  }
  return (
    <div className="msg">
      <div className="msg-avatar"><img src="../Peter.jpg" alt="" /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="msg-bubble">{msg.text}</div>
        {msg.chips && (
          <div className="msg-chips">
            {msg.chips.map((c, i) => (
              <button key={i} className="chip" onClick={() => onChip(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tools overview ──────────────────────────────────────
function ToolsScreen({ onOpenTool }) {
  const [cat, setCat] = useState('all');
  const [tier, setTier] = useState('all'); // all | essential | advanced

  const list = TOOLS.filter(t =>
    (cat === 'all' || t.category === cat) &&
    (tier === 'all' || t.tier === tier)
  );

  // Group by category when "all" is selected so the long list stays scannable.
  const groups = cat === 'all'
    ? TOOL_CATEGORIES.filter(c => c.id !== 'all').map(c => ({
        cat: c,
        items: list.filter(t => t.category === c.id),
      })).filter(g => g.items.length > 0)
    : [{ cat: TOOL_CATEGORIES.find(c => c.id === cat), items: list }];

  const totalCount = TOOLS.length;

  return (
    <main className="main">
      <div className="page-head">
        <div className="page-eyebrow">Tool-Übersicht</div>
        <h1 className="page-title">{totalCount} Tools — <em>kuratiert</em>, nicht komplett.</h1>
        <p className="page-lede">
          Der AI-Markt hat tausende Tools. Hier ist meine kuratierte Auswahl, sortiert nach Einsatzzweck
          und in zwei Reife­stufen: <em>Essentials</em> sind alltagstauglich für jeden,
          <em> Advanced</em> braucht etwas mehr Hintergrund.
        </p>

        <div className="filter-pills" style={{ marginTop: 24 }}>
          {TOOL_CATEGORIES.map((c) => (
            <button key={c.id} className="pill" data-active={cat === c.id ? '' : undefined} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="filter-pills" style={{ marginTop: 12 }}>
          <span className="pill-label">Reifestufe:</span>
          <button className="pill pill--ghost" data-active={tier === 'all' ? '' : undefined} onClick={() => setTier('all')}>Alle</button>
          <button className="pill pill--ghost" data-active={tier === 'essential' ? '' : undefined} onClick={() => setTier('essential')}>Essentials</button>
          <button className="pill pill--ghost" data-active={tier === 'advanced' ? '' : undefined} onClick={() => setTier('advanced')}>Advanced</button>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.cat.id} style={{ marginTop: cat === 'all' ? 48 : 24 }}>
          {cat === 'all' && (
            <div className="section-heading" style={{ marginTop: 0, marginBottom: 16 }}>
              <div>
                <div className="st-eyebrow">{g.cat.label}</div>
                <div className="st-title" style={{ fontSize: 28 }}>{g.items.length} Tool{g.items.length === 1 ? '' : 's'}</div>
              </div>
            </div>
          )}

          <div className="tools-grid">
            {g.items.map((t) => {
              const isLite = !t.body;
              return (
                <button key={t.id} className="tool-card" data-tier={t.tier} onClick={() => onOpenTool(t.id)}>
                  <div className="tool-card-head">
                    <div className="tool-card-logo" style={{ background: t.logoBg }}>{t.logoMark}</div>
                    <div style={{ flex: 1 }}>
                      <div className="tool-card-title">{t.name}</div>
                      <div className="tool-card-maker">{t.maker}</div>
                    </div>
                    <span className={`tier-chip tier-chip--${t.tier}`}>
                      {t.tier === 'essential' ? 'Essential' : 'Advanced'}
                    </span>
                  </div>
                  <p className="tool-card-body">{t.oneLine}</p>
                  {!isLite && (
                    <>
                      <div className="tool-card-rule" />
                      <div className="tool-card-example-label">Beispiel</div>
                      <p className="tool-card-example">{t.example}</p>
                    </>
                  )}
                  <div className="tool-card-foot">
                    <div className="tool-tags">{t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}</div>
                    <div className="tool-card-more">{isLite ? 'Mehr →' : 'Details →'}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <div className="empty-state">
          <p>Keine Tools in dieser Kombination — bitte Filter ändern.</p>
        </div>
      )}

      <PeterTip>
        Starten Sie mit <em>einem Essential-Chat-Tool</em> (ChatGPT oder Claude) und <em>einem Spezialisten</em>
        für Ihre häufigste Aufgabe. Advanced-Tools nehmen Sie erst dazu, wenn die Grundlage steht und der Hebel klar ist.
      </PeterTip>
    </main>
  );
}

// ── Tool detail ─────────────────────────────────────────
function ToolDetail({ toolId, onBack, onOpenChat }) {
  const tool = TOOLS.find(t => t.id === toolId) || TOOLS[0];
  const isLite = !tool.body;
  return (
    <main className="main">
      <button className="td-back" onClick={onBack}>
        <I.back style={{ width: 14, height: 14 }} /> Alle Tools
      </button>

      <div className="tool-detail">
        <div className="td-head">
          <div className="td-logo" style={{ background: tool.logoBg }}>{tool.logoMark}</div>
          <div style={{ flex: 1 }}>
            <div className="td-name">{tool.name}</div>
            <div className="td-maker">{tool.maker} — {tool.access}</div>
          </div>
          <span className={`tier-chip tier-chip--${tool.tier} tier-chip--lg`}>
            {tool.tier === 'essential' ? 'Essential' : 'Advanced'}
          </span>
        </div>

        <div className="td-section" style={{ borderTop: 0, paddingTop: 0, marginTop: 0 }}>
          <div className="td-section-label">Peters Einschätzung</div>
          <h3>{tool.oneLine}</h3>
          {tool.body && <p>{tool.body}</p>}
          {isLite && (
            <p style={{ color: 'var(--fg-2)' }}>
              Dieses Tool ist Teil der erweiterten Auswahl im Stack. Eine ausführliche Einschätzung
              folgt — bis dahin: bei Interesse Peter direkt fragen.
            </p>
          )}
        </div>

        {tool.example && (
          <div className="td-section">
            <div className="td-section-label">Konkretes Beispiel</div>
            <p>{tool.example}</p>
          </div>
        )}

        {tool.strengths && (
          <div className="td-section">
            <div className="td-cols">
              <div>
                <div className="td-section-label">Stärken</div>
                <ul className="td-list">
                  {tool.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <div className="td-section-label">Schwächen</div>
                <ul className="td-list --caution">
                  {tool.weak.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {(tool.useFor || tool.pricing) && (
          <div className="td-section">
            <div className="td-cols">
              {tool.useFor && (
                <div>
                  <div className="td-section-label">Einsatzempfehlung</div>
                  <p>{tool.useFor}</p>
                </div>
              )}
              {tool.pricing && (
                <div>
                  <div className="td-section-label">Preis</div>
                  <p>{tool.pricing}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {isLite && (
          <div className="td-section">
            <div className="td-cols">
              <div>
                <div className="td-section-label">Kategorie</div>
                <p>{(TOOL_CATEGORIES.find(c => c.id === tool.category) || {}).label}</p>
              </div>
              <div>
                <div className="td-section-label">Anbieter</div>
                <p>{tool.maker} — <a href={`https://${tool.url}`} target="_blank" rel="noreferrer">{tool.url}</a></p>
              </div>
            </div>
          </div>
        )}

        <div className="td-useful">
          <div className="qmark">Nicht sicher, ob {tool.name} für Sie passt?</div>
          <p>
            Beschreiben Sie Peter Ihren Anwendungsfall im Chat — er sagt Ihnen, ob {tool.name} das richtige Werkzeug ist
            oder ob ein anderes Tool besser passt.
          </p>
          <button className="chip" style={{ marginTop: 12 }} onClick={() => onOpenChat(`Passt ${tool.name} für meinen Betrieb?`)}>
            {tool.name} im Chat besprechen →
          </button>
        </div>
      </div>
    </main>
  );
}

// ── Compare screen ──────────────────────────────────────
function CompareScreen() {
  const chatTools = TOOLS.filter(t => t.category === 'chat' && t.tier === 'essential' && ['claude','chatgpt','gemini','perplexity'].includes(t.id));
  const rows = [
    { label: 'Stärke', vals: {
      claude: 'Tiefe Text-Analyse',
      chatgpt: 'Allrounder, großes Ökosystem',
      gemini: 'Workspace-Integration',
      perplexity: 'Recherche mit Quellen',
    }},
    { label: 'Kontextfenster', vals: {
      claude: '200k Token',
      chatgpt: '128k Token',
      gemini: '1 Mio. Token',
      perplexity: '···',
    }},
    { label: 'Bilder erstellen', vals: {
      claude: { dot: 'weak', text: 'Nein' },
      chatgpt: { dot: 'good', text: 'Ja, nativ' },
      gemini: { dot: 'good', text: 'Ja' },
      perplexity: { dot: 'weak', text: 'Nein' },
    }},
    { label: 'Dateien analysieren', vals: {
      claude: { dot: 'good', text: 'Sehr gut' },
      chatgpt: { dot: 'good', text: 'Sehr gut' },
      gemini: { dot: 'good', text: 'Gut' },
      perplexity: { dot: 'ok', text: 'Teils' },
    }},
    { label: 'Web-Suche', vals: {
      claude: { dot: 'ok',   text: 'Pro-Feature' },
      chatgpt: { dot: 'good', text: 'Eingebaut' },
      gemini: { dot: 'good', text: 'Google-nativ' },
      perplexity: { dot: 'good', text: 'Kern-Feature' },
    }},
    { label: 'Deutsche Qualität', vals: {
      claude: { dot: 'good', text: 'Exzellent' },
      chatgpt: { dot: 'good', text: 'Sehr gut' },
      gemini: { dot: 'good', text: 'Gut' },
      perplexity: { dot: 'ok', text: 'Ausreichend' },
    }},
    { label: 'Preis (Pro)', vals: {
      claude: '20 € / Mo',
      chatgpt: '23 € / Mo',
      gemini: '22 € / Mo',
      perplexity: '20 € / Mo',
    }},
    { label: 'Peters Wahl wenn...', vals: {
      claude: 'Texte, Verträge, Analyse',
      chatgpt: 'Sie ein Tool wollen',
      gemini: 'Sie Google nutzen',
      perplexity: 'Sie recherchieren',
    }},
  ];

  function Cell({ v }) {
    if (typeof v === 'string') return <>{v}</>;
    return <><span className={`cr-dot cr-dot--${v.dot}`} />{v.text}</>;
  }

  return (
    <main className="main">
      <div className="page-head">
        <div className="page-eyebrow">Vergleich</div>
        <h1 className="page-title">Die vier großen Chat-Modelle <em>im Vergleich</em>.</h1>
        <p className="page-lede">
          Claude, ChatGPT, Gemini, Perplexity — jedes hat einen Sweet Spot. Hier ist die Tabelle,
          die ich mir selbst gemacht habe, um bei Kundengesprächen schnell zu antworten.
        </p>
      </div>

      <div className="compare-wrap">
        <div className="compare-head">
          <div className="ch-cell"><div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-2)', fontWeight: 500 }}>Kriterium</div></div>
          {chatTools.map((t) => (
            <div key={t.id} className="ch-cell">
              <div className="tool-logo" style={{ background: t.logoBg }}>{t.logoMark}</div>
              <div>
                <div className="tool-name">{t.name}</div>
                <div className="tool-maker">{t.maker}</div>
              </div>
            </div>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={i} className="compare-row">
            <div className="cr-label">{r.label}</div>
            {chatTools.map((t) => (
              <div key={t.id} className="cr-cell"><Cell v={r.vals[t.id]} /></div>
            ))}
          </div>
        ))}
      </div>

      <PeterTip>
        Meine Faustregel: Wenn Sie <em>nicht wissen</em>, welches Sie brauchen — nehmen Sie ChatGPT.
        Wenn Sie viel Text in Ruhe analysieren — Claude. Wenn Sie in Google leben — Gemini.
        Wenn Sie Fakten zitieren müssen — Perplexity.
      </PeterTip>
    </main>
  );
}

// ── Tool-Finder (decision tree) ─────────────────────────
function FinderScreen({ onOpenTool, onOpenChat }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const steps = [
    {
      q: 'Was wollen Sie konkret erledigen?',
      options: [
        { label: 'Texte analysieren, schreiben, zusammenfassen', value: 'text' },
        { label: 'Präsentationen oder Dokumente erstellen', value: 'docs' },
        { label: 'Recherche mit belastbaren Quellen', value: 'research' },
        { label: 'Bilder produzieren', value: 'image' },
        { label: 'Audio oder Stimme produzieren', value: 'audio' },
        { label: 'Video erstellen oder bearbeiten', value: 'video' },
        { label: 'Prozesse zwischen Tools automatisieren', value: 'auto' },
        { label: 'Code schreiben oder Prototypen bauen', value: 'code' },
        { label: 'Backend / eigene App bauen', value: 'app' },
      ],
    },
    {
      q: 'Wie tief sollen Sie einsteigen?',
      options: [
        { label: 'Kurz ausprobieren — maximal 30 Minuten Aufwand', value: 'light' },
        { label: 'Ein paar Wochen konsequent testen', value: 'medium' },
        { label: 'In meinen Arbeitsalltag fest einbauen', value: 'deep' },
      ],
    },
  ];

  const recommend = () => {
    const { task } = answers;
    const map = {
      text: 'claude',
      docs: 'gamma',
      research: 'perplexity',
      image: 'midjourney',
      audio: 'elevenlabs',
      video: 'runway',
      auto: 'n8n',
      code: 'cursor',
      app: 'supabase',
    };
    return map[task] || 'chatgpt';
  };

  function answer(val) {
    const key = step === 0 ? 'task' : 'depth';
    setAnswers({ ...answers, [key]: val });
    setStep(step + 1);
  }

  function reset() {
    setStep(0); setAnswers({});
  }

  if (step >= steps.length) {
    const rec = TOOLS.find(t => t.id === recommend());
    return (
      <main className="main">
        <div className="page-head">
          <div className="page-eyebrow">Tool-Finder — Ergebnis</div>
          <h1 className="page-title">Meine Empfehlung: <em>{rec.name}</em>.</h1>
          <p className="page-lede">
            Basierend auf Ihrer Aufgabe {` (`}{steps[0].options.find(o => o.value === answers.task)?.label.toLowerCase()}{`)`} ist das Tool, mit dem
            ich selbst anfangen würde.
          </p>
        </div>

        <div className="tool-detail">
          <div className="td-head">
            <div className="td-logo" style={{ background: rec.logoBg }}>{rec.logoMark}</div>
            <div>
              <div className="td-name">{rec.name}</div>
              <div className="td-maker">{rec.maker}</div>
            </div>
          </div>
          <div className="td-section" style={{ borderTop: 0, paddingTop: 0, marginTop: 0 }}>
            <div className="td-section-label">Warum dieses Tool</div>
            <p>{rec.body || rec.oneLine}</p>
          </div>
          <div className="td-section">
            <div className="td-section-label">Konkret loslegen</div>
            <p>Gehen Sie auf <strong>{rec.access}</strong>, legen Sie einen kostenlosen Account an und probieren Sie in den ersten 20 Minuten eine echte Aufgabe aus Ihrem Betrieb aus. Nicht länger überlegen — einfach machen.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="chip" onClick={reset}>Neu starten</button>
            <button className="chip" onClick={() => onOpenTool(rec.id)}>Details zu {rec.name}</button>
            <button className="chip" onClick={() => onOpenChat(`Ich will mit ${rec.name} starten — wie genau?`)}>Im Chat weiterreden</button>
          </div>
        </div>
      </main>
    );
  }

  const cur = steps[step];
  return (
    <main className="main">
      <div className="page-head">
        <div className="page-eyebrow">Tool-Finder — Schritt {step + 1} von {steps.length}</div>
        <h1 className="page-title">{cur.q}</h1>
        <p className="page-lede">Zwei kurze Fragen. Am Ende sage ich Ihnen, mit welchem Tool Sie beginnen sollten.</p>
      </div>

      <div className="quick-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {cur.options.map((opt, i) => (
          <button key={i} className="quick-card" onClick={() => answer(opt.value)}>
            <div className="qc-title">{opt.label}</div>
            <div className="qc-cta">Weiter <I.arrow style={{ width: 14, height: 14 }} /></div>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button className="td-back" style={{ marginTop: 24 }} onClick={() => setStep(step - 1)}>
          <I.back style={{ width: 14, height: 14 }} /> Zurück
        </button>
      )}
    </main>
  );
}

window.ChatScreen = ChatScreen;
window.ToolsScreen = ToolsScreen;
window.ToolDetail = ToolDetail;
window.CompareScreen = CompareScreen;
window.FinderScreen = FinderScreen;
