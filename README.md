# Tasks Backlink Shortener

An [Obsidian](https://obsidian.md) plugin that shortens the backlink the [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) plugin displays under each task. By default it shows just the note name instead of the full path, heading, and `.md` extension — and a setting lets you choose from four display modes (see [Display modes](#display-modes) below).

This was built with [Claude Code](https://claude.com/claude-code) to scratch a personal itch, not to become a feature-rich plugin — it does exactly one small thing, and I released it in case someone else was looking for the same solution.

## Example

Before:

```text
☐ Feed the sourdough starter before it files a complaint
    (/Kitchen/Bread Diaries/2026/2026-03-14 (Sat).md > Evening Chores)
```

After:

```text
☐ Feed the sourdough starter before it files a complaint
    (2026-03-14 (Sat))
```

## Display modes

Under **Settings → Community plugins → Tasks Backlink Shortener**, pick how backlinks are shown. Only one mode is active at a time. Each example below shortens the same task from the [Example](#example) above.

**Filename + header** — path and `.md` removed, name and heading kept:

```text
☐ Feed the sourdough starter before it files a complaint
    (2026-03-14 (Sat) > Evening Chores)
```

**Header only** — everything except the heading removed (falls back to the filename when a task has no heading):

```text
☐ Feed the sourdough starter before it files a complaint
    (Evening Chores)
```

**Filename only** *(default)* — path, heading, and `.md` removed. The original behaviour, and what you get on a fresh install or after upgrading:

```text
☐ Feed the sourdough starter before it files a complaint
    (2026-03-14 (Sat))
```

**Custom text** — every backlink is replaced with a fixed string you type in (here, `📓 recipe notes`). This replaces *all* backlink text, including Tasks' short-mode link — if you want an emoji, add it to your custom text:

```text
☐ Feed the sourdough starter before it files a complaint
    (📓 recipe notes)
```

## Requirements

- The [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) plugin, installed and enabled. This plugin only shortens backlinks that Tasks itself renders (e.g. in a `tasks` query block) — it has no effect on its own.

## Installation

**From Obsidian (recommended):** Go to **Settings → Community plugins → Browse**, search for "Tasks Backlink Shortener", install, and enable it.

**Manually:**

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](../../releases).
2. Create a folder named `tasks-backlink-shortener` inside your vault's `.obsidian/plugins/` folder.
3. Copy those three files into it.
4. In Obsidian, go to **Settings → Community plugins**, refresh the list, and enable "Tasks Backlink Shortener".

## Known limitations

- If a note's name genuinely contains the text `" > "` (space, greater-than, space), it'll get shortened incorrectly — there's no reliable way to tell that apart from Tasks' own path/heading separator using only the rendered text. This is expected to be rare enough not to worry about.
- Relies on Tasks' current backlink markup (`.tasks-backlink a.internal-link`), so a future Tasks update could change this. Verified working against Tasks 8.2.2.

## License

MIT — see [LICENSE](LICENSE).
