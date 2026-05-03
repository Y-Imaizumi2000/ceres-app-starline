import BaseDialog from "../../components/BaseDialog";
import type { TodaySpaceImageResponse } from "./types";

type Props = {
  image: TodaySpaceImageResponse;
  onClose?: () => void;
};

export function ImageDialog({ image, onClose }: Props) {
  return (
    <BaseDialog title={image.title} onClose={onClose}>
      {image.mediaType === "image" && image.imageUrl && (
        <img className="space-image" src={image.imageUrl} alt={image.title} />
      )}
      {image.mediaType === "video" && image.imageUrl && (
        <iframe
          className="space-image"
          src={image.imageUrl}
          title={image.title}
          allowFullScreen
          style={{ border: "none", aspectRatio: "16/9", width: "100%" }}
        />
      )}
      <div className="image-description-scroll">
  {image.description.split("\n\n").map((paragraph, index) => (
    <p className="card-body" key={index}>{paragraph}</p>
  ))}
  {image.source && (
    <p className="meta-text">出典: {image.source}</p>
  )}
</div>
    </BaseDialog>
  );
}