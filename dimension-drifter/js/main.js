import { LEVEL_1, renderBoard } from "./grid.js";
import { setupPlayerControls } from "./entities.js";

/** @typedef {{ level: number[][], player: { row: number, col: number }, runes: { matter: boolean, behavior: boolean }, won: boolean }} GameState */

/** @type {GameState} */
export const gameState = {
  level: LEVEL_1,
  player: { row: 1, col: 1 },
  runes: {
    matter: false,
    behavior: false,
  },
  won: false,
};

function initGame() {
  const board = document.getElementById("board");
  if (!board) {
    return;
  }

  renderBoard(board, gameState.level, gameState.player);
  setupPlayerControls(gameState, board);
}

document.addEventListener("DOMContentLoaded", initGame);
