---
sidebar_position: 6
custom_edit_url: null
---

# Recipe: Add a Shape

This recipe guide takes you through the process of adding a new shape to the Diagram application. The example here discusses the addition of a new shape, _Arc_.

## The Arc Shape

The Arc shape is used in Diagram to draw a segment of a circle. An arc is defined using the following properties:

- x - the x-coord of the centre of the circle
- y - the y-coord of the centre of the circle
- r - the radius of the circle
- sAngle - the starting angle measured in degrees clockwise from the 3 o'clock position
- eAngle - the ending angle measured in degrees clockwise from the 3 o'clock position
- showSpokes - if true draw the two line segments connecting the circle centre to the ends of the arc segment.

## Implementation

### Update ShapeTypes

The _ShapeTypes_ type needs to be updated to include the new Arc shape.

```ts
export type ShapeTypes =
  | 'line'
  | 'curve'
  | 'circle'
  | 'rectangle'
  | 'triangle'
  | 'arc'
  | 'handle'
  | 'lineOutline'
  | 'rectangleOutline'
  | 'group';
```

The new shape is represented by the string 'arc' added to the string literal union type.

### Add Basic Arc Class

Next create a new class in the Shape class hierarchy. This is implemented in the `arc.ts` file, found in the `data-access-shape-classes` project.

### Add Menu Command

Need to add a command menu item to the Insert menu to add a new arc to the page.
