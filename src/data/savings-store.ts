export type SavingsState = {
  pot: number;
};

let savings: SavingsState = { pot: 0 };

export function getSavings(): SavingsState {
  return { ...savings };
}

export function addSavings(amount: number): SavingsState {
  if (amount > 0) {
    savings = { pot: savings.pot + amount };
  }
  return getSavings();
}

export function resetSavings(): SavingsState {
  savings = { pot: 0 };
  return getSavings();
}
