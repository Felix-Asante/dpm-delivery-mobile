export function formatCurrency(
  amount: number,
  currencyCode: string = "USD",
): string {
  const formatter = new Intl.NumberFormat("en-US");

  return formatter.format(amount);
}
