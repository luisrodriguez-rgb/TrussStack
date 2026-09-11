import React, { useState } from 'react';
import type { StackRecommendation } from '../../engine/types';
import { generateMermaidDiagram } from '../../exporters/mermaidExporter';
import { generateJsonExport } from '../../exporters/jsonExporter';
import { generateExcalidrawScene } from '../../exporters/excalidrawExporter';
import {
  generateDockerCompose,
  generateEnvExample,
} from '../../exporters/scaffoldExporter';
import {
  generateAdrs,
  generateConsolidatedAdrDoc,
} from '../../engine/adrGenerator';
import { useI18n } from '../../i18n/I18nContext';

interface ExportModalProps {
  recommendation: StackRecommendation;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ recommendation, onClose }) => {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState<
    'mermaid' | 'json' | 'excalidraw' | 'docker' | 'env' | 'adr'
  >('mermaid');
  const [copied, setCopied] = useState(false);
  const [selectedAdrId, setSelectedAdrId] = useState<string>('all');

  const mermaidCode = generateMermaidDiagram(recommendation);
  const jsonCode = generateJsonExport(recommendation);
  const excalidrawCode = generateExcalidrawScene(recommendation);
  const dockerCode = generateDockerCompose(recommendation);
  const envCode = generateEnvExample(recommendation);
  
  const adrList = generateAdrs(recommendation, lang);
  const adrCode =
    selectedAdrId === 'all'
      ? generateConsolidatedAdrDoc(adrList, lang)
      : adrList.find((a) => a.id === selectedAdrId)?.rawMarkdown || '';

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'mermaid':
        return mermaidCode;
      case 'json':
        return jsonCode;
      case 'excalidraw':
        return excalidrawCode;
      case 'docker':
        return dockerCode;
      case 'env':
        return envCode;
      case 'adr':
        return adrCode;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '840px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="pill-tag" style={{ color: 'var(--citron)' }}>
              {t.exportModalTag}
            </span>
            <h3>{t.exportModalTitle}</h3>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close">
            {t.drawerClose}
          </button>
        </div>

        <div className="modal-content">
          {/* Tabs Bar */}
          <div className="export-tabs-bar" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'mermaid' ? 'active' : ''}`}
              onClick={() => setActiveTab('mermaid')}
            >
              {t.exportTabMermaid}
            </button>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveTab('json')}
            >
              {t.exportTabJson}
            </button>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'excalidraw' ? 'active' : ''}`}
              onClick={() => setActiveTab('excalidraw')}
            >
              {t.exportTabExcalidraw}
            </button>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'docker' ? 'active' : ''}`}
              onClick={() => setActiveTab('docker')}
            >
              {t.exportTabDocker}
            </button>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'env' ? 'active' : ''}`}
              onClick={() => setActiveTab('env')}
            >
              {t.exportTabEnv}
            </button>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'adr' ? 'active' : ''}`}
              onClick={() => setActiveTab('adr')}
            >
              {t.exportTabAdr}
            </button>
          </div>

          {/* Selector de ADR cuando activeTab === 'adr' */}
          {activeTab === 'adr' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                margin: '0.6rem 0',
                padding: '0.5rem 0.8rem',
                backgroundColor: 'var(--surface-sunken)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {t.adrSelectorLabel}
              </span>
              <select
                value={selectedAdrId}
                onChange={(e) => setSelectedAdrId(e.target.value)}
                style={{
                  backgroundColor: 'var(--surface-card)',
                  color: 'var(--yellow-vivid)',
                  border: '1px solid var(--yellow-border)',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  flex: 1,
                  minWidth: '240px',
                }}
              >
                <option value="all">{t.adrConsolidatedOption}</option>
                {adrList.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.id}] {a.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Code Viewer */}
          <div className="code-viewer-container">
            <div className="code-viewer-header">
              <span className="code-lang-label">
                {activeTab === 'mermaid'
                  ? 'MERMAID FLOWCHART TD'
                  : activeTab === 'json'
                  ? 'CANONICAL JSON SCHEMA V1.0'
                  : activeTab === 'excalidraw'
                  ? 'EXCALIDRAW VECTOR SCENE V2 (COMPATIBLE CON SKETION)'
                  : activeTab === 'docker'
                  ? 'DOCKER COMPOSE CONFIGURATION'
                  : activeTab === 'env'
                  ? 'ENVIRONMENT VARIABLES TEMPLATE'
                  : selectedAdrId === 'all'
                  ? 'CONSOLIDATED ARCHITECTURAL DECISION LOG (MADR 3.0)'
                  : `MADR 3.0 RECORD // ${selectedAdrId}`}
              </span>
              <button type="button" className="btn-copy-code" onClick={handleCopy}>
                {copied ? t.btnCopiedCode : t.btnCopyCode}
              </button>
            </div>
            <pre className="code-viewer-pre" style={{ maxHeight: '340px' }}>
              <code>{getCurrentCode()}</code>
            </pre>
          </div>

          {/* Actions Footer */}
          <div className="export-actions-footer" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
            {activeTab === 'json' && (
              <button
                type="button"
                className="btn-download-file"
                onClick={() => handleDownload('trussstack.json', jsonCode, 'application/json')}
              >
                {t.btnDownloadJson}
              </button>
            )}

            {activeTab === 'excalidraw' && (
              <button
                type="button"
                className="btn-download-file"
                onClick={() =>
                  handleDownload('architecture.excalidraw', excalidrawCode, 'application/json')
                }
              >
                {t.btnDownloadExcalidraw}
              </button>
            )}

            {activeTab === 'mermaid' && (
              <button
                type="button"
                className="btn-download-file"
                onClick={() => handleDownload('architecture.mmd', mermaidCode, 'text/plain')}
              >
                {t.btnDownloadMmd}
              </button>
            )}

            {activeTab === 'docker' && (
              <button
                type="button"
                className="btn-download-file"
                onClick={() => handleDownload('docker-compose.yml', dockerCode, 'text/yaml')}
              >
                {t.btnDownloadDocker}
              </button>
            )}

            {activeTab === 'env' && (
              <button
                type="button"
                className="btn-download-file"
                onClick={() => handleDownload('.env.example', envCode, 'text/plain')}
              >
                {t.btnDownloadEnv}
              </button>
            )}

            {activeTab === 'adr' && (
              <button
                type="button"
                className="btn-download-file"
                onClick={() =>
                  handleDownload(
                    selectedAdrId === 'all' ? 'ARCHITECTURE_DECISIONS.md' : `${selectedAdrId}.md`,
                    adrCode,
                    'text/markdown'
                  )
                }
              >
                {selectedAdrId === 'all'
                  ? lang === 'es'
                    ? '[ DESCARGAR ARCHITECTURE_DECISIONS.MD ]'
                    : '[ DOWNLOAD ARCHITECTURE_DECISIONS.MD ]'
                  : lang === 'es'
                  ? `[ DESCARGAR ${selectedAdrId}.MD ]`
                  : `[ DOWNLOAD ${selectedAdrId}.MD ]`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
