// App.tsx
import React, { useState } from "react";
import CanvasViewport from "./components/CanvasViewport";
import "./styles/App.css";

const App: React.FC = () => {
  const [height, setHeight] = useState(400);

  return (
    <div className="app-container">
      <div className="viewport-wrapper" style={{ height }}>
        <CanvasViewport />
        <div className="overlay">
          <button onClick={() => setHeight(height + 100)}>Increase Size</button>
          <button onClick={() => setHeight(height - 100)}>Decrease Size</button>
        </div>
      </div>

      <div className="scroll-section">
        <p>Scroll down to test layout responsiveness</p>
        <div style={{ height: "800px" }} />
        <p>End of content</p>
      </div>
    </div>
  );
};

export default App;
