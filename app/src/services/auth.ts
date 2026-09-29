import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://127.0.0.1:8000";
const SESSION_KEY = "@retracta_session";

export type User = {
  id: number;
  name: string;
  email: string;
  profile: "usuario";
};

type AuthResponse = {
  mensagem: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: string;
  };
};

function converterUsuario(usuario: AuthResponse["usuario"]): User {
  return {
    id: usuario.id,
    name: usuario.nome,
    email: usuario.email,
    profile: "usuario",
  };
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: name.trim(),
        email: email.trim().toLowerCase(),
        senha: password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.mensagem ||
        "Não foi possível cadastrar o usuário."
    );
  }

  const user = converterUsuario(data.usuario);

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(user)
  );

  return user;
}

export async function loginUser(
  email: string,
  password: string
) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        senha: password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.mensagem ||
        "E-mail ou senha incorretos."
    );
  }

  const user = converterUsuario(data.usuario);

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(user)
  );

  return user;
}

export async function getSession(): Promise<User | null> {
  const session =
    await AsyncStorage.getItem(SESSION_KEY);

  if (!session) {
    return null;
  }

  try {
    return JSON.parse(session);
  } catch {
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function logoutUser() {
  await AsyncStorage.removeItem(SESSION_KEY);
}