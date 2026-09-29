from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Usuario


# ==============================
# INICIALIZAÇÃO DO BANCO
# ==============================

Base.metadata.create_all(bind=engine)


# ==============================
# APLICAÇÃO FASTAPI
# ==============================

app = FastAPI()


# ==============================
# CONFIGURAÇÃO CORS
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# MODELOS DE AUTENTICAÇÃO
# ==============================

class CadastroRequest(BaseModel):
    nome: str
    email: str
    senha: str
    perfil: str = "usuario"


class LoginRequest(BaseModel):
    email: str
    senha: str


# ==============================
# ESTADO ATUAL DO RETRACTA
# ==============================

varal = "aberto"
chuva = False
temperatura = 24
umidade = 45

# Histórico de eventos
eventos = []

# Início do período atual de exposição
inicio_exposicao = datetime.now()

# Tempo total acumulado com o varal aberto
tempo_exposto_total = 0


# ==============================
# LIMITES DOS SENSORES
# ==============================

LIMITE_TEMPERATURA = 16
LIMITE_UMIDADE = 85


# ==============================
# REGISTRAR EVENTO
# ==============================

def registrar_evento(tipo, descricao):

    eventos.append({
        "tipo": tipo,
        "descricao": descricao,
        "horario": datetime.now().strftime("%H:%M:%S")
    })


# ==============================
# CALCULAR TEMPO EXPOSTO
# ==============================

def atualizar_tempo_exposto():

    global inicio_exposicao
    global tempo_exposto_total

    if varal == "aberto" and inicio_exposicao is not None:

        agora = datetime.now()

        tempo_exposto_total += (
            agora - inicio_exposicao
        ).total_seconds()

        inicio_exposicao = agora


# ==============================
# ROTA PRINCIPAL
# ==============================

@app.get("/")
def inicio():

    return {
        "sistema": "RETRACTA",
        "status": "online"
    }


# ==============================
# CADASTRO DE USUÁRIO
# ==============================

@app.post("/auth/register")
def cadastrar_usuario(dados: CadastroRequest):

    db: Session = SessionLocal()

    try:

        nome = dados.nome.strip()
        email = dados.email.strip().lower()
        senha = dados.senha

        if not nome:
            raise HTTPException(
                status_code=400,
                detail="O nome é obrigatório."
            )

        if not email:
            raise HTTPException(
                status_code=400,
                detail="O e-mail é obrigatório."
            )

        if not senha:
            raise HTTPException(
                status_code=400,
                detail="A senha é obrigatória."
            )

        if len(senha) < 6:
            raise HTTPException(
                status_code=400,
                detail="A senha deve possuir pelo menos 6 caracteres."
            )

        usuario_existente = (
            db.query(Usuario)
            .filter(Usuario.email == email)
            .first()
        )

        if usuario_existente:

            raise HTTPException(
                status_code=409,
                detail="Já existe uma conta com este e-mail."
            )

        novo_usuario = Usuario(
            nome=nome,
            email=email,
            senha=senha,
            perfil=dados.perfil or "usuario"
        )

        db.add(novo_usuario)
        db.commit()
        db.refresh(novo_usuario)

        return {
            "mensagem": "Usuário cadastrado com sucesso!",
            "usuario": {
                "id": novo_usuario.id,
                "nome": novo_usuario.nome,
                "email": novo_usuario.email,
                "perfil": novo_usuario.perfil
            }
        }

    finally:
        db.close()


# ==============================
# LOGIN
# ==============================

@app.post("/auth/login")
def login_usuario(dados: LoginRequest):

    db: Session = SessionLocal()

    try:

        email = dados.email.strip().lower()

        usuario = (
            db.query(Usuario)
            .filter(Usuario.email == email)
            .first()
        )

        if not usuario or usuario.senha != dados.senha:

            raise HTTPException(
                status_code=401,
                detail="E-mail ou senha incorretos."
            )

        return {
            "mensagem": "Login realizado com sucesso!",
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email,
                "perfil": usuario.perfil
            }
        }

    finally:
        db.close()


# ==============================
# LISTAR USUÁRIOS
# ==============================

@app.get("/auth/users")
def listar_usuarios():

    db: Session = SessionLocal()

    try:

        usuarios = db.query(Usuario).all()

        return {
            "total": len(usuarios),
            "usuarios": [
                {
                    "id": usuario.id,
                    "nome": usuario.nome,
                    "email": usuario.email,
                    "perfil": usuario.perfil
                }
                for usuario in usuarios
            ]
        }

    finally:
        db.close()


# ==============================
# STATUS DO SISTEMA
# ==============================

@app.get("/status")
def status():

    return {
        "temperatura": temperatura,
        "umidade": umidade,
        "chuva": chuva,
        "varal": varal
    }


# ==============================
# HISTÓRICO DE EVENTOS
# ==============================

@app.get("/events")
def listar_eventos():

    return {
        "eventos": eventos
    }


# ==============================
# MÉTRICAS DO SISTEMA
# ==============================

@app.get("/metrics")
def metricas():

    atualizar_tempo_exposto()

    retracoes = sum(
        1
        for evento in eventos
        if evento["tipo"] in ["MANUAL", "PROTECAO"]
        and "recolhido" in evento["descricao"].lower()
    )

    horas_exposto = tempo_exposto_total / 3600

    return {
        "retracoes": retracoes,
        "horas_exposto": round(horas_exposto, 2)
    }


