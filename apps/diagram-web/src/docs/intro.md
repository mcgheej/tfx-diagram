---
sidebar_position: 1
# slug: /
custom_edit_url: null
---

# Tfx Diagram

Tfx Diagram is a file-based desktop application that stores diagram data in Sketchbook files, (extension .tfx). Each Sketchbook contains one or more pages and functionality is provided to add pages, remove pages and adjust the order of pages in the Sketchbook. Pages are always rectangular but unlike a physical book where all pages are the same size and orientation, pages in a Diagram Sketchbook can have different sizes and orientations. When a user creates a new Sketchbook they are prompted for a Sketchbook title, a page name, a page format (A0 - A5) and a page orientation (portrait or landscape). They are also asked to specify the page name, size and orientation whenever a new page is added.

:::info

At some point a custom page size will be introduced. This will allow the user to specify a custom page width and height in millimetres.

:::

Users are able to amend a page's name, size or orientation at any time.

## Page Units

Page dimensions are specified in millimetres. Positions on the page are referenced using a 2D coordinate system that has its origin at the top left corner, x-axis increasing left to right and y-axis increasing top to bottom. Units are millimetres.

## Page Viewport and Page Window

When a Sketchbook is open the application will always display content from one page in the Sketchbook, referred to as the current page. The content is displayed in a rectangular area of the screen called the Page Viewport. The Page Viewport coordinate system has pixel units with the origin at the top left corner, x-axis increasing left to right and y-axis increasing top to bottom. Therefore the coordinates of the top left corner of the Page Viewport are always $(0, 0)$ and the coordinates of the bottom right corner are ${(V_w-1, V_h-1)}$, where ${V_w}$ is the Page Viewport width in pixels and ${V_h}$ is the Page Viewport height in pixels.

![Window Viewport Mapping](/img/intro/viewport-window.drawio.svg)

The area of the page displayed in the Page Viewport is called the Page Window. This is a rectangle defined by the position of the top left corner, ${(W_x, W_y)}$ and its width, ${W_w}$, and height, ${W_h}$ - all expressed in millimetres. In the diagram above the Page Window is positioned such that the lower left quadrant of the circle appears in the Page Viewport.
