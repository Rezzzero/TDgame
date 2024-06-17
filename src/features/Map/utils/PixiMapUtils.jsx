import { Sprite } from "pixi.js";

const createDirtArea = (
  container,
  dirtTexture,
  tileWidth,
  tileHeight,
  startX,
  startY,
  size
) => {
  for (let row = startY; row < startY + size; row++) {
    for (let col = startX; col < startX + size; col++) {
      const dirtSprite = new Sprite(dirtTexture);
      dirtSprite.width = tileWidth;
      dirtSprite.height = tileHeight;
      dirtSprite.x = col * tileWidth;
      dirtSprite.y = row * tileHeight;
      container.addChild(dirtSprite);
    }
  }
};

const createSidePathSprites = (
  container,
  pathTexture,
  tileWidth,
  tileHeight,
  startX,
  startY,
  endX,
  endY
) => {
  const addPathSprite = (x, y) => {
    const pathSprite = new Sprite(pathTexture);
    pathSprite.width = tileWidth;
    pathSprite.height = tileHeight;
    pathSprite.x = x * tileWidth;
    pathSprite.y = y * tileHeight;
    container.addChild(pathSprite);
  };

  for (let y = startY; y <= endY; y++) {
    addPathSprite(startX, y);
    addPathSprite(endX, y);
  }

  for (let x = startX + 1; x < endX; x++) {
    addPathSprite(x, startY);
    addPathSprite(x, endY);
  }
};

const drawMainPath = (
  container,
  dirtTexture,
  tileWidth,
  tileHeight,
  startX,
  startY,
  endX,
  endY
) => {
  const addDirtSprite = (x, y) => {
    const dirtSprite = new Sprite(dirtTexture);
    dirtSprite.width = tileWidth;
    dirtSprite.height = tileHeight;
    dirtSprite.x = x * tileWidth;
    dirtSprite.y = y * tileHeight;
    container.addChild(dirtSprite);
  };

  let currentX = startX;
  let currentY = startY;

  while (currentX !== endX || currentY !== endY) {
    if (currentX < endX) {
      currentX++;
    } else if (currentX > endX) {
      currentX--;
    }

    if (currentY < endY) {
      currentY++;
    } else if (currentY > endY) {
      currentY--;
    }

    addDirtSprite(currentX, currentY);
    addDirtSprite(currentX + 1, currentY);
    addDirtSprite(currentX, currentY + 1);
  }
};

export { createDirtArea, createSidePathSprites, drawMainPath };
