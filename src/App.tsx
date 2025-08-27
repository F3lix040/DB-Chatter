import { useState } from 'react';
import { fetchStations, fetchJourneys } from './services/hafasApi';
import { formatJourney } from './utils/formatters';

export default function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const fromStation = (await fetchStations(from))[0];
      const toStation = (await fetchStations(to))[0];
      if (!fromStation || !toStation) {
        throw new Error('Bahnhof nicht gefunden');
      }
      const journeys = await fetchJourneys({ fromId: fromStation.id, toId: toStation.id });
      if (!journeys.length) {
        throw new Error('Keine Verbindung gefunden');
      }
      setOutput(formatJourney(journeys[0], fromStation.name, toStation.name));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Bahn Copilot</h1>
      <div>
        <input
          placeholder="Startbahnhof"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          placeholder="Zielbahnhof"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button onClick={search} disabled={loading}>
          Suchen
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {output && (
        <pre>
          {output}
        </pre>
      )}
    </div>
  );
}
