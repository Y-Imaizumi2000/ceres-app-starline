import type { SolarSystemPlanetResponse } from "./types";
import { useEffect, useRef, useState } from "react";

type Props = {
  planets: SolarSystemPlanetResponse[];
};

const PLANET_COLORS: Record<string, string> = {
  mercure: "#b0b0b0",
  venus: "#e8c880",
  terre: "#4a9fe8",
  mars: "#c0522a",
  jupiter: "#c8a878",
  saturne: "#d4b870",
  uranus: "#7de8e8",
  neptune: "#3a6ae8",
};

const ORBIT_RADII = [55, 85, 118, 155, 198, 242, 285, 326];
const PLANET_SIZES = [4, 6, 7, 5, 14, 12, 9, 9];    
const SPEEDS = [4.7, 1.8, 1.1, 0.6, 0.08, 0.034, 0.012, 0.006];

export function SolarSystemDialog({ planets }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(planets.map((_, i) => (i * Math.PI * 2) / planets.length));
  const [selected, setSelected] = useState<SolarSystemPlanetResponse | null>(planets.length > 0 ? planets[0] : null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CX = canvas.width / 2;
    const CY = canvas.height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const stars = [[80, 30], [200, 15], [350, 40], [480, 20], [560, 50], [30, 80], [600, 70]];
      stars.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x ?? 0, y ?? 0, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();
      });

      planets.forEach((_, i) => {
        const r = ORBIT_RADII[i] ?? 60 + i * 40;
        ctx.beginPath();
        ctx.ellipse(CX, CY, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      const sunGlow = ctx.createRadialGradient(CX, CY, 0, CX, CY, 28);
      sunGlow.addColorStop(0, "#fff7a0");
      sunGlow.addColorStop(0.4, "#ffcc00");
      sunGlow.addColorStop(1, "rgba(255,136,0,0)");
      ctx.beginPath();
      ctx.arc(CX, CY, 28, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(CX, CY, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#ffcc00";
      ctx.fill();

      planets.forEach((planet, i) => {
        const r = ORBIT_RADII[i] ?? 60 + i * 40;
        const size = PLANET_SIZES[i] ?? 8;
        const angle = anglesRef.current[i] ?? 0;
        const px = CX + r * Math.cos(angle);
        const py = CY + r * 0.3 * Math.sin(angle);
        const color = PLANET_COLORS[planet.id] ?? "#aaaaaa";

        if (planet.id === "saturne") {
          ctx.beginPath();
          ctx.ellipse(px, py, size + 10, 3, 0, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(196,160,96,0.6)";
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = selected?.id === planet.id ? "white" : color;
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(planet.name, px, py + size + 10);

        anglesRef.current[i] = angle + (SPEEDS[i] ?? 0.5) * 0.008;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [planets, selected]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    const CX = canvas.width / 2;
    const CY = canvas.height / 2;

    let clicked: SolarSystemPlanetResponse | null = null;
    planets.forEach((planet, i) => {
      const r = ORBIT_RADII[i] ?? 60 + i * 40;
      const size = PLANET_SIZES[i] ?? 8;
      const angle = anglesRef.current[i] ?? 0;
      const px = CX + r * Math.cos(angle);
      const py = CY + r * 0.3 * Math.sin(angle);
      const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
      if (dist <= size + 6) clicked = planet;
    });

    setSelected(clicked);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={700}
        height={340}  // 220 → 340
        style={{ width: "100%", borderRadius: "8px", cursor: "pointer", marginBottom: "16px" }}
        onClick={handleCanvasClick}
      />
      <div className="planet-list">
        {planets.map((planet) => (
          <button
            key={planet.id}
            className={`planet-list-item ${selected?.id === planet.id ? "active" : ""}`}
            onClick={() => setSelected(planet)}
          >
            {planet.name}
          </button>
        ))}
      </div>
      {selected ? (
        <div className="solar-detail">
          <p className="solar-detail-name">
            {selected.name}
            <span className="solar-detail-en">{selected.englishName}</span>
          </p>
          <div className="solar-detail-grid">
            <div className="solar-detail-item">
              <div className="solar-detail-label">平均半径</div>
              <div className="solar-detail-value">{selected.meanRadius.toLocaleString()} km</div>
            </div>
            <div className="solar-detail-item">
              <div className="solar-detail-label">重力</div>
              <div className="solar-detail-value">{selected.gravity} m/s²</div>
            </div>
            <div className="solar-detail-item">
              <div className="solar-detail-label">公転周期</div>
              <div className="solar-detail-value">{selected.orbitalPeriod.toLocaleString()} 日</div>
            </div>
            <div className="solar-detail-item">
              <div className="solar-detail-label">平均気温</div>
              <div className="solar-detail-value">{selected.averageTemperature} K</div>
            </div>
            <div className="solar-detail-item">
              <div className="solar-detail-label">衛星数</div>
              <div className="solar-detail-value">{selected.moonCount} 個</div>
            </div>
            <div className="solar-detail-item">
              <div className="solar-detail-label">質量</div>
              <div className="solar-detail-value">
                {selected.massValue} × 10<sup>{selected.massExponent}</sup> kg
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="meta-text">惑星をクリックすると詳細が表示されます</p>
      )}
    </>
  );
}