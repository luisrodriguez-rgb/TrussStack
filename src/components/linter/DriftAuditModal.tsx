import React, { useState, useMemo } from 'react';
import type { StackRecommendation } from '../../engine/types';
import {
  auditPackageJson,
  generateSamplePackageJson,
  generateGitHubActionWorkflow,
  generateCliAuditScript,
} from '../../engine/linter';
import { useI18n } from '../../i18n/I18nContext';

interface DriftAuditModalProps {
  recommendation: StackRecommendation;
  onClose: () => void;
}

export const DriftAuditModal: React.FC<DriftAuditModalProps> = ({
  recommendation,
  onClose,
}) => {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState<'audit' | 'ci' | 'cli'>('audit');
  const [packageJsonText, setPackageJsonText] = useState<string>(() =>
    generateSamplePackageJson(recommendation, 'drift')
  );
  const [copiedRemediation, setCopiedRemediation] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Deterministic live audit report
  const auditReport = useMemo(() => {
    return auditPackageJson(packageJsonText, recommendation, lang);
  }, [packageJsonText, recommendation, lang]);

  const ciWorkflow = useMemo(() => {
    return generateGitHubActionWorkflow(recommendation);
  }, [recommendation]);

  const cliScript = useMemo(() => {
    return generateCliAuditScript(recommendation);
  }, [recommendation]);

  const handleCopyRemediation = async () => {
    try {
      await navigator.clipboard.writeText(auditReport.remediationCommand);
      setCopiedRemediation(true);
      setTimeout(() => setCopiedRemediation(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
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

  const getStatusColor = (status: 'aligned' | 'warning' | 'critical') => {
    switch (status) {
      case 'aligned':
        return 'var(--yellow-vivid)';
      case 'warning':
        return '#F59E0B';
      case 'critical':
        return '#EF4444';
    }
  };

  const getStatusText = (status: 'aligned' | 'warning' | 'critical') => {
    switch (status) {
      case 'aligned':
        return t.auditAligned;
      case 'warning':
        return t.auditDriftWarning;
      case 'critical':
        return t.auditCritical;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '960px', width: '95vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="pill-tag" style={{ color: 'var(--citron)' }}>
              [ GITOPS LINTER // PHASE 3 ]
            </span>
            <h3>{t.auditTitle}</h3>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                margin: '0.2rem 0 0 0',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {t.auditSubtitle}
            </p>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            {t.drawerClose}
          </button>
        </div>

        <div className="modal-content">
          {/* Tabs Bar */}
          <div className="export-tabs-bar" style={{ marginBottom: '1rem' }}>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              {t.auditTabInspection}
            </button>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'ci' ? 'active' : ''}`}
              onClick={() => setActiveTab('ci')}
            >
              {t.auditTabCiWorkflow}
            </button>
            <button
              type="button"
              className={`export-tab-btn ${activeTab === 'cli' ? 'active' : ''}`}
              onClick={() => setActiveTab('cli')}
            >
              {t.auditTabCliScript}
            </button>
          </div>

          {/* TAB 1: LIVE AUDIT */}
          {activeTab === 'audit' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.2fr)',
                gap: '1.2rem',
              }}
            >
              {/* Left Column: package.json editor */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-dim)',
                    }}
                  >
                    PACKAGE.JSON [ RAW EDITOR ]
                  </span>
                  <button
                    type="button"
                    className="btn-theme-toggle"
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.2rem 0.5rem',
                      color: 'var(--yellow-vivid)',
                      borderColor: 'var(--yellow-border)',
                    }}
                    onClick={() =>
                      setPackageJsonText(
                        generateSamplePackageJson(recommendation, 'drift')
                      )
                    }
                  >
                    {t.auditBtnLoadSample}
                  </button>
                </div>

                <textarea
                  value={packageJsonText}
                  onChange={(e) => setPackageJsonText(e.target.value)}
                  style={{
                    width: '100%',
                    height: '420px',
                    backgroundColor: 'var(--surface-sunken)',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    padding: '0.8rem',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    resize: 'vertical',
                    lineHeight: '1.45',
                    boxSizing: 'border-box',
                  }}
                  spellCheck={false}
                />
              </div>

              {/* Right Column: Live Audit Findings */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  maxHeight: '460px',
                  overflowY: 'auto',
                  paddingRight: '0.3rem',
                }}
              >
                {/* Score Banner */}
                <div
                  style={{
                    padding: '0.8rem 1rem',
                    backgroundColor: 'var(--surface-sunken)',
                    border: `1px solid ${getStatusColor(auditReport.status)}`,
                    borderRadius: '2px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-dim)',
                      }}
                    >
                      {t.auditScoreLabel}
                    </span>
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: getStatusColor(auditReport.status),
                      }}
                    >
                      {auditReport.complianceScore}% {getStatusText(auditReport.status)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#22c55e',
                      }}
                    >
                      [ {auditReport.passed.length} {t.auditPassedRules} ]
                    </span>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#f59e0b',
                      }}
                    >
                      [ {auditReport.missing.length} {t.auditMissingDeps} ]
                    </span>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                      }}
                    >
                      [ {auditReport.drift.length} {t.auditDriftViolations} ]
                    </span>
                  </div>
                </div>

                {/* Remediation Snippet */}
                {auditReport.remediationCommand && (
                  <div
                    style={{
                      padding: '0.7rem 0.9rem',
                      backgroundColor: 'var(--surface-sunken)',
                      border: '1px solid var(--yellow-border)',
                      borderRadius: '2px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--yellow-vivid)',
                          fontWeight: 700,
                        }}
                      >
                        {t.auditRemediationTitle}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyRemediation}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {copiedRemediation ? t.auditRemediationCopied : t.auditBtnCopyRemediation}
                      </button>
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: '0.4rem',
                        backgroundColor: '#000',
                        color: '#4ade80',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        overflowX: 'auto',
                      }}
                    >
                      <code>{auditReport.remediationCommand}</code>
                    </pre>
                  </div>
                )}

                {/* Drift Violations List */}
                {auditReport.drift.length > 0 && (
                  <div>
                    <h5
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#ef4444',
                        margin: '0 0 0.4rem 0',
                      }}
                    >
                      [ ! ] {t.auditDriftViolations} ({auditReport.drift.length})
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {auditReport.drift.map((d) => (
                        <div
                          key={d.ruleId + (d.packageName || '')}
                          style={{
                            padding: '0.5rem 0.7rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            borderLeft: '2px solid #ef4444',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#ef4444' }}>{d.title}</div>
                          <div style={{ color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                            {d.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Dependencies List */}
                {auditReport.missing.length > 0 && (
                  <div>
                    <h5
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#f59e0b',
                        margin: '0 0 0.4rem 0',
                      }}
                    >
                      [ ? ] {t.auditMissingDeps} ({auditReport.missing.length})
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {auditReport.missing.map((m) => (
                        <div
                          key={m.ruleId}
                          style={{
                            padding: '0.5rem 0.7rem',
                            backgroundColor: 'rgba(245, 158, 11, 0.05)',
                            borderLeft: '2px solid #f59e0b',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#f59e0b' }}>{m.title}</div>
                          <div style={{ color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                            {m.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Passed Rules List */}
                {auditReport.passed.length > 0 && (
                  <div>
                    <h5
                      style={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#22c55e',
                        margin: '0 0 0.4rem 0',
                      }}
                    >
                      [ + ] {t.auditPassedRules} ({auditReport.passed.length})
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {auditReport.passed.map((p) => (
                        <div
                          key={p.ruleId}
                          style={{
                            padding: '0.4rem 0.6rem',
                            backgroundColor: 'rgba(34, 197, 94, 0.05)',
                            borderLeft: '2px solid #22c55e',
                            fontSize: '0.7rem',
                            fontFamily: 'var(--font-mono)',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ color: '#22c55e' }}>{p.title}</span>
                          <span style={{ color: 'var(--text-dim)' }}>[ OK ]</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB ACTION CI */}
          {activeTab === 'ci' && (
            <div className="code-viewer-container">
              <div className="code-viewer-header">
                <span className="code-lang-label">
                  .GITHUB/WORKFLOWS/TRUSSSTACK-AUDIT.YML
                </span>
                <button
                  type="button"
                  className="btn-copy-code"
                  onClick={() => handleCopyCode(ciWorkflow)}
                >
                  {copiedCode ? t.btnCopiedCode : t.btnCopyCode}
                </button>
              </div>
              <p
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-dim)',
                  margin: '0.6rem 0',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {t.auditCiDesc}
              </p>
              <pre className="code-viewer-pre" style={{ maxHeight: '360px' }}>
                <code>{ciWorkflow}</code>
              </pre>
              <div style={{ marginTop: '0.8rem' }}>
                <button
                  type="button"
                  className="btn-download-file"
                  onClick={() =>
                    handleDownload(
                      'trussstack-audit.yml',
                      ciWorkflow,
                      'text/yaml'
                    )
                  }
                >
                  {lang === 'es' ? '[ DESCARGAR WORKFLOW YML ]' : '[ DOWNLOAD WORKFLOW YML ]'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CLI SCRIPT */}
          {activeTab === 'cli' && (
            <div className="code-viewer-container">
              <div className="code-viewer-header">
                <span className="code-lang-label">
                  SCRIPTS/TRUSSSTACK-LINT.JS
                </span>
                <button
                  type="button"
                  className="btn-copy-code"
                  onClick={() => handleCopyCode(cliScript)}
                >
                  {copiedCode ? t.btnCopiedCode : t.btnCopyCode}
                </button>
              </div>
              <p
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-dim)',
                  margin: '0.6rem 0',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {t.auditCliDesc}
              </p>
              <pre className="code-viewer-pre" style={{ maxHeight: '360px' }}>
                <code>{cliScript}</code>
              </pre>
              <div style={{ marginTop: '0.8rem' }}>
                <button
                  type="button"
                  className="btn-download-file"
                  onClick={() =>
                    handleDownload(
                      'trussstack-lint.js',
                      cliScript,
                      'application/javascript'
                    )
                  }
                >
                  {lang === 'es' ? '[ DESCARGAR SCRIPT JS ]' : '[ DOWNLOAD JS SCRIPT ]'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
