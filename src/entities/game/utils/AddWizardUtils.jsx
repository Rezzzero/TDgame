export const PlacementTile = (x, y) => {
  const size = 32;
  let color = "rgba(255, 255, 255, 0.3)";
  let occupied = false;

  const draw = (ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
  };

  const update = (ctx, mouse) => {
    draw(ctx);
    if (
      mouse.x > x &&
      mouse.x < x + size &&
      mouse.y > y &&
      mouse.y < y + size
    ) {
      color = "white";
    } else {
      color = "rgba(255, 255, 255, 0.3)";
    }
  };

  return { x, y, size, update };
};

export const GeneratePlacementTiles = (placementTilesData) => {
  const tilesGrid = [];

  for (let i = 0; i < placementTilesData.length; i += 40) {
    tilesGrid.push(placementTilesData.slice(i, i + 40));
  }

  const tiles = [];

  tilesGrid.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol === 451) {
        tiles.push(PlacementTile(x * 32, y * 32));
      }
    });
  });

  return tiles;
};

const Projectile = (initialX, initialY, enemies) => {
  let x = initialX;
  let y = initialY;
  let velocity = { x: 0, y: 0 };
  let hit = false;
  const range = 3;

  const update = (ctx) => {
    if (hit) return;

    if (enemies.length > 0) {
      const angle = Math.atan2(enemies[0].y - y, enemies[0].x - x);
      velocity = { x: Math.cos(angle) * 2, y: Math.sin(angle) * 2 };
      x += velocity.x;
      y += velocity.y;
    }

    const enemy = enemies[0];
    const roundedProjectileX = Math.round(x);
    const roundedProjectileY = Math.round(y);
    const roundedEnemyX = Math.round(enemy.x);
    const roundedEnemyY = Math.round(enemy.y);

    if (
      Math.abs(roundedProjectileX - roundedEnemyX) < range &&
      Math.abs(roundedProjectileY - roundedEnemyY) < range
    ) {
      hit = true;
    } else {
      draw(ctx);
    }
  };

  const draw = (ctx) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "orange";
    ctx.fill();
  };

  return { update, hit };
};

export const AddWizard = (x, y, enemies, shooted, setShootStatus) => {
  const width = 32 * 2;
  const height = 32;
  const center = { x: x + width / 2, y: y + height / 2 };
  const radius = 100;
  let target;

  let projectiles = [];

  if (!shooted) {
    projectiles.push(Projectile(center.x, center.y, enemies));
    setShootStatus(true);
  }

  const draw = (ctx) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, width, height, 32);

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,255, 0.2)";
    ctx.fill();

    projectiles.forEach((projectile) => {
      projectile.update(ctx);
    });
  };

  return { x, y, projectiles, radius, draw };
};

export const handleCanvasClick = (
  event,
  activeTile,
  firstPlayerTiles,
  secondPlayerTiles,
  user,
  socketRef
) => {
  if (user && user.playerType && activeTile && !activeTile.isOccupied) {
    const playerType = user.playerType;
    console.log("click");

    const isFirstPlayerTile = firstPlayerTiles.includes(activeTile);
    const isSecondPlayerTile = secondPlayerTiles.includes(activeTile);

    if (
      (playerType === "firstPlayer" && isFirstPlayerTile) ||
      (playerType === "secondPlayer" && isSecondPlayerTile)
    ) {
      const wizard = { x: activeTile.x, y: activeTile.y };
      socketRef.current.emit("placeWizard", { wizard, playerType });
      activeTile.isOccupied = true;
    }
  }
};

export const activeTileFunction = (arr, mouse) => {
  for (let i = 0; i < arr.length; i++) {
    const tile = arr[i];
    if (
      mouse.x > tile.x &&
      mouse.x < tile.x + tile.size &&
      mouse.y > tile.y &&
      mouse.y < tile.y + tile.size
    ) {
      return tile;
    }
  }
  return null;
};

export const createWizards = (
  wizards,
  enemyPositions,
  wizardShootStatus,
  setWizardShootStatus
) => {
  return wizards.map((wizard, index) =>
    AddWizard(
      wizard.x,
      wizard.y,
      enemyPositions,
      wizardShootStatus[index],
      (shooted) =>
        setWizardShootStatus((prev) => {
          const newStatus = [...wizardShootStatus];
          newStatus[index] = shooted;
          return { ...prev, firstWizards: newStatus };
        })
    )
  );
};
