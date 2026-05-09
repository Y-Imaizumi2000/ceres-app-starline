import { useEffect, useState } from "react";
import { CircleMenu } from "../components/CircleMenu";
import { useNavigate } from "react-router-dom";

import {
  checkSkyToday,
  getSkyCheckStatus
} from "../services/apiClient";

export function HomeScreen() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);

      await Promise.allSettled([
        getSkyCheckStatus()
      ]);

      if (!mounted) return;
      setIsLoading(false);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  // ★ 円形メニュー
  const menuItems = [
    { id: "history", label: "今日の宇宙史", onSelect: () => navigate("/history") },
    { id: "image", label: "今日の宇宙画像", onSelect: () => navigate("/image") },
    { id: "tonight", label: "今夜見える星", onSelect: () => navigate("/tonight") },
    { id: "solar", label: "太陽系図鑑", onSelect: () => navigate("/solar") },
    { id: "skycheck", label: "今日空見た？", onSelect: () => navigate("/skycheck") },
    { id: "share", label: "空の共有", onSelect: () => navigate("/share") }
  ];

  return (
    <main className="page">
      <h1 className="title">Starline</h1>
      <p className="subtitle">今日の宇宙と、今夜見上げる空</p>

      {isLoading ? (
        <p className="card-body">読み込み中...</p>
      ) : (
        <CircleMenu items={menuItems} />
      )}

    </main>
  );
}