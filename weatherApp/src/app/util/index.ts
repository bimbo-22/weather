export function fahrenheitToCelsius(fahrenheit: number): undefined | number {
  if (!fahrenheit) return ;
  return (5 / 9) * (fahrenheit - 32);
}
