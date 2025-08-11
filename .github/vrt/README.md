# VRT (Visual Regression Testing) Script

This script automatically exports PNG images from Figma frames for visual regression testing purposes.

## Prerequisites

1. **Python 3.x** installed on your system
2. **Required Python packages**:
   ```bash
   pip install requests python-dotenv
   ```
3. **Figma Personal Access Token** - [Get it here](https://www.figma.com/developers/api#access-tokens)

## Setup

### 1. Environment Variables

Create a `.env` file in the root of your project with your Figma token:

```env
FIGMA_TOKEN=your_figma_token_here
```

### 2. Configuration

Update the `FILE_ID` variable in `vrt.py` with your Figma file ID:

```python
FILE_ID = "your_figma_file_id_here"
```

You can find the file ID in your Figma URL:
```
https://www.figma.com/file/FILE_ID/file-name
```

## How to Structure Frames in Figma

For the script to work correctly, your Figma frames must follow these naming conventions:

### Frame Naming Rules

1. **All exportable frames must start with "VRT"**
   - ✅ `VRT Button Primary`
   - ✅ `VRT Card Component`
   - ✅ `VRT Navigation Bar`
   - ❌ `Button Primary` (won't be exported)

2. **Use descriptive names after "VRT"**
   - The script will use the frame name as the PNG filename
   - Special characters will be replaced with underscores

### Supported Frame Types

The script will export these Figma node types that start with "VRT":
- **FRAME** - Regular frames
- **COMPONENT** - Master components
- **INSTANCE** - Component instances

### Example Frame Structure

```
📁 Page Name
├── 🖼️ VRT Button Primary Default
├── 🖼️ VRT Button Primary Hover
├── 🖼️ VRT Button Secondary Default
├── 🖼️ VRT Card Basic Layout
├── 🖼️ VRT Navigation Desktop
└── 🖼️ VRT Navigation Mobile
```

## Usage

1. **Run the script**:
   ```bash
   python .github/vrt/vrt.py
   ```

2. **Generated files**:
   - Images will be saved to `.github/vrt/__screenshot_tests__/`
   - Each frame will be exported as `{frame_name}.png`

## Output

The script will:
1. Connect to Figma API using your token
2. Scan the entire document for frames starting with "VRT"
3. Export each frame as a PNG image
4. Save images with cleaned filenames in the output directory

### Example Output

```
✅ Image saved: .github/vrt/__screenshot_tests__/VRT_Button_Primary_Default.png
✅ Image saved: .github/vrt/__screenshot_tests__/VRT_Button_Primary_Hover.png
✅ Image saved: .github/vrt/__screenshot_tests__/VRT_Card_Basic_Layout.png
```

## Best Practices

### Frame Organization
- Group related components together
- Use consistent naming conventions
- Keep frame sizes reasonable (max 2000px width/height)

### Naming Conventions
- Use descriptive names: `VRT Button Primary Hover State`
- Include component state: `VRT Input Field Error`
- Include breakpoint if relevant: `VRT Navigation Desktop`

### Performance Tips
- Limit the number of frames to export (recommended: <50 frames per run)
- Use specific frame names to avoid exporting unnecessary frames
- Consider organizing VRT frames in a dedicated Figma page

## Troubleshooting

### Common Issues

1. **"No frames starting with 'VRT' found"**
   - Check that your frames are named correctly
   - Ensure frames are not inside other components that might hide them

2. **"Error fetching Figma data"**
   - Verify your `FIGMA_TOKEN` is correct
   - Check that the `FILE_ID` matches your Figma file
   - Ensure the file is accessible with your token

3. **"Error fetching image URLs"**
   - Figma API rate limits might be exceeded
   - Try reducing the number of frames being exported

4. **Invalid characters in filenames**
   - The script automatically cleans filenames
   - Special characters are replaced with underscores

### Getting Help

- Check Figma API documentation: [Figma API Docs](https://www.figma.com/developers/api)
- Verify your token permissions and file access
- Ensure your Figma file is not private or restricted
