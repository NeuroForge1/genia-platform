import os
from dotenv import load_dotenv
import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import sys

# Cargar variables de entorno
load_dotenv()

# Crear la aplicación FastAPI
app = FastAPI(title="GENIA Backend Deployment", description="Servicio de despliegue para el ecosistema GENIA")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, limitar a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta para verificar el estado del servicio
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "GENIA Backend Deployment",
        "version": "1.0.0"
    }

# Ruta para verificar las variables de entorno (sin mostrar valores sensibles)
@app.get("/config")
async def config():
    return {
        "environment": os.getenv("ENVIRONMENT", "development"),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
        "supabase_configured": bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_KEY")),
        "stripe_configured": bool(os.getenv("STRIPE_API_KEY")),
        "port": os.getenv("PORT", "8000")
    }

# Función para iniciar el servidor principal en un proceso separado
def start_main_server():
    try:
        # Construir el comando para iniciar el servidor principal
        cmd = [
            sys.executable,
            "/home/ubuntu/genia_ecosystem/backend/main.py"
        ]
        
        # Iniciar el proceso
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        print(f"Servidor principal iniciado con PID: {process.pid}")
        return process
    except Exception as e:
        print(f"Error al iniciar el servidor principal: {e}")
        return None

# Punto de entrada para ejecución directa
if __name__ == "__main__":
    # Iniciar el servidor principal en un proceso separado
    main_server_process = start_main_server()
    
    # Iniciar el servidor de despliegue
    port = int(os.getenv("DEPLOY_PORT", 8080))
    uvicorn.run("deploy:app", host="0.0.0.0", port=port, reload=False)
