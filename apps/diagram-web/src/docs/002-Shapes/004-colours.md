---
sidebar_position: 4
custom_edit_url: null
---

# Colours

All colours eventually boil down to an RGB value that is used to colour a pixel. Organising colours and selecting colours, however, is a bit more complicated.

## Colour Categories

There are three types of colours that can be used in Diagram; colours from a colour theme, standard colours, and custom colours.

### Colour Themes

A common approach to organising colours in an application is to use a _colour theme_. A colour theme comprises a set of colours assigned to specific roles. In Diagram colour themes always have 10 roles:

| Role         | Colour          | Default Theme    | Description |
|--------------|-----------------|------------------|-------------|
| Background 1 | Always White    | rgb(255,255,255) | White       |
| Text 1       | Always Black    | rgb(0,0,0)       | Black       |
| Background 2 | Theme Dependent | rgb(231,230,230) | Light Gray  |
| Text 2       | Theme Dependent | rgb(68,84,106)   | Blue-Gray   |
| Accent 1     | Theme Dependent | rgb(68,114,196)  | Blue        |
| Accent 2     | Theme Dependent | rgb(237,125,49)  | Orange      |
| Accent 3     | Theme Dependent | rgb(165,165,165) | Gray        |
| Accent 4     | Theme Dependent | rgb(255,192,0)   | Gold        |
| Accent 5     | Theme Dependent | rgb(91,155,213)  | Blue        |
| Accent 6     | Theme Dependent | rgb(112,173,71)  | Green       |

The colours assigned to the theme roles are called the base colours. Each base colour has slots available in the theme for 5 tints/shades. This gives a total of 60 colours in the colour theme.

If a colour from the colour theme is assigned to a shape then the colour's role and tint that are assigned to the shape. When the shape is rendered it looks up the colour associated with the role and tint/shade and uses that to draw the shape. If the colour theme is changed and the shape redrawn then the colour associated with the new colour theme's role and tint/shade is used to draw the shape.

### Standard Colours

In addition to the colour theme Diagram also provides 10 standard colours. These are:

| Colour          | Description |
|-----------------|-------------|
| rgb(192,0,0)    | Dark Red    |
| rgb(255,0,0)    | Red         |
| rgb(255,192,0)  | Orange      |
| rgb(255,255,0)  | Yellow      |
| rgb(146,208,80) | Light Green |
| rgb(0,176,80)   | Green       |
| rgb(0,176,240)  | Light Blue  |
| rgb(0,112,192)  | Blue        |
| rgb(0,32,96)    | Dark Blue   |
| rgb(112,48,160) | Purple      |

If a standard colour is assigned to a shape then that is the colour used to draw the shape even if the user changes the colour theme.

### Custom Colours

If the colour requirements can't be fulfilled by the colour theme or the standard colours then the user can create a custom colour and add it to the pallete. Custom colours are saved with the Diagram sketchbook and functionality is provided to remove any unwanted custom colours if they are not in use.

If a custom colour is assigned to a shape then that is the colour used to draw the shape even if the user changes the colour theme.
