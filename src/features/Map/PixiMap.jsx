import React, { useEffect } from "react";
import { Application, Container, Sprite, Assets } from "pixi.js";
import grass from "@shared/assets/tile/medievalTile_58.png";
import path from "@shared/assets/tile/medievalTile_13.png";
import dirt from "@shared/assets/tile/medievalTile_14.png";
import {
  createDirtArea,
  createSidePathSprites,
  drawMainPath,
} from "./utils/PixiMapUtils.jsx";
import { addMask, setupDragListeners } from "./utils/MapInteraction.jsx";

const PixiMap = () => {
  useEffect(() => {
    const setupPixiApp = async () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const app = new Application();
      await app.init({ width: screenWidth, height: screenHeight });

      document.getElementById("map-container").appendChild(app.canvas);

      // Загрузка текстур
      const grassTexture = await Assets.load(grass);
      const pathTexture = await Assets.load(path);
      const dirtTexture = await Assets.load(dirt);

      const mapWidth = 100;
      const mapHeight = 100;
      const tileWidth = 3200 / mapWidth;
      const tileHeight = 3200 / mapHeight;

      const container = new Container();
      app.stage.addChild(container);

      // Создание сетки тайлов grass
      for (let row = 0; row < mapHeight; row++) {
        for (let col = 0; col < mapWidth; col++) {
          const grassSprite = new Sprite(grassTexture);
          grassSprite.width = tileWidth;
          grassSprite.height = tileHeight;
          grassSprite.x = col * tileWidth;
          grassSprite.y = row * tileHeight;
          container.addChild(grassSprite);
        }
      }

      const firstDirtStartX = 3;
      const firstDirtStartY = 3;

      const secondDirtStartX = mapWidth - 4 - 3;
      const secondDirtStartY = mapHeight - 4 - 3;

      //два вызова функции отрисовки участков домов
      createDirtArea(container, dirtTexture, tileWidth, tileHeight, 3, 3, 4);
      createDirtArea(
        container,
        dirtTexture,
        tileWidth,
        tileHeight,
        secondDirtStartX,
        secondDirtStartY,
        4
      );

      //функция для создания главной пути
      drawMainPath(
        container,
        dirtTexture,
        tileWidth,
        tileHeight,
        firstDirtStartX,
        firstDirtStartY,
        secondDirtStartX,
        secondDirtStartY
      );

      //функция для создания боковых путей
      createSidePathSprites(
        container,
        pathTexture,
        tileWidth,
        tileHeight,
        firstDirtStartX,
        firstDirtStartY,
        secondDirtStartX + 3,
        secondDirtStartY + 3
      );

      container.position.set(
        (screenWidth - mapWidth * tileWidth) / 2,
        (screenHeight - mapHeight * tileHeight) / 2
      );

      // Добавление маски и передвижения по карте
      addMask(app, container, screenWidth, screenHeight);
      setupDragListeners(
        app,
        container,
        mapWidth,
        mapHeight,
        tileWidth,
        tileHeight
      );
    };

    setupPixiApp();
  }, []);

  return (
    <div
      className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
      id="map-container"
    ></div>
  );
};

export default PixiMap;
