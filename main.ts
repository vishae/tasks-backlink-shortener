import { MarkdownPostProcessor, MarkdownRenderChild, Plugin } from "obsidian";
import { shortenBacklinksIn } from "./backlink";

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
