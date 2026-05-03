import { useEffect, useState } from "react";
import { TonightSkyDialog } from "./TonightSkyDialog";
import { getTonightSky } from "../../services/apiClient";
import type { TonightSkyResponse } from "./types";
import municipalitiesData from "../../data/municipalities.json";

const LOCATION_KEY = "tonightSky_location";

type Props = {
  onClose?: () => void;
};

export default function TonightSkyScreen({ onClose }: Props) {
  const [sky, setSky] = useState<TonightSkyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [selectedPref, setSelectedPref] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const prefectures = Object.keys(municipalitiesData);
  const cities = selectedPref
    ? (municipalitiesData as Record<string, string[]>)[selectedPref] ?? []
    : [];

  useEffect(() => {
    const saved = localStorage.getItem(LOCATION_KEY);
    if (saved) {
      loadSky(saved);
    } else {
      setShowInput(true);
      setLoading(false);
    }
  }, []);

  const loadSky = async (location: string) => {
    setLoading(true);
    const data = await getTonightSky(location);
    setSky(data);
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!selectedPref || !selectedCity) return;
    const location = selectedCity;
    localStorage.setItem(LOCATION_KEY, location);
    setShowInput(false);
    loadSky(location);
  };

  if (showInput) {
    return (
      <div className="dialog-overlay">
        <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
          <div className="dialog-header">
            <h2>観測地点を設定</h2>
          </div>
          <div className="dialog-content">
            <p className="card-body">お住まいの市区町村を選択してください。</p>
            <select
              className="location-select"
              value={selectedPref}
              onChange={(e) => {
                setSelectedPref(e.target.value);
                setSelectedCity("");
              }}
            >
              <option value="">都道府県を選択</option>
              {prefectures.map((pref) => (
                <option key={pref} value={pref}>{pref}</option>
              ))}
            </select>
            <select
              className="location-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedPref}
            >
              <option value="">市区町村を選択</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="location-input-actions">
            <button className="dialog-close-button" onClick={onClose}>キャンセル</button>
            <button
              className="location-submit-button"
              onClick={handleSubmit}
              disabled={!selectedPref || !selectedCity}
            >
              設定する
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !sky) {
    return <p className="card-body">読み込み中...</p>;
  }

  return <TonightSkyDialog sky={sky} onClose={onClose} onChangeLocation={() => {
    localStorage.removeItem(LOCATION_KEY);
    setShowInput(true);
    setSky(null);
  }} />;
}