---
title: Shock waves through abrupt area changes
theme: compressible
order: 1
summary: >-
  How a normal shock recovers after an abrupt expansion or contraction in a duct, combining
  shock-tube experiments, large-eddy simulation and geometrical shock dynamics.
image: shock-area-changes.jpg          # Wix file: 1663933987202.jpg
image_alt: Schlieren image of a shock wave passing an abrupt area expansion
related:
  - The dynamics of shock wave propagation far downstream
figures:
  - image: shock-contraction-series.png   # Wix file: image.png (709014_8ba136e9...)
    caption: >-
      Time series of experimental images showing the shock wave evolution after it impinges
      on four different contraction geometries, incoming Mach number 1.4.
  - image: shock-contraction-les.png      # Wix file: image.png (709014_0505d75d...)
    caption: >-
      Experimental schlieren images (top) compared with LES (bottom) for a 15° wedge, a 45°
      wedge and a forward-facing step at representative times after the interaction.
---
## Evolution of a shock wave moving through an expansion

When a normal shock passes over a step change in the cross-section of a duct, it experiences strong reflections, vortex formation and pressure fluctuations. Over time the shock front recovers into a uniform normal shock, but the transient path to that state is complex and was poorly understood. We combine experiments, large-eddy simulations (LES) and geometrical shock dynamics (GSD) to uncover the mechanisms that drive this evolution.

Experiments are performed in a 40 × 40 mm shock tube fitted with a 2 m long test section, long enough to capture the far-downstream development. The duct includes back-facing steps of varying heights (expansion ratios 1.75–3.25). High-speed schlieren imaging at up to 140 kHz and 26 pressure transducers resolve both the near-step transient and the far-downstream recovery.

The experiments are complemented by three-dimensional LES of the compressible Navier–Stokes equations with high-order schemes, validated against the measurements, and by geometrical shock dynamics adapted with corrections for expanding geometries, which gives a simplified predictive model for the shock propagation velocity. Together these methods cover Mach numbers 1.1–1.8 and expansion ratios up to 5.

**What we found.** Immediately after the expansion the shock slows down and becomes curved, producing strong reflections and vortices near the corner. A triple point forms and reverberates between the duct walls, creating a train of reflected shocks that extends downstream and induces large pressure fluctuations long after the initial shock has passed. Further downstream the front gradually straightens and approaches a pseudo-steady velocity. Scaling laws show that this velocity depends on the expansion ratio and the far-downstream shock speed, so the final outcome of a very complex transient can be predicted with a simple relation. These findings are relevant to the design of jet engines, pressure-relief devices and protective ducts.

## Evolution of a shock wave moving through a contraction

The companion study asks how shock waves behave when they meet sudden contractions of different shapes. Although shock reflection is a classic subject, its dynamics in confined geometries are still not fully understood. In a custom-built shock tube, a pneumatic fast-opening valve generates controlled shocks that travel through a square duct and meet one of four contraction geometries: a forward-facing step (90°), a 15° wedge, a 45° wedge and a quadrant profile. High-speed schlieren imaging captures the density gradients that evolve within microseconds of the interaction.

Three-dimensional LES, using a solver developed at the Technion CFDLAB with a monotonicity-preserving scheme for the inviscid fluxes, a fourth-order explicit scheme for the diffusive fluxes and Runge–Kutta time integration, extends the study to configurations that are not accessible experimentally. The simulations agree closely with the schlieren images.

**What we found.** Geometry is the key factor. In the step case the transmitted shock remains normal and produces the strongest reflection. In the sloped geometries the incoming shock undergoes complex reflection processes that lead to multiple reflections behind the contraction: the 45° wedge generates regular reflections while the 15° wedge produces Mach reflections, changing the transient flow significantly. The quadrant profile smooths the interaction, weakening the reflections and shortening the transient. Sharp steps therefore produce strong reflections and prolonged unsteadiness, while smoother profiles stabilize the flow more quickly, a practical insight for ducts, nozzles and flow passages where shock control matters.
