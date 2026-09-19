# Design QA — Version 1.1 Hero Refinements

## Evidence

- Source visual truth path: latest inline Browser annotation screenshots and Comments 1–2 attached to the current task.
- Source viewport: 1089 × 890 CSS pixels at density 1.
- Implementation: `http://127.0.0.1:5173/` in Codex in-app Browser tab 1.
- Implementation screenshot path: inline in-app Browser captures for the desktop hero and 390 × 844 mobile hero; this browser surface does not expose a filesystem path.
- Implementation viewports: 1089 × 890 desktop and 390 × 844 mobile at density 1.
- Source and implementation pixel dimensions: browser captures match their CSS viewports at density 1; no density normalization was required.
- State: default loaded hero.
- Full-view comparison evidence: the desktop capture shows the hero with both corner marks removed; the mobile capture preserves the prominent image scale while separating it from the copy.
- Focused-region comparison evidence: the lower edge of the mobile support paragraph and the top of the coilover are both clearly visible with a clean gap between them.
- Primary interactions tested: responsive viewport transition and initial hero load.
- Browser console: checked with no errors.

## Findings

- Fonts and typography: Inter Tight display hierarchy and the 11px mobile support copy remain unchanged. The mobile paragraph is fully readable and no longer covered by the product image.
- Spacing and layout rhythm: both decorative plate-corner marks are removed. The mobile product retains its previous 128% scale while top and bottom margins reserve clear space around surrounding text and actions.
- Colors and visual tokens: no color or token changes were made in this pass.
- Image quality and asset fidelity: the supplied vertical coilover remains proportionally scaled with automatic width and no crop, stretch, mask, or clipping.
- Copy and content: no visible copy changed.
- Responsive check: the desktop composition preserves the current image scale; at 390 × 844 the full-size product begins below the support paragraph rather than overlapping it.
- No actionable P0, P1, or P2 findings remain.

## Comparison History

- Initial desktop annotation showed two stray L-shaped plate-corner marks.
- Fix: removed both decorative `plate__mark` elements from the hero figure.
- Post-fix evidence: the 1089 × 890 capture contains no corner marks while the hero layout remains otherwise unchanged.
- Initial mobile annotation requested the current large image scale without text overlap.
- Fix: retained the mobile plate height and 128% image scale, replacing negative vertical margins with 64px reserved margins.
- Post-fix evidence: the 390 × 844 capture shows a clear gap between the final paragraph line and the coilover, with the same prominent product scale.

## Implementation Checklist

- [x] Remove both hero corner marks.
- [x] Preserve the mobile product scale.
- [x] Prevent mobile text and product overlap.
- [x] Confirm desktop and mobile rendering in the in-app Browser.
- [x] Confirm a clean browser console.

## Final Result

passed
