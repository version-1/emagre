export const intersect = (rect1: number[][], rect2: number[][]) => {
  const edges1 = rect1.map((_, i) => [rect1[i], rect1[(i + 1) % 4]]);
  const edges2 = rect2.map((_, i) => [rect2[i], rect2[(i + 1) % 4]]);

  for (const edge1 of edges1) {
    for (const edge2 of edges2) {
      if (linesIntersect(edge1[0], edge1[1], edge2[0], edge2[1])) {
        return true;
      }
    }
  }

  return false;
};

const linesIntersect = (
  l1: number[],
  l2: number[],
  l3: number[],
  l4: number[],
) => {
  function ccw(a: number[], b: number[], c: number[]) {
    return (c[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (c[0] - a[0]);
  }
  return (
    ccw(l1, l3, l4) !== ccw(l2, l3, l4) && ccw(l1, l2, l3) !== ccw(l1, l2, l4)
  );
};
