const TILE = {
  FLOOR: 0,
  WALL: 1,
  RIVER: 2,
  GUARD: 3,
  EXIT: 4,
};

export const RUNES = {
  MELT: "melt",
  TINY: "tiny",
};

const BASE_TILE_CLASS = {
  [TILE.FLOOR]: "tile-floor",
  [TILE.WALL]: "tile-wall",
  [TILE.RIVER]: "tile-river",
  [TILE.GUARD]: "tile-guard",
  [TILE.EXIT]: "tile-exit",
};

/**
 * Returns the CSS tile class for a cell, swapping appearance when a rune is active.
 * @param {number} tile
 * @param {string | null} activeRune
 */
export function getTileClass(tile, activeRune) {
  if (tile === TILE.RIVER && activeRune === RUNES.MELT) {
    return "tile-bridge";
  }
  if (tile === TILE.GUARD && activeRune === RUNES.TINY) {
    return "tile-guard-tiny";
  }
  return BASE_TILE_CLASS[tile] ?? "tile-floor";
}

/**
 * @param {number} tile
 * @param {string | null} activeRune
 * @returns {{ className: string, text: string, label?: string, hidden?: boolean } | null}
 */
export function getTileEntity(tile, activeRune) {
  if (tile === TILE.RIVER) {
    if (activeRune === RUNES.MELT) {
      return { className: "entity bridge", text: "🌉", label: "Candy bridge" };
    }
    return null;
  }

  if (tile === TILE.GUARD) {
    if (activeRune === RUNES.TINY) {
      return { className: "entity guard-tiny", text: "🍬", hidden: true };
    }
    return { className: "entity guard", label: "Lollipop guard" };
  }

  if (tile === TILE.EXIT) {
    return { className: "entity exit", text: "⭐", label: "Star candy exit" };
  }

  return null;
}

/**
 * @param {string | null} activeRune
 */
export function updateRuneUI(activeRune) {
  document.querySelectorAll(".rune-slot[data-rune]").forEach((button) => {
    const isActive = button.dataset.rune === activeRune;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));

    const status = button.querySelector(".rune-status");
    if (status) {
      status.textContent = isActive ? "Active" : "Inactive";
    }
  });
}

/**
 * @param {import("./main.js").GameState} gameState
 * @param {string} rune
 * @returns {string | null}
 */
export function toggleActiveRune(gameState, rune) {
  gameState.activeRune = gameState.activeRune === rune ? null : rune;
  return gameState.activeRune;
}

/**
 * @param {import("./main.js").GameState} gameState
 * @param {() => void} refreshBoard
 */
export function setupRuneControls(gameState, refreshBoard) {
  document.querySelectorAll(".rune-slot[data-rune]").forEach((button) => {
    button.addEventListener("click", () => {
      const rune = button.dataset.rune;
      if (!rune) {
        return;
      }

      toggleActiveRune(gameState, rune);
      updateRuneUI(gameState.activeRune);
      refreshBoard();
    });
  });

  updateRuneUI(gameState.activeRune);
}
