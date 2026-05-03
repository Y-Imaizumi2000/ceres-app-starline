import { useEffect, useState } from "react";
import { HistoryDialog } from "./HistoryDialog";
import { getTodaySpaceHistory } from "../../services/apiClient";
import type { TodaySpaceHistoryResponse } from "./types";

export default function HistoryScreen() {
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

  return <HistoryDialog history={history} />;
}
