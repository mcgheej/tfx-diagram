---
sidebar_position: 3
custom_edit_url: null
---

# Positioning the Window

In order to position the Page Window the following data points are required:

- zoom factor (page property)
- page size (page property)
- Page Viewport size (taken from HTML element used to contain the Page Viewport)
- Page Alignment (application setting)
- Last recorded Page Window centre (page property)

## Page Window Width & Height

The first step is to calculate the width and height of the Page Window. These are dependent on the current zoom factor, $Z_f$, the Page Viewport size, $V_w$ and $V_h$, and the screen pixel density, $D$. To calculate the Page Window width and height:

$$
W_w = \frac{V_w \times 25.4}{D \times Z_f}\\
$$

$$
W_h = \frac{V_h \times W_w}{V_w}
$$

The factor 25.4 converts inches to millimetres.

## Preliminary Positioning

Having calculated the size of the Page Window speculatively position it using the last recorded centre position. This will either be a Point (x and y coordinates) or null if the page has just been created. If the centre position is null then locate the top left corner of the Page Window at position (0, 0) and record the centre position of the placed Page Window. This will be (${W_w / 2, W_h / 2}$).

If the last recorded centre position is not null the calculate the top left corner of the Page Window as follows:

$$
W_x = W_{cx} - W_w / 2\\
W_y = W_{cy} - W_h / 2
$$

## Assess Position

If the page window sits entirely within the page then Page Window positioning is complete.

If the page window is larger than the page in any direction then page alignment will be required. This is discussed in detail in [Page Alignment](/windows-viewports-transforms/page-alignment).

If the page window is smaller that the page in any direction but not within the page in that dimension the Page Window edge locking will be required. This is discussed in detail in [Page Window Edge Locking](/windows-viewports-transforms/window-edge-locking).
