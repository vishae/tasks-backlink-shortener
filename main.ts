import { MarkdownPostProcessor, MarkdownRenderChild, Plugin } from "obsidian";

function toBasename(text: string): string | null {
	if (!text) return null;
	const [pathPart] = text.split(" > ");
	const segments = pathPart.split("/");
	const last = segments[segments.length - 1];
	return last.endsWith(".md") ? last.slice(0, -3) : last;
}

function shortenBacklinksIn(containerEl: HTMLElement) {
	containerEl.querySelectorAll<HTMLAnchorElement>(".tasks-backlink a.internal-link").forEach((link) => {
		const shortened = toBasename(link.textContent ?? "");
		if (shortened !== null && shortened !== link.textContent) {
			link.textContent = shortened;
		}
	});
}

class BacklinkWatcher extends MarkdownRenderChild {
	private observer: MutationObserver;

	constructor(containerEl: HTMLElement) {
		super(containerEl);
		this.observer = new MutationObserver(() => shortenBacklinksIn(containerEl));
	}

	onload() {
		shortenBacklinksIn(this.containerEl);
		this.observer.observe(this.containerEl, { childList: true, subtree: true });
	}

	onunload() {
		this.observer.disconnect();
	}
}

export default class TasksBacklinkShortenerPlugin extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor(this.watchForBacklinks);
	}

	private watchForBacklinks: MarkdownPostProcessor = (el, ctx) => {
		const container = el.closest<HTMLElement>(".plugin-tasks-query-result") ?? el;
		if (container.dataset.tbsWatching) return;
		container.dataset.tbsWatching = "true";
		ctx.addChild(new BacklinkWatcher(container));
	};
}
