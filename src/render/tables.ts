import { Create } from "..";
import { BUS_STOP_ARRAY, BUS_STOPS } from "../data/BusStops";

export const $ = document.getElementById.bind(document);
const table = {
  head: $("table-head") as HTMLTableRowElement,
  users: $("table-users") as HTMLTableRowElement,
  seconds: $("table-seconds") as HTMLTableRowElement,
  complexity: $("table-complexity") as HTMLTableRowElement,
}

export function setTable(points: string[], distances: { [key: string]: number }) {
  const complexity: [string, number][] = points.map(number => [number, distances[number] * BUS_STOPS[number].users.average])
  complexity.push(["FINAL", BUS_STOP_ARRAY.map(stop => distances[stop.number] * stop.users.average).reduce((p, c) => p + c, 0)])
  complexity.forEach(([number, complex]) => {
    const final = number === "FINAL"
    table.head.appendChild(Object.assign(Create("th"), { style: `width: ${100 / complexity.length}%;`, scope: "col", innerText:  final ? "전체 정류장 총계" : `${BUS_STOPS[number].dong}\n${BUS_STOPS[number].name}\n(${number})` }))
    table.users.appendChild(Object.assign(Create("td"), { className: final ? "diagonal" : "", innerText: final ? "" : BUS_STOPS[number].users.average }))
    table.seconds.appendChild(Object.assign(Create("td"), { className: final ? "diagonal" : "", innerText: final ? "" : distances[number].toFixed(0) }))
    table.complexity.appendChild(Object.assign(Create("td"), { innerText: complex.toFixed(0) }))
  })
}