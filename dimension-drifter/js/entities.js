import { TILE, renderBoard } from "./grid.js";
import { isTilePassable } from "./runes.js";

const KEY_DIRECTIONS = {
  ArrowUp: { dRow: -1, dCol: 0 },
  ArrowDown: { dRow: 1, dCol: 0 },
  ArrowLeft: { dRow: 0, dCol: -1 },
  ArrowRight: { dRow: 0, dCol: 1 },
  KeyW: { dRow: -1, dCol: 0 },
  KeyS: { dRow: 1, dCol: 0 },
  KeyA: { dRow: 0, dCol: -1 },
  KeyD: { dRow: 0, dCol: 1 },
};

/**
 * @param {number} tile
 * @param {string | null} activeRune
 */
export function isPassable(tile, activeRune = null) {
  return isTilePassable(tile, activeRune);
}

/**
 * @param {import("./main.js").GameState} gameState
 * @param {HTMLElement} boardElement
 * @param {number} dRow
 * @param {number} dCol
 */
export function tryMovePlayer(gameState, boardElement, dRow, dCol) {
  if (gameState.won) {
    return;
  }

  const newRow = gameState.player.row + dRow;
  const newCol = gameState.player.col + dCol;
  const { level } = gameState;

  if (
    newRow < 0 ||
    newCol < 0 ||
    newRow >= level.length ||
    newCol >= level[newRow].length
  ) {
    return;
  }

  const targetTile = level[newRow][newCol];
  if (!isPassable(targetTile, gameState.activeRune)) {
    return;
  }

  gameState.player.row = newRow;
  gameState.player.col = newCol;

  renderBoard(boardElement, level, gameState.player, gameState.activeRune);

  if (targetTile === TILE.EXIT) {
    gameState.won = true;
    alert("You reached the star candies! You win!");
  }
}

/**
 * @param {import("./main.js").GameState} gameState
 * @param {HTMLElement} boardElement
 */
export function setupPlayerControls(gameState, boardElement) {
  document.addEventListener("keydown", (event) => {
    const direction = KEY_DIRECTIONS[event.code];
    if (!direction) {
      return;
    }

    event.preventDefault();
    tryMovePlayer(
      gameState,
      boardElement,
      direction.dRow,
      direction.dCol
    );
  });
}
