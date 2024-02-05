---
sidebar_position: 1
custom_edit_url: null
---

# Shapes Overview

The only purpose of TfxDiagram is to allow users to create diagrams on Sketchbook pages. TfxDiagram provides a toolbox of shapes that the user can add to a Sketchbook page to create a diagram.

## Shapes

A shape is a graphical element that can be added to a Sketchbook page. Shapes can range from simple shapes, such as circles and rectangles, to more specialised shapes such as a state chart state representation (see diagram below).

<p align="center">
<img src="/img/shapes/state.drawio.svg" />
</p>

## Shape Selection

Once on a page the user is able to select one or more shapes. When a single shape is selected, called single selection, the user is able to amend any of the shape's properties. For example, in the case of a circle the user can change:

- the colour of the circle's perimeter
- the width of the circle's perimeter
- the colour of the circle's interior
- the size of the circle
- the position of the circle

When multiple shapes are selected, called multi-selection, the user is only able to change the position of the selected shapes as a group.

The user is also able to copy/cut selected shapes to the clipboard or delete selected shapes from the page.

## Lines

Lines are slightly special in TfxDiagram as they can connect to other shapes, although not to other lines. A line always has two endpoints that can be decorated with optional end styles, e.g. open arrow, open circle etc. A line comprises one or more line segments. A line can also be configured as straight or curved. In the case of a straight line the line segments are linear and in the case of a curved line the line segments are cubic bezier curves joined together with $C1$ continuity (derivative of the curve at the join remains constant).

<p align="center">
<img src="/img/shapes/lines.jpg" />
</p>

The diagram above shows a 3-segment straight line and a 3-segment curved line.
