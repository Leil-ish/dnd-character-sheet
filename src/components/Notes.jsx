import { getStartingEquipment } from '../utils/startingEquipment';

export default function Notes({ character, onChange }) {
  const populateGear = () => {
    const gear = getStartingEquipment(character.class, character.background);
    if (!gear) return;
    if (character.equipment && character.equipment.trim()) {
      if (!confirm('This will replace your current equipment. Continue?')) return;
    }
    onChange({ equipment: gear });
  };

  return (
    <div className="section notes-section">
      <h3>Character Details</h3>

      <div className="notes-grid">
        <div className="notes-field">
          <label>Personality Traits</label>
          <textarea value={character.personality} rows={3}
            onChange={(e) => onChange({ personality: e.target.value })} />
        </div>
        <div className="notes-field">
          <label>Ideals</label>
          <textarea value={character.ideals} rows={2}
            onChange={(e) => onChange({ ideals: e.target.value })} />
        </div>
        <div className="notes-field">
          <label>Bonds</label>
          <textarea value={character.bonds} rows={2}
            onChange={(e) => onChange({ bonds: e.target.value })} />
        </div>
        <div className="notes-field">
          <label>Flaws</label>
          <textarea value={character.flaws} rows={2}
            onChange={(e) => onChange({ flaws: e.target.value })} />
        </div>
      </div>

      <h3>Features & Traits</h3>
      <textarea className="full-width" value={character.features} rows={8}
        placeholder="Class features, racial traits, feats..."
        onChange={(e) => onChange({ features: e.target.value })} />

      <div className="equipment-header">
        <h3>Equipment</h3>
        <button className="sync-btn" onClick={populateGear} title="Fill in standard starting gear for your class and background">
          ↺ Suggest Starting Gear
        </button>
      </div>
      <div className="currency-row">
        {['cp','sp','ep','gp','pp'].map((coin) => (
          <div key={coin} className="currency-field">
            <label>{coin.toUpperCase()}</label>
            <input type="number" value={character.currency[coin]} min={0}
              onChange={(e) => onChange({ currency: { ...character.currency, [coin]: parseInt(e.target.value, 10) || 0 } })} />
          </div>
        ))}
      </div>
      <textarea className="full-width" value={character.equipment} rows={8}
        placeholder="List your equipment, weapons, armor..."
        onChange={(e) => onChange({ equipment: e.target.value })} />

      <h3>Notes</h3>
      <textarea className="full-width" value={character.notes} rows={8}
        placeholder="Session notes, NPC names, quest hooks..."
        onChange={(e) => onChange({ notes: e.target.value })} />
    </div>
  );
}
