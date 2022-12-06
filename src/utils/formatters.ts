export function numberWithCommas(x?: number) {
  if(x === undefined){
    return "Data not found"
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
