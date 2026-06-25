import { LEVEL_1, renderBoard } from "./grid.js";
import { setupPlayerControls } from "./entities.js";
import { setupRuneControls } from "./runes.js";

/** @typedef {{ level: number[][], player: { row: number, col: number }, activeRune: string | null, won: boolean }} GameState */

/** @type {GameState} */
export const gameState = {
  level: LEVEL_1,
  player: { row: 1, col: 1 },
  activeRune: null,
  won: false,
};

function initGame() {
  const board = document.getElementById("board");
  if (!board) {
    return;
  }

  renderBoard(board, gameState.level, gameState.player, gameState.activeRune);
  setupRuneControls(gameState, board);
  setupPlayerControls(gameState, board);
}

document.addEventListener("DOMContentLoaded", initGame);
