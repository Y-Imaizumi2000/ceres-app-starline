import { useState } from "react";
import { animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

type MenuItem = {
    id: string;
    label: string;
    onSelect: () => void;
};

export function CircleMenu({ items }: { items: MenuItem[] }) {
    const [index, setIndex] = useState(0);

    // スワイプ操作
    const bind = useDrag(({ offset: [x] }) => {
        const newIndex = Math.round(-x / 200);
        setIndex((newIndex % items.length + items.length) % items.length);
    });

    return (
        <>
            {/* ★ スクロールバーの宇宙テーマ（パターンA）をここに埋め込む */}
            <style>{`
  input[type="range"] {
    -webkit-appearance: none;
    width: 80%;
    height: 6px;
    background: linear-gradient(90deg, #3a4bff, #8a9bff);
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(120,150,255,0.5);
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 28px;
    height: 28px;
    background: url("/star-thumb.png") no-repeat center / contain;
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 14px rgba(150,160,255,0.45);
  }
`}</style>



            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                {/* 円形メニュー */}
                <div
                    {...bind()}
                    onWheel={(e) => {
                    if (e.deltaY > 0) {
                    setIndex((prev) => (prev + 1) % items.length);
                    } else {
                    setIndex((prev) => (prev - 1 + items.length) % items.length);
                     }
                    }}
                    style={{
                        width: "100%",
                        height: "350px",
                        position: "relative",
                        overflow: "hidden",
                        perspective: "1000px",
                    }}
                >
                    {items.map((item, i) => {
                        const angle = ((i - index + items.length) % items.length) * 60;
                        const isCenter = i === index;

                        return (
                            <animated.div
                                key={item.id}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: `
                    translate(-50%, -50%)
                    rotateY(${angle}deg)
                    translateZ(260px)
                    scale(${isCenter ? 1.2 : 0.8})
                  `,
                                    opacity: isCenter ? 1 : 0.15,
                                    transition: "all 0.3s ease",
                                    cursor: "pointer",
                                }}
                                onClick={item.onSelect}
                            >
                                <div
                                    style={{
                                        width: "180px",
                                        height: "200px",
                                        background: "linear-gradient(135deg, #0a0f2d, #1a1f4d)",
                                        borderRadius: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: "20px",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        backdropFilter: "blur(6px)",
                                        boxShadow: isCenter
                                            ? "0 0 25px rgba(120,150,255,0.6)"
                                            : "0 0 10px rgba(120,150,255,0.2)",
                                        transition: "box-shadow 0.3s ease",
                                    }}
                                >
                                    {item.label}
                                </div>
                            </animated.div>
                        );
                    })}
                </div>
                {/* 横スクロールバー
                <input
                    type="range"
                    min={0}
                    max={items.length - 1}
                    value={index}
                    onChange={(e) => setIndex(Number(e.target.value))}
                /> */}
            </div>
        </>
    );
}
