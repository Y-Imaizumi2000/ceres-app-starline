import type { TodaySpaceImageResponse } from "./types";

type Props = {
  image: TodaySpaceImageResponse;
};

export function ImageDialog({ image }: Props) {
  return (
    <>
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
      <h2 className="subtitle">概要 </h2>
      <div className="image-description-scroll">
        {image.description.split("\n\n").map((paragraph, index) => (
          <p className="card-body" key={index}>{paragraph}</p>
        ))}
        {image.source && (
          <p className="meta-text">出典: {image.source}</p>
        )}
      </div>
    </>
  );
}