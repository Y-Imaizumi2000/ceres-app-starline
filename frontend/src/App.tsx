import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}
