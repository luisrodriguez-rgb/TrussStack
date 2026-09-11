import React, { useState } from 'react';
import type { StackRecommendation } from '../../engine/types';
import { generateMermaidDiagram } from '../../exporters/mermaidExporter';
import { generateJsonExport } from '../../exporters/jsonExporter';
import { generateExcalidrawScene } from '../../exporters/excalidrawExporter';

interface ExportModalProps {
  recommendation: StackRecommendation;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ recommendation, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mermaid' | 'json' | 'excalidraw'>('mermaid');
  const [copied, setCopied] = useState(false);

  const mermaidCode = generateMermaidDiagram(recommendation);
  const jsonCode = generateJsonExport(recommendation);
  const excalidrawCode = generateExcalidrawScene(recommendation);

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'mermaid':
        return mermaidCode;
      case 'json':
        return jsonCode;
      case 'excalidraw':
        return excalidrawCode;
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
      <div className="modal-dialog" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="node-category-pill" style={{ color: 'var(--cyan-400)' }}>
              Centro de Exportación
            </span>
            <h3>Exportar Arquitectura StackForge</h3>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-content">
          <div className="export-tabs-bar">
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'mermaid' ? 'active' : ''}`}
              onClick={() => setActiveTab('mermaid')}
            >
              Mermaid (.md)
            </button>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveTab('json')}
            >
              stackforge.json
            </button>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'excalidraw' ? 'active' : ''}`}
              onClick={() => setActiveTab('excalidraw')}
            >
              Excalidraw (.excalidraw)
            </button>
          </div>

          <div className="code-viewer-container">
            <div className="code-viewer-header">
              <span className="code-lang-label">
                {activeTab === 'mermaid'
                  ? 'Mermaid Flowchart TD'
                  : activeTab === 'json'
                  ? 'Canonical JSON Schema v1.0'
                  : 'Excalidraw Vector Scene v2 (Compatible con Sketion)'}
              </span>
              <button type="button" className="btn-copy-code" onClick={handleCopy}>
                {copied ? '✓ ¡Copiado!' : 'Copiar al Portapapeles'}
              </button>
            </div>
            <pre className="code-viewer-pre">
              <code>{getCurrentCode()}</code>
            </pre>
          </div>

          <div className="export-actions-footer">
            {activeTab === 'json' && (
              <button
                type="button"
                className="btn-download-file"
                onClick={() => handleDownload('stackforge.json', jsonCode, 'application/json')}
              >
                <span>💾</span> Descargar stackforge.json
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
                <span>🎨</span> Descargar architecture.excalidraw
              </button>
            )}

            {activeTab === 'mermaid' && (
              <button
                type="button"
                className="btn-download-file"
                onClick={() => handleDownload('architecture.mmd', mermaidCode, 'text/plain')}
              >
                <span>📄</span> Descargar architecture.mmd
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
