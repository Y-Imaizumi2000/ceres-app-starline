import { useEffect, useState } from "react";
import { QuietCard } from "../components/QuietCard";
import { SkyCheckStatusResponse } from "../features/skyCheck/types";
import { TodaySpaceHistoryResponse } from "../features/todaySpaceHistory/types";
import { TodaySpaceImageResponse } from "../features/todaySpaceImage/types";
import { TonightSkyResponse } from "../features/tonightSky/types";
import { SolarSystemPlanetResponse } from "../features/solarSystem/types";
import {
  checkSkyToday,
  getSkyCheckStatus,
  getSolarSystemPlanets,
  getTodaySpaceHistory,
  getTodaySpaceImage,
  getTonightSky
} from "../services/apiClient";
import { toDisplayDate } from "../utils/date";

export function HomeScreen() {
  const [historyItem, setHistoryItem] = useState<TodaySpaceHistoryResponse | null>(null);
  const [spaceImage, setSpaceImage] = useState<TodaySpaceImageResponse | null>(null);
  const [tonightSky, setTonightSky] = useState<TonightSkyResponse | null>(null);
  const [planets, setPlanets] = useState<SolarSystemPlanetResponse[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<SolarSystemPlanetResponse | null>(null);
  const [skyCheckStatus, setSkyCheckStatus] = useState<SkyCheckStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSkyCheckSubmitting, setIsSkyCheckSubmitting] = useState(false);
  const [historyErrorMessage, setHistoryErrorMessage] = useState<string | null>(null);
  const [spaceImageErrorMessage, setSpaceImageErrorMessage] = useState<string | null>(null);
  const [tonightSkyErrorMessage, setTonightSkyErrorMessage] = useState<string | null>(null);
  const [planetErrorMessage, setPlanetErrorMessage] = useState<string | null>(null);
  const [skyCheckErrorMessage, setSkyCheckErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);

      const [historyResult, imageResult, tonightSkyResult, planetResult, skyCheckResult] = await Promise.allSettled([
        getTodaySpaceHistory(),
        getTodaySpaceImage(),
        getTonightSky(),
        getSolarSystemPlanets(),
        getSkyCheckStatus()
      ]);

      if (!mounted) {
        return;
      }

      if (historyResult.status === "fulfilled") {
        setHistoryItem(historyResult.value);
        setHistoryErrorMessage(null);
      } else {
        setHistoryErrorMessage("今日の宇宙史を読み込めませんでした。");
      }

      if (imageResult.status === "fulfilled") {
        setSpaceImage(imageResult.value);
        setSpaceImageErrorMessage(null);
      } else {
        setSpaceImageErrorMessage("今日の宇宙画像を読み込めませんでした。");
      }

      if (tonightSkyResult.status === "fulfilled") {
        setTonightSky(tonightSkyResult.value);
        setTonightSkyErrorMessage(null);
      } else {
        setTonightSkyErrorMessage("今夜の空を読み込めませんでした。");
      }

      if (planetResult.status === "fulfilled") {
        setPlanets(planetResult.value);
        setSelectedPlanet(planetResult.value[2] ?? planetResult.value[0] ?? null);
        setPlanetErrorMessage(null);
      } else {
        setPlanetErrorMessage("太陽系図鑑を読み込めませんでした。");
      }

      if (skyCheckResult.status === "fulfilled") {
        setSkyCheckStatus(skyCheckResult.value);
        setSkyCheckErrorMessage(null);
      } else {
        setSkyCheckErrorMessage("空チェックの状況を読み込めませんでした。");
      }

      setIsLoading(false);
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSkyCheck = async () => {
    try {
      setIsSkyCheckSubmitting(true);
      const updated = await checkSkyToday();
      setSkyCheckStatus(updated);
      setSkyCheckErrorMessage(null);
    } catch {
      setSkyCheckErrorMessage("今日の空チェックを保存できませんでした。");
    } finally {
      setIsSkyCheckSubmitting(false);
    }
  };

  return (
    <main className="page">
      <h1 className="title">Starline</h1>
      <p className="subtitle">今日の宇宙と、今夜見上げる空</p>

      {isLoading ? <p className="card-body">読み込み中...</p> : null}

      {!isLoading ? (
        <QuietCard>
          <h2 className="card-title">今日の宇宙史</h2>
          {historyErrorMessage ? <p className="card-body">{historyErrorMessage}</p> : null}
          {!historyErrorMessage && historyItem ? (
            <>
              <h3 className="card-subtitle">{historyItem.title}</h3>
              <p className="card-body">{historyItem.description}</p>
              <p className="meta-text">{toDisplayDate(historyItem.date)}</p>
              {historyItem.source ? <p className="meta-text">{historyItem.source}</p> : null}
            </>
          ) : null}
        </QuietCard>
      ) : null}

      {!isLoading ? (
        <QuietCard>
          <h2 className="card-title">太陽系図鑑</h2>
          {planetErrorMessage ? <p className="card-body">{planetErrorMessage}</p> : null}
          {!planetErrorMessage && planets.length > 0 ? (
            <>
              <div className="planet-grid">
                {planets.map((planet) => (
                  <button
                    key={planet.id}
                    type="button"
                    className={`planet-tile ${selectedPlanet?.id === planet.id ? "is-selected" : ""}`}
                    onClick={() => setSelectedPlanet(planet)}
                  >
                    <span className="planet-name">{planet.name}</span>
                    <span className="planet-english">{planet.englishName}</span>
                  </button>
                ))}
              </div>
              {selectedPlanet ? (
                <section className="planet-detail" aria-label={`${selectedPlanet.name}の詳細`}>
                  <div>
                    <h3 className="card-subtitle">{selectedPlanet.name}</h3>
                    <p className="meta-text">{selectedPlanet.englishName}</p>
                  </div>
                  <div className="planet-facts">
                    <span>衛星数: {selectedPlanet.moonCount}</span>
                    <span>重力: {selectedPlanet.gravity.toFixed(2)} m/s²</span>
                    <span>
                      質量: {selectedPlanet.massValue.toFixed(3)} × 10
                      <sup>{selectedPlanet.massExponent}</sup> kg
                    </span>
                    <span>平均半径: {Math.round(selectedPlanet.meanRadius).toLocaleString("ja-JP")} km</span>
                    <span>平均温度: {selectedPlanet.averageTemperature} K</span>
                    <span>公転周期: {Math.round(selectedPlanet.orbitalPeriod).toLocaleString("ja-JP")} 日</span>
                  </div>
                  <p className="meta-text">{selectedPlanet.source}</p>
                </section>
              ) : null}
            </>
          ) : null}
        </QuietCard>
      ) : null}

      {!isLoading ? (
        <QuietCard>
          <h2 className="card-title">今日の宇宙画像</h2>
          {spaceImageErrorMessage ? <p className="card-body">{spaceImageErrorMessage}</p> : null}
          {!spaceImageErrorMessage && spaceImage ? (
            <>
              {spaceImage.imageUrl && spaceImage.mediaType === "image" ? (
                <img className="space-image" src={spaceImage.imageUrl} alt={spaceImage.title} />
              ) : null}
              {spaceImage.imageUrl && spaceImage.mediaType === "video" ? (
                <video className="space-image" src={spaceImage.imageUrl} controls muted playsInline />
              ) : null}
              <h3 className="card-subtitle">{spaceImage.title}</h3>
              <p className="card-body">{spaceImage.description}</p>
              <p className="meta-text">{spaceImage.source}</p>
            </>
          ) : null}
        </QuietCard>
      ) : null}

      {!isLoading ? (
        <QuietCard>
          <h2 className="card-title">今夜の空</h2>
          {tonightSkyErrorMessage ? <p className="card-body">{tonightSkyErrorMessage}</p> : null}
          {!tonightSkyErrorMessage && tonightSky ? (
            <>
              <p className="card-body">{tonightSky.advice}</p>
              <div className="sky-facts">
                <span>場所: {tonightSky.location}</span>
                <span>見やすさ: {tonightSky.visibility}</span>
                <span>{tonightSky.moonInfo}</span>
              </div>
              <div className="highlight-list">
                {tonightSky.highlights.map((highlight) => (
                  <span key={highlight}>{highlight}</span>
                ))}
              </div>
              <p className="meta-text">{tonightSky.source}</p>
            </>
          ) : null}
        </QuietCard>
      ) : null}

      {!isLoading ? (
        <QuietCard>
          <h2 className="card-title">今日は空を見ましたか？</h2>
          {skyCheckErrorMessage ? <p className="card-body">{skyCheckErrorMessage}</p> : null}
          {skyCheckStatus ? (
            <>
              <p className="card-body">
                {skyCheckStatus.checkedToday
                  ? "今日はすでに記録済みです。いいですね。"
                  : "空を見上げたら、ボタンを押して記録しましょう。"}
              </p>
              <p className="meta-text">現在の連続記録: {skyCheckStatus.streakDays}日</p>
              {skyCheckStatus.lastCheckedDate ? (
                <p className="meta-text">前回の記録: {toDisplayDate(skyCheckStatus.lastCheckedDate)}</p>
              ) : null}
              <button
                type="button"
                className="check-button"
                onClick={() => void handleSkyCheck()}
                disabled={isSkyCheckSubmitting}
              >
                {isSkyCheckSubmitting ? "保存中..." : "今日は空を見ました"}
              </button>
            </>
          ) : null}
        </QuietCard>
      ) : null}
    </main>
  );
}
