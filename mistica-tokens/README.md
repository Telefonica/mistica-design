## Tokens structure

![Screenshot 2022-11-11 at 19 25 20](https://user-images.githubusercontent.com/44420072/201404605-61de32c9-893e-4542-89c2-2b93c09f45c8.png)


## Color

Inside `tokens/local/color/` each brand folder contains the dark and light tokens in separate files.

## Typography

Typography tokens are divided in `tokens/local/typography` and `tokens/global/typography.json`

### Font-size & line-height

From 1 to 10 each  `font-size ` and  `line-height` tokens match the current text-presets definition

### Font weight

There are 4 preset tokens for `font-weight`, additionally the following component tokens are available:

* media-card-title-font-weight


## Core tokens

Core tokens are filtered and they doesn't appear after the build in the output folders. They usage at the moment remains internal.

The match the previous palette colors definition and the 


## Build

Run `npm run build` from mistica-tokens folder to update the build folder
