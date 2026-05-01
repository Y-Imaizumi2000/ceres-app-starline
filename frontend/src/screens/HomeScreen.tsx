import { useEffect, useState } from "react";
import { CircleMenu } from "../components/CircleMenu"; // ◇ 円形メニューコンポーネント
import { useNavigate } from "react-router-dom"; // ◇ ページ遷移用フック

// ◇ API クライアント（今日の宇宙史・画像・今夜の星・太陽系・空チェック）
import {
  checkSkyToday,
  getSkyCheckStatus,
  getSolarSystemPlanets,
  getTodaySpaceHistory,
  getTodaySpaceImage,
  getTonightSky
} from "../services/apiClient";

export function HomeScreen() {
  const navigate = useNavigate();

  // ◇ 初回ロード中かどうか（メニューを表示する前にデータを取得するため）
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true; // ◇ コンポーネントがアンマウントされたかどうかのフラグ

    const load = async () => {
      setIsLoading(true);

      // ◇ ホーム画面で必要なデータをまとめて取得
      //   → ここで取得したデータは各ページで使われるため、先に読み込んでおく
      await Promise.allSettled([
        getTodaySpaceHistory(),   // 今日の宇宙史
        getTodaySpaceImage(),     // 今日の宇宙画像
        getTonightSky(),          // 今夜見える星
        getSolarSystemPlanets(),  // 太陽系データ
        getSkyCheckStatus()       // 今日空見た？の状態
      ]);

      // ◇ アンマウント後に setState が走らないようにする安全対策
      if (!mounted) return;

      setIsLoading(false);
    };

    void load();

    // ◇ クリーンアップ：アンマウント時にフラグを false にする
    return () => {
      mounted = false;
    };
  }, []);

  // ◇ 円形メニューに表示する項目
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
      {/* ◇ アプリタイトル */}
      <h1 className="title">Starline</h1>

      {/* ◇ サブタイトル（世界観の説明） */}
      <p className="subtitle">今日の宇宙と、今夜見上げる空</p>

      {/* ◇ データ読み込み中はテキストを表示、完了したら円形メニューを表示 */}
      {isLoading ? (
        <p className="card-body">読み込み中...</p>
      ) : (
        <CircleMenu items={menuItems} />
      )}
    </main>
  );
}
