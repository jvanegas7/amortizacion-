export interface LoanParams {
  principal: number;       // Monto del crédito
  annualRate: number;      // Tasa anual en porcentaje
  termMonths: number;      // Plazo en meses
  startDate: Date;         // Fecha de inicio
}

export interface AmortizationRow {
  period: number;
  date: string;
  initialBalance: number;
  payment: number;
  principal: number;
  interest: number;
  finalBalance: number;
}

export interface AmortizationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: AmortizationRow[];
  effectiveMonthlyRate: number;
  annualRate: number;
}
