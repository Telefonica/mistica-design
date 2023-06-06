# Set up VScode with Mística JSON Schema validator

Si quieres que te aparezcan errores de formato y de reglas no permitidas en los archivos .json de los tokens tienes que configurar VScode de la siguiente manera.

- 1.Abre las settings `cmd + ,`
- 2.Busca `Json` en la barra de búsqueda
- 3.En los resultados, busca `JSON: Schemas`

![image](https://user-images.githubusercontent.com/6722153/185502994-45f314e6-1025-4f26-8377-4da7d06b934f.png)

- 4.Dale a Edit in settings.json
- 5.Añade lo siguiente al archivo de settings

```json
{
  "json.schemas": [
    {
      "fileMatch": [
        "/blau.json",
        "/movistar.json",
        "/movistar-classic.json",
        "/o2.json",
        "/solar-360.json",
        "/telefonica.json",
        "/vivo.json"
      ],
      "url": "/Users/USERNAME/PATH TO MISTICA-DESIGN/mistica-design/tokens/schema/skin-schema.json"
    }
  ]
}
```
