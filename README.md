# Illustrator Text Lines Combiner

A Adobe Illustrator script that processes PDFs or documents containing many single-letter text frames and combines them into words grouped by horizontal lines — preserving exact horizontal spacing and vertical alignment.

## Features

- Groups single-letter text frames by horizontal line with vertical tolerance.
- Combines letters into words with tight kerning.
- Inserts spaces only when horizontal gaps between letters exceed 20 pixels.
- Precisely aligns combined words vertically by adjusting for Illustrator baseline offsets.
- Preserves original font and size.
- Deletes original single-letter frames after combining.
- Works with editable text frames on unlocked, visible layers.

## Installation

1. Save the `combine-text-lines.jsx` script file.
2. In Illustrator, go to `File > Scripts > Other Script...`
3. Select the saved `.jsx` file to run it.

## Usage

- Open your Illustrator document containing many single-letter text frames.
- Make sure layers are unlocked and text frames editable.
- Run the script.
- Each horizontal line of letters is merged into words.
- Spaces are preserved only where large gaps exist.
- The result is one clean text frame per word exactly positioned as in the original.

## How It Works

1. The script collects all editable text frames.
2. Groups them by Y-position with a tolerance to find horizontal lines.
3. Sorts letters left to right within each line.
4. Detects gaps ≥ 20px as spaces between words.
5. Merges letters into words, creates new text frames positioned to exactly match original vertical positions, adjusting for Illustrator baseline offsets.
6. Removes the original single-letter frames.

## Requirements

- Adobe Illustrator with scripting enabled.
- Documents with editable, unlocked text frames containing single letters.

## Limitations

- Does not process locked or hidden layers.
- Works best with clean, well-separated text frames.
- Font metrics are approximated via bounding box measurements.
- Designed for Latin alphabets and left-to-right scripts.

## License

MIT License © Chris Kirby

## Contact

For questions or improvements, please open an issue or submit a pull request.
