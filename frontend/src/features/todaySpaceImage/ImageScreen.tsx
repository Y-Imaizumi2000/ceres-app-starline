import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageDialog } from "./ImageDialog";
import { getTodaySpaceImage } from "../../services/apiClient";
import type { TodaySpaceImageResponse } from "./types";

export default function ImageScreen() {
  const navigate = useNavigate();
  const [image, setImage] = useState<TodaySpaceImageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTodaySpaceImage();
        setImage(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load today's space image:", err);
        const message = err instanceof Error ? err.message : "画像の読み込みに失敗しました";
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
        <h1 className="title">今日の宇宙画像</h1>
        <div className="card-body" style={{ color: "#ff6b6b", padding: "20px" }}>
          <p>❌ {error}</p>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            バックエンドサーバーが起動しているか確認してください。<br/>
            <code>http://localhost:8080/api/health</code>
          </p>
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

  if (!image) {
    return <p className="card-body">画像情報が見つかりません</p>;
  }

  return (
    <main className="page">
      <button className="back-button" onClick={() => navigate("/")}>← ホームへ</button>
      <h1 className="title">今日の宇宙画像</h1>
      <ImageDialog image={image} />
    </main>
  );
}