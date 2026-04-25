import type { Direction } from '../types';
import { DIR_VECTORS } from '../types';

export function isWalkable(grid: string[], x: number, y: number): boolean {
  if (y < 0 || y >= grid.length) return false;
  const row = grid[y];
  if (x < 0 || x >= row.length) return false;
  return row[x] !== '#';
}

export function bfsNextDirection(
  grid: string[],
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  forbidden: Direction = 'none',
): Direction {
  if (fromX === toX && fromY === toY) return 'none';

  const cols = grid[0].length;
  const key = (x: number, y: number) => y * cols + x;

  const prev = new Map<number, number>();
  const start = key(fromX, fromY);
  const goal = key(toX, toY);
  const queue: [number, number][] = [[fromX, fromY]];
  prev.set(start, -1);

  while (queue.length) {
    const [cx, cy] = queue.shift()!;
    if (cx === toX && cy === toY) break;
    for (const dir of ['up', 'down', 'left', 'right'] as Direction[]) {
      if (cx === fromX && cy === fromY && dir === forbidden) continue;
      const [dx, dy] = DIR_VECTORS[dir];
      const nx = cx + dx;
      const ny = cy + dy;
      if (!isWalkable(grid, nx, ny)) continue;
      const k = key(nx, ny);
      if (prev.has(k)) continue;
      prev.set(k, key(cx, cy));
      queue.push([nx, ny]);
    }
  }

  if (!prev.has(goal)) return 'none';

  let cur = goal;
  let parent = prev.get(cur)!;
  while (parent !== -1 && parent !== start) {
    cur = parent;
    parent = prev.get(cur)!;
  }
  if (parent === -1) return 'none';

  const stepX = cur % cols;
  const stepY = Math.floor(cur / cols);
  const dx = stepX - fromX;
  const dy = stepY - fromY;
  if (dx === 1) return 'right';
  if (dx === -1) return 'left';
  if (dy === 1) return 'down';
  if (dy === -1) return 'up';
  return 'none';
}
