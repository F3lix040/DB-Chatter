import { Journey } from '../services/hafasApi';

export function formatJourney(journey: Journey, from: string, to: string): string {
  const first = journey.legs[0];
  const last = journey.legs[journey.legs.length - 1];
  const dep = new Date(first.departure);
  const arr = new Date(last.arrival);
  const durationMs = arr.getTime() - dep.getTime();
  const hours = Math.floor(durationMs / 3600000);
  const minutes = Math.round((durationMs % 3600000) / 60000);
  const line = first.line?.name ? ` ${first.line.name}` : '';
  const depStr = dep.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const arrStr = arr.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  return `${from} → ${to}\nAbfahrt: ${depStr}  Ankunft: ${arrStr}${line}\nDauer: ${hours}h ${minutes}min`;
}
