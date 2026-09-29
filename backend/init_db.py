from database import engine, Base
from models import Usuario


Base.metadata.create_all(bind=engine)

print("Banco de dados RETRACTA inicializado com sucesso!")
print("Tabela 'usuarios' criada.")