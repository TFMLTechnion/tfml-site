---
title: Seeing the flow right next to a moving body
card: "Measuring the flow right up to a moving surface, where ordinary reconstructions go wrong."
theme: multiphase
order: 3
template: features/dynamic-masking.html   # this page has its own layout (an illustrated story)
summary: >-
  Particle tracking measures the flow at thousands of scattered points, but turning those
  points into a smooth picture goes wrong exactly where a solid body sits. We built a
  reconstruction that is told where the body is in every frame, so the flow it reports
  next to a moving surface is one you can trust.
image: rising-spheres/ledm-thumb.png
image_alt: >-
  Reconstructed flow wrapping around a moving sphere, with the thin shell of points at its
  surface picked out in orange and carried along with the body
related:
  - Dynamic masking for boundary-aware velocity reconstruction in volumetric particle tracking with moving solids
---
Particle tracking gives the velocity of the fluid at scattered points. Turning those points into a smooth field on a regular grid is a solved problem, as long as the whole volume is liquid. Put a solid body in the middle and the assumption breaks exactly where it matters most.

This project is the reconstruction side of our work on freely rising spheres. Every frame, each grid point is sorted by how far it sits from the body surface, and the reconstruction is told to respect that. The result is a measured flow that behaves properly right up to a moving surface, which is where pressure and forces come from.
