import { ReactNode } from "react";

type BaseDialogProps = {
  title: string;
  children: ReactNode;
  onClose?: () => void;
};

export default function BaseDialog({ title, children, onClose }: BaseDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{title}</h2>
        </div>
        <div className="dialog-content">{children}</div>
        {onClose && (
          <button
            className="dialog-close-button"
            onClick={onClose}
            aria-label="閉じる"
          >
            閉じる
          </button>
        )}
      </div>
    </div>
  );
}