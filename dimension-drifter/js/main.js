import { levels, levelStarts, renderBoard } from "./grid.js";
import { setupPlayerControls } from "./entities.js";
import { setupRuneControls, updateRuneUI } from "./runes.js";

/** @typedef {{ level: number[][], player: { row: number, col: number }, activeRune: string | null, gameComplete: boolean }} GameState */

/** @type {GameState} */
export const gameState = {
  level: levels[0],
  player: { ...levelStarts[0] },
  activeRune: null,
  gameComplete: false,
};

export let currentLevelIndex = 0;

/**
 * @param {number} index
 */
export function loadLevel(index) {
  currentLevelIndex = index;
  gameState.level = levels[index];
  gameState.player = { ...levelStarts[index] };
  gameState.activeRune = null;
}

/**
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
  updateLevelUI();
}

function updateLevelUI() {
  const label = document.getElementById("level-label");
  if (label) {
    label.textContent = `Level ${currentLevelIndex + 1} of ${levels.length}`;
  }
}

function showWinOverlay() {
  const overlay = document.getElementById("win-overlay");
  if (!overlay) {
    return;
  }
  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
}

/**
 * Called when the player steps on an exit tile.
 * @param {HTMLElement} boardElement
 */
export function handleLevelComplete(boardElement) {
  if (gameState.gameComplete) {
    return;
  }

  if (currentLevelIndex >= levels.length - 1) {
    gameState.gameComplete = true;
    showWinOverlay();
    return;
  }

  loadLevel(currentLevelIndex + 1);
  refreshGameView(boardElement);
}

function initGame() {
  const board = document.getElementById("board");
  if (!board) {
    return;
  }

  loadLevel(0);
  refreshGameView(board);
  setupRuneControls(gameState, () => refreshGameView(board));
  setupPlayerControls(gameState, board, () => handleLevelComplete(board));
}

document.addEventListener("DOMContentLoaded", initGame);
