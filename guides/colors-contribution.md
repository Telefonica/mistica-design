# Make changes in tokens

Desde Mística, queremos que cualquier diseñador de Telefónica pueda contribuir al Sistema. Aunque es cierto que al ser un sistema multimarca y ser usado por diferentes marcas hay algunos cambios en el sistema que son algo delicados. Sin embargo, hay otros cambios que no impactan de manera global a otros equipos. Creemos que hay partes del sistema que pueden ser controladas directamente por aquellos equipos de las diferentes marcas que trabajan el producto.

Es por esto que creamos esta guía para facilitar a los diseñadores de operaciones de las diferentes marcas facilitar cambios de relativos a la marca.

De momento, esta es la lista que creemos que un equipo de diseño externo a Mística puede hacer cambios de forma ágil.

- [Paleta](#paleta)
- [Constantes](#constantes)
- [Border Radius](#border-radius)

# Pasos para lograr contribuir a mistica-design

## Instala un editor de texto

Te recomendamos que instales VSCode, pero eres libre de usar el que más te guste.

[Descargar VSCode](https://code.visualstudio.com/download)

💡 Tenemos una configuración para evitar errores a la hora de cambiar tokens en VScode, pues ver cómo configurarlo [aquí](vsco-configuration.md).

## Instala GitHub Desktop

GitHub Desktop es la app para trabajar directamente con el respositorio, es la manera más fácil y visual que hay para poder entender GitHub.

[Descagar GitHub Desktop](https://desktop.github.com/)

Sigue esta guía para saber cómo clonar un repositorio

[Cloning a repository from GitHub to GitHub Desktop](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop)

Una vez ya tengas el respositorio clonado, deberías de ver en el Finder de tu ordenador la carpeta `Tokens` y en su interior todos los archivos de tokens.

## Abre el repositorio en VS Code

Una vez clonado, si en este selector de GitHub Desktop no aparece el repositorio seleccionado, despliega el menú para seleccionarlo. 

<img width="286" alt="Screenshot 2023-07-06 at 17 39 09" src="https://github.com/Telefonica/mistica-design/assets/44420072/198dc196-c236-4855-abe4-d2adc38b30c0">

Desde github desktop una vez seleccionado el repositorio recién clonado, ábrelo en el editor que hayas configurado por defecto:

<img width="638" alt="Screenshot 2023-07-06 at 17 33 44" src="https://github.com/Telefonica/mistica-design/assets/44420072/0083e758-dfb4-4281-8aa7-41aa8f9a54b6">

Si Visual Studio Code no es tu editor por defecto, puedes cambiarlo desde "preferencias" en ese mismo lugar.


## Crea una rama nueva para realizar los cambios

Antes de realizar modificaciones en los archivos JSON, es una buena práctica crear una nueva rama en el repositorio. Esto te permitirá trabajar de manera aislada y mantener un historial claro de tus cambios. Sigue estos pasos para crear una nueva rama:

1. En VS Code, haz clic en el icono del control de código fuente en la esquina inferior izquierda. Normalmente, este icono tiene el símbolo de git:

<img width="211" alt="Screenshot 2023-07-06 at 17 42 58" src="https://github.com/Telefonica/mistica-design/assets/44420072/588405e8-8a73-4723-829e-8f399e66403d">

2. En la parte superior de la ventana de control de código fuente, encontrarás una caja de texto que indica la rama actual. Haz clic en esa caja de texto y selecciona "Crear nueva rama" en el menú desplegable.

<img width="651" alt="Screenshot 2023-07-06 at 17 42 23" src="https://github.com/Telefonica/mistica-design/assets/44420072/8d45e7a5-e154-48d4-abf3-4bc4f7120e62">

3. Escribe un nombre descriptivo para tu nueva rama y presiona Enter para crearla.

4. Asegúrate de que la nueva rama esté seleccionada como la rama activa antes de continuar con las modificaciones en los archivos JSON.

## Modificando el JSON

Los archivos JSON de las diferentes marcas se encuentran en el directorio `tokens`

<img width="431" alt="Screenshot 2023-07-06 at 17 44 33" src="https://github.com/Telefonica/mistica-design/assets/44420072/1b482ecd-4fea-47c3-8b18-9a444c776106">

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





## Guarda los cambios y publica tu rama

Una vez que hayas realizado las modificaciones necesarias en los archivos JSON, deberás guardar tus cambios y publicar la rama en el repositorio remoto. Sigue estos pasos:

1. Desde la barra de navegación vete al tercer elemento (Source Control) donde verás lo siguiente:

<img width="420" alt="Screenshot 2023-07-06 at 17 47 26" src="https://github.com/Telefonica/mistica-design/assets/44420072/59c68814-b615-485f-ab7a-306bd5273738">

Aquí aparece el listado de los cambios que se han realizado. Comprueba que los cambios que aparecen listados son los correctos.

2. Introduce en el campo de texto una descripción de los cambios a realizar
3. Haz click en el botón para hacer un commit de los cambios. Este commit guardará de momento los cambios localmente en tu equipo.
4. Una vez que los cambios se han guardado, el botón se modificará mostrando la posibilidad de publicar la rama. Haz click en el botón.

<img width="358" alt="Screenshot 2023-07-06 at 17 51 19" src="https://github.com/Telefonica/mistica-design/assets/44420072/c2610218-5ae2-44b9-bad8-b99ac03a58b5">


## Crea una PR al repositorio de mistica-design

Una vez publicada la rama, es posible realizar una petición de cambios desde esa rama a la rama master, haciendo una Pull request.

1. Desde GitHub desktop y con esa rama seleccionada en el segundo selector de la barra superior, te aparecerá la opción de crear una Pull request.

<img width="926" alt="Screenshot 2023-07-07 at 10 22 38" src="https://github.com/Telefonica/mistica-design/assets/44420072/f73ad68a-ed72-4c76-813a-f743640326af">

2. Al hacer click en el botón de crear Pull Request, una nueva ventana del explorador se abrirá mostrando los campos necesarios a completar.
3. Comprueba que la rama base es `pre-production` y que la rama que estás comparando es la que acabas de crear
  
<img width="937" alt="Screenshot 2023-07-07 at 10 26 02" src="https://github.com/Telefonica/mistica-design/assets/44420072/886a92fd-4688-4124-8d5b-9f5039b98897">

> **Note**
> >
> Hay ocasiones en los que la rama base puede que no sea pre-production y sea production, estos casos ocurren normalmente cuando son  cambios que requieren realizarse de manera rápida ya que hay algo que solucionar en alguna de las implementaciones (nativo / web), antes de realizar una PR a production, consulta con design-core.

4. Una vez que todo está correcto, escribe un título descriptivo para la Pull Request y en el campo que se encuentra a la derecha, indica un revisor del equipo de design-core.
5. Una vez creado el título y asignado un revisor, puede procederse a crear la pull request con el botón de la parte inferior.


