import type { TechCategory, UserProjectSpec } from '../engine/types';
import { TECH_BY_ID } from '../engine/catalog';

export interface CompactBlueprintPayload {
  t: UserProjectSpec['projectType'];
  s: UserProjectSpec['scale'];
  ts: UserProjectSpec['teamSize'];
  sen: UserProjectSpec['seniority'];
  b: UserProjectSpec['budget'];
  c: UserProjectSpec['constraints'];
  p: UserProjectSpec['priorities'];
  slots: Partial<Record<TechCategory, string>>;
}

/**
 * Universal URL-safe Base64 encoder (works in modern browser & Node.js).
 */
function toUrlSafeBase64(str: string): string {
  let base64: string;
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    base64 = window.btoa(unescape(encodeURIComponent(str)));
  } else if (typeof Buffer !== 'undefined') {
    base64 = Buffer.from(str, 'utf-8').toString('base64');
  } else if (typeof btoa === 'function') {
    base64 = btoa(unescape(encodeURIComponent(str)));
  } else {
    base64 = encodeURIComponent(str);
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Universal URL-safe Base64 decoder.
 */
function fromUrlSafeBase64(urlSafeBase64: string): string {
  let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return decodeURIComponent(escape(window.atob(base64)));
  } else if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf-8');
  } else if (typeof atob === 'function') {
    return decodeURIComponent(escape(atob(base64)));
  } else {
    return decodeURIComponent(base64);
  }
}

/**
 * Encodes a project spec and active slots into a compact URL-safe hash string.
 */
export function encodeBlueprint(
  spec: UserProjectSpec,
  slots: Record<TechCategory, string | null>
): string {
  const cleanSlots: Partial<Record<TechCategory, string>> = {};
  for (const [cat, techId] of Object.entries(slots)) {
    if (techId) {
      cleanSlots[cat as TechCategory] = techId;
    }
  }

  const payload: CompactBlueprintPayload = {
    t: spec.projectType,
    s: spec.scale,
    ts: spec.teamSize,
    sen: spec.seniority,
    b: spec.budget,
    c: spec.constraints,
    p: spec.priorities,
    slots: cleanSlots,
  };

  const jsonStr = JSON.stringify(payload);
  return toUrlSafeBase64(jsonStr);
}

/**
 * Decodes a URL-safe hash into a validated spec and slots record.
 * Returns null if the hash is corrupted or invalid.
 */
export function decodeBlueprint(hash: string): {
  spec: UserProjectSpec;
  slots: Partial<Record<TechCategory, string>>;
} | null {
  try {
    const cleanHash = hash.replace(/^#/, '').replace(/^blueprint=/, '');
    if (!cleanHash) return null;

    const jsonStr = fromUrlSafeBase64(cleanHash);
    const payload = JSON.parse(jsonStr) as Partial<CompactBlueprintPayload>;

    if (
      !payload.t ||
      !payload.s ||
      !payload.ts ||
      !payload.sen ||
      !payload.b ||
      !payload.c ||
      !payload.p ||
      !payload.slots
    ) {
      return null;
    }

    // Validate slots against real catalog IDs
    const validatedSlots: Partial<Record<TechCategory, string>> = {};
    for (const [cat, id] of Object.entries(payload.slots)) {
      if (typeof id === 'string' && TECH_BY_ID[id]) {
        validatedSlots[cat as TechCategory] = id;
      }
    }

    const restoredSpec: UserProjectSpec = {
      projectType: payload.t,
      scale: payload.s,
      teamSize: payload.ts,
      seniority: payload.sen,
      budget: payload.b,
      constraints: payload.c,
      priorities: payload.p,
    };

    return {
      spec: restoredSpec,
      slots: validatedSlots,
    };
  } catch {
    return null;
  }
}

/**
 * Generates the full shareable URL containing the current blueprint in the hash.
 */
export function getShareableUrl(
  spec: UserProjectSpec,
  slots: Record<TechCategory, string | null>
): string {
  const token = encodeBlueprint(spec, slots);
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}#blueprint=${token}`;
  }
  return `https://trussstack.dev/#blueprint=${token}`;
}

/**
 * Copies the shareable blueprint URL to the user clipboard.
 */
export async function copyShareableUrlToClipboard(
  spec: UserProjectSpec,
  slots: Record<TechCategory, string | null>
): Promise<string> {
  const url = getShareableUrl(spec, slots);
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(url);
  }
  return url;
}
