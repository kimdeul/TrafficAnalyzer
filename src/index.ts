import { renderRoutes } from "./render/render";

const get = document.getElementById.bind(document);
const canvas = get("graph")

renderRoutes(canvas as HTMLCanvasElement)