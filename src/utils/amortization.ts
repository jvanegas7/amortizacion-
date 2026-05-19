import { LoanParams, AmortizationResult, AmortizationRow } from '../types/amortization';

/**
 * Formatos de fecha para la tabla
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

/**
 * Agrega meses a una fecha
 */
const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Calcula la cuota fija mensual usando la fórmula de amortización francesa (cuota constante)
 *
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Donde:
 *   P = capital (principal)
 *   r = tasa de interés mensual
 *   n = número de periodos (meses)
 */
export const calcularCuotaMensual = (
  principal: number,
  monthlyRate: number,
  termMonths: number
): number => {
  if (monthlyRate === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * (monthlyRate * factor)) / (factor - 1);
};

/**
 * Convierte tasa nominal anual a tasa efectiva mensual
 * usando capitalización mensual
 */
export const tasaNominalAMensual = (annualRatePercent: number): number => {
  return annualRatePercent / 100 / 12;
};

/**
 * Convierte tasa efectiva anual a tasa efectiva mensual
 */
export const tasaEfectivaAMensual = (annualEffectivePercent: number): number => {
  return Math.pow(1 + annualEffectivePercent / 100, 1 / 12) - 1;
};

/**
 * Genera la tabla de amortización completa (sistema francés)
 */
export const generarTablaAmortizacion = (
  params: LoanParams,
  usarTasaEfectiva: boolean = false
): AmortizationResult => {
  const { principal, annualRate, termMonths, startDate } = params;

  const monthlyRate = usarTasaEfectiva
    ? tasaEfectivaAMensual(annualRate)
    : tasaNominalAMensual(annualRate);

  const monthlyPayment = calcularCuotaMensual(principal, monthlyRate, termMonths);

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let period = 1; period <= termMonths; period++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    const finalBalance = Math.max(0, balance - principalPayment);

    schedule.push({
      period,
      date: formatDate(addMonths(startDate, period)),
      initialBalance: round2(balance),
      payment: round2(monthlyPayment),
      interest: round2(interestPayment),
      principal: round2(principalPayment),
      finalBalance: round2(finalBalance),
    });

    balance = finalBalance;
  }

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: round2(monthlyPayment),
    totalPayment: round2(totalPayment),
    totalInterest: round2(totalInterest),
    effectiveMonthlyRate: round4(monthlyRate * 100),
    annualRate,
    schedule,
  };
};

const round2 = (n: number) => Math.round(n * 100) / 100;
const round4 = (n: number) => Math.round(n * 10000) / 10000;

/**
 * Formatea un número como moneda colombiana
 */
export const formatCurrency = (value: number, currency: string = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};
