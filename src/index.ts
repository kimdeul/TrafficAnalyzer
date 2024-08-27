import { renderGraph } from "./render/render";

const get = document.getElementById.bind(document);
const canvas = get("graph")

renderGraph((canvas as HTMLCanvasElement).getContext("2d")!!)