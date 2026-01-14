# KeyNav

Vim-inspired keyboard navigation for Firefox with custom search shortcuts.

## Build

To build the extension package:

```bash
mkdir -p build && zip -r build/keynav.xpi manifest.json background.js icons/
```

The packaged extension will be in `build/keynav.xpi`.

## Features

### Tab Navigation (Vim-style HJKL)

- **Ctrl+H** - Previous tab
- **Ctrl+L** - Next tab
- **Ctrl+J** - Close current tab
- **Ctrl+K** - Open new tab

### Scrolling (Vim-style D/U and E/Y)

- **Ctrl+D** - Scroll down 30%
- **Ctrl+U** - Scroll up 30%
- **Ctrl+E** - Scroll down 20px
- **Ctrl+Y** - Scroll up 20px

### Browser History (Vim-style O/I)

- **Ctrl+O** - Go back in history
- **Ctrl+I** - Go forward in history

### Custom Search Shortcuts

Type these keywords in the address bar followed by your search query:

- **aa** [query] - Search Amazon UK
- **m** [query] - Search Google Maps
- **y** [query] - Search YouTube

**Examples:**

- `aa wireless mouse` - Searches Amazon UK for "wireless mouse"
- `m london bridge` - Searches Google Maps for "london bridge"
- `y cat videos` - Searches YouTube for "cat videos"

## Privacy

This extension does not collect, store, or transmit any user data. All functionality runs locally in your browser.

## License

MIT License
