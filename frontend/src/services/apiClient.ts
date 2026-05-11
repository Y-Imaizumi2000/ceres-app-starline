import { TodaySpaceHistoryResponse } from "../features/todaySpaceHistory/types";
import { SkyCheckStatusResponse } from "../features/skyCheck/types";
import { TodaySpaceImageResponse } from "../features/todaySpaceImage/types";
import { TonightSkyResponse } from "../features/tonightSky/types";
import { SolarSystemPlanetResponse } from "../features/solarSystem/types";
import todaySpaceHistoryData from "../data/todaySpaceHistory.json";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export { API_BASE_URL };

// ========== Health Check ==========
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, { 
      method: "GET",
      signal: AbortSignal.timeout(5000) // 5秒のタイムアウト
    });
    return response.ok;
  } catch {
    return false;
  }
}

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

// ========== User Profile APIs ==========
export interface UserProfile {
  userId: number;
  username: string;
  displayName: string;
  email: string;
  bio: string;
  iconUrl: string;
}

export async function getProfile(): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "プロフィール取得に失敗しました" }));
    throw new Error(errorData.message || "プロフィール取得に失敗しました");
  }

  return response.json();
}

export async function updateProfile(
  displayName: string,
  email: string,
  bio: string,
  iconUrl: string
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ displayName, email, bio, iconUrl }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "プロフィール更新に失敗しました" }));
    throw new Error(errorData.message || "プロフィール更新に失敗しました");
  }

  return response.json();
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  newPasswordConfirm: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/users/password`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword, newPasswordConfirm }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "パスワード変更に失敗しました" }));
    throw new Error(errorData.message || "パスワード変更に失敗しました");
  }
}

export async function uploadProfileIcon(iconFile: File): Promise<{ iconUrl: string }> {
  const formData = new FormData();
  formData.append('icon', iconFile);

  const token = localStorage.getItem("token");
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/users/profile/icon`, {
    method: "POST",
    headers: headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "アイコンアップロードに失敗しました" }));
    throw new Error(errorData.message || "アイコンアップロードに失敗しました");
  }

  return response.json();
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
  try {
    const response = await fetch(`${API_BASE_URL}/api/sky-check/today`);
    if (!response.ok) {
      throw new Error(`サーバーエラー: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error(
        `バックエンドサーバーに接続できません。\n` +
        `確認: バックエンドが起動しているか確認してください。`
      );
    }
    throw error;
  }
}

export async function getTodaySpaceImage(): Promise<TodaySpaceImageResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/today-space-image`);
    if (!response.ok) {
      throw new Error(`サーバーエラー: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error(
        `バックエンドサーバーに接続できません。\n` +
        `設定: ${API_BASE_URL || "(未設定)"}\n` +
        `確認: バックエンドが起動しているか、ポート番号が正しいか確認してください。`
      );
    }
    throw error;
  }
}

export async function getTonightSky(location: string): Promise<TonightSkyResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tonight-sky?location=${encodeURIComponent(location)}`
    );
    if (!response.ok) {
      throw new Error(`サーバーエラー: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error(
        `バックエンドサーバーに接続できません。\n` +
        `確認: バックエンドが起動しているか確認してください。`
      );
    }
    throw error;
  }
}

export async function getSolarSystemPlanets(): Promise<SolarSystemPlanetResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/solar-system/planets`);
    if (!response.ok) {
      throw new Error(`サーバーエラー: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error(
        `バックエンドサーバーに接続できません。\n` +
        `確認: バックエンドが起動しているか確認してください。`
      );
    }
    throw error;
  }
}

export async function checkSkyToday(): Promise<SkyCheckStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sky-check/today`, {
      method: "POST"
    });
    if (!response.ok) {
      throw new Error(`サーバーエラー: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error(
        `バックエンドサーバーに接続できません。\n` +
        `確認: バックエンドが起動しているか確認してください。`
      );
    }
    throw error;
  }
}
