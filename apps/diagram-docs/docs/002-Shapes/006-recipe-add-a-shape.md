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
This also needs an `InsertArc` action to be added to the Insert Menu actions.

### Hook up action

The `InsertArc` action needs to be handled in the `insertShape` effect (insert-shape.effect.ts). Add to list of other insert shape actions. This effect handler will dispatch a `ShapesEffectsActions.anotherShapeOnPage` action if there already shapes on the page or a `ShapesEffectsActions.firstShapeOnPage` action if
the arc is the first shape on the page.

### Handle new shape on opening saved files

In the shapes reducer the `SketchbookEffectsActions.openSuccess` action adds shapes from a saved file to the draw chain. This logic needs to create a shape of the correct type and there is a switch on `Shape.shapeType` to create the correct objects in the draw chain. Add code to handle Arc shapes here.
