export type DisplayMode = "filename-header" | "header" | "filename" | "custom";

interface BacklinkParts {
	filename: string;
	header: string | null;
}

// Split a Tasks backlink's text into its filename and (optional) heading.
// Text shapes Tasks can produce: "path/name.md > Heading", "path/name.md",
// "name > Heading", or "name" (see TECH-004's verified findings).
export function parseBacklink(text: string): BacklinkParts {
	const parts = text.split(" > ");
	const pathPart = parts[0];
	const header = parts.length > 1 ? parts.slice(1).join(" > ") : null;

	const segments = pathPart.split("/");
	const last = segments[segments.length - 1];
	const filename = last.endsWith(".md") ? last.slice(0, -3) : last;

	return { filename, header };
}

// Produce the display text for a backlink under the chosen mode. Returns null
// when there's nothing to show (empty text), so callers leave the link alone.
export function formatBacklink(text: string, mode: DisplayMode, customText: string): string | null {
	if (!text) return null;
	if (mode === "custom") return customText;

	const { filename, header } = parseBacklink(text);
	switch (mode) {
		case "header":
			// Header only, falling back to the filename when there's no heading (TBS-007).
			return header ?? filename;
		case "filename-header":
			return header ? `${filename} > ${header}` : filename;
		case "filename":
		default:
			return filename;
	}
}

export function shortenBacklinksIn(containerEl: HTMLElement, mode: DisplayMode, customText: string) {
	containerEl.querySelectorAll<HTMLAnchorElement>(".tasks-backlink a.internal-link").forEach((link) => {
		// Stash the original backlink text the first time we touch this link, so
		// switching modes later reformats from the source rather than from an
		// already-shortened value (which would have lost the path/heading).
		if (link.dataset.tbsOriginal === undefined) {
			link.dataset.tbsOriginal = link.textContent ?? "";
		}
		const original = link.dataset.tbsOriginal;

		const formatted = formatBacklink(original, mode, customText);
		if (formatted !== null && formatted !== link.textContent) {
			link.textContent = formatted;
		}
	});
}
