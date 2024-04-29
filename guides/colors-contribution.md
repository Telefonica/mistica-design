# Making Changes in Tokens

At Mística, we want any Telefónica designer to be able to contribute to the System. While it's true that being a multi-brand system used by different brands, there are some changes in the system that are somewhat delicate. However, there are other changes that do not have a global impact on other teams. We believe that there are parts of the system that can be directly controlled by the design teams of the different brands working on the product.

That's why we created this guide to facilitate designers from different brands in making changes related to their brand.

Currently, here is the list of changes that we believe an external design team can make efficiently:

- [Palette](#palette)
- [Constants](#constants)
- [Border Radius](#border-radius)

## Index

- [Install a text editor](#install-a-text-editor)
- [Install GitHub Desktop](#install-github-desktop)
- [Open the repository in VSCode](#open-the-repository-in-vs-code)
- [Create a new branch to make changes](#create-a-new-branch-to-make-changes)
- [Modifying the JSON file](#modifying-the-json-file)
- [Modifying the JSON schema](#modifying-the-json-schema)
- [Save changes and publish your branch](#save-changes-and-publish-your-branch)
- [Create a pull request to mistica-design repository](#create-a-pull-request-to-the-mistica-design-repository)

# Steps to Contribute to mistica-design

## Install a Text Editor

We recommend installing VSCode, but you are free to use any editor you prefer.

[Download VSCode](https://code.visualstudio.com/download)

💡 We have a configuration to avoid errors when changing tokens in VSCode. You can learn how to set it up [here](vsco-configuration.md).

## Install GitHub Desktop

GitHub Desktop is the app to work directly with the repository, and it's the easiest and most visual way to understand GitHub.

[Download GitHub Desktop](https://desktop.github.com/)

Follow this guide to learn how to clone a repository using GitHub Desktop:

[Cloning a repository from GitHub to GitHub Desktop](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop)

Once you have cloned the repository, you should see the `Tokens` folder in your computer's Finder, containing all the token files.

## Open the Repository in VS Code

Once cloned, if the repository is not automatically selected in this GitHub Desktop selector, expand the menu to choose it.

<img width="286" alt="Screenshot 2023-07-06 at 17 39 09" src="https://github.com/Telefonica/mistica-design/assets/44420072/198dc196-c236-4855-abe4-d2adc38b30c0">

From GitHub Desktop, after selecting the freshly cloned repository, open it in the editor you have configured by default:

<img width="638" alt="Screenshot 2023-07-06 at 17 33 44" src="https://github.com/Telefonica/mistica-design/assets/44420072/0083e758-dfb4-4281-8aa7-41aa8f9a54b6">

If Visual Studio Code is not your default editor, you can change it from "preferences" in the same place.

## Create a New Branch to Make Changes

Before making modifications to the JSON files, it's a good practice to create a new branch in the repository. This will allow you to work in isolation and maintain a clear history of your changes.

> [!NOTE]
>
> Before creating a new branch there are some considerations of the repo organization. The main branch is pre-production but normally the changes required, unless they have other dependencies or they need to be delayed to a specific release, can go into the production branch.

Follow these steps to create a new branch:

1. In VS Code, click on the version control icon in the bottom left corner. Usually, this icon has the git symbol:

<img width="211" alt="Screenshot 2023-07-06 at 17 42 58" src="https://github.com/Telefonica/mistica-design/assets/44420072/588405e8-8a73-4723-829e-8f399e66403d">

2. In the top of the version control window, you will find a text box indicating the current branch. Click on that text box and select "Create new branch" from the dropdown menu.

> [!IMPORTANT]
>
> If you need to create a branch from production choose the option "Create branch from" and select the production branch.

<img width="651" alt="Screenshot 2023-07-06 at 17 42 23" src="https://github.com/Telefonica/mistica-design/assets/44420072/8d45e7a5-e154-48d4-abf3-4bc4f7120e62">

If you need to change the production branch

3. Enter a descriptive name for your new branch and press Enter to create it.

4. Make sure the new branch is selected as the active branch before proceeding with the modifications to the JSON files.

## Modifying the JSON file

The JSON files for different brands are located in the tokens directory.

<img width="431" alt="Screenshot 2023-07-06 at 17 44 33" src="https://github.com/Telefonica/mistica-design/assets/44420072/1b482ecd-4fea-47c3-8b18-9a444c776106">

The JSON file for a brand has the following structure:

```
{
"light": { ... },
"dark": { ... },
"radius": { ... },
"text": { ... },
"global": {
   "palette": {...}
}
```

### Palette

The palette is located within the `global` / `palette` category and is composed of different tokens that are later used as values by the constants. Within the palette, the following modifications can be made:

> [!WARNING]
>
> **Changes that entail a breaking change**
>
> Although these changes are possible, modifying or removing a token from the palette may cause a breaking change in any product that directly consumes these tokens.
>
> - Name modification
> - Deletion of an existing token
>
> If you need to make a modification of either of the above types, carefully consider the impact it will have.

#### Modify value of an existing token

The `value` field of a token in the palette can be modified.

- It must always be enclosed in double quotes ("...").
- The valid format is [hexadecimal](https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color).

![palette_change](https://github.com/Telefonica/mistica-design/assets/44420072/89cdcab8-5e22-4113-aabd-7283b1c75ace)

#### Create a new token

A new token can be added to the palette to be used later in a constant.

It must follow the following format:

```
"name": {
  "value": "the desired value",
  "type": "color"
}
```

![tokens_new_palette](https://github.com/Telefonica/mistica-design/assets/44420072/3fadf1c9-f1f7-49e4-9c13-c9e9563b33c6)

### Constants

The constants are located within the `light` and `dark` categories of the JSON. In the value of a constant, a hexadecimal value is never used directly; instead, it references a pre-existing value from the palette as follows:

```
 "value": "{palette.white}"
```

It's also possible to apply opacity modifications to the values:

```
 "value": "rgba({palette.white}, 0.5)"
```

Where 0.5 is the alpha channel and can have a value between 0 and 1.

Constants allow the following modifications:

> [!WARNING]
>
> **Changes that cannot be made:**
>
> - Name modification
> - Deletion of an existing token
>
> To add a constant to a skin, it's recommended to open a discussion to evaluate the need.

#### Modify its value

The value of a constant can be modified. It's important to note that if you want the constant to change in both light and dark, you should change the value in the constant with the same name in both categories.

![tokens_modify_constant](https://github.com/Telefonica/mistica-design/assets/44420072/a0d8f6c8-a25d-41c9-b8dd-13c92773f57f)

> [!NOTE]
>
> When modifying a `value`, the `description` field must also be updated with the same value. For example, if the change is from "movistarBlue" to "movistarBlue55," the value should be: "{palette.movistarBlue55}" and the description: "movistarBlue55".

### Border radius

The border-radius tokens are located within the `radius` category. In this category, the following modifications can be made:

> [!WARNING]
>
> **Changes that cannot be made:**
>
> - Name modification
> - Deletion of an existing token
>
> To add a border-radius to a skin, it's recommended to open a discussion to evaluate the need.

#### Modify its value

The `value` field of a border-radius token can be modified:

![tokens_modify_radius](https://github.com/Telefonica/mistica-design/assets/44420072/cb1c7f44-3c09-4fdc-961f-5a3a5e170397)

## Modifying the JSON schema

> [!WARNING]
>
> **Maintainers only**
>
> To configure JSON schema in VSCode read [this documentation](https://github.com/Telefonica/mistica-design/blob/update-colors-contribution/guides/vsco-configuration.md)

In order to add, delete tokens or modify the name of existing tokens, the JSON schema should be updated to avoid check failure in the PRs containing the tokens.

The JSON schema can be found in `tokens` / `schema` / `skin-schema.json`.

### Add a new constant

In order to add a new constant you need to add a new entry in:

- `global` / `constants` / `required`: `"yourTokenName"`
- `global` / `constants` / `properties`: `"yourTokenName": { "$ref": "#/definitions/constantProperties" }`,
 
![add-constant](https://github.com/Telefonica/mistica-design/assets/44420072/35c596af-6b40-457d-a43f-e25cba010e64)

### Add a new variable

To add a new variable you need to update the constant properties:

- `definitions` / `constantProperties` / `patternProperties` / `value` / `anyOf` / `pattern`
- `definitions` / `constantProperties` / `patternProperties` / `value` / `properties` / `colors` / `items` / `properties` / `value` / `anyOf` / `pattern`

![add-variable](https://github.com/Telefonica/mistica-design/assets/44420072/a2516b84-5b2a-4484-8557-f5804b276559)


Inside both arrays you can find all the brands so you can add the variable names needed.

Each `pattern` has two regex expressions combined (rgba and non rgba values), so you will need to add two entries of the variable name. 

You'll need to update also the regex that checks that valid description is provided:

- `definitions` / `constantProperties` / `patternProperties` / `description` / `anyOf`

## Save Changes and Publish Your Branch

Once you have made the necessary modifications to the JSON files, you need to save your changes and publish the branch to the remote repository.

### Visual Studio Code

1. Go to the third element in the navigation bar (Source Control), where you will see the following:

<img width="420" alt="Screenshot 2023-07-06 at 17 47 26" src="https://github.com/Telefonica/mistica-design/assets/44420072/59c68814-b615-485f-ab7a-306bd5273738">

Here, you will find a list of the changes that have been made. Make sure that the listed changes are correct.

2. Enter a description of the changes to be made in the text field.
3. Click on the button to commit the changes. This commit will save the changes locally on your computer.
4. Once the changes have been saved, the button will change, showing the option to publish the branch. Click on the button.

<img width="358" alt="Screenshot 2023-07-06 at 17 51 19" src="https://github.com/Telefonica/mistica-design/assets/44420072/c2610218-5ae2-44b9-bad8-b99ac03a58b5">

### Github Desktop

1. Open GitHub Desktop and select the repository you are working on.

![Screenshot 2023-07-20 at 15 04 14](https://github.com/Telefonica/mistica-design/assets/44420072/a6003cb0-9760-4d0c-b452-85ae4ec0b317)

2. In the top menu, click on "Changes" to view the changes you have made to the files. Here, you will find a list of the changes that have been made. Make sure that the listed changes are correct.
3. Enter a description of the changes you made in the "Summary" text field at the bottom of the screen.
4. Click on the "Commit to {the name of your branch}" button. This will create a commit and save the changes locally on your computer.
5. Once the changes have been committed, click on the "Push origin" button. This will push the changes to the remote repository and publish the branch.

## Create a Pull Request to the mistica-design Repository

When the branch has been published, you can create a pull request to merge the changes from that branch into the master branch.

1. In GitHub Desktop, with the branch selected in the second dropdown of the top bar, you will see the option to create a Pull Request.

<img width="926" alt="Screenshot 2023-07-07 at 10 22 38" src="https://github.com/Telefonica/mistica-design/assets/44420072/f73ad68a-ed72-4c76-813a-f743640326af">

2. Clicking on the "Create Pull Request" button will open a new browser window displaying the necessary fields to complete.
3. Make sure the base branch is set to `production`, and the branch you are comparing is the one you just created.

<img width="937" alt="Screenshot 2023-07-07 at 10 26 02" src="https://github.com/Telefonica/mistica-design/assets/44420072/886a92fd-4688-4124-8d5b-9f5039b98897">

> [!NOTE]
>
> There may be cases where the base branch is not pre-production but production. This typically happens when there are changes that need to be made quickly to fix something in one of the implementations (native / web). Before creating a PR to production, consult with design-core.

4. When everything is correct, write a descriptive title for the Pull Request, and in the field on the right, assign a reviewer from the design-core team.
5. After creating the title and assigning a reviewer, you can proceed to create the pull request using the button at the bottom.
