# Contribute to mistica web for designers

Desde Mística creemos que los diseñadores deberíamos de ayudar a los equipos de desarrollo en aquellos detalles donde ellos no aporten valor, pequeños cambios visuales que podamos ayudar a los equipos siempre serán bienvenidos.

❗️ Los cambios en el repo deben de estar respaldados por las specs de los componentes y hablado con el equipo de Mística Design

Esto es un guía con todo detalle de lo que debe hacer un diseñador con conocimiento básico en la parte dev para contribuir en Mística.

## Instalar editor de texto

Te recomendamos que instales VSCode, pero eres libre de usar el que más te guste.  
[⬇️Descarga VSCode](https://code.visualstudio.com/download)

## Instalar

[⬇️Descarga nodejs](https://nodejs.org/en/download/)

## Instalar yarn

1. Abre el Terminal desde `Applications → Utilities → Terminal` o desde spotlight `⌘ + espacio`, escribe terminal y dale a intro.
2. Copia y pega esto en el terminal →

```zsh
npm install --global yarn
```

❗️ Al instalar elementos de manera global en el equipo, algunas veces salta un problema de permisos en el que verás que en el error te indica `EACES`; para resolver este tipo de problemas debes incluir `sudo` delante. Al hacer esto se te requerirá una contraseña, es la contraseña de tu usuario en el equipo.

Ejemplo:

```zsh
sudo npm install --global yarn
```

## Instalar Git

Para poder instalar git primero tienes que contar con homebew en tu equipo:

1.En el terminal pega →

```zsh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2.Una vez instalado pega →

```zsh
brew install git
```

## Instalar GitHub Desktop

Si quieres una interfaz friendly con la que moverte a través de las ramas, commitear y esas cosas instalate este programa.
[⬇️ Descarga GitHub Desktop](https://desktop.github.com/)

## Clona el repo de mistica-web

Cuando tengas instalado los tres puntos anteriores...

1. Abre Github Desktop
2. Dale a `File → Clone Repository...`
3. Busca `mistica-web`
4. Selecciona en qué sitio de tu ordenador quieres clonarlo
5. Dale a `Clone` (esto puede tardar algunos minutos)

Para clonar los repositorios

## Instalar dependencias

Instalar dependecias significa que cuando tu clonas un repositorio como mistica-web, en realidad hay mucho más código que el que existe en el repositorio de mistica-web, solo que ese código es externo y se le llama dependencias. Esto son extensiones de código que hace que las cosas sean más fáciles desde el lado tech, pero son paquetes que no viven dentro del repositorio de mistica-web.

Para instalar estas dependencias:

1. En GitHub Desktop dale a `Open in Visual Studio Code`
   ![image](https://user-images.githubusercontent.com/6722153/178792351-cc9ab7e8-6144-478f-b89a-3c66beaf076c.png)

Si no aparece esto, ve a Preferencias de GitHub Desktop y en Integrations cambia el external editor a Virtual Studio Code
![image](https://user-images.githubusercontent.com/6722153/178792466-94e25453-5dce-4bb6-9c59-f10e4acca8fd.png)

2.En VSCode dale a `CMD + SHIFT + P` y escribe "Terminal" y aparecerá en la lista algo como "Terminal: Create New Terminal"
3.Ya debe aparacer debajo de tu ventana de VSCODE una ventana de Terminal.
4.En esa ventana escribe `yarn`
5.Ya está, ya tendrías todo lo necesario para hacer commits y PRs al repo.

## Hacer una PR limpia, sin fallos

En mistica-web hay una serie de controles de calidad para identificar qué está pasando cuando cambias cualquier cosa en el código, de esta manera nos evitamos futuros sustos. Esto sirve por si cambias el borde de una card, saber dónde han sido aquellos sitios que ha afectado ese cambio.

Para pasar estos test de calidad, lo primero que tendrás que hacer es instalar [⬇️ Docker](https://docs.docker.com/get-docker/). Una vez instalado Docker, lo abres y ya no necesitas tocar nada más en Docker.

Volvemos a la ventana del terminal de tu VSCode y escribe `yarn test-acceptance`
Esto lo que hará será ir una a uno revisando qué diferencias hay con respecto a lo anterior.

Una vez termine el proceso (suele tardar) te saldrán aquellas screenshots que han dado fallos por existir diferencias entre lo nuevo y lo anterior (normalmente es lo que ocurrirá), para solucionar esto tienes que ejecutar el siguiente comando:

`yarn test-acceptance -u XXXXXXX-screenshot-test`

Siendo esas "XXXXXX" el nombre del error que te haya dado anteriormente.

P.E: `yarn test-acceptance -u carousel-screenshot-test`

---

Si a la hora de crear la PR la action te da error, otro comando que puede que te faltó por hacer es:

`yarn build` o `yarn test -u`
