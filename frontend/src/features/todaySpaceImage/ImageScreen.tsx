import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageDialog } from "./ImageDialog";
import { getTodaySpaceImage } from "../../services/apiClient";
import type { TodaySpaceImageResponse } from "./types";

export default function ImageScreen() {
  const navigate = useNavigate();
  const [image, setImage] = useState<TodaySpaceImageResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getTodaySpaceImage();
      setImage(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !image) {
    return <p className="card-body">読み込み中...</p>;
  }

  return (
    <main className="page">
      <button className="back-button" onClick={() => navigate("/")}>← ホームへ</button>
      <h1 className="title">今日の宇宙画像</h1>
      <ImageDialog image={image} />
    </main>
  );
}