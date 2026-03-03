export function formatCurrency(
  amount: number,
  currencyCode: string = "GHS",
): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  });

  return formatter.format(amount);
}
