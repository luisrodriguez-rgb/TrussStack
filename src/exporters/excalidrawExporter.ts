import type { StackRecommendation } from '../engine/types';
import { TECH_BY_ID } from '../engine/catalog';

interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: string;
  strokeWidth: number;
  strokeStyle: string;
  roughness: number;
  opacity: number;
  groupIds: string[];
  roundness: { type: number } | null;
  seed: number;
  version: number;
  versionNonce: number;
  isDeleted: boolean;
  text?: string;
  fontSize?: number;
  fontFamily?: number;
  textAlign?: string;
  verticalAlign?: string;
  containerId?: string | null;
  points?: [number, number][];
}

export function generateExcalidrawScene(recommendation: StackRecommendation): string {
  const elements: ExcalidrawElement[] = [];
  let seedCounter = 1000;

  const getSeed = () => ++seedCounter;

  // Fondo contenedor o marco
  elements.push({
    id: 'frame-bg',
    type: 'rectangle',
    x: 40,
    y: 40,
    width: 1100,
    height: 750,
    angle: 0,
    strokeColor: '#334155',
    backgroundColor: '#0A0F1D',
    fillStyle: 'solid',
    strokeWidth: 1.5,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [],
    roundness: { type: 3 },
    seed: getSeed(),
    version: 1,
    versionNonce: getSeed(),
    isDeleted: false,
  });

  // Título Header
  elements.push({
    id: 'header-title',
    type: 'text',
    x: 80,
    y: 70,
    width: 600,
    height: 30,
    angle: 0,
    strokeColor: '#F8FAFC',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [],
    roundness: null,
    seed: getSeed(),
    version: 1,
    versionNonce: getSeed(),
    isDeleted: false,
    text: `STACKFORGE ARCHITECTURE — FIT SCORE: ${recommendation.fitScore}%`,
    fontSize: 18,
    fontFamily: 2,
    textAlign: 'left',
    verticalAlign: 'top',
  });

  // Subtítulo
  elements.push({
    id: 'header-sub',
    type: 'text',
    x: 80,
    y: 105,
    width: 700,
    height: 20,
    angle: 0,
    strokeColor: '#94A3B8',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [],
    roundness: null,
    seed: getSeed(),
    version: 1,
    versionNonce: getSeed(),
    isDeleted: false,
    text: `Coste estimado: ${recommendation.overallCostEstimate} | Topología de 5 Capas`,
    fontSize: 13,
    fontFamily: 2,
    textAlign: 'left',
    verticalAlign: 'top',
  });

  // Función auxiliar para dibujar un nodo técnico
  const drawNode = (
    x: number,
    y: number,
    width: number,
    height: number,
    title: string,
    subtitle: string,
    badge: string,
    isHero = false
  ) => {
    const boxId = `box-${getSeed()}`;
    const textId = `txt-${getSeed()}`;

    // Caja
    elements.push({
      id: boxId,
      type: 'rectangle',
      x,
      y,
      width,
      height,
      angle: 0,
      strokeColor: isHero ? '#38BDF8' : '#334155',
      backgroundColor: '#1E293B',
      fillStyle: 'solid',
      strokeWidth: isHero ? 2 : 1.2,
      strokeStyle: 'solid',
      roughness: 0,
      opacity: 100,
      groupIds: [],
      roundness: { type: 3 },
      seed: getSeed(),
      version: 1,
      versionNonce: getSeed(),
      isDeleted: false,
    });

    // Badge de categoría
    elements.push({
      id: `badge-${getSeed()}`,
      type: 'text',
      x: x + 16,
      y: y + 12,
      width: width - 32,
      height: 14,
      angle: 0,
      strokeColor: isHero ? '#38BDF8' : '#64748B',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 0,
      opacity: 100,
      groupIds: [],
      roundness: null,
      seed: getSeed(),
      version: 1,
      versionNonce: getSeed(),
      isDeleted: false,
      text: badge.toUpperCase(),
      fontSize: 10,
      fontFamily: 3,
      textAlign: 'left',
      verticalAlign: 'top',
    });

    // Título de la herramienta
    elements.push({
      id: textId,
      type: 'text',
      x: x + 16,
      y: y + 30,
      width: width - 32,
      height: 22,
      angle: 0,
      strokeColor: '#F8FAFC',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 0,
      opacity: 100,
      groupIds: [],
      roundness: null,
      seed: getSeed(),
      version: 1,
      versionNonce: getSeed(),
      isDeleted: false,
      text: title,
      fontSize: 15,
      fontFamily: 2,
      textAlign: 'left',
      verticalAlign: 'top',
    });

    // Subtítulo técnico
    elements.push({
      id: `sub-${getSeed()}`,
      type: 'text',
      x: x + 16,
      y: y + 54,
      width: width - 32,
      height: 16,
      angle: 0,
      strokeColor: '#94A3B8',
      backgroundColor: 'transparent',
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 0,
      opacity: 100,
      groupIds: [],
      roundness: null,
      seed: getSeed(),
      version: 1,
      versionNonce: getSeed(),
      isDeleted: false,
      text: subtitle,
      fontSize: 11,
      fontFamily: 2,
      textAlign: 'left',
      verticalAlign: 'top',
    });

    return { x, y, width, height, centerX: x + width / 2, centerY: y + height / 2 };
  };

  const { slots } = recommendation;
  const fe = slots.frontend ? TECH_BY_ID[slots.frontend] : null;
  const be = slots.backend ? TECH_BY_ID[slots.backend] : null;
  const db = slots.database ? TECH_BY_ID[slots.database] : null;
  const auth = slots.auth ? TECH_BY_ID[slots.auth] : null;
  const st = slots.storage ? TECH_BY_ID[slots.storage] : null;
  const host = slots.hosting ? TECH_BY_ID[slots.hosting] : null;

  // Capa 1: Frontend Client
  const clientNode = drawNode(
    80,
    160,
    440,
    80,
    fe?.name || 'Web Client',
    fe?.tagline.slice(0, 45) || 'Client layer',
    'Ingress & Frontend',
    true
  );

  // Capa 2: API / Application
  const apiTitle = be ? be.name : `${fe?.name || 'Next.js'} Serverless API`;
  const apiSub = be ? be.tagline.slice(0, 45) : 'Integrated Route Handlers / RPC';
  const apiNode = drawNode(600, 160, 480, 80, apiTitle, apiSub, 'Application & API');

  // Capa 3: Database & State
  drawNode(
    80,
    300,
    300,
    80,
    db?.name || 'Database',
    db?.tagline.slice(0, 38) || 'Persistent storage',
    'Database'
  );

  // Capa 4: Auth & Services
  drawNode(
    420,
    300,
    300,
    80,
    auth?.name || 'Auth Provider',
    auth?.tagline.slice(0, 38) || 'Authentication & Session',
    'Authentication'
  );

  // Capa 5: Storage
  drawNode(
    760,
    300,
    320,
    80,
    st?.name || 'Object Storage',
    st?.tagline.slice(0, 38) || 'Files & Assets',
    'Storage'
  );

  // Capa 6: Hosting / Cloud
  drawNode(
    80,
    440,
    440,
    80,
    host?.name || 'Cloud Hosting',
    host?.tagline.slice(0, 45) || 'Edge infrastructure',
    'Infrastructure'
  );

  // Flecha Client -> API
  elements.push({
    id: `arrow-client-api`,
    type: 'arrow',
    x: clientNode.x + clientNode.width,
    y: clientNode.centerY,
    width: apiNode.x - (clientNode.x + clientNode.width),
    height: 0,
    angle: 0,
    strokeColor: '#38BDF8',
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1.5,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [],
    roundness: { type: 2 },
    seed: getSeed(),
    version: 1,
    versionNonce: getSeed(),
    isDeleted: false,
    points: [
      [0, 0],
      [apiNode.x - (clientNode.x + clientNode.width), 0],
    ],
  });

  const scene = {
    type: 'excalidraw',
    version: 2,
    source: 'https://stackforge.dev',
    elements,
    appState: {
      viewBackgroundColor: '#0A0F1D',
      gridSize: null,
    },
    files: {},
  };

  return JSON.stringify(scene, null, 2);
}
