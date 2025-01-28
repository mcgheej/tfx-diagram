---
sidebar_position: 4
custom_edit_url: null
---

# Page Window Edge Locking

The need for page window edge locking arises when the Page Window size in a particular dimension (width or height) is smaller than the page size in that dimension but the Page Window does not lie completely within the page. The diagram below shows the different scenarios that can arise with regard to positioning of the Page Window and the page in these circumstances.

![Edge Lock Scenarios](/img/windows-viewports-transforms/edge-locking.drawio.svg)

The solution is simple as show in the following pseudo code.

```ts
if (pageWindow.x < 0) {
  // set pageWindow.x to 0
} else if (pageWindow.x > page.width) {
  // set pageWindow.x to page.width - pageWindow.width
}
if (pageWindow.y < 0) {
  // set pageWindow.y to 0
} else if (pageWindow.y > page.height) {
  // set pageWindow.y to pahe.height - pageWindow.height
}
```

This locks the overlapping Page Window side to the relevant edge of the page.
