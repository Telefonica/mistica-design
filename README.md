![Mistica Design](.github/resources/mistica-design-light.svg#gh-light-mode-only)
![Mistica Design](.github/resources/mistica-design-dark.svg#gh-dark-mode-only)
&nbsp;

&nbsp;

| Other Mística Repos                                              | Description                                               |
| :--------------------------------------------------------------- | :-------------------------------------------------------- |
| [mistica-web](https://github.com/Telefonica/mistica-web)         | Repository with code libraries for Mística in web         |
| [mistica-ios](https://github.com/Telefonica/mistica-ios)         | Repository with code libraries for Mística in iOS         |
| [mistica-android](https://github.com/Telefonica/mistica-android) | Repository with code libraries for Mística in Android     |
| [mistica-icons](https://github.com/Telefonica/mistica-icons)     | The source of truth for icons in our digital products     |
| [mistica-manager](https://github.com/Telefonica/mistica-manager) | App to allows designer install al the system in one-click |

---

- [Mística Discussions](https://github.com/Telefonica/mistica-design/discussions): The place to discuss all the topics to work in Mística
- [Mística Roadmap](https://github.com/Telefonica/mistica-design/projects/2): An overview of Mística planning
- [Mística Issues](https://github.com/Telefonica/mistica-design/issues): All the tasks with details

---

- [Contribute to Mística](https://brandfactory.telefonica.com/document/1846#/contribute/how-to-contribute)
- [Current components status](https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/components/overview)

---

<br/>

# Figma

## How to sync design tokens

If you want to sync design tokens with Figma files you can use [Figma Tokens plugin](https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens) and setup the plugin with the following information.

1. Open Figma Tokens Plugin, go to `Settings` and select `Github` in Token Storage
2. Add new credentials

- **Name:** The name of the brand
- **Personal Access Token:** you have to generate a token from Github and the paste in. [Read how to do it](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- **Repository:** `Telefonica/mistica-design`
- **Default Branch:** `production`
- **File Path:** `tokens/brandName.json` (see files [here](./tokens/))

![image](https://user-images.githubusercontent.com/6722153/166447592-e3d1b545-199d-4155-9024-2fb88351b444.png)
3. Finally, go to `Tokens`, select `Global` and `Apply to document` and clic in `Update`
