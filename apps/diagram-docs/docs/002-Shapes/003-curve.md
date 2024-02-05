---
sidebar_position: 3
custom_edit_url: null
---

# Curve

## Introduction

Curve is a class that provides functionality to draw a curved line on a Sketchbook page.

Curved lines in TfxDiagram are drawn using the HTML Canvas _bezierCurveTo_ method. This method draws a cubic Bezier curve defined by the position of four control points, commonly referred to as $P_0$, $P_1$, $P_2$ and $P_3$. The diagram below shows two Bezier curves with different values for $P_0$, ... $P_3$.

<p align="center">
<img src="/img/shapes/bezier-curves.jpg" />
</p>

More complex curves can be achieved by joining Bezier curves together, each Bezier curve providing a segment of the overall curve.

<p align="center">
<img src="/img/shapes/joined-bezier-curves.jpg" />
</p>

In this diagram there are two Bezier curves joined together together at $P_3$. In this case the first segment is defined by $P_0$, $P_1$, $P_2$ and $P_3$ while the second segment is defined by $P_3$, $P_4$, $P_5$ and $P_6$.

To ensure a smooth join the derivative of the curve at the join must remain constant ($C^1$ continuity). This is easy to achieve by simply co-locating the end of the leading curve with the start of the subsequent curve, in this case point $P_3$, and then keeping the adjacent points co-linear, in the diagram $P_2$, $P_3$ and $P_4$.
