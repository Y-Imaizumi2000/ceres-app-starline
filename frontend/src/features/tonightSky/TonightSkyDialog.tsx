import type { TonightSkyResponse } from "./types";

type Props = {
  sky: TonightSkyResponse;
  onChangeLocation?: () => void;
};

export function TonightSkyDialog({ sky, onChangeLocation }: Props) {
  return (
    <>
      <div className="tonight-info">
        <p className="tonight-info-item"><span className="tonight-label">場所</span>{sky.location}</p>
        <p className="tonight-info-item"><span className="tonight-label">視界</span>{sky.visibility}</p>
        <p className="tonight-info-item"><span className="tonight-label">月</span>{sky.moonInfo}</p>
      </div>

      {sky.highlights.length > 0 && (
        <div className="highlight-list">
          {sky.highlights.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      )}

      <p className="tonight-advice">{sky.advice}</p>

      {onChangeLocation && (
        <button className="location-change-button" onClick={onChangeLocation}>
          地点を変更
        </button>
      )}
    </>
  );
}
