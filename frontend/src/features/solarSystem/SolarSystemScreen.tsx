import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SolarSystemDialog } from "./SolarSystemDialog";
import { getSolarSystemPlanets } from "../../services/apiClient";
import type { SolarSystemPlanetResponse } from "./types";

export default function SolarSystemScreen() {
  const navigate = useNavigate();
  const [planets, setPlanets] = useState<SolarSystemPlanetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSolarSystemPlanets();
        setPlanets(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load solar system planets:", err);
        const message = err instanceof Error ? err.message : "惑星情報の読み込みに失敗しました";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="card-body">読み込み中...</p>;
  }

  if (error) {
    return (
      <main className="page">
        <button className="back-button" onClick={() => navigate("/")}>← ホームへ</button>
        <h1 className="title">太陽系図鑑</h1>
        <div className="card-body" style={{ color: "#ff6b6b", padding: "20px" }}>
          <p>❌ {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: "10px", padding: "8px 16px" }}
          >
            再試行
          </button>
        </div>
      </main>
    );
  }

  if (planets.length === 0) {
    return <p className="card-body">惑星情報が見つかりません</p>;
  }

  return (
    <main className="page">
      <button className="back-button" onClick={() => navigate("/")}>← ホームへ</button>
      <h1 className="title">太陽系図鑑</h1>
      <SolarSystemDialog planets={planets} />
    </main>
  );
}