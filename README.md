<br>
<br>
<div align="left">
  <img height="80" alt="Mística Logo" src="https://raw.githubusercontent.com/Telefonica/mistica-icons-web/master/images/mistica_logo.svg?token=ABTJE2PLEOMYVFYEGWNL7JC66MAYM">
<img align="right" height="24" src="https://img.shields.io/badge/2.3.0-003245">
</div>
<br>
<br>
<br>
<br>
<p align="left" style="border-bottom: 1px solid #eaecef; padding-bottom: .3em;">
  <a href="#componentsStatus">Components Status</a> •
  <a href="#gettingStarted">Getting Started</a> •
  <a href="#releaseWorkflow">Release Workflow</a> •
  <a href="#dangerZone">Danger Zone in Kactus</a> •
  <a href="https://github.com/Telefonica/mistica-design-libraries/wiki">Wiki</a> •
  <a href="#problemsWithKactus">Problems w/ Kactus</a>
</p>
<br>
<br>

| Other Mística Repos | Description                                               |
| :------------------ | :-------------------------------------------------------- |
| [mistica-icons](https://github.com/Telefonica/mistica-icons)      | The source of truth for icons in our digital products |
| [mistica-icons-web](https://github.com/Telefonica/mistica-icons-web) | Webapp to view, search and download icons  |
| [mistica-manager](https://github.com/Telefonica/mistica-manager)     | App to allows designer install al the system in one-click  |

<br>

## Current components status (design + develop)  <a name="componentsStatus"></a>
To know what is the status and components are already implemented by DesignCore + AppsCore, please visit [this link](https://zpl.io/bJxDLDW)

<br>

## Getting Started <a name="gettingStarted"></a>

1. Download and install latest version of [Kactus](http://kactus.io)
2. Clone repo in **Kactus**:  
   You can search mistica-design-libraries repo in the list
   ![Clone Repo](https://i.imgur.com/iz45eLf.png)  

   You also clone the repo with this url  
   `https://github.com/tef-novum/mistica-design-libraries.git`  
3. Generate Sketch files
    + Click in **Regenerate Sketch File** in each files in Kactus
      ![Kactus Regenerate File](https://i.imgur.com/8WHdEmf.png)  
4. Remove old dropbox libraries from Sketch > Libraries (just remove from Sketch! Don't delete the files)
5. Add Kactus libraries sketch files to Sketch.



## Release Workflow in Kactus <a name="releaseWorkflow"></a>
Master branch always be a production version of Mística Design System Libraries. Ensure before of select a branch of the version that you want to work, you always have to work in a branch created from `Production` branch.

Every Friday, if there are substantial changes, we release a new version of library. So, **don't let anything without commited and pushed!**

![Kactus Regenerate File](https://i.imgur.com/frFVeUR.png)  


#### POC Branches (Shouldn't be common)
If you want to test something to later will be integrated in libraries, you will be going to do that creating a *custom branch* from production.  

A custom branch always have to follow a structure in the name:  
`ACRONYM-short-description`  

*For example*  
Proof of concept  = POC
`POC-autolayout-list`  

If this custom branch work fine, we can merge it with *develop* branch.  

**When you make a new branch, don't publish immediately, work on this branch and publish it when you consider that your work is substantial. This avoids having a dirty repository.**

## Danger Zone in Kactus <a name="dangerZone"></a>
If you will go to use Kactus, when you download libraries in your computer, install the libraries from Kactus to Sketch (just drag and drop libraries sketch files to the Sketch > Preferences > Libraries). Be careful because if you change the branch in Kactus, libraries will change. Obviously, right?.

**Be careful updating library updates, make sure that you know what are you doing**

## Problems w/ Kactus <a name="problemsWithKactus"></a>
1. First time when you will sync Mistica repository you will not see sketch files, to generate this files click in "Regenerate sketch file" in each files in Kactus.

2. If Kactus fetching time is longer, better restart Kactus app.

3. If Kactus show a lot of changes when you swap between branches, don't do anything, let Kactus load. (If this loading take a lot of time.. you can close and open Kactus CMD + Q).

4. Usually, when you change between branches, a bunch of changes to commit appear. *NEVER COMMIT THIS CHANGES*. That appear because in the transition between branches Kactus detect changes between new and the old branch.

<br>
