---
sidebar_position: 5
custom_edit_url: null
---

# Connectors and Connections

## Introduction

A key element of drawing diagrams involves connecting lines to shapes, for example connecting a curved arrow to the side of a rectangle.

In Diagram lines and curves are classified as _connectors_. Each connector has two ends, simply referred to as the _connector start_ and the _connector finish_. The position of these two ends is provided by the first and last control points that define the shape of the line or curve.

A connection is made when a connector end is connected to the boundary of a shape. A shape boundary defines the edge of the shape. For example, the boundary of a rectangle is defined by the locus of its four sides and the boundary of a circle is defined by its circumference. When a connector end is connected to a shape boundary it is said to be _attached_. When a connector end is not connected to a shape boundary it is described as _unattached_.

A connector end can be attached anywhere on a shape boundary. Whenever a shape is moved or reshaped (by manipulating its control handles) the position of any attached connector ends are recalculated to keep the endpoints attached to the shape boundary.

## Attaching Connector Ends

To attach a connector end to a shape the Snap to Shape feature must be enabled. When this feature is active the user simply drags the connector end near a shape boundary and Diagram will snap the end to the shape boundary and establish a connection. The user can continue to move the connector end around the boundary and provided the end stays near the boundary the connection is maintained and the location of the attachment is updated until the user drops the end at the desired position.

To unattach a connector end the user simply drags the end away from the shape's boundary and the connection is broken.

## Implementation

### Drag Start

The sequence begins when a user starts to drag a control handle. The _dragStart$_ property of _ControlFormatEffects_ class is an effect that triggers when the XState Mouse Machine running in the Page Viewport feature dispatches a _dragStart_ action.

The effect handler is implemented by the _dragStart_ function (actually the function returned by the _dragStart_ funtion). This function determines the type of drag and calls the appropriate function to process the drag start. Drag types are:

- single selection drag (calls _doSingleSelectionDragStart_)
- multi selection drag (calls _doMultiSelectionDragStart_)
- handle drag (calls _doHandleDragStart_)
- selection box drag (calls _doSelectionBoxDragStart_)

We are only interested if the user is dragging a Connector end control handle.

Before support for connections the _doHandleDragStart_ function simply issued a _ControlFrameEffectsActions.dragStartHandle_ action which resulted in a modification to the current control frame that hides the shape's control handles during the drag operation.

To support connections now need to check whether or not the control handle is associated with a Connector end. This is straightforward as the _doHandleDragStart_ function gets the handle object for the dragged handle. The handle object contains a property, _handleType_, which will be 'notConnectorEnd', 'connectorStart', or 'connectorEnd'. If the handle type is 'notConnectorEnd' then simply dispatch the _dragStartHandle_ action as before. Otherwise the handle is associated with a connector end and we need to set up for connecting the connector end to a shape is necessary.

Setting up the connector end involves setting the connectionHook parameter of the _dragStartHandle_ action. There are two scenarios here; the first where the end of the connector is not currently attached to a shape, and the second where the connector end is attached to a shape, i.e. a connection object exists in the Shape State's connections Map property with an id equal to:

_\<connectorId>_ + '\_' + _\<handleType>_

where _connectorId_ is the id of the connector and _handleType_ is 'connectorStart' or 'connectorFinish'.

If the connector end is not attached then a new _CircleConnection_ object is assigned to the _connectionHook_ with the id constructed as above and a shapeId set to the empty string ('').

If the connector end is attached then a copy of the connection object is assigned to the connectionHook.

### Drag End
