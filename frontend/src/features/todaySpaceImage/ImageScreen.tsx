import { useEffect, useState } from "react";
import { ImageDialog } from "./ImageDialog";
import { getTodaySpaceImage } from "../../services/apiClient";
import type { TodaySpaceImageResponse } from "./types";

type Props = {
  onClose?: () => void; // 追加
};

export default function ImageScreen({ onClose }: Props) {
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

  return <ImageDialog image={image} onClose={onClose}/>;
}