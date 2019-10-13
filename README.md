<div align="center">
  <img alt="Mística Logo" src="https://i.imgur.com/3H975vE.png">
</div>
<h1 align="center">Mística Design Libraries</h1> <br>

<p align="center">
  <a href="#gettingStarted">Getting Started</a> •
  <a href="#releaseWorkflow">Release Workflow</a> •
  <a href="#dangerZone">Danger Zone in Kactus</a> •
  <a href="#wiki">Wiki</a> •
  <a href="#problemsWithKactus">Problems w/ Kactus</a>
</p>

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
La rama Máster siempre será la versión que está en producción. Asegurate de seleccionar la rama con la versión en la que quieras trabajar (desarrollo) porque no podrás hacer commit de tus cambios en la versión de producción y probablemente perderás tus cambios. Para saber qué versión de producción tienes que usar, mira arriba de este documento.

Cada viernes (si existen cambios sustanciales) se hará un merge de la branch activa de desarrollo a la máster.  **No dejes nada sin hacer commit o no saldrán en la release.**

Master branch always be a production version of Mística Design System Libraries. Ensure before of select a branch of the version that you want to work, you always have to work in Development branch, if you don't do that all of your changes will be lost. To know what version of development have to choose, see the first lines of this document.

#### POC Branches (Esto no debería ocurrir habitualmente)
If you want to test something to later will be integrated in libraries, you will be going to do that creating a *custom branch*.  

A custom branch always have to follow a structure in the name:  
`ACRONYM-short-description`  

*For example*  
Proof of concept  = POC  
`POC-autolayout-list`  

If this custom branch work fine, we can merge it with development branch.  

**When you make a new branch, don't publish immediately, work on this branch and publish it when you consider that your work is substantial.**

## Danger Zone in Kactus <a name="dangerZone"></a>
If you will go to use Kactus, when you download libraries in your computer, install the libraries from Kactus to Sketch (just drag and drop libraries sketch files to the Sketch > Preferences > Libraries). Be careful because if you change the branch in Kactus, libraries will change. Obviously, right?.

**Be careful updating library updates, make sure that you know what are you doing**

## Wiki <a name="wiki"></a>
* **Branch**  
It is a copy from Master or other branch. You can work new things in this copy and when you finish, you can merge in Master.
* **Merge**  
The union of one branch and another.
* **Master**  
Main branch in the repository. In our case, production branch.
* **Repositorio**  
The place where all the files are located.
* **Commit**  
It is a confirmation to save and upload all your changes in a branch.
* **Fetch**  
Just a refresh action to know if there are something new in the repository. (new commits, new branches, etc.)
* **Pull**  
Download new updates to your files.
* **Push**  
Upload your work to the branch. When you make push, all of the people on the repository will get a Pull.

## Problems w/ Kactus <a name="problemsWithKactus"></a>
1. First time when you will sync Mistica repository you will not see sketch files, to generate this files click in "Regenerate sketch file" in each files in Kactus.

2. If Kactus fetching time is longer, better restart Kactus app.
