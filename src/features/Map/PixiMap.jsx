import React, { useEffect } from "react";
import { Application, Container, Sprite, Assets } from "pixi.js";
import grass from "@shared/assets/tile/medievalTile_58.png";
import path from "@shared/assets/tile/medievalTile_13.png";
import dirt from "@shared/assets/tile/medievalTile_14.png";

const PixiMap = () => {
  useEffect(() => {
    const setupPixiApp = async () => {
      const app = new Application();
      await app.init({ width: 800, height: 800 });

      document.getElementById("map-container").appendChild(app.canvas);

      // Загрузка текстур
      const grassTexture = await Assets.load(grass);
      const pathTexture = await Assets.load(path);
      const dirtTexture = await Assets.load(dirt);

      const mapWidth = 30;
      const mapHeight = 30;
      const tileWidth = app.screen.width / mapWidth;
      const tileHeight = app.screen.height / mapHeight;

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
      //функция для создания области вокруг дома
      const createDirtArea = (startX, startY, size) => {
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

      const secondDirtStartX = mapWidth - 4 - 3;
      const secondDirtStartY = mapHeight - 4 - 3;
      //два вызова функции для создания области вокруг левого верхнего и правого нижнего домов
      createDirtArea(3, 3, 4);
      createDirtArea(secondDirtStartX, secondDirtStartY, 4);

      container.position.set(
        (app.screen.width - mapWidth * tileWidth) / 2,
        (app.screen.height - mapHeight * tileHeight) / 2
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
