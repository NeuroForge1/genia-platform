import os
from fastapi import FastAPI, HTTPException, Depends, Request, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn
from dotenv import load_dotenv
import asyncio
import sys
import stripe
from datetime import datetime, timedelta

# Añadir el directorio de clones al path para importar
sys.path.append('/home/ubuntu/genia_ecosystem')
from clones.genia_clones import GeniaCloneFactory
from backend.supabase_manager import supabase_manager, Usuario, Credito, AccionUsuario, Referido

# Cargar variables de entorno
load_dotenv()

# Configurar Stripe
stripe.api_key = os.getenv("STRIPE_API_KEY", "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")

# Crear la aplicación FastAPI
app = FastAPI(title="GENIA Backend API", description="API para el ecosistema GENIA")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, limitar a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos adicionales
class MessageRequest(BaseModel):
    user_id: str
    message: str
    clone_type: str = "ceo"  # Por defecto, usar GENIA CEO

class MessageResponse(BaseModel):
    response: str
    clone_type: str

class RegistroRequest(BaseModel):
    nombre: str
    email: str
    negocio: str
    codigo_referido: Optional[str] = None

class LoginRequest(BaseModel):
    email: str

class StripeCheckoutRequest(BaseModel):
    user_id: str
    plan: str  # "starter", "pro", "elite"

# Almacenamiento en memoria para los clones activos de usuarios
user_clones = {}

# Función para inicializar clones de un usuario
def initialize_user_clones(user_id: str, plan: str):
    user_clones[user_id] = {
        "ceo": GeniaCloneFactory.create_clone("ceo"),
        "funnel": GeniaCloneFactory.create_clone("funnel") if plan in ["pro", "elite"] else None,
        "content": GeniaCloneFactory.create_clone("content") if plan == "elite" else None,
        "bot": GeniaCloneFactory.create_clone("bot") if plan == "elite" else None
    }

# Endpoints
@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de GENIA"}

@app.post("/registro")
async def registro(request: RegistroRequest, background_tasks: BackgroundTasks):
    # Verificar si el usuario ya existe
    usuario_existente = await supabase_manager.obtener_usuario_por_email(request.email)
    if usuario_existente:
        return JSONResponse(
            status_code=400,
            content={"error": "El email ya está registrado"}
        )
    
    # Crear nuevo usuario
    fecha_registro = datetime.now().isoformat()
    nuevo_usuario = Usuario(
        nombre=request.nombre,
        email=request.email,
        negocio=request.negocio,
        plan="free",  # Plan inicial gratuito
        fecha_registro=fecha_registro,
        link_clon=""  # Se actualizará después del despliegue
    )
    
    usuario_creado = await supabase_manager.crear_usuario(nuevo_usuario)
    if not usuario_creado:
        raise HTTPException(status_code=500, detail="Error al crear usuario")
    
    user_id = usuario_creado.get("id")
    
    # Asignar créditos iniciales
    creditos_iniciales = Credito(
        usuario_id=user_id,
        cantidad=5,
        tipo="standard"
    )
    await supabase_manager.crear_creditos(creditos_iniciales)
    
    # Registrar acción de registro
    accion_registro = AccionUsuario(
        usuario_id=user_id,
        tipo_accion="registro",
        fecha=fecha_registro,
        detalles={"origen": "formulario_web"}
    )
    await supabase_manager.registrar_accion(accion_registro)
    
    # Procesar código de referido si existe
    if request.codigo_referido:
        # Buscar referido en la base de datos
        # Implementar lógica de referidos aquí
        pass
    
    # Inicializar clones para este usuario
    initialize_user_clones(user_id, "free")
    
    # Generar link de acceso (en producción, este sería un enlace real al panel)
    link_clon = f"https://genia-platform.vercel.app/panel/{user_id}"
    await supabase_manager.actualizar_link_clon(user_id, link_clon)
    
    # Enviar email de bienvenida (tarea en segundo plano)
    # background_tasks.add_task(enviar_email_bienvenida, request.email, request.nombre, link_clon)
    
    return {
        "status": "success",
        "message": "Usuario registrado correctamente",
        "user_id": user_id,
        "link_clon": link_clon
    }

