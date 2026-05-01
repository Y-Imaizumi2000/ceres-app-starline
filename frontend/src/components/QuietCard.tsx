import { PropsWithChildren } from "react";

type QuietCardProps = PropsWithChildren;

export function QuietCard({ children }: QuietCardProps) {
  return <section className="quiet-card">{children}</section>;
}
