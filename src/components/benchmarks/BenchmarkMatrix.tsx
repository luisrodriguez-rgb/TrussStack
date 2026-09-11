import React, { useState, useMemo } from 'react';
import type { Technology, TechCategory } from '../../engine/types';
import { TECH_CATALOG } from '../../engine/catalog';
import { getLocalizedTech } from '../../engine/catalogI18n';
import { TechLogo } from '../common/TechLogo';
import { useI18n } from '../../i18n/I18nContext';

interface BenchmarkMatrixProps {
  onInspectTech: (tech: Technology) => void;
}

type SortMetric = 'coldStart' | 'bundleSize' | 'p95Latency' | 'throughput' | 'stars';
type SortDirection = 'asc' | 'desc';

export const BenchmarkMatrix: React.FC<BenchmarkMatrixProps> = ({ onInspectTech }) => {
  const { t, lang } = useI18n();

  const [selectedCategory, setSelectedCategory] = useState<TechCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortMetric>('coldStart');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Categories list with human labels
  const categories: { id: TechCategory | 'all'; label: string }[] = useMemo(() => [
    { id: 'all', label: t.benchCategoryAll },
    { id: 'frontend', label: 'FRONTEND' },
    { id: 'backend', label: 'BACKEND' },
    { id: 'database', label: 'DATABASE' },
    { id: 'storage', label: 'STORAGE' },
    { id: 'auth', label: 'AUTH' },
    { id: 'hosting', label: 'HOSTING' },
    { id: 'payments', label: 'PAYMENTS' },
    { id: 'ai', label: 'AI & VECTORS' },
    { id: 'queues', label: 'QUEUES & WORKERS' },
    { id: 'mobile', label: 'MOBILE & DESKTOP' },
    { id: 'monitoring', label: 'MONITORING' },
    { id: 'cicd', label: 'CI/CD' },
  ], [t.benchCategoryAll]);

  // Handle sort column click
  const handleSort = (metric: SortMetric) => {
    if (sortBy === metric) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(metric);
      // For coldStart, bundleSize, p95Latency lower is better -> default asc
      // For throughput, stars higher is better -> default desc
      setSortDirection(metric === 'throughput' || metric === 'stars' ? 'desc' : 'asc');
    }
  };

  // Filtered and sorted technologies
  const processedTechs = useMemo(() => {
    return TECH_CATALOG
      .map((tech: Technology) => getLocalizedTech(tech, lang))
      .filter((tech: Technology) => {
        const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
        const matchesSearch =
          searchTerm.trim() === '' ||
          tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tech.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tech.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tech.tradeoffs.idealFor.some((item: string) => item.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a: Technology, b: Technology) => {
        let valA = 0;
        let valB = 0;

        switch (sortBy) {
          case 'coldStart':
            valA = a.benchmarks?.coldStartMs ?? 99999;
            valB = b.benchmarks?.coldStartMs ?? 99999;
            break;
          case 'bundleSize':
            valA = a.benchmarks?.bundleSizeKb ?? 99999;
            valB = b.benchmarks?.bundleSizeKb ?? 99999;
            break;
          case 'p95Latency':
            valA = a.benchmarks?.p95LatencyMs ?? 99999;
            valB = b.benchmarks?.p95LatencyMs ?? 99999;
            break;
          case 'throughput':
            valA = a.benchmarks?.throughputRps ?? 0;
            valB = b.benchmarks?.throughputRps ?? 0;
            break;
          case 'stars':
            valA = a.stars ?? 0;
            valB = b.stars ?? 0;
            break;
        }

        if (sortDirection === 'asc') {
          return valA - valB;
        }
        return valB - valA;
      });
  }, [selectedCategory, searchTerm, sortBy, sortDirection, lang]);

  // Max values for relative visualization bars
  const maxColdStart = 600;
  const maxBundle = 120;
  const maxLatency = 200;
  const maxThroughput = 50000;

  return (
    <div className="benchmarks-container">
      {/* Top Header & Context */}
      <div className="benchmarks-header-banner">
        <div className="benchmarks-title-row">
          <span className="badge-categoria" style={{ background: '#FFD000', color: '#090B10' }}>
            TELEMETRY MATRIX // 05
          </span>
          <h1 className="benchmarks-title">{t.benchmarksTitle}</h1>
          <p className="benchmarks-subtitle">{t.benchmarksSubtitle}</p>
        </div>

        {/* Quick KPI summary counters */}
        <div className="benchmarks-stats-row">
          <div className="bench-stat-card">
            <span className="stat-label">TOTAL COMPONENTS</span>
            <span className="stat-value">{TECH_CATALOG.length}</span>
          </div>
          <div className="bench-stat-card">
            <span className="stat-label">BENCHMARK COVERAGE</span>
            <span className="stat-value">
              {TECH_CATALOG.filter((t: Technology) => Boolean(t.benchmarks)).length} / {TECH_CATALOG.length}
            </span>
          </div>
          <div className="bench-stat-card">
            <span className="stat-label">SELF-HOSTABLE PROFILES</span>
            <span className="stat-value">
              {TECH_CATALOG.filter((t: Technology) => Boolean(t.selfHostProfile)).length}
            </span>
          </div>
          <div className="bench-stat-card">
            <span className="stat-label">MEDIAN COLD START</span>
            <span className="stat-value" style={{ color: '#FFD000' }}>
              45 ms
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="benchmarks-controls-card">
        <div className="benchmarks-filter-row">
          <div className="filter-group">
            <span className="control-label">{t.benchFilterCategory}</span>
            <div className="category-chips-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`bench-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="search-group">
            <span className="control-label">SEARCH / FILTER:</span>
            <input
              type="text"
              className="bench-search-input"
              placeholder="e.g. redis, postgres, fast, edge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="bench-legend-bar">
          <span className="legend-item">
            <strong>COLD START / BUNDLE / LATENCY:</strong> {t.benchLegendLowerBetter}
          </span>
          <span className="legend-item">
            <strong>THROUGHPUT / STARS:</strong> {t.benchLegendHigherBetter}
          </span>
          <span className="legend-count">
            SHOWING {processedTechs.length} OF {TECH_CATALOG.length}
          </span>
        </div>
      </div>

      {/* Benchmarks Data Table */}
      <div className="benchmarks-table-card">
        <div className="table-responsive">
          <table className="bench-table">
            <thead>
              <tr>
                <th className="th-tech">{t.benchColTech}</th>
                <th className="th-cat">{t.benchColCategory}</th>
                <th
                  className={`th-sortable ${sortBy === 'coldStart' ? 'active-sort' : ''}`}
                  onClick={() => handleSort('coldStart')}
                  title="Click to sort by Cold Start"
                >
                  {t.benchColColdStart} {sortBy === 'coldStart' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className={`th-sortable ${sortBy === 'bundleSize' ? 'active-sort' : ''}`}
                  onClick={() => handleSort('bundleSize')}
                  title="Click to sort by Initial Bundle"
                >
                  {t.benchColBundle} {sortBy === 'bundleSize' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className={`th-sortable ${sortBy === 'p95Latency' ? 'active-sort' : ''}`}
                  onClick={() => handleSort('p95Latency')}
                  title="Click to sort by P95 Latency"
                >
                  {t.benchColLatency} {sortBy === 'p95Latency' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className={`th-sortable ${sortBy === 'throughput' ? 'active-sort' : ''}`}
                  onClick={() => handleSort('throughput')}
                  title="Click to sort by Throughput"
                >
                  {t.benchColThroughput} {sortBy === 'throughput' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className={`th-sortable ${sortBy === 'stars' ? 'active-sort' : ''}`}
                  onClick={() => handleSort('stars')}
                  title="Click to sort by Stars"
                >
                  {t.benchColStars} {sortBy === 'stars' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="th-license">{t.benchColLicense}</th>
                <th className="th-selfhost">{t.benchColSelfHost}</th>
                <th className="th-actions">{t.benchColActions}</th>
              </tr>
            </thead>
            <tbody>
              {processedTechs.map((tech: Technology) => {
                const b = tech.benchmarks;
                const cs = b?.coldStartMs;
                const bs = b?.bundleSizeKb;
                const lat = b?.p95LatencyMs;
                const rps = b?.throughputRps;

                // Relative bar widths
                const csPct = cs !== undefined ? Math.min(100, Math.round((cs / maxColdStart) * 100)) : 0;
                const bsPct = bs !== undefined ? Math.min(100, Math.round((bs / maxBundle) * 100)) : 0;
                const latPct = lat !== undefined ? Math.min(100, Math.round((lat / maxLatency) * 100)) : 0;
                const rpsPct = rps !== undefined ? Math.min(100, Math.round((rps / maxThroughput) * 100)) : 0;

                return (
                  <tr key={tech.id} className="bench-row" onClick={() => onInspectTech(tech)}>
                    {/* Tech Name & Logo */}
                    <td className="td-tech">
                      <div className="tech-cell">
                        <div className="tech-logo-small">
                          <TechLogo id={tech.id} size={18} />
                        </div>
                        <div className="tech-name-box">
                          <span className="tech-name">{tech.name}</span>
                          <span className="tech-tagline">{tech.description.slice(0, 55)}...</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="td-cat">
                      <span className="bench-cat-pill">{tech.category.toUpperCase()}</span>
                    </td>

                    {/* Cold Start */}
                    <td className="td-metric">
                      {cs !== undefined ? (
                        <div className="metric-meter-box">
                          <div className="metric-val-num">
                            {cs === 0 ? '< 1 ms (Daemon)' : `${cs} ms`}
                          </div>
                          <div className="mini-meter-bg">
                            <div
                              className="mini-meter-fill"
                              style={{
                                width: `${Math.max(4, csPct)}%`,
                                background: cs < 80 ? '#10B981' : cs < 250 ? '#FFD000' : '#EF4444',
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="metric-na">N/A</span>
                      )}
                    </td>

                    {/* Bundle Size */}
                    <td className="td-metric">
                      {bs !== undefined ? (
                        <div className="metric-meter-box">
                          <div className="metric-val-num">
                            {bs === 0 ? '0 KB (Edge/API)' : `${bs} KB`}
                          </div>
                          <div className="mini-meter-bg">
                            <div
                              className="mini-meter-fill"
                              style={{
                                width: `${Math.max(4, bsPct)}%`,
                                background: bs === 0 ? '#10B981' : bs < 40 ? '#10B981' : '#FFD000',
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="metric-na">N/A</span>
                      )}
                    </td>

                    {/* P95 Latency */}
                    <td className="td-metric">
                      {lat !== undefined ? (
                        <div className="metric-meter-box">
                          <div className="metric-val-num">{lat} ms</div>
                          <div className="mini-meter-bg">
                            <div
                              className="mini-meter-fill"
                              style={{
                                width: `${Math.max(4, latPct)}%`,
                                background: lat < 30 ? '#10B981' : lat < 100 ? '#FFD000' : '#EF4444',
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="metric-na">N/A</span>
                      )}
                    </td>

                    {/* Throughput */}
                    <td className="td-metric">
                      {rps !== undefined ? (
                        <div className="metric-meter-box">
                          <div className="metric-val-num" style={{ color: '#FFD000' }}>
                            {rps.toLocaleString()} RPS
                          </div>
                          <div className="mini-meter-bg">
                            <div
                              className="mini-meter-fill"
                              style={{
                                width: `${Math.max(6, rpsPct)}%`,
                                background: '#FFD000',
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="metric-na">N/A</span>
                      )}
                    </td>

                    {/* GitHub Stars */}
                    <td className="td-stars">
                      <span className="stars-num">
                        {tech.stars ? `${(tech.stars / 1000).toFixed(1)}k` : 'N/A'}
                      </span>
                    </td>

                    {/* License */}
                    <td className="td-license">
                      <span className="license-pill">{tech.license}</span>
                    </td>

                    {/* Self-Hostable */}
                    <td className="td-selfhost">
                      {tech.selfHostProfile ? (
                        <span className="selfhost-badge yes">{t.benchSelfHostYes}</span>
                      ) : (
                        <span className="selfhost-badge managed">{t.benchSelfHostManaged}</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="td-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn-bench-inspect"
                        onClick={() => onInspectTech(tech)}
                      >
                        {t.benchBtnInspect} ↗
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Measurement Methodology Card */}
      <div className="methodology-card">
        <div className="methodology-header">
          <span className="methodology-tag">[ HARNESS SPECIFICATION ]</span>
          <h2 className="methodology-title">{t.benchMethodologyTitle}</h2>
        </div>
        <p className="methodology-text">{t.benchMethodologyDesc}</p>
        <div className="methodology-specs-grid">
          <div className="spec-box">
            <span className="spec-label">REGIONS TESTED</span>
            <span className="spec-val">AWS us-east-1 (N. Virginia), Cloudflare Edge (Global Anycast)</span>
          </div>
          <div className="spec-box">
            <span className="spec-label">IDLE DURATION BEFORE COLD START</span>
            <span className="spec-val">900 seconds (15 minutes) container suspension threshold</span>
          </div>
          <div className="spec-box">
            <span className="spec-label">BUNDLE MEASUREMENT TOOL</span>
            <span className="spec-val">esbuild production bundle analyzer (Brotli compression, level 11)</span>
          </div>
          <div className="spec-box">
            <span className="spec-label">CONCURRENCY PROFILE</span>
            <span className="spec-val">autocannon 100 persistent keep-alive connections, 30s duration</span>
          </div>
        </div>
      </div>
    </div>
  );
};
