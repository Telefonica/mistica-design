# Antes de empezar

Es importante contar con unas nociones básicas de HTML, CSS y Javascript para entender los conceptos explicados en esta guía. Tanto si no tienes ningún conocimiento como si partes de nociones básicas recomendamos una lectura previa de los cursos:

- [Learn HTML, Web.dev](https://web.dev/learn/html/)
- [Learn CSS, Web.dev](https://web.dev/learn/css/)
- [Una reintroducción a JavaScript, MDN Web docs](https://developer.mozilla.org/es/docs/Web/JavaScript/Language_Overview)

Su contenido es completamente gratuito y te proveerá de una buena base sobre la que se apoyan todos los conceptos que veremos a continuación.

De todas formas, repasaremos conceptos básicos intentando no caer en explicaciones extensas que otros recursos ya proveen para ayudarte a usar playroom en el menor tiempo posible contando con las herramientas necesarias para prototipar cualquier interfaz que necesites.

---

## Índice

### Introducción

- [¿Qué es Playroom?](#qué-es-playroom)
- [Playroom defaults](#playroom-defaults)
- [Preview & preview tools](#preview--preview-tools)
- [Atajos de teclado](#atajos-de-teclado)

### Básicos

- [Etiquetas](#etiquetas)
- [Children](#children)
- [Props](#props)
- [Estilos](#estilos)
- [Theme variant](#theme-variant)

## Lógicas

- [Según el tamaño de pantalla](#screen-size)
- [Según la marca](#brand)
- [Según si es light o dark mode](#light-or-dark-modes)

## Construyendo layout

- [Responsive layout](#responsive-layout)
- [Grid layout](#grid-layout)
- [Box, Stack & Inline](#box-stack--inline)
- [Carousel](#carousel)
- [Composiciones de página]

## Avanzado

- [Funciones](#funciones)
- [Manejando estados](#estado)
- [Iterando con arrays](#iterando-con-arrays)
- [Crear nuevos componentes](#crear-nuevos-componentes)

---

# Introducción

## ¿Qué es Playroom?

Playroom es un entorno de código orientado al diseño que permite la creación de mockups y prototipos de una manera sencilla y rápida integrando la librería de componentes de Mística.

[Ir a Playroom →](https://mistica-web.vercel.app/playroom)

Utilizamos esta herramienta para testear, construir y compartir diseños aplicados en el medio final.

## Playroom defaults

El Playroom de Mística viene con una serie de funcionalidades predefinidas a las que se puede acceder a través de su menú.

![usePlayroom](https://user-images.githubusercontent.com/44420072/210263265-f86810a5-cc5a-4dd8-bdbc-2cfbf9349cfe.gif)

### Component snippets

Desde el panel de Playroom puedes buscar y seleccionar snippets ya preparados de una gran mayoría de los componentes de Mística lo que te ahorrará mucho tiempo de prototipado.

Estos snippets además pueden ayudarte a comprender cómo se utiliza cada uno de nuestros componentes.

### Themes & screen widths

Activando varios temas o varios tamaños de pantalla, puedes verlos en simultáneo.

## Preview & preview tools

Playroom permite la previsualización del código en cualquiera de los temas predefinidos.

![preview](https://user-images.githubusercontent.com/44420072/210265026-dd99ef30-9035-484e-b857-a8f54d5e6b3d.gif)

Además, puedes añadir una barra en la parte superior que permite el cambio de marca desde la preview así como el cambio de modo entre light y dark.

Añade al inicio de tu playroom lo siguiente:

```
<PreviewTools/>
```

Preview tools ofrece diferentes configuraciones de customización como `floating` que oculta el menu dentro de una rueda de configuración o
`showPlatformSelector` que muestra un selector de plataforma.

## Atajos de teclado

| Acción                             | Teclas                                     |
| :--------------------------------- | :----------------------------------------- |
| Formateo de código                 | <kbd>⌘</kbd> + <kbd>S</kbd>                |
| Abrir snippets                     | <kbd>⌘</kbd> + <kbd>K</kbd>                |
| Intercambiar por la línea superior | <kbd>⌥</kbd> + <kbd>↑</kbd>                |
| Intercambiar por la línea inferior | <kbd>⌥</kbd> + <kbd>↓</kbd>                |
| Duplicar la linea encima           | <kbd>⇧</kbd> + <kbd>⌥</kbd> + <kbd>↑</kbd> |
| Duplicate la linea debajo          | <kbd>⇧</kbd> + <kbd>⌥</kbd> + <kbd>↓</kbd> |
| Añadir cursor a la línea anterior  | <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>↑</kbd> |
| Añadir cursor a la línea siguiente | <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>↓</kbd> |
| Seleccionar siguiente ocurrencia   | <kbd>⌘</kbd> + <kbd>D</kbd>                |
| Deshacer                           | <kbd>⌘</kbd> + <kbd>Z</kbd>                |

# Básicos

Playroom utiliza JSX, una extensión de la sintaxis de Javascript. En este capítulo repasaremos conceptos básicos sobre esta sintaxis para que puedas comenzar cuanto antes a trabajar con la herramienta.

Si quieres saber más acerca de JSX puedes consultar la [documentación oficial de React](https://es.reactjs.org/docs/introducing-jsx.html).

## Etiquetas

Una etiqueta se usa para crear un elemento. Para diferenciar las etiquetas propias de HTML las etiquetas de componentes React **siempre comienzan con letra mayúscula y utilizan una notación camelCase**.

![etiquetas](https://user-images.githubusercontent.com/44420072/210240149-65c85264-db03-43aa-baeb-7bfe421c0700.gif)

Ejemplo de una etiqueta HTML:

```
<p>Esta es la etiqueta usada para crear un párrafo</p>
```

Ejemplo de una etiqueta de un componente:

```
<Text>Este es un componente custom de texto</Text>
```

Cuando un elemento tiene otros elementos hijo se utilizan etiquetas de apertura y cierre, la mayor diferencia entre las mismas es que la etiqueta de cierre contiene una barra inclinada tras el paréntesis angular (`</p>`). Hay casos en los que el elemento no puede tener elementos hijo y la etiqueta no precisa por tanto ser cerrada.

Un ejemplo:

```
<img>
```

### Elementos sin etiqueta de cierre

La etiqueta utilizada para definir elementos de imagen no precisa de etiqueta de cierre ya que toda la información necesaria para renderizar la imagen se le provee a través de atributos HTML. Un ejemplo de atributo sería la fuente de donde el elemento debe extraer la información de la imagen.

```
<img src="la fuente de la imagen">
```

### Cierre automático de etiquetas

Un elemento en JSX puede prescindir de etiqueta de cierre siempre y cuando no tenga hijos utilizando la siguiente sintaxis:

```
<SnapCard/>
```

[Ver ejemplo en playroom →](https://rebrand.ly/58sy2hg)

## Children

Todo aquello que se encuentre entre las etiquetas de apertura y cierre de un elemento se considera hijo del mismo. En JSX pueden coexistir varios tipos de children:

### Cadenas de literales

```
<Text>Esto es una cadena de literales</Text>
```

### Otros elementos JSX

```
<Inline>
  <Chip>Filtro 1</Chip>
  <Chip>Filtro 2</Chip>
</Inline>
```

En JSX, al igual que en HTML, puedes mezclar cadenas de literales con elementos JSX.

```
<Stack>
  Esto es un texto
  <TextLink>Esto es un link</TextLink>
</Stack>
```

[Ver ejemplo en playroom →](https://rebrand.ly/e13jw2d)

### Otros tipos

Los siguientes tipos de children se tocarán en profundidad en el apartado avanzado de esta guía:

- Expresiones javascript
- Funciones

## Props

Las `props` son aquellos parámetros que definen cómo se va a renderizar el componente. Las props siempre se escriben el el mismo formato:

```
nombreDeLaProp={valorDeLaProp}
```

Las props se incluyen en la etiqueta de apertura de cada uno de los componentes:

![Screenshot 2023-01-03 at 16 26 48](https://user-images.githubusercontent.com/44420072/210387934-4ac861e5-2c57-4de9-92dc-39747d5a78bc.png)

```
<Avatar size={64} src="https://i.imgur.com/nRBEMMV.png"/>
```

En el caso del componente avatar, podemos ver en el código de arriba dos props: `size`, `src`.

[Ver ejemplo en playroom →](https://rebrand.ly/mn601rg)

### Autocompletado de props en Playroom

![props_autocomplete](https://user-images.githubusercontent.com/44420072/210398017-0bb4d8bf-60c7-4cf6-b319-28d7ae56e6f9.gif)

Al crear un nuevo elemento en Playroom se nos sugiere la lista de propiedades disponibles para el componente. Esta lista aparece al pulsar <kbd>Space</kbd> en la etiqueta de apertura de un componente.

### Tipos de props

Pueden ser de varios tipos en función de su objetivo. Para entender esto en profundidad debemos conocer cuáles son los tipos de variables que existe en JavaScript. En ocasiones sólo un tipo de variable puede utilizarse como valor para la prop de un componente, veamos cada tipo con un ejemplo:

#### String o variable de texto

```
<SnapCard title="título de la card"/>
```

![props_string](https://user-images.githubusercontent.com/44420072/210240643-a4d1cd4e-46fd-4693-a638-6d37ca262839.gif)

En nuestro componente `SnapCard` tenemos una `prop` llamada `title` a la que le queremos asignar un valor. En este caso estamos utilizando un `string` (o una variable de texto) para asignar un valor de texto a nuestra propiedad. Esta variable almacena una cadena de caracteres de texto.

- Un string siempre tiene que ir entre comillas (es válido tanto usar comillas dobles como simples)
- Cuando se utiliza un string como valor de una prop puede prescindirse de las llaves de apertura y cierre (`{}`)

[Ver ejemplo en playroom →](https://rebrand.ly/50elab5)

#### Number o variable de tipo numérico

```
<Stack space={16}></Stack>
```

![props_number](https://user-images.githubusercontent.com/44420072/210241221-baeceae3-303e-4f60-bea7-8418a35b8c2e.gif)

En nuestro componente stack la prop `prop` llamada `space` sirve para espaciar sus elementos hijo en el eje vertical, el valor de esta propiedad es numérico y siempre se escribe entre llaves.

[Ver ejemplo en playroom →](https://rebrand.ly/gd0crzv)

#### Boolean o variable de tipo booleano

```
<Boxed isInverse={true}></Boxed>
```

![props_boolean](https://user-images.githubusercontent.com/44420072/210241860-df7c1088-44c7-4e05-bf46-8405510ddaf4.gif)

Las variables booleanas indican si algo es verdadero o falso. En el ejemplo superior vemos como la prop `isInverse` tiene como valor `true`, lo que hace que se renderize como un elemento inverse.

- Si en un prop cuyo valor es de tipo booleano omitimos el valor, se colocará como verdadera por defecto
- Un buen indicativo de que una prop espera un valor booleano es cómo se compone su nombre (`isInverse`, `isLoading`) aunque no aplica en todos los casos.

[Ver ejemplo en playroom →](https://rebrand.ly/2nvcodz)

#### Otros tipo de variable

Además de las anteriormente mencionadas existen las variables de tipo lista y objeto. Incluiremos este tipo de variables más adelante en los conceptos avanzados de la guía ya que para la mayoría de casos no necesitaremos utilizarlas.

## Estilos

### Clases

Puede utilizarse la etiqueta `<style>` para incluir estilos al inicio del Playroom, esto nos permitirá acceder posteriormente a través del atributo `className` a las clases definidas dentro de esta etiqueta en otros elementos.

![style_classes](https://user-images.githubusercontent.com/44420072/210356016-2dd846f5-ff5f-4f53-9bcc-57a80d58e75a.gif)

```
<style>
  {`
    .myClass{}
  `}
</style>

<div className="myClass"></div>
```

[Ver ejemplo en playroom →](https://rebrand.ly/dspc38z)

### Estilos en línea

El atributo `style` permite incluir estilos en línea en aquellas etiquetas custom que incluyamos en nuestro playroom. Para ello debemos convertir a camelCase cualquier propiedad de CSS que necesitemos (`grid-template-columns` → `gridTemplateColumns`).

El valor de la propiedad debe ir siempre entre comillas y cuando se listan varias propiedades, ir separadas por comas.

```
style={{
  backgroundColor: "#fabada",
  width: "100%"
}}
```

![style_background](https://user-images.githubusercontent.com/44420072/210352287-e03690a1-dbf7-4cb4-8ddc-320d6c029670.gif)

Puede accederse a [cualquiera de los colores](https://mistica-web.vercel.app/?path=/story/utilities-skinvars--skin-vars) de mística a través de `colors`:

```
colors.nombreDelColor
```

[Ver ejemplo en playroom →](https://rebrand.ly/enphrfu)

#### Opacity in colors

Puedes aplicar opacidad a constantes de Mística

```
applyAlpha(skinVars.rawColors.inverse, 0.2)
```

[Ver ejemplo en playroom →](https://tinyurl.com/2luzuq49)

## Theme variant

![theme_inverse](https://user-images.githubusercontent.com/44420072/210542968-6460d343-febc-4866-adf4-53bc5ab6eceb.gif)

El componente `ThemeVariant` crea un contexto `inverse` en el que los estilos de sus hijos se adaptan para renderizarse con el contraste correcto. Para entender mejor que es un contexto inverse puedes consultar nuestra [documentación de theming](https://brandfactory.telefonica.com/document/1846#/fundamentals/theming).

```
<ThemeVariant isInverse>
  {contenido}
</ThemeVariant>
```

[Ver ejemplo en Playroom →](https://rebrand.ly/21w9u0h)

# Lógicas

Para comprender los ejemplos de lógicas que se abordarán en esta sección es importante conocer los siguientes conceptos:

- [Operador ternario](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
- [Operador de igualdad](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Strict_equality)
- [Sentencia if...else](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/if...else)

## Screen size

Puedes decidir tener propiedades diferentes por tipología de pantalla.

`isDesktopOrBigger` `isMobile` `isTablet` `isTabletOrBigger` `isTabletOrSmaller` `isDesktopOrBigger`

[+ info](https://mistica-web.vercel.app/?path=/story/hooks-usescreensize--use-screen-size)

De esta manera puedo decir que en tamaños desktop exista un espacio de 32 y en el resto de 16.
También puedo mostrar un texto (o cualquier cosa) diferente según el tamaño de pantalla.

Podemos utilizar dentro de la prop de un componente un operador ternario para evaluar si nos encontramos en un tamaño de pantalla o no y asignar un valor en consecuencia:

```
<Box padding={isDesktopOrBigger ? 40 : 16}>
```

renderizar diferente contenido:

```
<Text3>{isDesktopOrBigger ? "Desktop" : "Mobile"}</Text3>
```

o renderizar componentes diferentes :

```
{isDesktopOrBigger ? <Text10>Texto</Text10> : <Text4>Texto</Text4>}
```

[Ver ejemplo en Playroom →](https://rebrand.ly/g7oe2b3)

## Brand

A través de `theme.skinName` podemos obtener la marca(s) que se están utilizando. Esto nos permite realizar modificaciones por marca.

Las marcas soportadas por mística son: `Movistar`, `Telefonica`, `O2`, `Vivo` y `Blau`

Por ejemplo, se podría mostrar una ilustración diferente en función la marca a la que aplique utilizando una sentencia if...else:

```
if (theme.skinName === "Movistar") {
      return (...);
    }
if (theme.skinName === "Vivo") {
     return (...);
    }
return ("No hay ilustración")
```

u mostrar un elemento para una marca en concreto utilizando un operador ternario:

```
<Text2>{theme.skinName === "Movistar" ? "Es Movistar" : "No es Movistar"}</Text2>
```

[Ver ejemplo en Playroom →](https://rebrand.ly/134r5xp)

## Light or dark modes

A través de `theme.isDarkMode` podemos obtener información del modo en el que nos encontramos

[Ver ejemplo en Playroom →](https://tinyurl.com/227youkm)

# Construyendo layout

## Responsive layout

![layout_responsive](https://user-images.githubusercontent.com/44420072/210536892-5e07c565-4eb7-444c-98ee-5532ac75428a.gif)

El componente `ResponsiveLayout` proporciona márgenes al contenido en función del tamaño del viewport

```
<ResponsiveLayout>
  {Tu contenido}
</ResponsiveLayout>
```

[Ver ejemplo en Playroom →](https://rebrand.ly/8qnsdjo)

Además, puedes indicarle al componente si es `inverse`:

```
<ResponsiveLayout isInverse>
  {Tu contenido}
</ResponsiveLayout>
```

o que tenga un `backgroundColor` específico:

```
<ResponsiveLayout backgroundColor={colors.backgroundAlternative}>
  {Tu contenido}
</ResponsiveLayout>
```

[Ver ejemplo en Playroom →](https://rebrand.ly/51h6mol)

## Grid layout

El componente GridLayout sirve para organizar el contenido en columnas de ancho variable siguiendo unas templates predefinidas que se reajustan automáticamente en función del viewport.

![layout_grid](https://user-images.githubusercontent.com/44420072/210546735-c1f7e3db-2428-4551-be6b-cb882bb1fae8.gif)

Para utilizar las templates del componente usaremos la prop `template`:

```
<GridLayout template="8+4"/>
```

El contenido que va dentro del grid se indica a través de las props `left` y `right`:

```
<GridLayout template="8+4" left={content} right={content}/>
```

Para indicar el espaciado vertical entre bloques de contenido en la versión mobile existe la prop `verticalSpace`:

```
<GridLayout template="8+4" left={content} right={content} verticalSpace={32}/>
```

[Ver ejemplo en Playroom →](https://rebrand.ly/wphekwb)

## Box, Stack & Inline

Estos son los tres componentes fundamentales que tienes que conocer para distribuir elementos con Mística.

### Box

Como su nombre indica, hace de caja. Podrás añadir espacio alrededor de todo lo que metas dentro.

[Ejemplo de Box →](https://ibit.ly/Zmoz)

### Stack

Apila elementos verticalmente y le puedes dar el espacio que necesites (el autolayout con la flechita hacia abajo de Figma sería el ejemplo perfecto).

[Ejemplo de Stack →](https://mistica-web.vercel.app/playroom#?code=N4Igxg9gJgpiBcJgHoBUACAjAOnQUQBt0AeABQIEMwYALCA2AJ3WQD50YBndAVwDt0kALYAHCHxh8ALjHQiKjCnMY8YAIwrdUyAL4AdPigwAmXKRXqlSsBSFqAlgvQEI3TADZ0sdJ3nUvMEScUlQA1nIKSpIyfEzoAI48AJfoEGA8jIyy2vp8xADKIWDhvlQwALzAHjqsBugk5GV0DDDMbHUNlNTNce15yIVhtXwgADQgUjQwQlwIANogAEKUPGMgALIQAG72wQprAPLGawAqgTAAZuL2NmsAavZbECAAuuMA7vZQk5zzAMzuAAMLx0QA)

### Inline

Igual que el `stack`, apila elementos pero horizontalmente.

[Ejemplo de Inline →](https://mistica-web.vercel.app/playroom#?code=N4Igxg9gJgpiBcJgHoBUACAjAOnQUQBt0AeABQIEMwYALCA2AJ3WQD50YBndAVwDt0kALYAHCHxh8ALjHQiKjCnMY8YAIwrdUyAL4AdPigwAmXKRXqlSsBSFqAlgvQEI3TADZ0sdJ3nUvMET2fATBsvKKHNKSTOgAjjwAl%2BgQYDyMjLLa%2BnzEAJIhYT5%2BMAC8wB46rAboJORUtPSxbDV1lNR0DDDMLbnIBaES1XwgADQgUjQwQlwIANogALIQAG72nFIKIAC64wDu9lCTnPMAzO4ADNs6QA)

[Ejemplo de Inline con otro tipo de espaciado →](https://mistica-web.vercel.app/playroom#?code=N4Igxg9gJgpiBcJgHoBUACAjAOnQUQBt0AeABQIEMwYALCA2AJ3WQD50YBndAVwDt0kALYAHCHxh8ALjHQiKjCnMY8YAIwrdUyAL4AdPigwAmXKRXqlSsBSFqAlgvQEI3TADZ0sdJ3nUvMET2fATBsvKKHNKSTOgAjjwAl%2BgQYDyMjLLa%2BnzEAJIhYT5%2BMAC8wB46rAboJORUtPSxbDV1lNR0DDDMLbnIBaES1XwGRugAzLgAgkGFEs7hqrDcsGD2zAmynOEKsi7cgTBCklKuguLoeiC%2BDQC0ajBSAO4wklcBzkqc9gDmPPYnWRCCgSSIACkC51E4kBAQe6BkoN4AhBYDo6AAZvYAFYQACU6GyBnycy2JVKVwez1eIxAw1qZHajS6zCe9igUho5UwAAYeToWPS2g1OrE2RyuRU%2BQLesR%2BqThiTBmSGhSQAoIPwoFchYyRU1uuhxZzudLBa09R0Daz2SapfzzX0BmFFc75jdqGqYAA3SQEACeOot9StLKNtslvIdvQZIeZYojpujivlyuGIAANCBOUcuAgANogACyEG99k4UgUIAAulnjTROAXxu4edWdEA)

## Carousel

El componente `Carousel` permite organizar contenido horizontalmente excediendo los límites del viewport.

Para controlar el contenido del carousel utilizaremos las props `items` e `itemsPerPage`:

```
<Carousel items={[Lista de items]} itemsPerPage={2}/>
```

[Ver ejemplo en Playroom →](https://rebrand.ly/4gbmti6)

# Avanzado

## Funciones

### Immediately Invoked Function Expression

Es una función que se ejecuta nada mas ser definida. Las variables definidas dentro de esta función son descartadas tras su ejecución.

```
{(() => {
// …
})()}
```

### Argumentos

Podemos usar esta función para definir una constante que utilizaremos luego dentro de la prop de nuestro componente:

[Ver ejemplo en Playroom →](https://rebrand.ly/pav1x9p)

## Estado

El estado de un componente define, además de las props cómo se renderiza un componente en determinado momento. Por ejemplo, al hacer click sobre un botón su estado puede cambiar a un estado de carga.

![useState](https://user-images.githubusercontent.com/44420072/210258052-58ab316e-e009-4081-b862-1cea47e1b3b0.gif)

### `useState`

En el ejemplo superior utilizamos el hook useState para actualizar el estado de nuestro componente

```
 const [isLoading, setIsLoading] = useState(false)
```

### `setState` y `getState`

El estado de los componentes puede controlarse a través de los métodos `setState` y `getState`

![setState](https://user-images.githubusercontent.com/44420072/210255077-b2528ee6-a8b6-4695-9c92-5cbc00b8178b.gif)

### Iterando con arrays

Para evitar duplicación de código podemos utilizar el método Array.from y una función para duplicar automáticamente elementos:

```
{Array.from({ length: n }, (_, idx) => (
     //...
))}
```

[Ver ejemplo en Playroom →](https://rebrand.ly/rdmk0tx)

En el caso de que necesitemos modificar las propiedades de cada uno de los elementos de nuestro array de manera independiente podemos hacerlo combinando conceptos vistos anteriormente:

[Ver ejemplo en Playroom →](https://rebrand.ly/bibj1j0)

## Crear nuevos componentes

https://rebrand.ly/5cjmmfw
