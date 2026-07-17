import { App, MarkdownPostProcessor, MarkdownRenderChild, Plugin, PluginSettingTab, Setting } from "obsidian";
import { DisplayMode, shortenBacklinksIn } from "./backlink";

interface TbsSettings {
	mode: DisplayMode;
	customText: string;
}

const DEFAULT_SETTINGS: TbsSettings = {
	// Filename only preserves the pre-TBS-007 behaviour, so existing users see
	// no change on upgrade unless they opt in.
	mode: "filename",
	customText: "",
};

class BacklinkWatcher extends MarkdownRenderChild {
	private observer: MutationObserver;

	constructor(containerEl: HTMLElement, private plugin: TasksBacklinkShortenerPlugin) {
		super(containerEl);
		this.observer = new MutationObserver(() => this.render());
	}

	render() {
		shortenBacklinksIn(this.containerEl, this.plugin.settings.mode, this.plugin.settings.customText);
	}

	onload() {
		this.plugin.registerWatcher(this);
		this.render();
		this.observer.observe(this.containerEl, { childList: true, subtree: true });
	}

	onunload() {
		this.observer.disconnect();
		this.plugin.unregisterWatcher(this);
	}
}

export default class TasksBacklinkShortenerPlugin extends Plugin {
	settings: TbsSettings;
	private watchers = new Set<BacklinkWatcher>();

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new TbsSettingTab(this.app, this));
		this.registerMarkdownPostProcessor(this.watchForBacklinks);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// Re-apply to already-rendered task lists so a settings change takes
		// effect immediately, without needing to reopen the note.
		this.watchers.forEach((w) => w.render());
	}

	registerWatcher(watcher: BacklinkWatcher) {
		this.watchers.add(watcher);
	}

	unregisterWatcher(watcher: BacklinkWatcher) {
		this.watchers.delete(watcher);
	}

	private watchForBacklinks: MarkdownPostProcessor = (el, ctx) => {
		const container = el.closest<HTMLElement>(".plugin-tasks-query-result") ?? el;
		if (container.dataset.tbsWatching) return;
		container.dataset.tbsWatching = "true";
		ctx.addChild(new BacklinkWatcher(container, this));
	};
}

class TbsSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: TasksBacklinkShortenerPlugin) {
		super(app, plugin);
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Backlink display mode")
			.setDesc("Choose how each task's backlink is shown.")
			.addDropdown((dropdown) => {
				dropdown
					.addOption("filename-header", "Filename + header")
					.addOption("header", "Header only")
					.addOption("filename", "Filename only")
					.addOption("custom", "Custom text")
					.setValue(this.plugin.settings.mode)
					.onChange(async (value) => {
						this.plugin.settings.mode = value as DisplayMode;
						await this.plugin.saveSettings();
						// Re-render so the custom-text field appears/disappears.
						this.display();
					});
			});

		if (this.plugin.settings.mode === "custom") {
			new Setting(containerEl)
				.setName("Custom backlink text")
				.setDesc("Shown in place of every task backlink. Replaces all backlink text, including Tasks' short-mode link — add your own emoji here if you want one.")
				.addText((text) => {
					text
						.setPlaceholder("e.g. 🔗 source")
						.setValue(this.plugin.settings.customText)
						.onChange(async (value) => {
							this.plugin.settings.customText = value;
							await this.plugin.saveSettings();
						});
				});
		}
	}
}
