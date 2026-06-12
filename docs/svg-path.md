# SVG Notch Path

The moving top edge is rendered by a real SVG path, not pseudo-elements.

## Path Strategy

The reference notch shape is preserved as one reusable curve and translated horizontally by changing `centerX`. The path is generated in `src/components/geometry.ts`.

Core control values:

- `curveWidth = 120`
- `curveDepth = 28`
- `half = curveWidth / 2`
- `x1 = centerX - half`
- `x2 = centerX + half`
- `shoulder = curveWidth * 0.18`
- `inner = curveWidth * 0.31`

## Shape

```svg
M 0 0
L x1 0
C ...
C ...
C ...
C ...
L width 0
L width height
L 0 height
Z
```

The notch is a concave downward valley under the floating circle. The left and right shoulders connect back into the straight top edge with cubic Bezier curves to avoid sharp corners.

## Animation

`SvgNotch.tsx` receives a Framer Motion `MotionValue<number>` for `centerX` and maps it to the SVG `d` attribute with `useTransform`. This makes the actual path morph as the active tab changes.
