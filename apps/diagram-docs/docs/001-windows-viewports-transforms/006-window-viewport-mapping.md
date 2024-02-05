---
sidebar_position: 6
custom_edit_url: null
---

# Page Window to Page Viewport Mapping

The 2D transformation to map points on a page to pixels in the Page Viewport. The mapping involves combining two primitive transformations to page coordinates (millimetres) to give Page Viewport coordinates (pixels). First translate to the origin of the page and then scale to map to Page Viewport coordinates. This is enough as the Page Viewport top left corner is always (0, 0).

$$
\begin{bmatrix}
S & 0 & 0\\
0 & S & 0\\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
1 & 0 & T_x\\
0 & 1 & T_y\\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
X\\
Y\\
1
\end{bmatrix}
=
\begin{bmatrix}
X'\\
Y'\\
1
\end{bmatrix}
$$

Multiplying the first two matrices gives:

$$
\begin{bmatrix}
S & 0 & ST_x\\
0 & S & ST_y\\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
X\\
Y\\
1
\end{bmatrix}
=
\begin{bmatrix}
X'\\
Y'\\
1
\end{bmatrix}
$$

Expanding this gives the following equations to transform x and y coordinates from millimetres to Page Viewport pixels:

$$
X' = S(X + T_x)\\
Y' = S(Y + T_y)
$$

where

$$
S = V_w / W_w\\
T_x = -W_x\\
T_y = -W_y
$$

and $V_w$ is the Page Viewport width, $W_w$ is the Page Window width, and ${(W_x, W_y)}$ are the coordinates of the top left corner of the Page Window.
