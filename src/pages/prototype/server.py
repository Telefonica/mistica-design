# simple_server.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import os
import logging
import time
import threading

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Configurar logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('sesame_server')

# Mock plans data (en una implementación real, estos vendrían de una API o base de datos)
fiber_plans = [
    {
        "id": "plan1",
        "title": "Fibra 600 Mb y 2 líneas móviles 35 GB",
        "price": "52,90 €/mes",
        "description": "Velocidad simétrica, sin permanencia",
    },
    {
        "id": "plan2",
        "title": "Fibra 1 Gb y 2 líneas móviles ilimitadas",
        "price": "64,90 €/mes",
        "description": "Máxima velocidad, sin permanencia",
    },
    {
        "id": "plan3",
        "title": "Fibra 300 Mb y 1 línea móvil 25 GB",
        "price": "42,90 €/mes",
        "description": "Ideal para uso individual, sin permanencia",
    },
]

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return jsonify({'status': 'ok'})

@app.route('/api/welcome', methods=['GET'])
def welcome_message():
    """Obtener el mensaje de bienvenida inicial"""
    response = {
        'text': "Hola, soy Maya de Movistar. ¿En qué puedo ayudarte hoy? Puedo recomendarte planes de fibra óptica según tus necesidades.",
        'plans': fiber_plans
    }
    return jsonify(response)

@app.route('/api/query', methods=['POST'])
def process_query():
    """Procesar una consulta del usuario"""
    data = request.json
    text = data.get('text', '')
    logger.info(f"Recibido texto del usuario: {text}")
    
    # Simulación de respuesta basada en palabras clave (como en el componente original)
    response = {}
    plans = []
    
    # Análisis básico de palabras clave
    text_lower = text.lower()
    
    if ("hola" in text_lower or 
        "buenos días" in text_lower or 
        "buenas" in text_lower):
        response_text = "Hola, soy Maya de Movistar. ¿En qué puedo ayudarte hoy? Puedo recomendarte planes de fibra óptica según tus necesidades."
    elif ("fibra" in text_lower or 
          "internet" in text_lower or 
          "planes" in text_lower):
        response_text = "Tenemos excelentes planes de fibra óptica. Te muestro algunas opciones que podrían interesarte:"
        plans = fiber_plans
    elif ("más rápido" in text_lower or 
          "velocidad" in text_lower or 
          "1 gb" in text_lower):
        response_text = "Nuestro plan más rápido es el de Fibra 1 Gb con líneas móviles ilimitadas:"
        plans = [fiber_plans[1]]
    elif ("económico" in text_lower or 
          "barato" in text_lower or 
          "precio" in text_lower):
        response_text = "Te recomiendo nuestro plan más económico:"
        plans = [fiber_plans[2]]
    elif ("familia" in text_lower or 
          "varias líneas" in text_lower or 
          "hijos" in text_lower):
        response_text = "Para familias, recomiendo nuestros planes con múltiples líneas móviles:"
        plans = [fiber_plans[0], fiber_plans[1]]
    else:
        response_text = "Disculpa, no he entendido tu consulta. ¿Podrías decirme qué tipo de plan de internet estás buscando?"
    
    return jsonify({
        'text': response_text,
        'plans': plans
    })

@app.route('/api/select-plan', methods=['POST'])
def select_plan():
    """Procesar la selección de un plan"""
    data = request.json
    plan = data.get('plan', {})
    
    if not plan:
        return jsonify({'error': 'No se recibió información del plan'}), 400
    
    response_text = f"Has seleccionado el plan {plan.get('title')} por {plan.get('price')}. ¡Excelente elección! Este plan incluye {plan.get('description')}. ¿Deseas proceder con la contratación o tienes alguna otra pregunta?"
    
    return jsonify({
        'text': response_text
    })

if __name__ == '__main__':
    # Determinar el puerto (usar variable de entorno PORT si está disponible, o 5000 por defecto)
    port = int(os.environ.get('PORT', 5000))
    
    print(f"Iniciando servidor Sesame AI simplificado en el puerto {port}...")
    
    # Ejecutar el servidor con modo debug y permitir conexiones externas
    app.run(host='0.0.0.0', port=port, debug=True)