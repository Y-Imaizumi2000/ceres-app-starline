import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTodaySpaceHistory } from "../../services/apiClient";
import type { TodaySpaceHistoryResponse } from "./types";

export default function HistoryScreen() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<TodaySpaceHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getTodaySpaceHistory();
      setHistory(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading || !history) {
    return <p className="card-body">読み込み中...</p>;
  }

  return (
    <main className="page">
      <button className="back-button" onClick={() => navigate("/")}>← ホームへ</button>
      <h1 className="title">今日の宇宙史</h1>
      <p className="subtitle">過去の今日起こった宇宙史を紹介します。</p>

      {history.imageUrl && (
        <img
          className="space-image"
          src={history.imageUrl}
          alt={history.spaceTopic}
        />
      )}

      <h2 className="card-title">{history.spaceTopic}</h2>
      <div className="card-body">
        <h3 className="card-subtitle">詳細</h3>
        <p className="card-body">{history.description}</p><br></br>
        <p className="card-body">{history.year}/{history.date}</p>
        <p>カテゴリ： {history.category}</p>
        {history.source && (
          <p className="card-body">出典： {history.source}</p>
        )}
      </div>
    </main>
  );
}