@app.post("/login")
async def login(request: LoginRequest):
    usuario = await supabase_manager.obtener_usuario_por_email(request.email)
    if not usuario:
        return JSONResponse(
            status_code=404,
            content={"error": "Usuario no encontrado"}
        )
    
    user_id = usuario.get("id")
    
    # Inicializar clones si no existen
    if user_id not in user_clones:
        initialize_user_clones(user_id, usuario.get("plan", "free"))
    
    # Registrar acción de login
    accion_login = AccionUsuario(
        usuario_id=user_id,
        tipo_accion="login",
        fecha=datetime.now().isoformat(),
        detalles={"metodo": "email"}
    )
    await supabase_manager.registrar_accion(accion_login)
    
    return {
        "status": "success",
        "user_id": user_id,
        "nombre": usuario.get("nombre"),
        "email": usuario.get("email"),
        "negocio": usuario.get("negocio"),
        "plan": usuario.get("plan"),
        "link_clon": usuario.get("link_clon")
    }

@app.post("/chat")
async def chat_with_clone(request: MessageRequest):
    user_id = request.user_id
    
    # Verificar que el usuario existe
    usuario = await supabase_manager.obtener_usuario(user_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Inicializar clones si no existen
    if user_id not in user_clones:
        initialize_user_clones(user_id, usuario.get("plan", "free"))
    
    # Verificar que el clon solicitado existe para este usuario
    if request.clone_type not in user_clones[user_id] or user_clones[user_id][request.clone_type] is None:
        raise HTTPException(status_code=403, detail="Clon no disponible para este usuario")
    
    # Obtener el clon y generar respuesta
    clone = user_clones[user_id][request.clone_type]
    
    try:
        # Registrar acción de chat
        accion_chat = AccionUsuario(
            usuario_id=user_id,
            tipo_accion="chat",
            fecha=datetime.now().isoformat(),
            detalles={"clone_type": request.clone_type, "message": request.message[:100]}
        )
        await supabase_manager.registrar_accion(accion_chat)
        
        # Generar respuesta
        response = await clone.generate_response(request.message, usuario)
        return {
            "response": response,
            "clone_type": request.clone_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar respuesta: {str(e)}")

@app.get("/available_clones/{user_id}")
async def get_available_clones(user_id: str):
    usuario = await supabase_manager.obtener_usuario(user_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Inicializar clones si no existen
    if user_id not in user_clones:
        initialize_user_clones(user_id, usuario.get("plan", "free"))
    
    # Filtrar clones disponibles (no None)
    available = [clone_type for clone_type, clone in user_clones[user_id].items() if clone is not None]
    return {"available_clones": available}

@app.post("/reset_conversation/{user_id}/{clone_type}")
async def reset_conversation(user_id: str, clone_type: str):
    usuario = await supabase_manager.obtener_usuario(user_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Inicializar clones si no existen
    if user_id not in user_clones:
        initialize_user_clones(user_id, usuario.get("plan", "free"))
    
    if clone_type not in user_clones[user_id] or user_clones[user_id][clone_type] is None:
        raise HTTPException(status_code=404, detail="Clon no encontrado")
    
    user_clones[user_id][clone_type].clear_history()
    
    # Registrar acción
    accion_reset = AccionUsuario(
        usuario_id=user_id,
        tipo_accion="reset_conversation",
        fecha=datetime.now().isoformat(),
        detalles={"clone_type": clone_type}
    )
    await supabase_manager.registrar_accion(accion_reset)
    
    return {"status": "success", "message": "Conversación reiniciada"}

@app.post("/create_checkout_session")
async def create_checkout_session(request: StripeCheckoutRequest):
    usuario = await supabase_manager.obtener_usuario(request.user_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Mapeo de planes a precios de Stripe
    plan_prices = {
        "starter": "price_1RAQd300gy6Lj7juJu4s9bMw",  # $9.99/semana
        "pro": "price_1RAQd300gy6Lj7jun4td98fG",      # $29.99/mes
        "elite": "price_1RAQd300gy6Lj7juHoinS6N4"     # $99.99/mes
    }
    
    if request.plan not in plan_prices:
        raise HTTPException(status_code=400, detail="Plan no válido")
    
    try:
        # Crear sesión de checkout en Stripe
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price": plan_prices[request.plan],
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=f"https://genia-platform.vercel.app/success?session_id={{CHECKOUT_SESSION_ID}}&user_id={request.user_id}",
            cancel_url=f"https://genia-platform.vercel.app/cancel?user_id={request.user_id}",
            client_reference_id=request.user_id,
            customer_email=usuario.get("email")
        )
        
        # Registrar acción
        accion_checkout = AccionUsuario(
            usuario_id=request.user_id,
            tipo_accion="checkout_iniciado",
            fecha=datetime.now().isoformat(),
            detalles={"plan": request.plan, "session_id": checkout_session.id}
        )
        await supabase_manager.registrar_accion(accion_checkout)
        
        return {"checkout_url": checkout_session.url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear sesión de checkout: {str(e)}")

@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_your_webhook_secret")
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Manejar eventos de Stripe
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id = session.get("client_reference_id")
        
        if user_id:
            # Actualizar plan del usuario
            subscription = stripe.Subscription.retrieve(session.get("subscription"))
            plan_id = subscription.items.data[0].price.id
            
            # Mapeo de precios de Stripe a planes
            price_plans = {
                "price_1RAQd300gy6Lj7juJu4s9bMw": "starter",
                "price_1RAQd300gy6Lj7jun4td98fG": "pro",
                "price_1RAQd300gy6Lj7juHoinS6N4": "elite"
            }
            
            plan = price_plans.get(plan_id, "free")
            
            # Actualizar plan en Supabase
            await supabase_manager.actualizar_usuario(user_id, {"plan": plan})
            
            # Reinicializar clones para reflejar el nuevo plan
            if user_id in user_clones:
                initialize_user_clones(user_id, plan)
            
            # Registrar acción
            accion_upgrade = AccionUsuario(
                usuario_id=user_id,
                tipo_accion="upgrade_plan",
                fecha=datetime.now().isoformat(),
                detalles={"plan": plan, "subscription_id": subscription.id}
            )
            await supabase_manager.registrar_accion(accion_upgrade)
    
    return {"status": "success"}

@app.get("/user_stats/{user_id}")
async def get_user_stats(user_id: str):
    usuario = await supabase_manager.obtener_usuario(user_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener créditos
    creditos = await supabase_manager.obtener_creditos(user_id)
    
    # Obtener acciones
    acciones = await supabase_manager.obtener_acciones(user_id)
    
    # Calcular estadísticas
    total_chats = sum(1 for accion in acciones if accion.get("tipo_accion") == "chat")
    
    # Contar acciones por tipo de clon
    chats_por_clon = {}
    for accion in acciones:
        if accion.get("tipo_accion") == "chat" and accion.get("detalles") and "clone_type" in accion.get("detalles", {}):
            clone_type = accion["detalles"]["clone_type"]
            chats_por_clon[clone_type] = chats_por_clon.get(clone_type, 0) + 1
    
    return {
        "user_id": user_id,
        "nombre": usuario.get("nombre"),
        "plan": usuario.get("plan"),
        "creditos": creditos.get("cantidad", 0) if creditos else 0,
        "total_chats": total_chats,
        "chats_por_clon": chats_por_clon,
        "fecha_registro": usuario.get("fecha_registro")
    }

# Punto de entrada para ejecución directa
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
