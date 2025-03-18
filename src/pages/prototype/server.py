#!/usr/bin/env python3
"""
Servidor que solo inicia voice_chat.py bajo demanda cuando alguien accede a la web
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys
import time
import json
import threading
import logging
import queue
import subprocess
import signal

# Configurar logging
logging.basicConfig(level=logging.INFO,
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('sesame_server')

# Obtener la ruta actual
current_dir = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Configuración
TOKEN_FILE = os.path.join(current_dir, "token.json")
CHARACTER = "Maya"
INPUT_DEVICE = 7  # Dispositivo de entrada que funciona
OUTPUT_DEVICE = 2  # Dispositivo de salida que funciona
welcome_message = "Hola, soy Maya de Movistar. ¿En qué puedo ayudarte hoy? Puedo recomendarte planes de fibra óptica según tus necesidades."

# Mensaje simulado para respuestas a la web
message_queue = queue.Queue()
message_queue.put(welcome_message)

# Mock plans data
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

# Variables para controlar el proceso de voice_chat.py
voice_chat_process = None
is_running = False
is_initialized = False
last_activity_time = time.time()
activity_timeout = 300  # 5 minutos sin actividad = cierre automático

# Función para ejecutar voice_chat.py como un proceso
def start_voice_chat_process():
    global voice_chat_process, is_running, is_initialized, last_activity_time
    
    # Si ya está en ejecución, no hacer nada pero actualizar el timestamp
    if is_running and voice_chat_process and voice_chat_process.poll() is None:
        logger.info("El proceso voice_chat.py ya está en ejecución")
        last_activity_time = time.time()
        return True
    
    # Asegurarnos de que el proceso anterior se ha cerrado
    stop_voice_chat_process()
    time.sleep(1)  # Dar tiempo a que se cierre completamente
    
    try:
        # Construir la ruta al script voice_chat.py
        script_path = os.path.join(current_dir, "sesame_ai", "examples", "voice_chat.py")
        
        if not os.path.exists(script_path):
            logger.error(f"Script no encontrado: {script_path}")
            return False
        
        logger.info(f"Iniciando script {script_path}...")
        
        # Construir comando con los dispositivos correctos
        cmd = [
            sys.executable,  # Usa el mismo intérprete de Python que está ejecutando este script
            script_path,
            "--character", CHARACTER,
            "--input-device", str(INPUT_DEVICE),
            "--output-device", str(OUTPUT_DEVICE),
            "--token-file", TOKEN_FILE
        ]
        
        # Ejecutar en proceso separado
        voice_chat_process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            stdin=subprocess.PIPE,  # Añadimos entrada estándar para poder enviar comandos
            text=True,
            bufsize=1  # Línea por línea buffering
        )
        
        # Verificar si el proceso se inició correctamente
        if voice_chat_process.poll() is None:
            logger.info("Proceso iniciado correctamente")
            is_running = True
            is_initialized = False
            last_activity_time = time.time()
            
            # Iniciar hilo para leer la salida del proceso
            threading.Thread(target=read_process_output, daemon=True).start()
            
            # Iniciar hilo para monitorear inactividad
            threading.Thread(target=monitor_inactivity, daemon=True).start()
            
            # Esperar a que se inicialice (máximo 10 segundos)
            start_time = time.time()
            while not is_initialized and time.time() - start_time < 10:
                time.sleep(0.5)
                
                # Si el proceso ha terminado, algo salió mal
                if voice_chat_process.poll() is not None:
                    stderr = voice_chat_process.stderr.read()
                    logger.error(f"El proceso terminó prematuramente: {stderr}")
                    is_running = False
                    return False
            
            # Si llegamos aquí pero no se ha inicializado, seguimos adelante
            # ya que podría estar esperando input del usuario
            if not is_initialized:
                logger.warning("Timeout esperando inicialización, continuando de todos modos")
            
            # Tratar de enviar un Enter para que comience la conversación
            try:
                voice_chat_process.stdin.write("\n")
                voice_chat_process.stdin.flush()
                logger.info("Enviado Enter para comenzar conversación")
            except Exception as e:
                logger.error(f"Error enviando Enter: {e}")
            
            return True
        else:
            returncode = voice_chat_process.poll()
            stderr = voice_chat_process.stderr.read()
            logger.error(f"Error iniciando proceso. Código: {returncode}, Error: {stderr}")
            return False
        
    except Exception as e:
        logger.error(f"Error iniciando voice_chat.py: {e}", exc_info=True)
        return False

# Monitorear inactividad y cerrar el proceso después de un tiempo
def monitor_inactivity():
    global is_running, last_activity_time
    
    while is_running:
        # Comprobar tiempo de inactividad
        if time.time() - last_activity_time > activity_timeout:
            logger.info(f"Inactividad detectada ({activity_timeout} segundos). Cerrando proceso...")
            stop_voice_chat_process()
            break
        
        time.sleep(10)  # Comprobar cada 10 segundos

# Leer la salida del proceso
def read_process_output():
    global voice_chat_process, is_running, is_initialized
    
    while is_running and voice_chat_process and voice_chat_process.poll() is None:
        try:
            # Leer una línea de la salida estándar
            line = voice_chat_process.stdout.readline().strip()
            if line:
                logger.info(f"Voice Chat: {line}")
                
                # Detectar mensajes específicos para saber cuándo está listo
                if "Voice chat with Maya started!" in line:
                    is_initialized = True
                    logger.info("¡Voice chat inicializado correctamente!")
        except Exception as e:
            logger.error(f"Error leyendo salida: {e}")
            time.sleep(0.1)
    
    # Si llegamos aquí, el proceso ha terminado
    is_running = False
    logger.info("Proceso voice_chat.py finalizado")

# Detener el proceso voice_chat.py
def stop_voice_chat_process():
    global voice_chat_process, is_running, is_initialized
    
    if voice_chat_process and voice_chat_process.poll() is None:
        logger.info("Deteniendo proceso voice_chat.py...")
        
        # Intentar cierre graceful primero
        try:
            # Enviar señal SIGINT (equivalente a Ctrl+C)
            if sys.platform == 'win32':
                voice_chat_process.send_signal(signal.CTRL_C_EVENT)
            else:
                voice_chat_process.send_signal(signal.SIGINT)
                
            # Esperar a que termine (con timeout)
            try:
                voice_chat_process.wait(timeout=3)
            except subprocess.TimeoutExpired:
                logger.warning("Timeout esperando cierre graceful, terminando...")
                voice_chat_process.terminate()
                try:
                    voice_chat_process.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    logger.warning("Timeout esperando terminación, forzando...")
                    voice_chat_process.kill()
        except Exception as e:
            logger.error(f"Error cerrando proceso: {e}")
            # Intentar forzar el cierre si falla el cierre graceful
            try:
                voice_chat_process.kill()
            except:
                pass
        
        is_running = False
        is_initialized = False
        logger.info("Proceso detenido")

# Registrar actividad para mantener el proceso vivo
def register_activity():
    global last_activity_time
    last_activity_time = time.time()

# Enviar texto al proceso voice_chat.py (simulación de entrada de usuario)
def send_text_to_voice_chat(text):
    global voice_chat_process, is_running
    
    # Registrar actividad
    register_activity()
    
    if not is_running or not voice_chat_process or voice_chat_process.poll() is not None:
        logger.warning("No se puede enviar texto: voice_chat.py no está en ejecución")
        return False
    
    try:
        # Intentar enviar texto seguido de un Enter
        voice_chat_process.stdin.write(text + "\n")
        voice_chat_process.stdin.flush()
        logger.info(f"Texto enviado a voice_chat.py: {text}")
        return True
    except Exception as e:
        logger.error(f"Error enviando texto a voice_chat.py: {e}")
        return False

# Endpoints
@app.route('/health', methods=['GET'])
def health_check():
    """Verificar que el servidor está funcionando"""
    global is_running, is_initialized
    
    # No iniciar el proceso aquí, solo informar del estado
    status = {
        'status': 'ok',
        'sesame_connected': is_running,
        'sesame_initialized': is_initialized,
        'message_queue_size': message_queue.qsize()
    }
    return jsonify(status)

@app.route('/api/welcome', methods=['GET'])
def get_welcome():
    """Obtener mensaje de bienvenida e iniciar voice_chat.py bajo demanda"""
    global is_running
    
    # Aquí es donde iniciamos el proceso cuando alguien accede a la web
    if not is_running:
        if not start_voice_chat_process():
            return jsonify({
                'error': 'No se pudo iniciar voice_chat.py',
                'text': 'Error conectando con Sesame AI',
                'plans': []
            }), 500
    else:
        # Si ya está corriendo, registrar actividad
        register_activity()
    
    # Dar un empujón adicional para que salude
    threading.Thread(target=lambda: time.sleep(1) and send_text_to_voice_chat("hola"), daemon=True).start()
    
    # Devolver mensaje y planes
    return jsonify({
        'text': welcome_message,
        'plans': fiber_plans
    })

@app.route('/api/query', methods=['POST'])
def process_query():
    """Procesar consulta de texto y enviarla a voice_chat.py"""
    data = request.json
    text = data.get('text', '')
    logger.info(f"Recibido texto: {text}")
    
    # Registrar actividad
    register_activity()
    
    # Asegurarse de que voice_chat.py está ejecutándose
    if not is_running:
        if not start_voice_chat_process():
            return jsonify({
                'error': 'No se pudo iniciar voice_chat.py',
                'text': 'Error conectando con Sesame AI',
                'plans': []
            }), 500
    
    # Enviar texto a voice_chat.py
    send_text_to_voice_chat(text)
    
    # Simulación de respuesta basada en palabras clave
    text_lower = text.lower()
    plans = []
    
    if ("hola" in text_lower or 
        "buenos días" in text_lower or 
        "buenas" in text_lower):
        response_text = welcome_message
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
    
    # Añadir a la cola de mensajes
    message_queue.put(response_text)
    
    return jsonify({
        'text': response_text,
        'plans': plans
    })

@app.route('/api/select-plan', methods=['POST'])
def select_plan():
    """Manejar selección de plan"""
    data = request.json
    plan = data.get('plan', {})
    
    # Registrar actividad
    register_activity()
    
    if not plan:
        return jsonify({'error': 'No se recibió información del plan'}), 400
    
    response_text = f"Has seleccionado el plan {plan.get('title')} por {plan.get('price')}. ¡Excelente elección! Este plan incluye {plan.get('description')}. ¿Deseas proceder con la contratación o tienes alguna otra pregunta?"
    
    # Enviar a voice_chat.py
    send_text_to_voice_chat(f"Me gusta el plan {plan.get('title')}")
    
    # Añadir a la cola de mensajes
    message_queue.put(response_text)
    
    return jsonify({
        'text': response_text
    })

@app.route('/restart', methods=['GET'])
def restart_voice_chat():
    """Endpoint para reiniciar voice_chat.py"""
    stop_voice_chat_process()
    time.sleep(1)
    success = start_voice_chat_process()
    
    return jsonify({
        'success': success,
        'message': "Proceso reiniciado" if success else "Error reiniciando proceso"
    })

@app.route('/stop', methods=['GET'])
def stop_voice_chat():
    """Endpoint para detener voice_chat.py"""
    stop_voice_chat_process()
    
    return jsonify({
        'success': True,
        'message': "Proceso detenido"
    })

# Manejar cierre del servidor
def cleanup():
    logger.info("Limpiando recursos...")
    stop_voice_chat_process()

# Registrar función de limpieza para que se ejecute al salir
import atexit
atexit.register(cleanup)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Servidor iniciado en puerto {port}")
    print(f"Usando dispositivo de entrada: {INPUT_DEVICE}, dispositivo de salida: {OUTPUT_DEVICE}")
    print(f"Inactividad máxima: {activity_timeout} segundos")
    print("El proceso voice_chat.py se iniciará cuando alguien acceda a la web")
    
    try:
        app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
    finally:
        cleanup()