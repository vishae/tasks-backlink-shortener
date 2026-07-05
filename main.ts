import { MarkdownPostProcessor, Plugin } from "obsidian";

function toBasename(text: string): string | null {
	if (!text) return null;
	const [pathPart] = text.split(" > ");
	const segments = pathPart.split("/");
	const last = segments[segments.length - 1];
	return last.endsWith(".md") ? last.slice(0, -3) : last;
}

export default class TasksBacklinkShortenerPlugin extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor(this.shortenBacklinks);
	}

	private shortenBacklinks: MarkdownPostProcessor = (el) => {
		el.querySelectorAll<HTMLAnchorElement>(".tasks-backlink a.internal-link").forEach((link) => {
			const shortened = toBasename(link.textContent ?? "");
			if (shortened !== null && shortened !== link.textContent) {
				link.textContent = shortened;
			}
		});
	};
}
