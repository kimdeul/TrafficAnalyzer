import { BUS_ROUTES } from "./data/BusRoutes";
import { BUS_STOP_ARRAY, BUS_STOPS } from "./data/BusStops";
import { delaunay } from "./geometry/algorithm/triangulation/delaunay";
import { insert } from "./geometry/algorithm/triangulation/insert";
import { Geo } from "./geometry/Area";
import { getDistance } from "./geometry/distance";
import { Segment } from "./geometry/shapes/Segment";
import { degrees, graph, graphize, graphizeRoute, graphizeTriangulation } from "./graph/graphize";
import { grouping, setConstrainedRoute } from "./graph/grouping";
import { naiveDijkstra } from "./graph/shortest";
import { proposeWithTSP } from "./graph/tsp";
import { Renderer } from "./render/render";
import { $, setTable } from "./render/tables";

// [Geo] the geometric methods; if set this true, renderer will render the Constrained Delaunay Triangulation
const MOD_GEOMERTIC = true;
const MOD_GEOMETRIC_ANALYZE = true;

// Initializing
export const Create = document.createElement.bind(document);
const renderer = new Renderer($("graph") as HTMLCanvasElement)

// Graphizing
graphize()
console.log(`${Object.values(graph).length} Vertices, ${Object.values(graph).reduce((p, c) => p + c.length, 0)} Edges`)

// Proposing
const proposed = proposeWithTSP(10, (a, b) => degrees[`${b.number}`].in + degrees[`${b.number}`].out - degrees[`${a.number}`].in - degrees[`${a.number}`].out)
graphizeRoute(proposed)

// Analyzing
const START_NUMBER = "40224" /* Bupyeong stn. */
const COMPLEXITY_VIEWPOINT = ["40049", "40785", "40451", "40533", "40631", "40683", "40853", "40790"]

// Visualizing
renderer.renderWithBackground(() => {
    // [Geo] Delaunay trinagulation
    if (MOD_GEOMERTIC) {
        // [Geo] Grouping
        grouping()

        // [Geo] Add constrained edges (CDT)
        const every: Segment[] = []
        for (const route of BUS_ROUTES) every.push(...setConstrainedRoute(route))

        // [Geo] Delaunay triangulation
        Geo.triangles.push(...delaunay(Geo.points))
        if (!MOD_GEOMETRIC_ANALYZE) Geo.points.forEach(point => renderer.renderPoint(point, { color: "#fff", size: 4 }))
        
        // [Geo] Insert (CDT)
        for (const segment of Geo.segments) insert(segment)
        // Geo.segments.forEach(segment => renderer.renderSegment(segment, { color: "#f005" }))
        if (!MOD_GEOMETRIC_ANALYZE) Geo.triangles.forEach(triangle => renderer.renderPolygon(triangle.vertices, { fill: { color: "#fff", size: 4 }, stroke: { color: "#fff" } }))

        // [Geo] Find incovering edges
        const inconvered = Geo.triangles.reduce<Segment[]>((p, c) => p.concat(c.edges), []).filter(edge => !every.some(seg => edge.is(seg)))
        if (!MOD_GEOMETRIC_ANALYZE) inconvered.forEach(segment => renderer.renderSegment(segment, { color: "#0009", size: 5, }))

        // [Geo] CDT to graph
        graphizeTriangulation()

    }

    if (!MOD_GEOMERTIC || MOD_GEOMETRIC_ANALYZE) {
        const distances = naiveDijkstra(START_NUMBER)

        renderer.renderGraph()
        COMPLEXITY_VIEWPOINT.map(number => renderer.renderBusStop(BUS_STOPS[number], "#fff", 12))
        renderer.renderDistance(distances, START_NUMBER)
        setTable(COMPLEXITY_VIEWPOINT, distances)

        if (!MOD_GEOMETRIC_ANALYZE) renderer.renderBusRoute(proposed)
    }
    
})

console.log(BUS_STOP_ARRAY.map(stop => stop.users.average * getDistance(stop, BUS_STOPS[START_NUMBER]) / (15/3.6) + 20).reduce((p, c) => p + c, 0))