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

  // Добавляем вертикальные пути
  for (let y = startY; y <= endY; y++) {
    for (let xOffset = 0; xOffset < 2; xOffset++) {
      if (startX > endX) {
        addPathSprite(startX - xOffset, y);
        addPathSprite(endX + xOffset, y);
      } else {
        addPathSprite(startX + xOffset, y);
        addPathSprite(endX - xOffset, y);
      }
    }
  }

  // Добавляем горизонтальные пути
  for (let x = startX; x <= endX; x++) {
    for (let yOffset = 0; yOffset < 2; yOffset++) {
      if (startY > endY) {
        addPathSprite(x, startY - yOffset);
        addPathSprite(x, endY + yOffset);
      } else {
        addPathSprite(x, startY + yOffset);
        addPathSprite(x, endY - yOffset);
      }
    }
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
