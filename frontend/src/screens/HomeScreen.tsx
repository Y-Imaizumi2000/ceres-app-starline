import { useEffect, useState } from "react";
import { CircleMenu } from "../components/CircleMenu";
import { useNavigate } from "react-router-dom";
import ImageScreen from "../features/todaySpaceImage/ImageScreen";
import TonightSkyScreen from "../features/tonightSky/TonightSkyScreen";

import {
  checkSkyToday,
  getSkyCheckStatus,
  getSolarSystemPlanets,
  getTodaySpaceHistory
} from "../services/apiClient";

import { HistoryDialog } from "../features/todaySpaceHistory/HistoryDialog";
import type { TodaySpaceHistoryResponse } from "../features/todaySpaceHistory/types";

export function HomeScreen() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  // ★ ダイアログ表示フラグ & データ
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState<TodaySpaceHistoryResponse | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [showTonight, setShowTonight] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);

      await Promise.allSettled([
        getSolarSystemPlanets(),
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
    {
      id: "history",
      label: "今日の宇宙史",
      onSelect: async () => {
        const data = await getTodaySpaceHistory();
        setHistoryData(data);
        setShowHistory(true);
      }
    },
    { id: "image", label: "今日の宇宙画像", onSelect: () => setShowImage(true) },
    { id: "tonight", label: "今夜見える星", onSelect: () => setShowTonight(true) },
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

      {/* ★ ダイアログ表示 */}
      {showHistory && historyData && (
        <HistoryDialog history={historyData} onClose={() => setShowHistory(false)} />
      )}
      {showImage && ( // 追加
        <ImageScreen onClose={() => setShowImage(false)} />
      )}
      {showTonight && (
        <TonightSkyScreen onClose={() => setShowTonight(false)} />
      )}
    </main>
  );
}