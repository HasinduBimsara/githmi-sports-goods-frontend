import React from "react";

const ShinyText = ({
  text,
  speed = 2.8,
  delay = 0,
  color = "#4c16b1",
  shineColor = "#ff0000",
  spread = 120,
  direction = "right",
  yoyo = false,
  pauseOnHover = false,
  disabled = false,
  className = "",
}) => {
  // Map the direction and yoyo props to standard CSS animation-direction properties
  let animDirection = direction === "right" ? "normal" : "reverse";
  if (yoyo) {
    animDirection = direction === "right" ? "alternate" : "alternate-reverse";
  }

  return (
    <div
      className={`inline-block font-bold ${
        disabled ? "" : "animate-shine"
      } ${pauseOnHover ? "hover-pause" : ""} ${className}`}
      style={{
        // Dynamically applies your base color and shine color using the spread width
        backgroundImage: `linear-gradient(120deg, ${color} calc(50% - ${spread}px), ${shineColor} 50%, ${color} calc(50% + ${spread}px))`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        color: "transparent", // Hides the HTML text so the background gradient shows through
        animationDuration: `${speed}s`,
        animationDelay: `${delay}s`,
        animationDirection: animDirection,
      }}
    >
      {text}

      {/* Standard CSS injection (Vite compatible) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shine {
          0% {
            background-position: 100%;
          }
          100% {
            background-position: -100%;
          }
        }
        .animate-shine {
          animation-name: shine;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .hover-pause:hover {
          animation-play-state: paused;
        }
      `,
        }}
      />
    </div>
  );
};

export default ShinyText;
