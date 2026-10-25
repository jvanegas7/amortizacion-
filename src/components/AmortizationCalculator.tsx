import { useState, useMemo, useRef } from 'react';
import { generarTablaAmortizacion, formatCurrency, formatPercent } from '../utils/amortization';
import { AmortizationResult, LoanParams } from '../types/amortization';

const CURRENCIES = ['COP', 'USD', 'EUR', 'MXN'];

interface FormState {
  principal: string;
  annualRate: string;
  termMonths: string;
  startDate: string;
  currency: string;
  usarTasaEfectiva: boolean;
}

const defaultForm: FormState = {
  principal: '50000000',
  annualRate: '18',
  termMonths: '60',
  startDate: new Date().toISOString().split('T')[0],
  currency: 'COP',
  usarTasaEfectiva: false,
};

export default function AmortizationCalculator() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [result, setResult] = useState<AmortizationResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [showAll, setShowAll] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const p = parseFloat(form.principal.replace(/\./g, '').replace(',', '.'));
    const r = parseFloat(form.annualRate);
    const t = parseInt(form.termMonths);

    if (!p || p <= 0) newErrors.principal = 'El monto debe ser mayor a 0';
    if (!r || r <= 0 || r > 200) newErrors.annualRate = 'Tasa entre 0.01% y 200%';
    if (!t || t < 1 || t > 600) newErrors.termMonths = 'Plazo entre 1 y 600 meses';
    if (!form.startDate) newErrors.startDate = 'Fecha requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;

    const params: LoanParams = {
      principal: parseFloat(form.principal.replace(/\./g, '').replace(',', '.')),
      annualRate: parseFloat(form.annualRate),
      termMonths: parseInt(form.termMonths),
      startDate: new Date(form.startDate + 'T00:00:00'),
    };

    const res = generarTablaAmortizacion(params, form.usarTasaEfectiva);
    setResult(res);
    setShowAll(false);

    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setForm(defaultForm);
    setResult(null);
    setErrors({});
    setShowAll(false);
  };

  const visibleSchedule = useMemo(() => {
    if (!result) return [];
    return showAll ? result.schedule : result.schedule.slice(0, 12);
  }, [result, showAll]);

  const fmt = (v: number) => formatCurrency(v, form.currency);

  return (
    <div className="calculator-root">
      {/* HEADER */}
      <header className="calc-header">
        <div className="header-badge">SISTEMA FRANCÉS</div>
        <h1 className="calc-title">
          <span className="title-accent">Calculadora</span>
          <br />de Amortización
        </h1>
        <p className="calc-subtitle">
          Proyecte su crédito con precisión · Cuota constante mensual
        </p>
      </header>

      {/* FORM */}
      <section className="calc-form-section">
        <div className="form-grid">
          {/* Monto */}
          <div className={`field-group ${errors.principal ? 'has-error' : ''}`}>
            <label className="field-label">
              <span className="label-icon">$</span>
              Monto del Crédito
            </label>
            <div className="input-with-select">
              <input
                type="number"
                className="field-input"
                value={form.principal}
                onChange={e => setForm(f => ({ ...f, principal: e.target.value }))}
                placeholder="50,000,000"
                min={1}
              />
              <select
                className="currency-select"
                value={form.currency}
                onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
              >
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {errors.principal && <span className="error-msg">{errors.principal}</span>}
          </div>

          {/* Tasa */}
          <div className={`field-group ${errors.annualRate ? 'has-error' : ''}`}>
            <label className="field-label">
              <span className="label-icon">%</span>
              Tasa Anual
            </label>
            <div className="input-with-toggle">
              <input
                type="number"
                className="field-input"
                value={form.annualRate}
                onChange={e => setForm(f => ({ ...f, annualRate: e.target.value }))}
                placeholder="18.00"
                step="0.01"
                min={0.01}
                max={200}
              />
              <div className="rate-type-toggle">
                <button
                  className={`toggle-btn ${!form.usarTasaEfectiva ? 'active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, usarTasaEfectiva: false }))}
                >
                  Nominal
                </button>
                <button
                  className={`toggle-btn ${form.usarTasaEfectiva ? 'active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, usarTasaEfectiva: true }))}
                >
                  Efectiva
                </button>
              </div>
            </div>
            {errors.annualRate && <span className="error-msg">{errors.annualRate}</span>}
          </div>

          {/* Plazo */}
          <div className={`field-group ${errors.termMonths ? 'has-error' : ''}`}>
            <label className="field-label">
              <span className="label-icon">⌛</span>
              Plazo (meses)
            </label>
            <input
              type="number"
              className="field-input"
              value={form.termMonths}
              onChange={e => setForm(f => ({ ...f, termMonths: e.target.value }))}
              placeholder="60"
              min={1}
              max={600}
            />
            {form.termMonths && (
              <span className="field-hint">
                = {Math.round(parseInt(form.termMonths) / 12 * 10) / 10} años
              </span>
            )}
            {errors.termMonths && <span className="error-msg">{errors.termMonths}</span>}
          </div>

          {/* Fecha */}
          <div className={`field-group ${errors.startDate ? 'has-error' : ''}`}>
            <label className="field-label">
              <span className="label-icon">📅</span>
              Fecha de Inicio
            </label>
            <input
              type="date"
              className="field-input"
              value={form.startDate}
              onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            />
            {errors.startDate && <span className="error-msg">{errors.startDate}</span>}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button className="btn-primary" onClick={handleCalculate}>
            <span className="btn-icon">⟶</span>
            Calcular Amortización
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            Reiniciar
          </button>
        </div>
      </section>

      {/* RESULTS */}
      {result && (
        <section className="results-section" ref={tableRef}>
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card kpi-primary">
              <span className="kpi-label">Cuota Mensual</span>
              <span className="kpi-value">{fmt(result.monthlyPayment)}</span>
              <span className="kpi-sub">pago fijo durante {form.termMonths} meses</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Total a Pagar</span>
              <span className="kpi-value">{fmt(result.totalPayment)}</span>
              <span className="kpi-sub">capital + intereses</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Total Intereses</span>
              <span className="kpi-value kpi-interest">{fmt(result.totalInterest)}</span>
              <span className="kpi-sub">
                {formatPercent((result.totalInterest / parseFloat(form.principal.replace(/\./g, ''))) * 100)} sobre el capital
              </span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Tasa Mensual</span>
              <span className="kpi-value">{formatPercent(result.effectiveMonthlyRate, 4)}</span>
              <span className="kpi-sub">
                {form.usarTasaEfectiva ? 'efectiva' : 'nominal'} anual {formatPercent(result.annualRate)}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="debt-breakdown">
            <div className="breakdown-label">
              <span>Capital</span>
              <span>Intereses</span>
            </div>
            <div className="breakdown-bar">
              <div
                className="bar-capital"
                style={{
                  width: `${(parseFloat(form.principal.replace(/\./g, '')) / result.totalPayment) * 100}%`
                }}
              />
              <div className="bar-interest" style={{ flex: 1 }} />
            </div>
            <div className="breakdown-values">
              <span>{fmt(parseFloat(form.principal.replace(/\./g, '')))}</span>
              <span>{fmt(result.totalInterest)}</span>
            </div>
          </div>

          {/* Table */}
          <div className="table-header-row">
            <h2 className="table-title">Tabla de Amortización</h2>
            <span className="table-badge">{form.termMonths} cuotas</span>
          </div>

          <div className="table-wrapper">
            <table className="amort-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Saldo Inicial</th>
                  <th>Cuota</th>
                  <th>Capital</th>
                  <th>Interés</th>
                  <th>Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {visibleSchedule.map(row => (
                  <tr key={row.period} className={row.period % 2 === 0 ? 'row-even' : ''}>
                    <td className="td-period">{row.period}</td>
                    <td className="td-date">{row.date}</td>
                    <td>{fmt(row.initialBalance)}</td>
                    <td className="td-payment">{fmt(row.payment)}</td>
                    <td className="td-principal">{fmt(row.principal)}</td>
                    <td className="td-interest">{fmt(row.interest)}</td>
                    <td className="td-balance">{fmt(row.finalBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!showAll && result.schedule.length > 12 && (
            <div className="show-more-row">
              <button className="btn-show-more" onClick={() => setShowAll(true)}>
                Ver todas las {result.schedule.length} cuotas ↓
              </button>
            </div>
          )}
          {showAll && (
            <div className="show-more-row">
              <button className="btn-show-more" onClick={() => setShowAll(false)}>
                Mostrar menos ↑
              </button>
            </div>
          )}
        </section>
      )}

      <footer className="calc-footer">
        <p>Calculadora de Amortización DFP · Sistema Francés Franses · Cuota Constante</p>
      </footer>
    </div>
  );
}
