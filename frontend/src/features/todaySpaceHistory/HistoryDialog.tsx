import BaseDialog from "../../components/BaseDialog";
import type { TodaySpaceHistoryResponse } from "./types";

type Props = {
  history: TodaySpaceHistoryResponse;
  onClose?: () => void; // 追加
};

export function HistoryDialog({ history, onClose }: Props) {
  return (
    <BaseDialog title="今日の宇宙史" onClose={onClose}>
      {history.imageUrl && (
        <img
          className="space-image"
          src={history.imageUrl}
          alt={history.spaceTopic}
        />
      )}
      <p className="dialog-title">{history.spaceTopic}</p>
      <p className="dialog-meta">
        {history.year}年 ・ {history.category} ・ {history.date}
      </p>
      <p>{history.description}</p>
      {history.source && <p className="dialog-source">出典: {history.source}</p>}
    </BaseDialog>
  );
}