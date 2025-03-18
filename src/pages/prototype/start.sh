#!/bin/bash

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}======= Iniciando Sesame AI Integration =======${NC}"

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 no está instalado. Por favor, instálalo primero.${NC}"
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm no está instalado. Por favor, instálalo primero.${NC}"
    exit 1
fi

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creando entorno virtual...${NC}"
    python3 -m venv venv
fi

# Activar entorno virtual
echo -e "${YELLOW}Activando entorno virtual...${NC}"
source venv/bin/activate

# Instalar dependencias de Python
echo -e "${YELLOW}Instalando dependencias de Python...${NC}"
pip install -r requirements.txt

# Iniciar el servidor Flask en segundo plano
echo -e "${YELLOW}Iniciando servidor Flask en puerto 5000...${NC}"
cd src/pages/prototype
python server.py &
SERVER_PID=$!

# Esperar a que el servidor esté listo
echo -e "${YELLOW}Esperando a que el servidor esté listo...${NC}"
sleep 5

# Iniciar la aplicación React
echo -e "${YELLOW}Iniciando aplicación React...${NC}"
cd ../../..
npm start &
REACT_PID=$!

# Función para manejar la terminación del script
cleanup() {
    echo -e "${YELLOW}Deteniendo procesos...${NC}"
    kill $SERVER_PID
    kill $REACT_PID
    echo -e "${GREEN}Procesos detenidos correctamente.${NC}"
    exit 0
}

# Capturar señales de terminación
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}======= Sesame AI Integration iniciado correctamente =======${NC}"
echo -e "${GREEN}Servidor Flask corriendo en: http://localhost:5000${NC}"
echo -e "${GREEN}Aplicación React corriendo en: http://localhost:3000${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para detener todos los servicios${NC}"

# Mantener el script ejecutándose
wait