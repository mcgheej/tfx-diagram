---
sidebar_position: 1
custom_edit_url: null
---

# Overview

Tfx Diagram is a file-based desktop application that stores diagram data in Sketchbook files, (extension .tfx). Each Sketchbook contains one or more pages and functionality is provided to add pages, remove pages and adjust the order of pages in the Sketchbook. Pages are always rectangular but unlike a physical book where all pages are the same size and orientation, pages in a Diagram Sketchbook can have different sizes and orientations. When a user creates a new Sketchbook they are prompted for a Sketchbook title, a page name, a page format (A0 - A5) and a page orientation (portrait or landscape). They are also asked to specify the page name, size and orientation whenever a new page is added.

:::info

At some point a custom page size will be introduced. This will allow the user to specify a custom page size by specifying the width and height in millimetres.

:::

Users are able to amend a page's name, size or orientation at any time.

## Page Viewport and Page Window

When a Sketchbook is open the application will always display content from one page, referred to as the current page. The content is displayed in a rectangular area of the screen called the Page Viewport. The Page Viewport coordinate system has pixel units with the origin at the top left corner, x-axis increasing left to right and y-axis increasing top to bottom. Therefore the coordinates of the top left corner of the Page Viewport are always $(0, 0)$ and the coordinates of the bottom right corner are ${(V_w-1, V_h-1)}$, where ${V_w}$ is the Page Viewport width in pixels and ${V_h}$ is the Page Viewport height in pixels.

![Window Viewport Mapping](/img/intro/viewport-window.drawio.svg)

The area of the page displayed in the Page Viewport is called the Page Window. This is a rectangle defined by the position of the top left corner, ${(W_x, W_y)}$ and its width, ${W_w}$, and height, ${W_h}$ - all expressed in millimetres. In the diagram above the Page Window is positioned such that the lower left quadrant of the circle appears in the Page Viewport.

## Aspect Ratio

The aspect ratio for a rectangle is simply the ratio of its width to height. To avoid shapes on a page being distorted when they are mapped to the Page Viewport it is essential to keep the aspect ratio of the Page Window equal to the aspect ratio of the Page Viewport:

$$
\frac{V_w}{V_h} = \frac{W_w}{W_h}
$$

## Page Alignment

If the Page Window is larger in any dimension than the actual page then the application needs to know how to position the displayed page in the Page Viewport. The _pageAlignmentInViewport_ application setting controls this behaviour by setting alignment values for the horizontal and vertical directions.

```ts
// libs/diagram/data-access/types/src/lib/diagram.types.ts
export type HorizontalAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'center' | 'bottom';

export interface Alignment {
  horizontal: HorizontalAlignment;
  vertical: VerticalAlignment;
}

// libs/diagram/data-access/types/src/lib/ngrx-state.types.ts
export interface SettingsState {
  ...
  pageAlignmentInViewport: Alignment;
  ...
}

// libs/diagram/data-access/settings/src/lib/settings.reducer.ts
export const initialState: SettingsState = {
  ...
  pageAlignmentInViewport: { horizontal: 'center', vertical: 'center' },
  ...
};
```

The Typescript snippet above shows the types defined for alignment and the initial default value. Alignment is a global application setting and the value therefore affects all pages displayed. The user is able to change the setting at any time and the application persists the value in local store between application executions.

![Window Viewport Mapping](/img/intro/alignment-options.drawio.svg)

The diagram above shows all nine possible alignment combinations where the page is scaled down to fit entirely in the Page Viewport.

## Zoom Factor

The zoom factor is used to detrmine the scaling of the page on screen. A zoom factor of 100% will display the page at actual size. A zoom factor of 200% will show the page at twice its actual size. Valid zoom factors are 33%, 50%, 75%, 100%, 125%, 150%, 200%, 400%, 800%, 1200% and 1600%.

In addition to the preset zoom factors the application also allows the user to specify "zoom to width" and "zoom to page". Zoom to width calculates the zoom factor so that the entire width of the page fits the width of the Page Viewport. Zoom to page calculates the zoom factor so that the entire page fits in the Page Viewport. Details on how the zoom factor for these special zoom functions is calculated can be found in ????.

## Screen Pixel Density

In order to display a page on screen at its actual size, i.e. 1mm of distance on a page is 1mm of distance on the screen, it is necessary to know the display's screen pixel density. Screen pixel density is conventionally expressed in pixels per inch (PPI). A display screen will always have the same pixel density horizontally and vertically to give square pixels. Unfortunately it is not possible to find a display's PPI programatically so the user has to set the value as an application setting.
