import { BusStop } from "../types/BusStop";

function rad(deg: number) {
  return deg * Math.PI / 180
}

function haversine(deg: number) {
  return (1 - Math.cos(deg)) / 2
}

export function getDistance(stop1: BusStop, stop2: BusStop) {
  const EARTH_RADIUS = 6371
  const dist = 2 * EARTH_RADIUS * Math.asin(Math.sqrt(
    haversine(rad(stop2.longitude) - rad(stop1.longitude))
     + Math.cos(rad(stop1.longitude)) * Math.cos(rad(stop2.longitude)) * haversine(rad(stop2.latitude) - rad(stop1.latitude))
  ))
  return dist * 1000
}