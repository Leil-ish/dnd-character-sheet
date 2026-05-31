import { useState } from 'react';
import { getCharacterActions } from '../utils/actions';

const SECTION_LABELS = {
  action:   'Action',
  bonus:    'Bonus Action',
  reaction: 'Reaction',
  free:     'Free / No Action',
};

const SECTION_COLORS = {
  action:   'var(--accent)',
  bonus:    'var(--accent2)',
  reaction: '#7575cc',
  free:     'var(--text-muted)',
};

function ActionCard({ action }) {
  const [expanded, setExpanded] = useState(false);
  const isClass = action.source !== 'Universal' && !action.source.startsWith('Feat');
  const isFeat = action.source.startsWith('Feat');
  return (
    <div className={`action-card${expanded ? ' expanded' : ''}`} onClick={() => setExpanded((v) => !v)}>
      <div className="action-card-header">
        <span className="action-name">{action.name}</span>
        <span className={`action-source-tag${isClass ? ' class-tag' : isFeat ? ' feat-tag' : ''}`}>
          {action.source}
        </span>
        <span className="action-chevron">{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div className="action-description">{action.description}</div>
      )}
    </div>
  );
}

function ActionSection({ type, actions }) {
  if (actions.length === 0) return null;
  return (
    <div className="action-section">
      <div className="action-section-label" style={{ borderLeftColor: SECTION_COLORS[type] }}>
        {SECTION_LABELS[type]}
        <span className="action-count">{actions.length}</span>
      </div>
      <div className="action-cards">
        {actions.map((a) => <ActionCard key={a.id} action={a} />)}
      </div>
    </div>
  );
}

export default function Actions({ character }) {
  const [filter, setFilter] = useState('all');
  const grouped = getCharacterActions(character);
  const sections = ['action', 'bonus', 'reaction', 'free'];

  return (
    <div className="section actions-section">
      <div className="actions-header">
        <h3>Actions Reference — {character.class} {character.level}</h3>
      </div>
      <p className="actions-hint">
        All actions available to your character. Click any to expand. Universal actions are available to everyone; class and feat actions are specific to you.
      </p>

      <div className="actions-filter-row">
        {['all', ...sections].map((f) => (
          <button
            key={f}
            className={`actions-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : SECTION_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="actions-content">
        {sections
          .filter((s) => filter === 'all' || filter === s)
          .map((s) => (
            <ActionSection key={s} type={s} actions={grouped[s]} />
          ))}
      </div>
    </div>
  );
}
