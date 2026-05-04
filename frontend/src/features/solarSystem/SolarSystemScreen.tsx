import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SolarSystemDialog } from "./SolarSystemDialog";
import { getSolarSystemPlanets } from "../../services/apiClient";
import type { SolarSystemPlanetResponse } from "./types";

export default function SolarSystemScreen() {
  const navigate = useNavigate();
  const [planets, setPlanets] = useState<SolarSystemPlanetResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getSolarSystemPlanets();
      setPlanets(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || planets.length === 0) {
    return <p className="card-body">読み込み中...</p>;
  }

  return (
    <main className="page">
      <button className="back-button" onClick={() => navigate("/")}>← ホームへ</button>
      <h1 className="title">太陽系図鑑</h1>
      <SolarSystemDialog planets={planets} />
    </main>
  );
}