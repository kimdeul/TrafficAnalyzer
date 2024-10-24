import { BUS_STOP_ARRAY } from "../data/BusStops";
import { getDistance } from "../geometry/distance";
import { BusRoute, BusRouteColors } from "../types/BusRoute";
import { BusStop } from "../types/BusStop";

function tsp(size: number, edges: number[][]) {

  const result: { route: number[], length: number } = { route: [], length: 0 }
  const dp = new Array(size).fill(0).map(_ => new Array(1 << size).fill(Infinity))

  function dfs(node: number, visited: number) {
    if (visited === (1 << size) - 1) dp[node][visited] = edges[node][0];
    if (dp[node][visited] !== Infinity) return dp[node][visited];
    for (let i=0; i<size; i++) {
      if (visited & (1 << i)) continue;
      dp[node][visited] = Math.min(dp[node][visited], edges[node][i] + dfs(i, visited | (1 << i)))
    }
    return dp[node][visited]
  }

  function trace(node: number, visited: number) {
    result.route.push(node)
    const next = { weight: Infinity, node: 0 }
    if (visited === (1 << size) - 1) return;
    for (let i=0; i<size; i++) {
      if (visited & (1 << i)) continue;
      const weight = edges[node][i] + dp[i][visited | (1 << i)]
      if (weight >= next.weight) continue;
      next.weight = weight;
      next.node = i;
    }
    trace(next.node, visited | (1 << next.node))
  }

  result.length = dfs(0, 1)
  trace(0, 1)
  return result

}

export function proposeWithTSP(size: number, compare: (a: BusStop, b: BusStop) => number) {
  
  const selected = BUS_STOP_ARRAY.sort(compare).slice(0, size)
  
  const edges: number[][] = []
  for (let i=0; i<size; i++) edges.push([...new Array(size).fill(0).map((_, index) => index === i ? 0 : getDistance(selected[i], selected[index])), 0])
  edges.push(new Array(size + 1).fill(0))

  const result = tsp(size+1, edges)

  const route: BusRoute = {
    number: "",
    id: "",
    list: result.route.map(index => selected[index]?.number ?? ""),
    color: BusRouteColors.BRANCH
  }

  while (route.list[0] !== "") route.list.push(route.list.shift()!)
  route.list.shift()

  return route;

}