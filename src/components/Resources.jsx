import { getClassResources, getRaceResources, mergeResources } from '../utils/calculations';

function ResourceRow({ resource, onChange, onRemove }) {
  const { label, current, max } = resource;
  const unlimited = max === 999;
  const usePips = !unlimited && max <= 6;

  return (
    <div className="resource-row">
      <input
        className="resource-label-input"
        value={label}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder="Resource name"
      />
      <div className="resource-tracker">
        {unlimited ? (
          <span className="resource-unlimited">∞</span>
        ) : usePips ? (
          <div className="resource-pips">
            {Array.from({ length: max }, (_, i) => (
              <span
                key={i}
                className={`resource-pip${i < current ? ' filled' : ''}`}
                onClick={() => onChange({ current: i < current ? i : i + 1 })}
              />
            ))}
          </div>
        ) : (
          <div className="resource-counter">
            <button onClick={() => onChange({ current: Math.max(0, current - 1) })}>−</button>
            <span className="resource-counter-val">{current}</span>
            <button onClick={() => onChange({ current: Math.min(max, current + 1) })}>+</button>
          </div>
        )}
        {!unlimited && (
          <span className="resource-max-label">
            / <input
              type="number"
              className="resource-max-input"
              value={max}
              min={0}
              onChange={(e) => {
                const newMax = Math.max(0, parseInt(e.target.value, 10) || 0);
                onChange({ max: newMax, current: Math.min(current, newMax) });
              }}
              title="Max"
            />
          </span>
        )}
      </div>
      <button className="remove-btn" onClick={onRemove} title="Remove">×</button>
    </div>
  );
}

export default function Resources({ character, onChange }) {
  const resources = character.resources || [];

  const update = (id, partial) =>
    onChange({ resources: resources.map((r) => (r.id === id ? { ...r, ...partial } : r)) });

  const remove = (id) =>
    onChange({ resources: resources.filter((r) => r.id !== id) });

  const addCustom = () =>
    onChange({
      resources: [...resources, { id: `custom_${Date.now()}`, label: 'New Resource', max: 1, current: 1, isCustom: true }],
    });

  const sync = () => {
    const classRes = getClassResources(character.class, character.level, character.abilities, character.subclass);
    const raceRes = getRaceResources(character.race);
    onChange({ resources: mergeResources(resources, [...classRes, ...raceRes]) });
  };

  return (
    <div className="section resources-section">
      <div className="resources-header">
        <h3>Resources</h3>
        <button className="sync-btn" onClick={sync} title="Load defaults for current class & race">
          ↺ Sync
        </button>
      </div>
      {resources.length === 0 && (
        <p className="resources-empty">No resources tracked. Click ↺ Sync to load class defaults.</p>
      )}
      <div className="resources-list">
        {resources.map((r) => (
          <ResourceRow key={r.id} resource={r} onChange={(p) => update(r.id, p)} onRemove={() => remove(r.id)} />
        ))}
      </div>
      <button className="add-btn" style={{ marginTop: '6px' }} onClick={addCustom}>
        + Add Resource
      </button>
    </div>
  );
}
