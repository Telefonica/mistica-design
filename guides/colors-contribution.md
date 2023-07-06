# Make changes in tokens

Desde Mística, queremos que cualquier diseñador de Telefónica pueda contribuir al Sistema. Aunque es cierto que al ser un sistema multimarca y ser usado por diferentes marcas hay algunos cambios en el sistema que son algo delicados. Sin embargo, hay otros cambios que no impactan de manera global a otros equipos. Creemos que hay partes del sistema que pueden ser controladas directamente por aquellos equipos de las diferentes marcas que trabajan el producto.

Es por esto que creamos esta guía para facilitar a los diseñadores de operaciones de las diferentes marcas facilitar cambios de relativos a la marca.

De momento, esta es la lista que creemos que un equipo de diseño externo a Mística puede hacer cambios de forma ágil.

- [Paleta](#paleta)
- [Constantes](#constantes)
- [Border Radius](#border-radius)

## Pasos para lograr contribuir a mistica-design

### Instala un editor de texto

Te recomendamos que instales VSCode, pero eres libre de usar el que más te guste.

[Descargar VSCode](https://code.visualstudio.com/download)

💡 Tenemos una configuración para evitar errores a la hora de cambiar tokens en VScode, pues ver cómo configurarlo [aquí](vsco-configuration.md).

### Instala GitHub Desktop

GitHub Desktop es la app para trabajar directamente con el respositorio, es la manera más fácil y visual que hay para poder entender GitHub.

[Descagar GitHub Desktop](https://desktop.github.com/)

Sigue esta guía para saber cómo clonar un repositorio

[Cloning a repository from GitHub to GitHub Desktop](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop)

Una vez ya tengas el respositorio clonado, deberías de ver en el Finder de tu ordenador la carpeta `Tokens` y en su interior todos los archivos de tokens.

Abre el archivo .json que quieras modificar (por ejemplo, vivo.json)

## Modificando el JSON

El archivo JSON de una marca tiene la siguiente estructura:

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

### Paleta

La paleta está dentro de la está dentro de la categoría `global` / `palette` y está compuesta por los diferentes tokens que luego las constantes utilizan como value. Dentro de la paleta se pueden realizar las siguientes modificaciones:

> **Warning**
>
> **Cambios que conllevan un breaking change**
>
> Aunque es posible realizar estos cambios, la modificación o eliminación de un token de la paleta puede suponer un breaking change en algún producto que consuma directamente estos tokens.
>
> * Modificación de nombre
> * Eliminación de un token existente
>
> Si necesitas realizar una modificación de alguno de los dos tipos anteriores valora previamente el impacto que tiene el cambio.


#### Modificar valor de un token existente

Se puede modificar el campo `value` de un token de la paleta.

* Siempre tiene que ir entre comillas dobles ("...")
* El formato válido es el [hexadecimal](https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color).

![palette_change](https://github.com/Telefonica/mistica-design/assets/44420072/89cdcab8-5e22-4113-aabd-7283b1c75ace)

#### Crear un nuevo token

Se puede añadir un nuevo token a la paleta para utilizarlo posteriormente en una constante.

Tiene que seguir el siguiente formato:

```
"nombre": {
  "value": "valor",
  "type": "color"
}
```

![tokens_new_palette](https://github.com/Telefonica/mistica-design/assets/44420072/3fadf1c9-f1f7-49e4-9c13-c9e9563b33c6)


### Constantes

Las constantes se encuentran dentro de las categorías `light` y `dark` del json. En el value de una constante nunca se utiliza un valor hexadecimal directamente, sino que se referencia un valor pre-existente de la paleta de la siguiente manera:

```
 "value": "{palette.white}"
```

Tambien es posible aplicar modificaciones de opacidad a los valores:

```
 "value": "rgba({palette.white}, 0.5)"
```

Donde 0.05 es el canal alpha y puede tener un valor entre 0 y 1.

Las constantes permiten las siguientes modificaciones:

> **Warning**
>
> **Cambios que no se pueden realizar**
> * Modificación de nombre
> * Eliminación de un token existente
>
> Para añadir una constante a una skin es recomendable abrir una discussion con la necesidad, de manera que pueda evaluarse.


Con las constantes se puede:

* Modificar su valor



### Border radius

Los tokens de border-radius se encuentran dentro de la categoria `radius`, dentro de esta categoría se pueden realizar las siguientes modificaciones:

> **Warning**
>
> **Cambios que no se pueden realizar**
> * Modificación de nombre
> * Eliminación de un token existente
>
> Para añadir una border-radius a una skin es recomendable abrir una discussion con la necesidad, de manera que pueda evaluarse.


#### Modificar su valor



