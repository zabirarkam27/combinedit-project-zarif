# Animation Analysis

## Source Timing

- GIF frames: `41`
- Frame time: `100ms`
- Full loop: `4100ms`

The reference loops through several tab positions. The circle settles for multiple frames at each tab, then travels with a visible spring-like ease. The extracted centers show short overshoot/settle phases around each destination.

## Applied Motion

The implementation uses Framer Motion springs rather than linear tweens:

```ts
indicatorSpring = {
  type: "spring",
  stiffness: 500,
  damping: 35,
  mass: 0.86,
}

notchSpring = {
  type: "spring",
  stiffness: 440,
  damping: 34,
  mass: 0.9,
}
```

The notch spring is slightly softer than the circle, giving the top edge the liquid trailing feel visible in the GIF.

## Icon Behaviour

Observed behaviour from the reference:

- Inactive icons remain light gray.
- The active icon appears inside the floating circle.
- Active icon has a subtle scale emphasis.

Implementation:

- Inactive icon color: `#C8C8C8`
- Active icon color: `var(--theme-primary)` to match the site theme
- Active icon scale target: `1.15`
- Active slot icon fades/scales down so the icon visually moves into the circle.

## Validation Notes

The GIF is an angled phone render, not a flat orthographic UI recording. Pixel-difference overlay against the live upright component is therefore not directly meaningful without first perspective-warping the reference. The geometry is documented with raw traced values and normalized target values.
