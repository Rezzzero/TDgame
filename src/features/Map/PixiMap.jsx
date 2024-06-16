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

      const firstDirtStartX = 3;
      const firstDirtStartY = 3;

      const secondDirtStartX = mapWidth - 4 - 3;
      const secondDirtStartY = mapHeight - 4 - 3;
      //два вызова функции для создания области вокруг левого верхнего и правого нижнего домов
      createDirtArea(firstDirtStartX, firstDirtStartY, 4);
      createDirtArea(secondDirtStartX, secondDirtStartY, 4);

      const drawPath = (startX, startY, endX, endY) => {
        //функция для создания спрайта
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

          addDirtSprite(currentX, currentY); //отрисовка главного пути
          addDirtSprite(currentX + 1, currentY); //добавление спрайта справа от главного пути
          addDirtSprite(currentX, currentY + 1); //добавление спрайта под гланым путем
        }
      };

      // Вызываем функцию для отрисовки главного пути между двумя участками
      drawPath(
        firstDirtStartX,
        firstDirtStartY,
        secondDirtStartX,
        secondDirtStartY
      );

      //функция для создания боковых путей
      const drawSidePaths = (startX, startY, endX, endY) => {
        const createPathSprite = (x, y) => {
          const pathSprite = new Sprite(pathTexture);
          pathSprite.width = tileWidth;
          pathSprite.height = tileHeight;
          pathSprite.x = x * tileWidth;
          pathSprite.y = y * tileHeight;
          container.addChild(pathSprite);
        };

        for (let y = startY; y <= endY; y++) {
          createPathSprite(startX, y);
          createPathSprite(endX, y);
        }

        for (let x = startX; x <= endX; x++) {
          createPathSprite(x, startY);
          createPathSprite(x, endY);
        }
      };

      // Вызываем функцию для отрисовки пути между двумя участками
      drawSidePaths(
        firstDirtStartX,
        firstDirtStartY,
        secondDirtStartX + 3,
        secondDirtStartY + 3
      );

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
