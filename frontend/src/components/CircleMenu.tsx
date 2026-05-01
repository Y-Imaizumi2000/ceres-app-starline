import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

type MenuItem = {
  id: string;
  label: string;
  onSelect: () => void;
};

export function CircleMenu({ items }: { items: MenuItem[] }) {
  const [index, setIndex] = useState(0);

  const bind = useDrag(({ offset: [x] }) => {
    const newIndex = Math.round(-x / 200);
    setIndex((newIndex % items.length + items.length) % items.length);
  });

  return (
    <div
      {...bind()}
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
              opacity: isCenter ? 1 : 0.4,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={item.onSelect}
          >
            <div
              style={{
                width: "180px",
                height: "200px",
                background: "#1a1a1a",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px",
                boxShadow: isCenter
                  ? "0 0 20px rgba(255,255,255,0.4)"
                  : "0 0 5px rgba(0,0,0,0.3)",
              }}
            >
              {item.label}
            </div>
          </animated.div>
        );
      })}
    </div>
  );
}
