import { Plugin } from "obsidian";

export default class TasksBacklinkShortenerPlugin extends Plugin {
	async onload() {
		console.log("Tasks Backlink Shortener: loaded");
	}

	onunload() {
		console.log("Tasks Backlink Shortener: unloaded");
	}
}
