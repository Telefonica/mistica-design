<div align="center">
  <img alt="Mística Logo" src="https://i.imgur.com/3H975vE.png">
</div>
<h1 align="center">Mística Design Libraries</h1> <br>

<p align="center" style="border-bottom: 1px solid #eaecef; padding-bottom: .3em;">
  <a href="#gettingStarted">Getting Started</a> •
  <a href="#releaseWorkflow">Release Workflow</a> •
  <a href="#dangerZone">Danger Zone in Kactus</a> •
  <a href="#wiki">Wiki</a> •
  <a href="#problemsWithKactus">Problems w/ Kactus</a>
</p>

<br>

<div align="center">
  <img alt="VERSION" src="https://img.shields.io/badge/VERSION-1.16.0-blueviolet">
</div>

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
Master branch always be a production version of Mística Design System Libraries. Ensure before of select a branch of the version that you want to work, you always have to work in Development branch, if you don't do that all of your changes will be lost. To know what version of development have to choose, see the first lines of this document.

Every Friday, if there are substantial changes, we release a new version of library. So, **don't let anything without commited and pushed!**


#### POC Branches (Shouldn't be common)
If you want to test something to later will be integrated in libraries, you will be going to do that creating a *custom branch*.  

A custom branch always have to follow a structure in the name:  
`ACRONYM-VERSION-short-description`  

*For example*  
Proof of concept  = POC
`POC-1.15.0-autolayout-list`  

If this custom branch work fine, we can merge it with development branch.  

**When you make a new branch, don't publish immediately, work on this branch and publish it when you consider that your work is substantial. This avoids having a dirty repository.**

## Danger Zone in Kactus <a name="dangerZone"></a>
If you will go to use Kactus, when you download libraries in your computer, install the libraries from Kactus to Sketch (just drag and drop libraries sketch files to the Sketch > Preferences > Libraries). Be careful because if you change the branch in Kactus, libraries will change. Obviously, right?.

**Be careful updating library updates, make sure that you know what are you doing**

## Problems w/ Kactus <a name="problemsWithKactus"></a>
1. First time when you will sync Mistica repository you will not see sketch files, to generate this files click in "Regenerate sketch file" in each files in Kactus.

2. If Kactus fetching time is longer, better restart Kactus app.
