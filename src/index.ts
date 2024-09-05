import { idx } from "./graph/graphize";
import { renderDistance, renderGraph, renderWithBackground } from "./render/render";

const get = document.getElementById.bind(document);
const canvas = get("graph")
const ctx = (canvas as HTMLCanvasElement).getContext("2d")!!

renderWithBackground(ctx, () => {
    renderGraph(ctx)
    renderDistance(ctx, idx["40224"])
})