# ==============================
# RECOLHER VARAL MANUALMENTE
# ==============================

@app.post("/clothesline/retract")
def recolher_varal():

    global varal
    global inicio_exposicao

    if varal == "aberto":
        atualizar_tempo_exposto()

    varal = "recolhido"
    inicio_exposicao = None

    registrar_evento(
        "MANUAL",
        "Varal recolhido manualmente pelo usuário."
    )

    return {
        "mensagem": "Varal recolhido com sucesso!",
        "varal": varal
    }


# ==============================
# ABRIR VARAL MANUALMENTE
# ==============================

@app.post("/clothesline/open")
def abrir_varal():

    global varal
    global inicio_exposicao

    varal = "aberto"
    inicio_exposicao = datetime.now()

    registrar_evento(
        "MANUAL",
        "Varal aberto manualmente pelo usuário."
    )

    return {
        "mensagem": "Varal aberto com sucesso!",
        "varal": varal
    }


# ==============================
# SIMULAR CHUVA
# ==============================

@app.post("/simulate/rain")
def simular_chuva():

    global chuva
    global varal
    global inicio_exposicao

    chuva = True

    if varal == "aberto":
        atualizar_tempo_exposto()

    varal = "recolhido"
    inicio_exposicao = None

    registrar_evento(
        "PROTECAO",
        "Chuva detectada. Varal recolhido automaticamente."
    )

    return {
        "mensagem": "Chuva detectada! Varal recolhido automaticamente.",
        "chuva": chuva,
        "varal": varal
    }


# ==============================
# ENCERRAR CHUVA
# ==============================

@app.post("/simulate/clear")
def parar_chuva():

    global chuva

    chuva = False

    return {
        "mensagem": "Chuva encerrada!",
        "chuva": chuva
    }


# ==============================
# SIMULAR SENSORES
# ==============================

@app.post("/simulate/sensors")
def simular_sensores(
    nova_temperatura: float,
    nova_umidade: float
):

    global temperatura
    global umidade

    temperatura = nova_temperatura
    umidade = nova_umidade

    if temperatura < LIMITE_TEMPERATURA:

        registrar_evento(
            "ATENCAO",
            f"Temperatura abaixo do limite: {temperatura}°C."
        )

    elif umidade >= LIMITE_UMIDADE:

        registrar_evento(
            "ATENCAO",
            f"Umidade acima do limite: {umidade}%."
        )

    return {
        "mensagem": "Sensores atualizados!",
        "temperatura": temperatura,
        "umidade": umidade
    }


# ==============================
# TOMADA DE DECISÃO
# ==============================

@app.get("/decision")
def decisao():

    if chuva:

        return {
            "situacao": "PROTECAO_ATIVADA",
            "motivo": "Chuva detectada",
            "acao": "Recolher varal",
            "varal": varal
        }

    if temperatura < LIMITE_TEMPERATURA:

        return {
            "situacao": "ATENCAO",
            "motivo": "Temperatura abaixo do limite",
            "acao": "Recolher varal",
            "varal": varal
        }

    if umidade >= LIMITE_UMIDADE:

        return {
            "situacao": "ATENCAO",
            "motivo": "Umidade muito alta",
            "acao": "Recolher varal",
            "varal": varal
        }

    return {
        "situacao": "NORMAL",
        "motivo": "Condicoes normais",
        "acao": "Manter varal aberto",
        "varal": varal
    }


# ==============================
# MODO AUTOMÁTICO
# ==============================

@app.post("/system/auto")
def modo_automatico():

    global varal
    global inicio_exposicao

    if chuva:

        if varal == "aberto":
            atualizar_tempo_exposto()

        varal = "recolhido"
        inicio_exposicao = None

        registrar_evento(
            "PROTECAO",
            "Modo automático: chuva detectada. Varal recolhido."
        )

        return {
            "situacao": "PROTECAO_ATIVADA",
            "motivo": "Chuva detectada",
            "acao": "Varal recolhido automaticamente",
            "varal": varal
        }

    if temperatura < LIMITE_TEMPERATURA:

        if varal == "aberto":
            atualizar_tempo_exposto()

        varal = "recolhido"
        inicio_exposicao = None

        registrar_evento(
            "PROTECAO",
            "Modo automático: temperatura abaixo do limite. Varal recolhido."
        )

        return {
            "situacao": "PROTECAO_ATIVADA",
            "motivo": "Temperatura abaixo do limite",
            "acao": "Varal recolhido automaticamente",
            "varal": varal
        }

    if umidade >= LIMITE_UMIDADE:

        if varal == "aberto":
            atualizar_tempo_exposto()

        varal = "recolhido"
        inicio_exposicao = None

        registrar_evento(
            "PROTECAO",
            "Modo automático: umidade muito alta. Varal recolhido."
        )

        return {
            "situacao": "PROTECAO_ATIVADA",
            "motivo": "Umidade muito alta",
            "acao": "Varal recolhido automaticamente",
            "varal": varal
        }

    return {
        "situacao": "NORMAL",
        "motivo": "Condicoes normais",
        "acao": "Nenhuma acao necessaria",
        "varal": varal
    }