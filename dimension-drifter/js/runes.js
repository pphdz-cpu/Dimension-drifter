import { TILE } from "./tiles.js";

export const RUNES = {
  MELT: "melt",
  TINY: "tiny",
};

/** Maps tile types to default and rune-transformed CSS classes. */
export const TILE_VISUAL_CLASS = {
  [TILE.FLOOR]: { default: "tile-floor" },
  [TILE.WALL]: { default: "tile-wall" },
  [TILE.RIVER]: { default: "tile-river", [RUNES.MELT]: "tile-bridge" },
  [TILE.GUARD]: { default: "tile-guard", [RUNES.TINY]: "tile-guard-tiny" },
  [TILE.EXIT]: { default: "tile-exit" },
};

/**
 * @param {number} tile
 * @param {string | null} activeRune
 */
export function getTileClass(tile, activeRune) {
  const visual = TILE_VISUAL_CLASS[tile];
  if (!visual) {
    return "tile-floor";
  }

  if (activeRune && visual[activeRune]) {
    return visual[activeRune];
  }

  return visual.default;
}

/**
 * @param {number} tile
 * @param {string | null} activeRune
 */
export function getTileVisualState(tile, activeRune) {
  if (tile === TILE.RIVER && activeRune === RUNES.MELT) {
    return "bridge";
  }
  if (tile === TILE.RIVER) {
    return "river";
  }
  if (tile === TILE.GUARD && activeRune === RUNES.TINY) {
    return "tiny-guard";
  }
  if (tile === TILE.GUARD) {
    return "guard";
  }
  if (tile === TILE.EXIT) {
    return "exit";
  }
  if (tile === TILE.WALL) {
    return "wall";
  }
  return "floor";
}

/**
 * @param {number} tile
 * @param {string | null} activeRune
 */
export function isTilePassable(tile, activeRune = null) {
  if (tile === TILE.FLOOR || tile === TILE.EXIT) {
    return true;
  }
  if (tile === TILE.RIVER && activeRune === RUNES.MELT) {
    return true;
  }
  if (tile === TILE.GUARD && activeRune === RUNES.TINY) {
    return true;
  }
  return false;
}

/**
 * @param {number} tile
 * @param {string | null} activeRune
 */
export function getTileEntity(tile, activeRune) {
  if (tile === TILE.RIVER && activeRune === RUNES.MELT) {
    return { className: "entity entity-bridge", label: "Candy bridge" };
  }

  if (tile === TILE.RIVER) {
    return { className: "entity entity-chocolate", hidden: true };
  }

  if (tile === TILE.GUARD) {
    if (activeRune === RUNES.TINY) {
      return { className: "entity entity-tiny-candy", label: "Tiny candy" };
    }
    return { className: "entity entity-lollipop", label: "Lollipop guard" };
  }

  if (tile === TILE.EXIT) {
    return { className: "entity entity-exit-stars", label: "Star candy exit" };
  }

  return null;
}

/**
 * @param {string | null} activeRune
 */
export function updateRuneUI(activeRune) {
  const panel = document.querySelector(".runes-panel");
  if (panel) {
    panel.dataset.activeRune = activeRune ?? "none";
  }

  document.querySelectorAll(".rune-slot[data-rune]").forEach((button) => {
    const isActive = button.dataset.rune === activeRune;
    button.classList.toggle("active", isActive);
    button.classList.toggle("rune-glow", isActive);
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
 */
export function setActiveRune(gameState, rune) {
  gameState.activeRune = gameState.activeRune === rune ? null : rune;
  return gameState.activeRune;
}

/**
 * @param {import("./main.js").GameState} gameState
 * @param {() => void} onRuneChange
 */
export function setupRuneControls(gameState, onRuneChange) {
  document.querySelectorAll(".rune-slot[data-rune]").forEach((button) => {
    button.addEventListener("click", () => {
      const rune = button.dataset.rune;
      if (!rune) {
        return;
      }

      setActiveRune(gameState, rune);
      onRuneChange();
    });
  });

  updateRuneUI(gameState.activeRune);
}
