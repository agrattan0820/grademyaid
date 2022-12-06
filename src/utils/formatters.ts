export function numberWithCommas(x?: number, dollar?: boolean) {
  if (x === undefined || x === null) {
    return "Data not found";
  }

  const string = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const addDollar = dollar ? "$" + string : string;

  return addDollar;
}
