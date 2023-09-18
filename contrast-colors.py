import json
import os

# Función para calcular el contraste WCAG entre dos colores
def calculate_contrast(color1, color2):
    # Función para obtener el valor relativo de luminosidad de un color
    def get_luminance(color):
        r, g, b = [int(color[i:i+2], 16) / 255.0 for i in (1, 3, 5)]
        r = r if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
        g = g if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
        b = b if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
        return 0.2126 * r + 0.7152 * g + 0.0722 * b

    # Calcular el contraste WCAG
    luminance1 = get_luminance(color1)
    luminance2 = get_luminance(color2)
    if luminance1 > luminance2:
        contrast_ratio = (luminance1 + 0.05) / (luminance2 + 0.05)
    else:
        contrast_ratio = (luminance2 + 0.05) / (luminance1 + 0.05)

    return contrast_ratio

# Función para verificar el contraste de colores en la paleta del JSON
def check_contrast_palette(json_data):
    color_palette = json_data.get("global", {}).get("palette", {})
    
    for color_name, color_info in color_palette.items():
        if color_info.get("type") == "color":
            color_value = color_info.get("value")
            contrast_ratio = calculate_contrast(color_value, "#FFFFFF")  # Comparar con el blanco (#FFFFFF)
            
            if contrast_ratio < 4.5 and contrast_ratio >= 2:
                print(f"El contraste del color '{color_name}' es insuficiente: {contrast_ratio:.2f}")

# # Cargar el JSON
# with open('tokens/o2.json', 'r') as json_file:
#     data = json.load(json_file)

# Carpeta que contiene los archivos JSON
carpeta_json = 'tokens'

# Iterar a través de los archivos en la carpeta
for archivo in os.listdir(carpeta_json):
    if archivo.endswith('.json'):
        ruta_archivo = os.path.join(carpeta_json, archivo)
        with open(ruta_archivo, 'r') as json_file:
            data = json.load(json_file)
            print(f"Revisando el archivo {archivo}:")
            check_contrast_palette(data)

# Verificar el contraste de colores en la paleta
check_contrast_palette(data)


