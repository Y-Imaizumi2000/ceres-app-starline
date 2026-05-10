import { TodaySpaceHistoryResponse } from "../features/todaySpaceHistory/types";
import { SkyCheckStatusResponse } from "../features/skyCheck/types";
import { TodaySpaceImageResponse } from "../features/todaySpaceImage/types";
import { TonightSkyResponse } from "../features/tonightSky/types";
import { SolarSystemPlanetResponse } from "../features/solarSystem/types";
import todaySpaceHistoryData from "../data/todaySpaceHistory.json";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function getTodayDateKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${month}/${day}`;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ========== Auth APIs ==========
export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  displayName: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "ログインに失敗しました" }));
    throw new Error(errorData.message || "ログインに失敗しました");
  }

  return response.json();
}

export async function signup(
  userId: string,
  displayName: string,
  email: string,
  password: string,
  passwordConfirm: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, displayName, email, password, passwordConfirm }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "登録に失敗しました" }));
      throw new Error(errorData.message || "登録に失敗しました");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "登録に失敗しました");
    }
    throw new Error("登録に失敗しました");
  }
}

// ========== Existing APIs ==========

export async function getTodaySpaceHistory(): Promise<TodaySpaceHistoryResponse> {
  const todayKey = getTodayDateKey();
  const history =
    todaySpaceHistoryData.find((item) => item.date === todayKey) ??
    todaySpaceHistoryData[0];
  return history;
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

export async function getTonightSky(location: string): Promise<TonightSkyResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/tonight-sky?location=${encodeURIComponent(location)}`
  );
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
