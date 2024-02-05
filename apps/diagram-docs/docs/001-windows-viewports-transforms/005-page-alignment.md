---
sidebar_position: 5
custom_edit_url: null
---

# Page Alignment

Page alignment is necessary when the Page Window size in a particular dimension (width or height) is greater than the page size in that direction.

## Horizontal Alignment

If the width of the Page Window is greater than the page width then the page can be drawn aligned to the left edge of the Page Viewport, centred horizontally in the Page Viewport, or aligned to the right edge of the Page Viewport. This behaviour is controlled by the value of the _pageAlignmentInViewport.horizontal_ application setting.

| Alignment | Calculation              |
| --------- | ------------------------ |
| left      | $W_x = 0$                |
| centre    | $W_x = -(W_w - P_w) / 2$ |
| right     | $W_x = -(W_w - P_w)$     |

The table above shows how to calculate the x coordinate of the top left corner of the Page Window.

## Verical Alignment

If the height of the Page Window is greater than the page height then the page can be drawn aligned to the top edge of the Page Viewport, centred vertically in the Page Viewport, or aligned to the bottom edge of the Page Viewport. This behaviour is controlled by the value of the _pageAlignmentInViewport.vertical_ application setting.

| Alignment | Calculation              |
| --------- | ------------------------ |
| top       | $W_y = 0$                |
| centre    | $W_y = -(W_h - P_h) / 2$ |
| bottom    | $W_y = -(W_h - P_h)$     |

The table above shows how to calculate the y coordinate of the top left corner of the Page Window.
