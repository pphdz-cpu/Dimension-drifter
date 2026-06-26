import { getTileClass, getTileEntity, getTileVisualState } from "./runes.js";

export { TILE } from "./tiles.js";

/**
 * Level 1 — three rooms; river at (4, 4), guard at (7, 5). Start (1, 1), exit (8, 8).
 */
const level1 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 3, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

/**
 * Level 2 — winding rooms; river at (4, 5), guard at (7, 4). Start (1, 1), exit (8, 8).
 */
const level2 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 3, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

/**
 * Level 3 — dual choke points; rivers at (3, 6) and (5, 3), guard at (7, 6).
 * Start (1, 1), exit (8, 8).
 */
const level3 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 2, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 3, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const levels = [level1, level2, level3];

/** Starting coordinates for the marshmallow on each level. */
export const levelStarts = [
  { row: 1, col: 1 },
  { row: 1, col: 1 },
  { row: 1, col: 1 },
];

/** @deprecated Use levels[0] */
export const LEVEL_1 = level1;

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

      cell.className = `cell ${getTileClass(tile, activeRune)}`;
      cell.setAttribute("role", "gridcell");
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.dataset.tile = String(tile);
      cell.dataset.visual = getTileVisualState(tile, activeRune);

      if (isPlayerHere) {
        cell.classList.add("has-player");
        const player = document.createElement("span");
        player.className = "entity player";
        player.setAttribute("aria-label", "Marshmallow player");
        cell.appendChild(player);
      } else {
        const entity = getTileEntity(tile, activeRune);
        if (entity) {
          const span = document.createElement("span");
          span.className = entity.className;
          if (entity.text) {
            span.textContent = entity.text;
          }
          if (entity.label) {
            span.setAttribute("aria-label", entity.label);
          }
          if (entity.hidden) {
            span.setAttribute("aria-hidden", "true");
          }
          cell.appendChild(span);
        }
      }

      boardElement.appendChild(cell);
    }
  }
}
