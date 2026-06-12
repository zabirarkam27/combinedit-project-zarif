# Extracted GIF Metrics

Reference file:

`C:\Users\Zabir\Downloads\12 Beautiful Mobile App UI Animations Inspiration.gif`

## Frame Data

- Canvas: `600 x 450`
- Extracted frames: `41`
- Frame duration: `100ms`
- Loop duration: `4100ms`

## Measured White Indicator Component

The GIF is rendered on an angled phone mockup, so the visible indicator is perspective-skewed. White-pixel connected-component tracing produced these stable indicator measurements:

| Frame range | Center x | Center y | BBox width | BBox height |
| --- | ---: | ---: | ---: | ---: |
| 0, 35-40 | 298-303px | 166-170px | 58-59px | 71px |
| 5-10 | 217-221px | 123-126px | 59px | 71-72px |
| 15-20 | 150-152px | 84-89px | 60px | 71-72px |
| 25-30 | 440-447px | 244-247px | 56-57px | 71px |

## Normalized Upright Geometry

Because the implementation is an upright mobile bottom navigation, the traced perspective values were normalized to the provided target geometry:

- Navigation max width: `420px`
- Navigation height: `80px`
- Floating circle: `64px`
- Circle top offset: `-28px`
- Notch width after smooth reference refinement: `120px`
- Notch depth after smooth reference refinement: `28px`
- Icon count: `4`
- Tab centers: `navWidth / 4 * index + tabWidth / 2`

## Icon Spacing

The reference uses four evenly distributed icon slots. The implementation calculates slot centers from live measured width rather than hardcoded x positions.
