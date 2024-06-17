import { Graphics } from "pixi.js";

export const addMask = (app, container, screenWidth, screenHeight) => {
  const obj = new Graphics().rect(0, 0, screenWidth, screenHeight);
  container.obj = obj;
  app.stage.addChild(obj);
};

export const setupDragListeners = (
  app,
  container,
  mapWidth,
  mapHeight,
  tileWidth,
  tileHeight
) => {
  let dragging = false;
  let previousPosition = null;

  const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

  app.view.addEventListener("mousedown", (event) => {
    dragging = true;
    previousPosition = { x: event.clientX, y: event.clientY };
  });

  app.view.addEventListener("mousemove", (event) => {
    if (dragging) {
      const dx = event.clientX - previousPosition.x;
      const dy = event.clientY - previousPosition.y;
      container.x = clamp(
        container.x + dx,
        -(mapWidth * tileWidth - app.screen.width),
        0
      );
      container.y = clamp(
        container.y + dy,
        -(mapHeight * tileHeight - app.screen.height),
        0
      );
      previousPosition = { x: event.clientX, y: event.clientY };
    }
  });

  app.view.addEventListener("mouseup", () => {
    dragging = false;
  });

  app.view.addEventListener("mouseleave", () => {
    dragging = false;
  });
};
