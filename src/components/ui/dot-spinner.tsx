import React from "react";
import "./dot-spinner.css"; // 아래 CSS를 이 경로에 저장

export function DotSpinner() {
  return (
    <div className="dot-spinner">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="dot"
          style={{ "--i": i } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
