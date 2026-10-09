/**
 * Static token registry.
 *
 * Token JSON files live at ../../tokens/ (co-located on the production branch).
 * Vite imports them at build time via the @tokens alias, eliminating the
 * runtime GitHub API dependency that was required when the site lived on a
 * separate branch.
 */
import blau from '@tokens/blau.json';
import esimflag from '@tokens/esimflag.json';
import movistar from '@tokens/movistar.json';
import o2 from '@tokens/o2.json';
import telefonica from '@tokens/telefonica.json';
import unbranded from '@tokens/unbranded.json';
import vivoEvolution from '@tokens/vivo-evolution.json';
import vivo from '@tokens/vivo.json';
import cyber from '@tokens/community/cyber.json';

export const allTokens: Record<string, unknown> = {
  blau,
  esimflag,
  movistar,
  o2,
  telefonica,
  unbranded,
  'vivo-evolution': vivoEvolution,
  vivo,
  cyber,
};

export const tokenNames: Array<{ value: string; text: string; community: boolean }> = [
  { value: 'blau', text: 'Blau', community: false },
  { value: 'esimflag', text: 'Esimflag', community: false },
  { value: 'movistar', text: 'Movistar', community: false },
  { value: 'o2', text: 'O2', community: false },
  { value: 'telefonica', text: 'Telefonica', community: false },
  { value: 'unbranded', text: 'Unbranded', community: false },
  { value: 'vivo-evolution', text: 'Vivo Evolution', community: false },
  { value: 'vivo', text: 'Vivo', community: false },
  { value: 'cyber', text: 'Cyber (Community)', community: true },
];
