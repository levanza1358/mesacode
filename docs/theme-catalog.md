# Mesa Code Theme Catalog

## Behavior

- Theme preference persists under the existing `zcode-theme` key.
- System, Zai Light, Zai Dark, Black, Midnight, Ocean, Forest, Purple, Rose, and Amber are selectable.
- Each theme controls surface mode and accent tokens through semantic CSS variables.
- Theme changes apply immediately and remain compatible with existing `Theme` consumers.
- Accent selection is bundled with each theme; semantic tokens prevent component-level color forks.

## Catalog

| Theme | Surface | Accent |
| --- | --- | --- |
| System | OS light/dark | Follows OS |
| Zai Light | Light | Blue |
| Zai Dark | Dark | Blue |
| Black | True black | Neutral |
| Midnight | Dark | Indigo |
| Ocean | Dark | Cyan |
| Forest | Dark | Green |
| Purple | Dark | Violet |
| Rose | Dark | Rose |
| Amber | Dark | Amber |

## Acceptance

- Selecting any catalog entry updates the document theme class.
- Reload restores selected entry.
- System follows OS light/dark preference.
- Existing light/dark code preview behavior continues using resolved light/dark mode.

## Compatibility

The persisted key remains `zcode-theme` for upgrade compatibility. Internal package names, environment variables, protocol schemes, and storage paths are not renamed by theme work.
