# ZerOne Website Release Notes

## Version 1.2 — 4 October 2026

### Product imagery

- Replaced the hero, Object Study, and suspension-system card imagery with supplied ZerOne product photographs.
- Updated the four system cards to identify ZerOne SSR550, SSR700 Plus, SSR500 Plus, and Type S Spring.
- Kept product proportions intact and reduced the Type S Spring image to half its previous displayed size.
- Converted all served raster assets to WebP, including the vehicle-logo rail, preserving transparency where present. Existing source/reference assets in `assets-source/` were retained; vector logos remain SVG.

### Road section

- Replaced the coilover backdrop with the supplied BMW photograph.
- Applied a monochrome black-and-white treatment, dark readability overlays, and a 40% grain layer.

### Interaction and presentation

- Removed pointer-driven 3D rotation, hover movement, parallax, and shadow from the hero product image.
- Set all four product cards to white by default and black with light text on hover.
- Adjusted mobile hero spacing to keep the full-size product clear of the copy.
- Verified the production build and inspected the updated imagery and hover states in the browser.

## Version 1.1 — 19 September 2026

### Visual system

- Replaced the display typeface with Inter Tight across the website.
- Added a subtle technical grid treatment to light page backgrounds.
- Shifted the main accent from neon green to a vibrant performance red while retaining lime details within product imagery.
- Standardised primary calls to action as clean rounded rectangular buttons with arrow motion, borderless styling, and hover feedback.
- Standardised adjacent secondary actions as text links with animated underlines.

### Hero

- Replaced the original hero crop with a full vertical ZerOne coilover render from the supplied ChatGPT image set.
- Removed image masking and clipping so the complete product can extend naturally beyond its former frame.
- Removed the decorative corner marks from the hero image.
- Expanded the supporting introduction to describe the suspension system and Malaysian-road positioning.
- Kept the laboratory label on one line at desktop widths and allowed natural wrapping in tight spaces.
- Enlarged the hero product on mobile without distorting it, while reserving enough space to prevent overlap with the copy and actions.
- Reduced the mobile supporting-copy size for better hierarchy.

### Product and suspension sections

- Rebuilt the Object Study as a responsive bento layout with product, purpose, adjustment, construction, and result cards.
- Replaced the Object Study product visual with a full horizontal side-view coilover render.
- Removed the decorative rule after “One system. More control.”
- Reworked the suspension-system presentation into a horizontal scroll experience with responsive cards and a progress treatment.
- Replaced the system-card imagery with the supplied ChatGPT product renders while preserving aspect ratios.

### Road section

- Replaced the road photograph with a monochrome sports car showroom image.
- Refined the image contrast, positioning, and dark overlays for legible copy.

### Vehicle applications and dealers

- Added a continuously looping horizontal vehicle-logo rail for Perodua, Nissan, Honda, BMW, Audi, Toyota, and Proton.
- Added pause-on-hover/focus behavior and a lighter monochrome-to-dark hover treatment.
- Removed opaque logo backgrounds and increased logo scale.
- Reordered dealer markets with Kuala Lumpur, Selangor, and Johor first, followed by the remaining states.
- Updated the two-column dealer list to read 01–06 down the left column and 07–12 down the right.

### Footer and content cleanup

- Removed the footer programme badges and the Kuala Lumpur location line.
- Removed unnecessary dash and rule decorations from navigation, hero metadata, and section labels.
- Preserved the technical certification/barcode styling while simplifying the footer composition.

### Responsive quality

- Fixed clipped hero typography and enabled visible overflow where required.
- Prevented image distortion with proportional contain sizing throughout the replaced artwork.
- Added focused desktop and mobile layout refinements for the hero, bento cards, horizontal system deck, logo rail, and dealer list.
- Verified the production build and browser console with no errors.
