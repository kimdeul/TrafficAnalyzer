import { BUS_STOP_ARRAY } from "../data/BusStops";

export function mst() {
  const selected = BUS_STOP_ARRAY.sort((a, b) => b.users.average - a.users.average).slice(0, 10)
  console.log(selected)
  return selected
}
