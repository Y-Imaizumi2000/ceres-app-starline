import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen";
import HistoryScreen from "./features/todaySpaceHistory/HistoryScreen";
import ImageScreen from "./features/todaySpaceImage/ImageScreen";
import TonightSkyScreen from "./features/tonightSky/TonightSkyScreen";
import SolarSystemScreen from "./features/solarSystem/SolarSystemScreen";

export default function App() {
  return (
    <>
      {/* ★ アプリ全体の背景アニメーションレイヤー */}
      <div className="starline-background">
      <div className="planet-stream"></div>
      <div className="star-twinkle"></div>
      <div className="star-twinkle-layer3"></div>
      <div className="star-parallax-layer1"></div>
      <div className="star-parallax-layer2"></div>
      <div className="star-parallax-layer3"></div>
      <div className="star-depth-layer1"></div>
      <div className="star-depth-layer2"></div>
      <div className="star-depth-layer3"></div>
      <div className="milkyway-stars"></div>



    </div>


      {/* ★ ここからルーティング */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/image" element={<ImageScreen />} />
          <Route path="/tonight" element={<TonightSkyScreen />} />
          <Route path="/solar" element={<SolarSystemScreen />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
