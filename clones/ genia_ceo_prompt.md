import os
import openai
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configurar OpenAI API
openai.api_key = os.getenv("OPENAI_API_KEY")

class GeniaClone:
    def __init__(self, name, prompt_file):
        self.name = name
        self.prompt_file = prompt_file
        self.system_prompt = self._load_prompt()
        self.conversation_history = []
        
    def _load_prompt(self):
        """Carga el prompt del archivo de configuración"""
        try:
            with open(self.prompt_file, 'r') as file:
                return file.read()
        except Exception as e:
            print(f"Error al cargar el prompt para {self.name}: {e}")
            return ""
    
    async def generate_response(self, user_input, user_info=None):
        """Genera una respuesta utilizando OpenAI GPT-4"""
        # Personalizar el prompt con información del usuario si está disponible
        personalized_prompt = self.system_prompt
        if user_info:
            personalized_prompt = personalized_prompt.replace("[NOMBRE_USUARIO]", user_info.get("nombre", ""))
            personalized_prompt = personalized_prompt.replace("[NEGOCIO_USUARIO]", user_info.get("negocio", ""))
        
        # Actualizar historial de conversación
        self.conversation_history.append({"role": "user", "content": user_input})
        
        try:
            # Crear mensajes para la API de OpenAI
            messages = [
                {"role": "system", "content": personalized_prompt}
            ]
            
            # Añadir historial de conversación (limitado a las últimas 10 interacciones)
            messages.extend(self.conversation_history[-10:])
            
            # Llamar a la API de OpenAI
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
                top_p=1.0,
                frequency_penalty=0.0,
                presence_penalty=0.0
            )
            
            # Extraer y guardar la respuesta
            assistant_response = response.choices[0].message.content
            self.conversation_history.append({"role": "assistant", "content": assistant_response})
            
            return assistant_response
            
        except Exception as e:
            error_msg = f"Error al generar respuesta con {self.name}: {e}"
            print(error_msg)
            return error_msg
    
    def clear_history(self):
        """Limpia el historial de conversación"""
        self.conversation_history = []

class GeniaCloneFactory:
    @staticmethod
    def create_clone(clone_type, base_path="/home/ubuntu/genia_ecosystem/clones"):
        """Crea una instancia del clon especificado"""
        clone_configs = {
            "ceo": {
                "name": "GENIA CEO",
                "prompt_file": f"{base_path}/genia_ceo_prompt.md"
            },
            "funnel": {
                "name": "GENIA Funnel",
                "prompt_file": f"{base_path}/genia_funnel_prompt.md"
            },
            "content": {
                "name": "GENIA Content",
                "prompt_file": f"{base_path}/genia_content_prompt.md"
            },
            "bot": {
                "name": "GENIA Bot",
                "prompt_file": f"{base_path}/genia_bot_prompt.md"
            }
        }
        
        if clone_type not in clone_configs:
            raise ValueError(f"Tipo de clon no válido: {clone_type}")
        
        config = clone_configs[clone_type]
        return GeniaClone(config["name"], config["prompt_file"])

# Ejemplo de uso:
# async def test_clone():
#     factory = GeniaCloneFactory()
#     ceo_clone = factory.create_clone("ceo")
#     response = await ceo_clone.generate_response("¿Cómo puedo mejorar mi embudo de ventas?")
#     print(response)
