import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import AbilityScores from './components/AbilityScores';
import Skills from './components/Skills';
import Combat from './components/Combat';
import Attacks from './components/Attacks';
import Spells from './components/Spells';
import Notes from './components/Notes';
import { defaultCharacter } from './utils/defaultCharacter';
import './App.css';

const STORAGE_KEY = 'dnd-character-sheet';
const TABS = ['Combat', 'Spells', 'Notes'];

function loadCharacter() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultCharacter, ...JSON.parse(saved) };
  } catch {}
  return { ...defaultCharacter };
}

export default function App() {
  const [character, setCharacter] = useState(loadCharacter);
  const [activeTab, setActiveTab] = useState('Combat');
  const [saveStatus, setSaveStatus] = useState('saved');
  const saveTimer = useRef(null);

  useEffect(() => {
    setSaveStatus('unsaved');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
      setSaveStatus('saved');
    }, 800);
  }, [character]);

  const update = (partial) => setCharacter((prev) => ({ ...prev, ...partial }));

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        setCharacter({ ...defaultCharacter, ...data });
      } catch {
        alert('Invalid character file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const newCharacter = () => {
    if (confirm('Start a new character? This will clear the current sheet (export first to save).')) {
      setCharacter({ ...defaultCharacter });
    }
  };

  return (
    <div className="app">
      <div className="toolbar">
        <span className="app-title">D&D 5e Character Sheet</span>
        <div className="toolbar-actions">
          <span className={`save-status ${saveStatus}`}>{saveStatus === 'saved' ? '✓ Saved' : '● Unsaved'}</span>
          <button onClick={newCharacter}>New</button>
          <button onClick={exportJSON}>Export JSON</button>
          <label className="import-btn">
            Import JSON
            <input type="file" accept=".json" onChange={importJSON} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div className="sheet-layout">
        <div className="left-col">
          <Header character={character} onChange={update} />
          <AbilityScores character={character} onChange={update} />
          <Skills character={character} onChange={update} />
        </div>

        <div className="right-col">
          <div className="tabs">
            {TABS.map((tab) => (
              <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'Combat' && (
              <>
                <Combat character={character} onChange={update} />
                <Attacks character={character} onChange={update} />
              </>
            )}
            {activeTab === 'Spells' && <Spells character={character} onChange={update} />}
            {activeTab === 'Notes' && <Notes character={character} onChange={update} />}
          </div>
        </div>
      </div>
    </div>
  );
}
