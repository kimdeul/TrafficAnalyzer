import axios from "axios";
import { config } from "dotenv";
import { writeFileSync } from "fs";
import { BusRoute, BusRouteColors, ROUTE_NUMBERS_MAINLINE } from "../../types/BusRoute";

config()
const EXTRACTED_BUS_ROUTES:BusRoute[] = []

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

function extractDataByTag(data: string, tag: string) {
  const matched = data.match(new RegExp(`<${tag}>[^<>]+</${tag}>`, 'gi'))
  if (!matched) return;
  return matched.map(m => m.replace(new RegExp(`</?${tag}>`, 'gi'), ''))
}

async function getRouteIdByRouteNumber(num: string) {
  const res = await axios.get("https://apis.data.go.kr/6280000/busRouteService/getBusRouteNo", {
    params: {
      serviceKey: process.env.API_KEY,
      pageNo: 1,
      numOfRows: 100,
      routeNo: num
    }
  })
  console.log(res.data)
  return extractDataByTag(res.data, "ROUTEID")?.[extractDataByTag(res.data, "ROUTENO")?.indexOf(num) ?? 0]
}

async function getRouteStopsByRouteId(id: string) {
  const res = await axios.get("http://apis.data.go.kr/6280000/busRouteService/getBusRouteSectionList", {
    params: {
      serviceKey: process.env.API_KEY,
      pageNo: 1,
      numOfRows: 100,
      routeId: id,
    }
  })
  return extractDataByTag(res.data, "SHORT_BSTOPID")?.map(id => parseInt(id))
}

const TARGET_ROUTES = ROUTE_NUMBERS_MAINLINE;
const TARGET_COLOR = BusRouteColors.MAINLINE;

(async () => { 
  for (const num of TARGET_ROUTES) {
    await sleep(1000)
    console.log(num)
    const id = await getRouteIdByRouteNumber(num)
    if (!id) continue
    const list = await getRouteStopsByRouteId(id)
    if (!list) continue
    EXTRACTED_BUS_ROUTES.push({
      number: num,
      id: id,
      list: list,
      color: TARGET_COLOR
    })
  }
  writeFileSync("src/data/raw/request.json", JSON.stringify(EXTRACTED_BUS_ROUTES, null, 2))
})()