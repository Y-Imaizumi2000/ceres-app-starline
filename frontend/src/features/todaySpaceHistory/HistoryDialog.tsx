import BaseDialog from "../../components/BaseDialog";
import type { TodaySpaceHistoryResponse } from "./types";

type Props = {
  history: TodaySpaceHistoryResponse;
  onClose?: () => void; // 追加
};

export function HistoryDialog({ history, onClose }: Props) {
  return (
    <BaseDialog title="今日の宇宙史" onClose={onClose}>
      <p>{history.title}</p>
      <p>{history.description}</p>
    </BaseDialog>
  );
}