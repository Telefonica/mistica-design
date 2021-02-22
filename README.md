<br>
<br>
<!-- 
<div align="left">
  <img height="64" alt="Mística Logo" src=".github/resources/misticaLogo.svg">
</div>
-->
  <img alt="Mística Logo" src=".github/resources/misticaDesign.svg">
<br>
<br>
<p align="center" style="border-bottom: 1px solid #eaecef; padding-bottom: .3em;">
  <a href="#componentsStatus">Components Status</a> •
  <a href="#contribute">Contribute</a> •
  <a href="#gettingStarted">Getting Started</a> •
  <a href="#releaseWorkflow">Release Workflow</a> •
  <a href="https://github.com/Telefonica/mistica-design-libraries/wiki">Wiki</a>
</p>

<br>
<br>

| Other Mística Repos | Description                                               |
| :------------------ | :-------------------------------------------------------- |
| [mistica-icons](https://github.com/Telefonica/mistica-icons)      | The source of truth for icons in our digital products |
| [mistica-manager](https://github.com/Telefonica/mistica-manager)     | App to allows designer install al the system in one-click  |
| [mistica-web](https://github.com/Telefonica/mistica-web)     | Repository with code libraries for Mística in web  |
| [mistica-ios](https://github.com/Telefonica/mistica-ios)     | Repository with code libraries for Mística in iOS  |
| [mistica-android](https://github.com/Telefonica/mistica-android)     | Repository with code libraries for Mística in Android  |

<br>

## Contribute to Mística  <a name="contribute"></a>
To contribute to Mística, please visit [this link](https://brandfactory.telefonica.com/document/1846#/contribute/components-request)

## Current components status (design + develop)  <a name="componentsStatus"></a>
To know what is the status and components are already implemented by DesignCore + AppsCore, please visit [this link](https://brandfactory.telefonica.com/document/1846#/components/overview)

## How to install sketch development libraries<a name="gettingStarted"></a>
If you want to try development libraries and pull changes to production library, follow [this documentation](https://github.com/Telefonica/mistica-design/wiki/Install-development-libraries-with-Kactus) (please, read [contribution guidelines](https://brandfactory.telefonica.com/document/1846#/contribute/components-request) first) 

## Release Workflow in Kactus <a name="releaseWorkflow"></a>
Master branch always be a production version of Mística Design System Libraries. Ensure before of select a branch of the version that you want to work, you always have to work in a branch created from `Production` branch.

Every Friday, if there are substantial changes, we release a new version of library. So, **don't let anything without commited and pushed!**

![Kactus Regenerate File](https://i.imgur.com/frFVeUR.png)  

#### Creating new branches
If you want to do a new branch, please, write the branch name with the correct name.

`name-short-description`  
`iceballos-fix-buttons-size`

#### POC Branches (Shouldn't be common)
If you want to test something to later will be integrated in libraries, you will be going to do that creating a *custom branch* from production.  

A custom branch always have to follow a structure in the name:  
`poc-name-short-description`  
`poc-iceballos-autolayout-list`  

If this custom branch work fine, we can merge it with *develop* branch through a pull request.  

**When you make a new branch, don't publish immediately, work on this branch and publish it when you consider that your work is substantial. This avoids having a dirty repository.**
