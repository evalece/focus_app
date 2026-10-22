
import { useEffect, useRef } from "react";
import { Application, Assets, Sprite } from "pixi.js";

export default function AnimatedScene({ isRunning }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let initialized = false;
    let destroyed = false;
    let resizeObserver = null;

    const app = new Application();

    function destroyApp() {
      if (!initialized || destroyed) return;

      destroyed = true;
      app.destroy(true, { children: true });
    }

    async function setup() {
      try {
        // 1. Initialize PixiJS
        await app.init({
          resizeTo: container,
          backgroundColor: 0xfaf9f6,
          antialias: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          autoDensity: true,
        });

        initialized = true;

        if (cancelled) return;

        container.appendChild(app.canvas);
        console.log("PixiJS initialized");

        // 2. Load classroom background
        const backgroundTexture = await Assets.load(
          "/assets/classroom.png"
        );

        if (cancelled) return;

        const background = new Sprite(backgroundTexture);
        app.stage.addChild(background);

        console.log("Classroom loaded");

        // 3. Load our ONE schoolgirl frame
        const girlTexture = await Assets.load(
          "/assets/frames/writing_00.png"
        );

        if (cancelled) return;

        const girl = new Sprite(girlTexture);

        girl.anchor.set(0.5, 1);

        // Render schoolgirl above the classroom
        app.stage.addChild(girl);

        console.log("Schoolgirl loaded!");

        // 4. Responsive layout
        function layout() {
          const width = app.screen.width;
          const height = app.screen.height;

          // Preserve classroom aspect ratio
          const backgroundScale = Math.max(
            width / backgroundTexture.width,
            height / backgroundTexture.height
          );

          background.scale.set(backgroundScale);

          // Center classroom; crop excess edges
          background.position.set(
            (width - backgroundTexture.width * backgroundScale) / 2,
            (height - backgroundTexture.height * backgroundScale) / 2
          );

          // Use the schoolgirl size that worked earlier
          girl.scale.set(0.26);

          // Position schoolgirl at the foreground desk
          girl.position.set(
            width * 0.36,
            height * 0.80
          );
        }

        layout();

        // 5. Update layout when scene resizes
        resizeObserver = new ResizeObserver(layout);
        resizeObserver.observe(container);

        console.log("CGI scene ready!");
      } catch (error) {
        if (!cancelled) {
          console.error("PixiJS scene error:", error);
        }
      } finally {
        // Handle unmount during async initialization
        if (cancelled) {
          destroyApp();
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      destroyApp();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="animated-scene"
      style={{
        width: "100%",
        height: "500px",
      }}
      role="img"
      aria-label="A classroom with a schoolgirl studying"
    />
  );
}
