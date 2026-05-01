import { TodaySpaceHistoryResponse } from "../features/todaySpaceHistory/types";
import { SkyCheckStatusResponse } from "../features/skyCheck/types";
import { TodaySpaceImageResponse } from "../features/todaySpaceImage/types";
import { TonightSkyResponse } from "../features/tonightSky/types";
import { SolarSystemPlanetResponse } from "../features/solarSystem/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function getTodaySpaceHistory(): Promise<TodaySpaceHistoryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/today-space-history`);
  if (!response.ok) {
    throw new Error(`Today space history failed: ${response.status}`);
  }
  return response.json();
}

export async function getSkyCheckStatus(): Promise<SkyCheckStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/sky-check/today`);
  if (!response.ok) {
    throw new Error(`Sky check status failed: ${response.status}`);
  }
  return response.json();
}

export async function getTodaySpaceImage(): Promise<TodaySpaceImageResponse> {
  const response = await fetch(`${API_BASE_URL}/api/today-space-image`);
  if (!response.ok) {
    throw new Error(`Today space image failed: ${response.status}`);
  }
  return response.json();
}

export async function getTonightSky(): Promise<TonightSkyResponse> {
  const response = await fetch(`${API_BASE_URL}/api/tonight-sky`);
  if (!response.ok) {
    throw new Error(`Tonight sky failed: ${response.status}`);
  }
  return response.json();
}

export async function getSolarSystemPlanets(): Promise<SolarSystemPlanetResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/solar-system/planets`);
  if (!response.ok) {
    throw new Error(`Solar system planets failed: ${response.status}`);
  }
  return response.json();
}

export async function checkSkyToday(): Promise<SkyCheckStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/sky-check/today`, {
    method: "POST"
  });
  if (!response.ok) {
    throw new Error(`Sky check update failed: ${response.status}`);
  }
  return response.json();
}
