---
title: "Local Data Masking Tool"
client: "Data Masking Tool"
role: "Product Designer & Developer"
years: "2025 — 2026"
tools: ["Python", "Claude", "HMAC-SHA256", "Tkinter", "pandas", "openpyxl"]
summary: "Designed and built a local desktop app that lets analysts safely share sensitive data with AI tools — masking identifiers before they leave the machine, adding just enough context for AI-assisted analysis, and restoring original values for authorized recipients."
outcome: "A production-ready, privacy-first workflow that removes the guesswork from AI-assisted analysis of client data. Now used for real media analysis jobs with zero sensitive values exposed to external APIs."
heroImage: "/images/work/masking-app-mask-ui-pt-1.png"
heroAlt: "Local Data Masking Tool v2.0 — Mask data tab showing source data preview, column selection, and masking configuration"
images:
  - src: "/images/work/masking-app-mask-ui-pt-1.png"
    alt: "Mask data tab — load CSV or Excel, preview data, and assign columns as dimensions or metrics"
    caption: "Steps 1–3 — load a CSV or Excel file, review the full-width data preview, and batch-assign columns as dimensions or metrics."
  - src: "/images/work/masking-app-mask-ui-pt-2.png"
    alt: "Configure masking, aggregation, AI context layer, and save settings"
    caption: "Steps 4–5 — choose which dimensions to mask, set metric aggregation, add an optional AI context blurb, and save to separate masked output and vault folders."
  - src: "/images/work/masking-app-masked-data.png"
    alt: "Excel output with mask_ token values replacing original campaign and placement names"
    caption: "Masked output — sensitive dimension values replaced with keyed HMAC-SHA256 tokens. Metrics remain numeric and fully usable for analysis."
  - src: "/images/work/masking-app-unmask-ui.png"
    alt: "Restore data tab — select masked file, encrypted vault, output path, and vault password"
    caption: "Restore tab — strict vault-and-password matching; a wrong credential stops the operation without writing any decrypted output."
  - src: "/images/work/masking-app-unmasked-data.png"
    alt: "Restored_Data Excel sheet with original campaign, placement, and creative values"
    caption: "Restored output — original values back in place, alongside a Mapper tab for joining masked tokens to source dimensions."
  - src: "/images/work/masking-app-data-key.png"
    alt: "Mapper tab showing Dimension, Masked Value, and Original Value columns"
    caption: "Mapper tab — every token mapped back to its original value. Useful for reconciling AI analysis output against source reporting."
order: 4
---

## The problem

Analysts working with client media data face a familiar bind: the most useful AI-assisted analysis requires sharing actual data with a model, but client contracts and basic data hygiene say you shouldn't paste campaign names, placement IDs, or other potentially sensitive identifiers into a third-party API.

The usual workarounds — anonymizing by hand before sharing, using only aggregate totals, or just not using AI — each sacrifice something. Manual anonymization is slow and error-prone. Sharing only aggregates strips the structural detail that makes AI analysis useful. Skipping AI entirely leaves real capacity on the table.

I wanted a tool that solved this properly: local processing, cryptographically sound masking, and a clean path back to original values for authorized use.

## What I built

The Local Data Masking Tool is a cross-platform desktop app (Windows and macOS) that fits directly into an analyst's file workflow.

**Masking.** Load a CSV or Excel file. Assign columns as dimensions, metrics, or ignored. Choose which dimensions to mask and how each metric should be aggregated. The app replaces sensitive dimension values with keyed HMAC-SHA256 tokens and saves two separate outputs: the masked data file (safe to share with an AI model) and an encrypted `.maskvault` file (kept private). Masked output and vault must go to different folders by design.

**AI Context Layer.** Before saving, you can add a plain-language blurb describing what the masked dimensions represent — "campaign refers to different product lines within a cookie brand's portfolio" — without including any real values. That context travels with the masked file and gives the AI model enough to reason about the data structure without exposing identifiers.

**Restore.** When an authorized recipient needs original values, the Restore tab matches the masked file against its vault, decrypts in memory, and writes a new workbook with a `Restored_Data` sheet and a `Mapper` tab mapping every token back to its original value.

**[View the source on GitHub →](https://github.com/jbelzman/data_masking)**

## How AI shaped the build

Claude was a genuine co-developer across the full lifecycle, not just a code generator.

**Security architecture.** Early drafts offered selectable hash algorithms (MD5, SHA-256, SHA-512). Iterating with Claude surfaced the dictionary-attack vulnerability of unsalted hashes against predictable values — campaign names, placement labels. That analysis led directly to the keyed HMAC-SHA256 approach with a fresh random key per job.

**The vault model.** The original design stored masked data and lookup keys in a single combined workbook — simple, but it puts "safe to share" and "never share" material in the same file. Claude helped reason through the threat model and spec out the separate encrypted vault design that ships in v2.0.

**UI and workflow.** Built the scrollable blue-and-white interface iteratively with Claude — working through the batch column selection model, the dimension/metric role system, show/hide password controls, and the status bar that confirms row and column counts on load.

**The Context Layer prompt.** Claude drafted the auto-generated starter text that seeds the context blurb from actual column names in the loaded file. The goal: give users something concrete to edit rather than a blank textarea, while keeping the prompt tight enough that they won't accidentally drop in real values.

**Documentation.** The user guide and release notes were drafted with Claude from a working spec, then corrected against actual app behavior.

## Security design

A few deliberate choices distinguish this from a quick script:

The vault password is never saved or logged — used in memory for the duration of a restore session, then gone. A wrong password or mismatched vault produces a clean error, not a partially-restored file. Masked output and vault folders must be different; the app enforces this at save time to make it structurally hard to accidentally bundle them together.

The Context Layer explicitly warns against including sensitive values in the blurb. The point of the context is that it travels with the masked file — so it can't contain what the masking is hiding.

## Honest limitations

Masking dimensions reduces exposure but doesn't automatically anonymize a dataset. Rare dimension combinations, free-text fields, dates, and small group sizes can still carry identifying signal. The user guide and README both call this out directly.

Aggregated metrics stay aggregated after restoration — row-level detail isn't preserved if you chose to summarize. That's a feature for some workflows and a limitation for others.
