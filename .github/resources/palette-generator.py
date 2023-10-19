import os
import json

def extract_color_names_from_file(file_path):
    with open(file_path, 'r') as file:
        json_data = json.load(file)
    color_names = []
    if "global" in json_data and "palette" in json_data["global"]:
        palette = json_data["global"]["palette"]
        color_names = list(palette.keys())
    return color_names

def extract_color_names_from_folder(folder_path):
    color_names = []
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".json"):
            file_path = os.path.join(folder_path, file_name)
            color_names.extend(extract_color_names_from_file(file_path))
    return color_names

folder_path = 'tokens'  # Reemplaza con la ruta correcta
color_names = extract_color_names_from_folder(folder_path)

# print("Nombres de colores extraídos de todos los archivos JSON en la carpeta:")
# print(color_names)

def generate_json_schema_with_colors(color_names):
    schema = {
        "additionalProperties": False,
        "required": ["light", "dark", "radius", "text", "global"],
        "properties": {
        "global": {
            "additionalProperties": False,
            "properties": {
            "palette": {
                "anyOf": [{ "$ref": "#/global/palette" }]
            }
            }
        },
        "prominent": { "comment": "Prominent will be deleted soon", "additionalProperties": True },
        "light": {
            "comment": "Aquí se obliga a usar las constantes definidas para light mode",
            "allOf": [{ "$ref": "#/global/constants" }]
        },
        "dark": {
            "comment": "Aquí se obliga a usar las constantes definidas para dark mode",
            "allOf": [{ "$ref": "#/global/constants" }]
        },
        "radius": {
            "comment": "Aquí se obliga a usar los border radius definidos",
            "allOf": [{ "$ref": "#/global/radius" }]
        },
        "text": {
            "comment": "Aquí se obliga a usar los text weight definidos",
            "additionalProperties": False,
            "properties": {
            "weight": {
                "allOf": [{ "$ref": "#/global/weight" }]
            },
            "size": {
                "allOf": [{ "$ref": "#/global/size" }]
            },
            "lineHeight": {
                "allOf": [{ "$ref": "#/global/lineHeight" }]
            }
            }
        }
        },
        "global": {
        "comment": "Aquí se definen constantes y paleta (aunque no definimos los colores de la paleta porque de momento queremos dejar libre la creación de nuevos colores)",
        "palette": {
            "patternProperties": {
            ".*": {
                "type": "object",
                "$ref": "#/definitions/paletteProperties"
            }
            }
        },
        "constants": {
            "additionalProperties": False,
            "required": [
            "appBarBackground",
            "background",
            "backgroundContainer",
            "backgroundContainerHover",
            "backgroundContainerPressed",
            "backgroundContainerAlternative",
            "backgroundContainerBrand",
            "backgroundContainerBrandHover",
            "backgroundContainerBrandPressed",
            "backgroundContainerBrandOverInverse",
            "backgroundBrand",
            "backgroundBrandSecondary",
            "backgroundOverlay",
            "backgroundSkeleton",
            "backgroundSkeletonInverse",
            "backgroundAlternative",
            "backgroundFeedbackBottom",
            "navigationBarBackground",
            "skeletonWave",
            "border",
            "borderLow",
            "borderHigh",
            "borderSelected",
            "coverBackgroundHover",
            "coverBackgroundPressed",
            "buttonDangerBackground",
            "buttonDangerBackgroundSelected",
            "buttonDangerBackgroundHover",
            "buttonLinkBackgroundSelected",
            "buttonLinkBackgroundInverseSelected",
            "buttonPrimaryBackground",
            "buttonPrimaryBackgroundInverse",
            "buttonPrimaryBackgroundSelected",
            "buttonPrimaryBackgroundInverseSelected",
            "buttonPrimaryBackgroundHover",
            "buttonSecondaryBorder",
            "buttonSecondaryBackgroundSelected",
            "buttonSecondaryBorderInverse",
            "buttonSecondaryBorderInverseSelected",
            "buttonSecondaryBorderSelected",
            "buttonSecondaryBackgroundHover",
            "buttonSecondaryBackgroundInverseSelected",
            "buttonSecondaryBackgroundInverseHover",
            "control",
            "controlActivated",
            "controlError",
            "loadingBar",
            "loadingBarBackground",
            "toggleAndroidInactive",
            "toggleAndroidBackgroundActive",
            "iosControlKnob",
            "divider",
            "dividerInverse",
            "navigationBarDivider",
            "badge",
            "feedbackErrorBackground",
            "feedbackInfoBackground",
            "brand",
            "brandHigh",
            "inverse",
            "neutralHigh",
            "neutralLow",
            "neutralLowAlternative",
            "neutralMedium",
            "promo",
            "error",
            "highlight",
            "success",
            "warning",
            "textPrimary",
            "textPrimaryInverse",
            "textSecondary",
            "textSecondaryInverse",
            "textButtonPrimary",
            "textButtonPrimaryInverse",
            "textButtonPrimaryInverseSelected",
            "textButtonSecondary",
            "textButtonSecondarySelected",
            "textButtonSecondaryInverse",
            "textButtonSecondaryInverseSelected",
            "textLink",
            "textLinkInverse",
            "textLinkDanger",
            "textLinkSnackbar",
            "textNavigationBarPrimary",
            "textNavigationBarSecondary",
            "textNavigationSearchBarHint",
            "textNavigationSearchBarText",
            "textAppBar",
            "textAppBarSelected",
            "successLow",
            "warningLow",
            "errorLow",
            "promoLow",
            "brandLow",
            "successHigh",
            "warningHigh",
            "errorHigh",
            "promoHigh",
            "successHighInverse",
            "warningHighInverse",
            "errorHighInverse",
            "promoHighInverse",
            "neutralMediumInverse",
            "customTabsBackground"
            ],
            "properties": {
            "appBarBackground": { "$ref": "#/definitions/constantProperties" },
            "background": { "$ref": "#/definitions/constantProperties" },
            "backgroundContainer": { "$ref": "#/definitions/constantProperties" },
            "backgroundContainerHover": { "$ref": "#/definitions/constantProperties" },
            "backgroundContainerPressed": { "$ref": "#/definitions/constantProperties" },
            "backgroundContainerAlternative": { "$ref": "#/definitions/constantProperties" },
            "backgroundContainerBrand": { "$ref": "#/definitions/constantProperties" },
            "backgroundContainerBrandHover": { "$ref": "#/definitions/constantProperties" },
            "backgroundContainerBrandPressed": { "$ref": "#/definitions/constantProperties" },
            "backgroundContainerBrandOverInverse": { "$ref": "#/definitions/constantProperties" },
            "backgroundBrand": { "$ref": "#/definitions/constantProperties" },
            "backgroundBrandSecondary": { "$ref": "#/definitions/constantProperties" },
            "backgroundOverlay": { "$ref": "#/definitions/constantProperties" },
            "backgroundSkeleton": { "$ref": "#/definitions/constantProperties" },
            "backgroundSkeletonInverse": { "$ref": "#/definitions/constantProperties" },
            "backgroundAlternative": { "$ref": "#/definitions/constantProperties" },
            "backgroundFeedbackBottom": { "$ref": "#/definitions/constantProperties" },
            "navigationBarBackground": { "$ref": "#/definitions/constantProperties" },
            "skeletonWave": { "$ref": "#/definitions/constantProperties" },
            "border": { "$ref": "#/definitions/constantProperties" },
            "borderLow": { "$ref": "#/definitions/constantProperties" },
            "borderHigh": { "$ref": "#/definitions/constantProperties" },
            "borderSelected": { "$ref": "#/definitions/constantProperties" },
            "coverBackgroundHover": { "$ref": "#/definitions/constantProperties" },
            "coverBackgroundPressed": { "$ref": "#/definitions/constantProperties" },
            "buttonDangerBackground": { "$ref": "#/definitions/constantProperties" },
            "buttonDangerBackgroundSelected": { "$ref": "#/definitions/constantProperties" },
            "buttonDangerBackgroundHover": { "$ref": "#/definitions/constantProperties" },
            "buttonLinkBackgroundSelected": { "$ref": "#/definitions/constantProperties" },
            "buttonLinkBackgroundInverseSelected": { "$ref": "#/definitions/constantProperties" },
            "buttonPrimaryBackground": { "$ref": "#/definitions/constantProperties" },
            "buttonPrimaryBackgroundInverse": { "$ref": "#/definitions/constantProperties" },
            "buttonPrimaryBackgroundSelected": { "$ref": "#/definitions/constantProperties" },
            "buttonPrimaryBackgroundInverseSelected": { "$ref": "#/definitions/constantProperties" },
            "buttonPrimaryBackgroundHover": { "$ref": "#/definitions/constantProperties" },
            "buttonSecondaryBorder": { "$ref": "#/definitions/constantProperties" },
            "buttonSecondaryBackgroundSelected": { "$ref": "#/definitions/constantProperties" },
            "buttonSecondaryBorderInverse": { "$ref": "#/definitions/constantProperties" },
            "buttonSecondaryBorderInverseSelected": { "$ref": "#/definitions/constantProperties" },
            "buttonSecondaryBorderSelected": { "$ref": "#/definitions/constantProperties" },
            "buttonSecondaryBackgroundHover": { "$ref": "#/definitions/constantProperties" },
            "buttonSecondaryBackgroundInverseSelected": { "$ref": "#/definitions/constantProperties" },
            "buttonSecondaryBackgroundInverseHover": { "$ref": "#/definitions/constantProperties" },
            "control": { "$ref": "#/definitions/constantProperties" },
            "controlActivated": { "$ref": "#/definitions/constantProperties" },
            "controlError": { "$ref": "#/definitions/constantProperties" },
            "loadingBar": { "$ref": "#/definitions/constantProperties" },
            "loadingBarBackground": { "$ref": "#/definitions/constantProperties" },
            "toggleAndroidInactive": { "$ref": "#/definitions/constantProperties" },
            "toggleAndroidBackgroundActive": { "$ref": "#/definitions/constantProperties" },
            "iosControlKnob": { "$ref": "#/definitions/constantProperties" },
            "divider": { "$ref": "#/definitions/constantProperties" },
            "dividerInverse": { "$ref": "#/definitions/constantProperties" },
            "navigationBarDivider": { "$ref": "#/definitions/constantProperties" },
            "badge": { "$ref": "#/definitions/constantProperties" },
            "feedbackErrorBackground": { "$ref": "#/definitions/constantProperties" },
            "feedbackInfoBackground": { "$ref": "#/definitions/constantProperties" },
            "brand": { "$ref": "#/definitions/constantProperties" },
            "brandHigh": { "$ref": "#/definitions/constantProperties" },
            "inverse": { "$ref": "#/definitions/constantProperties" },
            "neutralHigh": { "$ref": "#/definitions/constantProperties" },
            "neutralLow": { "$ref": "#/definitions/constantProperties" },
            "neutralLowAlternative": { "$ref": "#/definitions/constantProperties" },
            "neutralMedium": { "$ref": "#/definitions/constantProperties" },
            "promo": { "$ref": "#/definitions/constantProperties" },
            "error": { "$ref": "#/definitions/constantProperties" },
            "highlight": { "$ref": "#/definitions/constantProperties" },
            "success": { "$ref": "#/definitions/constantProperties" },
            "warning": { "$ref": "#/definitions/constantProperties" },
            "textPrimary": { "$ref": "#/definitions/constantProperties" },
            "textPrimaryInverse": { "$ref": "#/definitions/constantProperties" },
            "textSecondary": { "$ref": "#/definitions/constantProperties" },
            "textSecondaryInverse": { "$ref": "#/definitions/constantProperties" },
            "textButtonPrimary": { "$ref": "#/definitions/constantProperties" },
            "textButtonPrimaryInverse": { "$ref": "#/definitions/constantProperties" },
            "textButtonPrimaryInverseSelected": { "$ref": "#/definitions/constantProperties" },
            "textButtonSecondary": { "$ref": "#/definitions/constantProperties" },
            "textButtonSecondarySelected": { "$ref": "#/definitions/constantProperties" },
            "textButtonSecondaryInverse": { "$ref": "#/definitions/constantProperties" },
            "textButtonSecondaryInverseSelected": { "$ref": "#/definitions/constantProperties" },
            "textLink": { "$ref": "#/definitions/constantProperties" },
            "textLinkInverse": { "$ref": "#/definitions/constantProperties" },
            "textLinkDanger": { "$ref": "#/definitions/constantProperties" },
            "textLinkSnackbar": { "$ref": "#/definitions/constantProperties" },
            "textNavigationBarPrimary": { "$ref": "#/definitions/constantProperties" },
            "textNavigationBarSecondary": { "$ref": "#/definitions/constantProperties" },
            "textNavigationSearchBarHint": { "$ref": "#/definitions/constantProperties" },
            "textNavigationSearchBarText": { "$ref": "#/definitions/constantProperties" },
            "textAppBar": { "$ref": "#/definitions/constantProperties" },
            "textAppBarSelected": { "$ref": "#/definitions/constantProperties" },
            "successLow": { "$ref": "#/definitions/constantProperties" },
            "warningLow": { "$ref": "#/definitions/constantProperties" },
            "errorLow": { "$ref": "#/definitions/constantProperties" },
            "promoLow": { "$ref": "#/definitions/constantProperties" },
            "brandLow": { "$ref": "#/definitions/constantProperties" },
            "successHigh": { "$ref": "#/definitions/constantProperties" },
            "warningHigh": { "$ref": "#/definitions/constantProperties" },
            "errorHigh": { "$ref": "#/definitions/constantProperties" },
            "promoHigh": { "$ref": "#/definitions/constantProperties" },
            "successHighInverse": { "$ref": "#/definitions/constantProperties" },
            "warningHighInverse": { "$ref": "#/definitions/constantProperties" },
            "errorHighInverse": { "$ref": "#/definitions/constantProperties" },
            "promoHighInverse": { "$ref": "#/definitions/constantProperties" },
            "neutralMediumInverse": { "$ref": "#/definitions/constantProperties" },
            "customTabsBackground": { "$ref": "#/definitions/constantProperties" },
            "extended": {
                "type": "object",
                "patternProperties": {
                ".*": {
                    "type": "object",
                    "$ref": "#/definitions/constantProperties"
                }
                },
                "additionalProperties": True
            }
            }
        },
        "radius": {
            "additionalProperties": False,
            "required": ["bar", "button", "checkbox", "avatar", "container", "indicator", "input", "legacyDisplay", "popup", "sheet"],
            "properties": {
            "avatar": { "$ref": "#/definitions/radiusProperties" },
            "bar": { "$ref": "#/definitions/radiusProperties" },
            "button": { "$ref": "#/definitions/radiusProperties" },
            "checkbox": { "$ref": "#/definitions/radiusProperties" },
            "container": { "$ref": "#/definitions/radiusProperties" },
            "indicator": { "$ref": "#/definitions/radiusProperties" },
            "input": { "$ref": "#/definitions/radiusProperties" },
            "legacyDisplay": { "$ref": "#/definitions/radiusProperties" },
            "popup": { "$ref": "#/definitions/radiusProperties" },
            "sheet": { "$ref": "#/definitions/radiusProperties" }
            }
        },
        "weight": {
            "additionalProperties": False,
            "properties": {
            "cardTitle": { "$ref": "#/definitions/weightProperties" },
            "button": { "$ref": "#/definitions/weightProperties" },
            "tabsLabel": { "$ref": "#/definitions/weightProperties" },
            "link": { "$ref": "#/definitions/weightProperties" },
            "indicator": { "$ref": "#/definitions/weightProperties" },
            "navigationBar": { "$ref": "#/definitions/weightProperties" },
            "title1": { "$ref": "#/definitions/weightProperties" },
            "title2": { "$ref": "#/definitions/weightProperties" },
            "text5": { "$ref": "#/definitions/weightProperties" },
            "text6": { "$ref": "#/definitions/weightProperties" },
            "text7": { "$ref": "#/definitions/weightProperties" },
            "text8": { "$ref": "#/definitions/weightProperties" },
            "text9": { "$ref": "#/definitions/weightProperties" },
            "text10": { "$ref": "#/definitions/weightProperties" }
            }
        },
        "size": {
            "additionalProperties": False,
            "properties": {
            "tabsLabel": { "$ref": "#/definitions/sizeProperties" },
            "title2": { "$ref": "#/definitions/sizeProperties" }
            }
        },
        "lineHeight": {
            "additionalProperties": False,
            "properties": {
            "tabsLabel": { "$ref": "#/definitions/lineHeightProperties" },
            "title2": { "$ref": "#/definitions/lineHeightProperties" }
            }
        }
        },
        "definitions": {
        "comment": "Aquí se define el formato de un color o de una constante.",
        "paletteProperties": {
            "patternProperties": {
            "value": {
                "type": "string",
                "pattern": "^#([A-F0-9]{6}|[A-F0-9]{3})$"
            },
            "type": {
                "const": "color"
            }
            },
            "required": ["value", "type"]
        },
        "constantProperties": {
            "patternProperties": {
            "value": {
                "type": "string",
                "pattern": "(.*?rgba.*?)+([({])+(palette.("+ "|".join(color_names) + ")}, (0+([.][0-9]+)?|1([.]0)?)[)])$|^({palette.("+ "|".join(color_names) +")+})$|(.*?linear-gradient.*?)+([(])(?:36[0]|3[0-5][0-9]|[12][0-9][0-9]|[1-9]?[0-9])(.*?deg).*[)]$"
            },
            "type": {
                "const": "color"
            },
            "description": {
                "type": "string",
                "pattern": "^("+ "|".join(color_names) + ")+$"
            }
            },
            "required": ["value", "type", "description"],
            "additionalProperties": False
        },
        "radiusProperties": {
            "patternProperties": {
            "value": {
                "type": "string",
                "pattern": "^(0|2|4|8|12|16|circle|999|(0|4|8|12|16) (0|4|8|12|16) (0|4|8|12|16) (0|4|8|12|16))$"
            },
            "type": {
                "const": "borderRadius"
            }
            },
            "required": ["value", "type"],
            "additionalProperties": False
        },
        "weightProperties": {
            "patternProperties": {
            "value": {
                "type": "string",
                "pattern": "^(light|regular|medium|bold)+$"
            },
            "type": {
                "const": "typography"
            }
            },
            "required": ["value", "type"]
        },
        "sizeProperties": {
            "type": "object",
            "patternProperties": {
            "value": {
                "type": "object",
                "properties": {
                "desktop": {
                    "type": "number",
                    "enum": [16, 18, 20, 28]
                },
                "mobile": {
                    "type": "number",
                    "enum": [16, 18, 20, 24, 28]
                }
                },
                "required": ["desktop", "mobile"]
            },
            "type": {
                "const": "typography"
            }
            },
            "required": ["value", "type"]
        },
        "lineHeightProperties": {
            "type": "object",
            "patternProperties": {
            "value": {
                "type": "object",
                "properties": {
                "desktop": {
                    "type": "number",
                    "enum": [24, 28, 32]
                },
                "mobile": {
                    "type": "number",
                    "enum": [24]
                }
                },
                "required": ["desktop", "mobile"]
            },
            "type": {
                "const": "typography"
            }
            },
            "required": ["value", "type"]
        }
    }
}

    return schema

# Extraer los nombres de colores
# color_names = extract_color_names(json_data)

# Generar el JSON Schema con los nombres de colores en el patrón
schema_with_colors = generate_json_schema_with_colors(color_names)

# Guardar el JSON Schema con los colores en el patrón en un archivo de salida
with open('tokens/schema/skin-schema-auto.json', 'w') as output_file:
    json.dump(schema_with_colors, output_file, indent=2)

# # Imprimir el JSON Schema con los colores en el patrón
# print(json.dumps(schema_with_colors, indent=2))

# # Validar el JSON original con el JSON Schema (opcional)
# jsonschema.validate(json_data, schema_with_colors)
