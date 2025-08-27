const API_BASE = 'https://v6.transport.rest';

export interface Station {
  id: string;
  name: string;
}

export async function fetchStations(query: string): Promise<Station[]> {
  if (!query) return [];
  const res = await fetch(`${API_BASE}/locations?query=${encodeURIComponent(query)}&results=5&fuzzy=true&stations=true`);
  if (!res.ok) throw new Error('Stationssuche fehlgeschlagen');
  return res.json();
}

export interface JourneyLeg {
  departure: string;
  arrival: string;
  line?: { name?: string };
}

export interface Journey {
  legs: JourneyLeg[];
}

export interface JourneyQuery {
  fromId: string;
  toId: string;
  date?: string;
  via?: string;
}

export async function fetchJourneys(query: JourneyQuery): Promise<Journey[]> {
  const url = new URL(`${API_BASE}/journeys`);
  url.searchParams.set('from', query.fromId);
  url.searchParams.set('to', query.toId);
  if (query.date) url.searchParams.set('departure', query.date);
  if (query.via) url.searchParams.set('via', query.via);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Verbindungssuche fehlgeschlagen');
  const data = await res.json();
  return data.journeys || [];
}
