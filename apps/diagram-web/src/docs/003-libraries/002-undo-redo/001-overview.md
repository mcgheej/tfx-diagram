---
sidebar_position: 3
custom_edit_url: null
---

# Undo/Redo Overview

Undo/Redo gives the user the ability to undo any changes made to the currently open sketchbook. Having undone a change, or changes, the user can redo the discarded changes until a new change is made which automatically deletes all discarded changes. This is a feature available in most software tools and is commonly accessed through Ctrl+Z and Ctrl+Y.

Undo/Redo in TfxDiagram is implemented using an approach that resembles the Memento software design pattern. This approach involves saving a snapshot of those areas of application state that are persisted to file when the sketchbook is saved as these are the only areas of relevant. For example application settings such as page alignment do not affect the state of the application, they simply affect how the sketchbook page is rendered to the screen. Therefore changing an application setting cannot be undone using the Undo/Redo feature.

## Areas of State Subject to Undo/Redo

These are the areas of state that are persisted to file whenever the user saves a sketchbook. Specifically these are the *SketchbookState* and *PagesState*.

:::info Future States

Note that other state areas will be subject to Undo/Redo in the future as the application is developed further - e.g. ShapesState

:::

## Actions Impacting Undo/Redo
