// CanvasViewport.tsx
import React, { useEffect, useRef } from "react";
import { RenderSystem } from "../../../../3ans-ecs/src/systems/RenderSystem";

const CanvasViewport: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderSystem = RenderSystem.getInstance();
    
    renderSystem.initRenderer();

    const canvas = renderSystem.getDomElement();

    if (containerRef.current && !containerRef.current.contains(canvas)) {
      containerRef.current.appendChild(canvas);
    }

    const resize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderSystem.resize(width, height);
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default CanvasViewport;