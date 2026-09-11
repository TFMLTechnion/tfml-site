---
title: A flow reconstruction that knows where the body is
date: 2026-09-02
image: paper-ledm.jpg
summary: LE-DM, our boundary-aware velocity reconstruction for moving solids, is accepted in Measurement Science and Technology.
---
Volumetric particle tracking gives velocities at scattered points, which must be turned into a smooth field on a grid before pressure or forces can be computed. Every method for doing so assumed the whole volume is fluid, and invented velocity inside any body moving through it.

LE-DM, developed by Jibu Tom Jose with Arieh Jacobson, Dhanush Vittal Shenoy and Steven Frankel, fixes this: at each instant it classifies grid points as fluid, boundary shell or solid interior, enforces the body's motion at its surface and keeps the fluid divergence-free. In an analytical test the error next to the body drops from 14% to 3% of the body speed. The paper has been accepted in *Measurement Science and Technology*; the code is open on [GitHub](https://github.com/TFMLTechnion/LEDM).
