---
sidebar_position: 2
custom_edit_url: null
---

# Calculating Zoom Factor

In addition to the preset zoom factors (see [Overview](/windows-viewports-transforms/overview)) the application also allows the user to zoom the page so that its width maps exactly to the width of the Page Viewport (zoom to width), or zoom the page so that it fits entirely inside the Page Viewport (zoom to page). In bith cases once the desired zoom factor has been calculated the Page Window can be positioned.

## Zoom to Width

When the user selects zoom to width the application calculates the required zoom factor to fit the width of the page to the width of the Page Viewport. To calculate the zoom factor:

$$
Z_f = \frac{V_w\times25.4}{D \times P_w}
$$

where $V_w$ is the Page Viewport width in pixels, $D$ is the screen pixel density in pixels per inch, and $P_w$ is the page width in millimetres. The constants 25.4 is the conversion factor for inches to millimetres.

## Zoom to Page

The zoom to page calculation is a little more involved as the interplay between the Page Window and Page Viewport layouts (portrait / landscape) has to be factored in. The first step is to assess whether the zoom factor should be calculated using a fit-to-width approach (same as soom to width function) or a fit-to-height aproach.

The algorithm used is as follows:

1. Calculate for Zoom Factor Fit-to-Width

   Use the formula above to calculate the zoom factor for fit to width

2. Calculate Page Window Height Fit-to-Width

   Assuming fit-to-width calculate the height of the Page Window in millimetres using the formula below:

$$
W_h = \frac{V_h \times P_w}{V_w}
$$

3. Check for Fit-to-Height

   If the page height is greater than the Page Window height for fit-to-width then the zoom factor for fit-to-height needs to be calculated. Otherwise use the fit-to-width zoom factor. If fit-to-height is required use the following formula:

$$
Z_f = \frac{V_h \times 25.4}{D \times P_h}
$$
