import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

# Cargar variables de entorno
load_dotenv()

# Configuración de Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://axfcmtrhsvmtzqqhxwul.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZmNtdHJoc3ZtdHpxcWh4d3VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzgyMDY0MCwiZXhwIjoyMDU5Mzk2NjQwfQ.ZauKEBezAmiV0gaKVcQEdTh3Mjnw_awMb3jlAWOGbww")

# Modelos de datos
class Usuario(BaseModel):
    id: Optional[str] = None
    nombre: str
    email: str
    negocio: str
    plan: str = "free"
    fecha_registro: Optional[str] = None
    link_clon: Optional[str] = None

class Credito(BaseModel):
    id: Optional[int] = None
    usuario_id: str
    cantidad: int
    tipo: str = "standard"

class AccionUsuario(BaseModel):
    id: Optional[int] = None
    usuario_id: str
    tipo_accion: str
    fecha: Optional[str] = None
    detalles: Optional[Dict[str, Any]] = None

class Referido(BaseModel):
    id: Optional[int] = None
    usuario_id: str
    codigo_referido: str
    email_referido: Optional[str] = None
    estado: str = "pendiente"

class SupabaseManager:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Métodos para Usuarios
    async def crear_usuario(self, usuario: Usuario) -> Dict[str, Any]:
        """Crea un nuevo usuario en Supabase"""
        response = self.supabase.table('usuarios').insert(usuario.dict(exclude_none=True)).execute()
        if len(response.data) > 0:
            return response.data[0]
        return {}
    
    async def obtener_usuario(self, usuario_id: str) -> Dict[str, Any]:
        """Obtiene un usuario por su ID"""
        response = self.supabase.table('usuarios').select('*').eq('id', usuario_id).execute()
        if len(response.data) > 0:
            return response.data[0]
        return {}
    
    async def obtener_usuario_por_email(self, email: str) -> Dict[str, Any]:
        """Obtiene un usuario por su email"""
        response = self.supabase.table('usuarios').select('*').eq('email', email).execute()
        if len(response.data) > 0:
            return response.data[0]
        return {}
    
    async def actualizar_usuario(self, usuario_id: str, datos: Dict[str, Any]) -> Dict[str, Any]:
        """Actualiza los datos de un usuario"""
        response = self.supabase.table('usuarios').update(datos).eq('id', usuario_id).execute()
        if len(response.data) > 0:
            return response.data[0]
        return {}
    
    async def actualizar_link_clon(self, usuario_id: str, link_clon: str) -> Dict[str, Any]:
        """Actualiza el link del clon de un usuario"""
        return await self.actualizar_usuario(usuario_id, {"link_clon": link_clon})
    
    # Métodos para Créditos
    async def crear_creditos(self, credito: Credito) -> Dict[str, Any]:
        """Crea créditos para un usuario"""
        response = self.supabase.table('creditos').insert(credito.dict(exclude_none=True)).execute()
        if len(response.data) > 0:
            return response.data[0]
        return {}
    
    async def obtener_creditos(self, usuario_id: str) -> Dict[str, Any]:
        """Obtiene los créditos de un usuario"""
        response = self.supabase.table('creditos').select('*').eq('usuario_id', usuario_id).execute()
        if len(response.data) > 0:
            return response.data[0]
        return {}
    
    async def actualizar_creditos(self, usuario_id: str, cantidad: int) -> Dict[str, Any]:
        """Actualiza la cantidad de créditos de un usuario"""
        creditos = await self.obtener_creditos(usuario_id)
        if creditos:
            response = self.supabase.table('creditos').update({"cantidad": cantidad}).eq('id', creditos["id"]).execute()
            if len(response.data) > 0:
                return response.data[0]
        return {}
    
    # Métodos para Acciones de Usuario
    async def registrar_accion(self, accion: AccionUsuario) -> Dict[str, Any]:
        """Registra una acción realizada por un usuario"""
        response = self.supabase.table('acciones_usuarios').insert(accion.dict(exclude_none=True)).execute()
        if len(response.data) > 0:
            return response.data[0]
        return {}
    
    async def obtener_acciones(self, usuario_id: str) -> List[Dict[str, Any]]:
        """Obtiene todas las acciones de un usuario"""
        response = self.supabase.table('acciones_usuarios').select('*').eq('usuario_id', usuario_id).execute()
        return response.data
    
    # Métodos para Referidos
    async def crear_referido(self, referido: Referido) -> Dict[str, Any]:
        """Crea un nuevo referido"""
        response = self.supabase.table('referidos').insert(referido.dict(exclude_none=True)).execute()
        if len(response.data) > 0:
            return response.data[0]
        return {}
    
    async def obtener_referidos(self, usuario_id: str) -> List[Dict[str, Any]]:
        """Obtiene todos los referidos de un usuario"""
        response = self.supabase.table('referidos').select('*').eq('usuario_id', usuario_id).execute()
        return response.data
    
    async def actualizar_estado_referido(self, referido_id: int, estado: str) -> Dict[str, Any]:
        """Actualiza el estado de un referido"""
        response = self.supabase.table('referidos').update({"estado": estado}).eq('id', referido_id).execute()
        if len(response.data) > 0:
            return response.data[0]
        return {}

# Instancia global para usar en la aplicación
supabase_manager = SupabaseManager()
