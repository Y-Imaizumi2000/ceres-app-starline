import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen";
import HistoryScreen from "./features/todaySpaceHistory/HistoryScreen";
import ImageScreen from "./features/todaySpaceImage/ImageScreen";
import TonightSkyScreen from "./features/tonightSky/TonightSkyScreen";
import SolarSystemScreen from "./features/solarSystem/SolarSystemScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import MyPageScreen from "./screens/MyPageScreen";
import { AuthProvider } from "./features/auth/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { checkBackendHealth, API_BASE_URL } from "./services/apiClient";

export default function App() {
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);
  const [showHealthWarning, setShowHealthWarning] = useState(false);
  const isDev = import.meta.env.MODE === "development";

  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendHealthy(isHealthy);

      // バックエンドが不健康で、警告を表示していない場合のみ表示
      if (!isHealthy && !showHealthWarning) {
        setShowHealthWarning(true);
      } else if (isHealthy && showHealthWarning) {
        // バックエンドが復旧したら警告を隠す
        setShowHealthWarning(false);
      }

      if (!isHealthy) {
        console.warn("⚠️ Backend server is not responding. API calls may fail.");
      }
    };

    checkHealth();
    // Check health every 5 minutes (300000ms) instead of 30 seconds
    const interval = setInterval(checkHealth, 300000);
    return () => clearInterval(interval);
  }, [showHealthWarning]);

  const dismissWarning = () => {
    setShowHealthWarning(false);
  };

  return (
    <>
      {/* Backend health indicator (development only) */}
      {isDev && showHealthWarning && backendHealthy === false && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ff4444",
          color: "white",
          padding: "8px 40px 8px 8px",
          textAlign: "center",
          fontSize: "12px",
          zIndex: 9999,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}>
          ⚠️ バックエンドサーバーに接続できません: {API_BASE_URL || "未設定"}
          <button
            onClick={dismissWarning}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
              padding: "0"
            }}
            title="閉じる"
          >
            ×
          </button>
        </div>
      )}

      {/* ★ アプリ全体の背景アニメーションレイヤー */}
      <div className="starline-background">
      <div className="planet-stream"></div>
      <div className="star-twinkle"></div>
      <div className="star-twinkle-layer3"></div>
      <div className="star-parallax-layer1"></div>
      <div className="star-parallax-layer2"></div>
      <div className="star-parallax-layer3"></div>
      <div className="star-depth-layer1"></div>
      <div className="star-depth-layer2"></div>
      <div className="star-depth-layer3"></div>
      <div className="milkyway-stars"></div>
    </div>


      {/* ★ ここからルーティング */}
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/mypage" element={<MyPageScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/image" element={<ImageScreen />} />
            <Route path="/tonight" element={<TonightSkyScreen />} />
            <Route path="/solar" element={<SolarSystemScreen />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
