#!/usr/bin/env python3
"""
Script para diagnosticar la conexión a Sesame AI
"""
import os
import sys
import time
import base64

# Asegurarse de que podemos importar sesame_ai
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

print("Importando bibliotecas Sesame AI...")
try:
    from sesame_ai import SesameAI, SesameWebSocket, TokenManager
    print("✅ Bibliotecas importadas correctamente")
except ImportError as e:
    print(f"❌ Error importando bibliotecas: {e}")
    sys.exit(1)

# Configuración
TOKEN_FILE = "token.json"
CHARACTER = "Maya"

print(f"Verificando token en {TOKEN_FILE}...")
token_exists = os.path.exists(TOKEN_FILE)
print(f"{'✅' if token_exists else '❌'} Archivo de token {'existe' if token_exists else 'no existe'}")

if not token_exists:
    print("Generando nuevo token...")
    api_client = SesameAI()
    token_manager = TokenManager(api_client, token_file=TOKEN_FILE)
    try:
        token = token_manager.get_valid_token(force_new=True)
        print(f"✅ Nuevo token generado: {token[:10]}...")
    except Exception as e:
        print(f"❌ Error generando token: {e}")
        sys.exit(1)

print("Inicializando cliente Sesame AI...")
try:
    api_client = SesameAI()
    token_manager = TokenManager(api_client, token_file=TOKEN_FILE)
    token = token_manager.get_valid_token()
    print(f"✅ Token obtenido: {token[:10]}...")
except Exception as e:
    print(f"❌ Error obteniendo token: {e}")
    sys.exit(1)

print(f"Conectando a Sesame AI como {CHARACTER}...")

# Variables para tracking
received_audio = False
connection_success = False
audio_count = 0

# Callback para conexión
def on_connect():
    global connection_success
    print("✅ Conectado a Sesame AI")
    connection_success = True

# Callback para desconexión
def on_disconnect():
    print("Desconectado de Sesame AI")

try:
    ws = SesameWebSocket(
        id_token=token,
        character=CHARACTER
    )
    
    # Configurar callbacks
    ws.set_connect_callback(on_connect)
    ws.set_disconnect_callback(on_disconnect)
    
    # Conectar (bloqueante)
    if not ws.connect(blocking=True):
        print("❌ No se pudo conectar a Sesame AI")
        sys.exit(1)
    
    print("Esperando audio (10 segundos)...")
    start_time = time.time()
    
    while time.time() - start_time < 10:
        # Obtener audio
        audio = ws.get_next_audio_chunk(timeout=0.1)
        if audio:
            received_audio = True
            audio_count += 1
            audio_size = len(audio)
            print(f"✅ Audio recibido #{audio_count}: {audio_size} bytes")
            
            # Guardar un fragmento de audio para debug
            if audio_count == 1:
                audio_b64 = base64.b64encode(audio).decode('utf-8')
                with open("audio_sample.txt", "w") as f:
                    f.write(audio_b64[:100] + "...")
                print(f"Muestra de audio guardada en audio_sample.txt")
        
        time.sleep(0.1)
    
    # Desconectar
    ws.disconnect()
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Resultados
print("\n--- RESULTADOS DEL DIAGNÓSTICO ---")
print(f"{'✅' if connection_success else '❌'} Conexión exitosa: {connection_success}")
print(f"{'✅' if received_audio else '❌'} Audio recibido: {received_audio}")
print(f"Total fragmentos de audio: {audio_count}")

if connection_success and received_audio:
    print("\n✅ ¡Todo parece estar funcionando correctamente!")
else:
    print("\n❌ Hay problemas con la conexión a Sesame AI.")
    
    if not connection_success:
        print("- No se pudo establecer la conexión. Verifica el token y la conexión a internet.")
    elif not received_audio:
        print("- No se recibió audio. Sesame podría estar teniendo problemas.")