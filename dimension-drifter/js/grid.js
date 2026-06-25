/** Tile types for Dimension Drifter: The Magic Labyrinth */
export const TILE = {
  FLOOR: 0,
  WALL: 1,
  RIVER: 2,
  GUARD: 3,
  EXIT: 4,
};

/** @param {number} tile @param {string | null} activeRune */
export function isPassable(tile, activeRune = null) {
  if (tile === TILE.FLOOR || tile === TILE.EXIT) {
    return true;
  }
  if (tile === TILE.RIVER && activeRune === "melt") {
    return true;
  }
  if (tile === TILE.GUARD && activeRune === "tiny") {
    return true;
  }
  return false;
}

const TILE_CLASS = {
  [TILE.FLOOR]: "tile-floor",
  [TILE.WALL]: "tile-wall",
  [TILE.RIVER]: "tile-river",
  [TILE.GUARD]: "tile-guard",
  [TILE.EXIT]: "tile-exit",
};

/**
 * Level 1 — three walled rooms with strict choke points.
 * Player starts at (1, 1), exit at (8, 8).
 *
 * Room 1 (rows 1–3): start area — only exit south through (4, 4) river.
 * Room 2 (rows 5–6): middle chamber — only exit south through (7, 5) guard.
 * Room 3 (row 8): exit chamber — star candies at (8, 8).
 *
 * Reaching the exit requires stepping on both tile 2 and tile 3.
 */
export const LEVEL_1 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1], // Room 1
  [1, 0, 1, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 1, 1], // Wall — sole gap: river (4, 4)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], // Room 2
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 3, 1, 1, 1, 1], // Wall — sole gap: guard (7, 5)
  [1, 0, 0, 0, 0, 0, 0, 0, 4, 1], // Room 3 — exit (8, 8)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

/**
 * Renders a 2D map array into the board container.
 * @param {HTMLElement} boardElement
 * @param {number[][]} mapData
 * @param {{ row: number, col: number } | null} playerPos
 * @param {string | null} activeRune
 */
export function renderBoard(
  boardElement,
  mapData,
  playerPos = null,
  activeRune = null
) {
  boardElement.replaceChildren();
  boardElement.setAttribute("role", "grid");

  const size = mapData.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < mapData[row].length; col++) {
      const tile = mapData[row][col];
      const cell = document.createElement("div");
      const isPlayerHere =
        playerPos && playerPos.row === row && playerPos.col === col;

      cell.className = `cell ${TILE_CLASS[tile] ?? "tile-floor"}`;
      cell.setAttribute("role", "gridcell");
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.dataset.tile = String(tile);

      if (isPlayerHere) {
        cell.classList.add("has-player");
        const player = document.createElement("span");
        player.className = "entity player";
        player.setAttribute("aria-label", "Marshmallow player");
        player.textContent = "😊";
        cell.appendChild(player);
      } else if (tile === TILE.GUARD) {
        if (activeRune === "tiny") {
          cell.classList.add("tile-guard-tiny");
          const tinyGuard = document.createElement("span");
          tinyGuard.className = "entity guard-tiny";
          tinyGuard.setAttribute("aria-hidden", "true");
          tinyGuard.textContent = "🍬";
          cell.appendChild(tinyGuard);
        } else {
          const guard = document.createElement("span");
          guard.className = "entity guard";
          guard.setAttribute("aria-hidden", "true");
          guard.textContent = "🍭";
          cell.appendChild(guard);
        }
      } else if (tile === TILE.RIVER) {
        if (activeRune === "melt") {
          cell.classList.remove("tile-river");
          cell.classList.add("tile-bridge");
          const bridge = document.createElement("span");
          bridge.className = "entity bridge";
          bridge.setAttribute("aria-label", "Candy bridge");
          bridge.textContent = "🌉";
          cell.appendChild(bridge);
        } else {
          const river = document.createElement("span");
          river.className = "entity river";
          river.setAttribute("aria-hidden", "true");
          river.textContent = "🍫";
          cell.appendChild(river);
        }
      } else if (tile === TILE.EXIT) {
        const exit = document.createElement("span");
        exit.className = "entity exit";
        exit.setAttribute("aria-label", "Star candy exit");
        exit.textContent = "⭐";
        cell.appendChild(exit);
      }

      boardElement.appendChild(cell);
    }
  }
}
