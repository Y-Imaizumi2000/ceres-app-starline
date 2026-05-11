import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TonightSkyDialog } from "./TonightSkyDialog";
import { getTonightSky } from "../../services/apiClient";
import type { TonightSkyResponse } from "./types";
import municipalitiesData from "../../data/municipalities.json";

const LOCATION_KEY = "tonightSky_location";

export default function TonightSkyScreen() {
  const navigate = useNavigate();
  const [sky, setSky] = useState<TonightSkyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [selectedPref, setSelectedPref] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const prefectures = Object.keys(municipalitiesData);
  const cities = selectedPref
    ? (municipalitiesData as Record<string, string[]>)[selectedPref] ?? []
    : [];

  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_KEY);
    if (saved) {
      loadSky(saved);
    } else {
      setShowInput(true);
      setLoading(false);
    }
  }, []);

  const loadSky = async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTonightSky(location);
      setSky(data);
    } catch (err) {
      console.error("Failed to load tonight sky:", err);
      const message = err instanceof Error ? err.message : "星空情報の読み込みに失敗しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedPref || !selectedCity) return;
    const location = selectedCity;
    localStorage.setItem(LOCATION_KEY, location);
    setShowInput(false);
    loadSky(location);
  };

  return (
    <main className="page">
      <button className="back-button" onClick={() => navigate("/")}>← ホームへ</button>
      <h1 className="title">今夜見える星</h1>
      <p className="subtitle">観測地点を設定して、今夜みえる星をチェックしましょう。</p>

      {error && (
        <div className="quiet-card" style={{ color: "#ff6b6b", padding: "20px" }}>
          <p>❌ {error}</p>
          <button 
            onClick={() => {
              setError(null);
              const saved = localStorage.getItem(LOCATION_KEY);
              if (saved) loadSky(saved);
            }} 
            style={{ marginTop: "10px", padding: "8px 16px" }}
          >
            再試行
          </button>
        </div>
      )}

      {showInput ? (
        <div className="quiet-card">
          <h2 className="card-title">観測地点を設定</h2>
          <p className="card-body">お住まいの都道府県と市区町村を選択してください。</p>

          <select
            className="location-select"
            value={selectedPref}
            onChange={(e) => {
              setSelectedPref(e.target.value);
              setSelectedCity("");
            }}
          >
            <option value="">都道府県を選択</option>
            {prefectures.map((pref) => (
              <option key={pref} value={pref}>{pref}</option>
            ))}
          </select>

          <select
            className="location-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedPref}
          >
            <option value="">市区町村を選択</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <div className="location-input-actions">
            <button
              className="location-submit-button"
              onClick={handleSubmit}
              disabled={!selectedPref || !selectedCity}
            >
              設定する
            </button>
          </div>
        </div>
      ) : loading || !sky ? (
        <p className="card-body">読み込み中...</p>
      ) : (
          <TonightSkyDialog
            sky={sky}
            onChangeLocation={() => {
              localStorage.removeItem(LOCATION_KEY);
              setShowInput(true);
              setSky(null);
              setError(null);
            }}
          />
      )}
    </main>
  );
}
