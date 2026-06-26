import { LEVEL_1, renderBoard } from "./grid.js";
import { setupPlayerControls } from "./entities.js";
import { setupRuneControls, updateRuneUI } from "./runes.js";

/** @typedef {{ level: number[][], player: { row: number, col: number }, activeRune: string | null, won: boolean }} GameState */

/** @type {GameState} */
export const gameState = {
  level: LEVEL_1,
  player: { row: 1, col: 1 },
  activeRune: null,
  won: false,
};

/**
 * Re-renders the board with current rune visuals and updates rune button UI.
 * Class swaps (e.g. tile-river → tile-bridge) happen inside renderBoard via getTileClass.
 * @param {HTMLElement} boardElement
 */
export function refreshGameView(boardElement) {
  renderBoard(
    boardElement,
    gameState.level,
    gameState.player,
    gameState.activeRune
  );
  updateRuneUI(gameState.activeRune);
}

function initGame() {
  const board = document.getElementById("board");
  if (!board) {
    return;
  }

  refreshGameView(board);
  setupRuneControls(gameState, () => refreshGameView(board));
  setupPlayerControls(gameState, board);
}

document.addEventListener("DOMContentLoaded", initGame);
