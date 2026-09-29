import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";

import { registerUser } from "../services/auth";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const cadastrar = async () => {
    if (loading) return;

    setError("");

    if (
      !nome.trim() ||
      !email.trim() ||
      !senha ||
      !confirmacao
    ) {
      setError(
        "Preencha todos os campos."
      );
      return;
    }

    if (senha.length < 6) {
      setError(
        "A senha deve possuir pelo menos 6 caracteres."
      );
      return;
    }

    if (senha !== confirmacao) {
      setError(
        "As senhas não coincidem."
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        nome,
        email,
        senha
      );

      router.replace("/");
    } catch (error: any) {
      setError(
        error?.message ||
          "Não foi possível criar a conta."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            style={styles.back}
            onPress={() =>
              router.replace("/login")
            }
          >
            <Text style={styles.backText}>
              ← VOLTAR
            </Text>
          </Pressable>

          <View style={styles.logoArea}>
            <Text style={styles.logo}>
              RETRACTA
            </Text>

            <View
              style={styles.logoLine}
            />

            <Text
              style={styles.logoSubtitle}
            >
              AUTOMAÇÃO INTELIGENTE
            </Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.overline}>
              NOVO USUÁRIO
            </Text>

            <Text style={styles.title}>
              Criar conta
            </Text>

            <Text
              style={styles.description}
            >
              Crie seu acesso para começar
              a utilizar o sistema RETRACTA.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              NOME
            </Text>

            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
            />

            <Text style={styles.label}>
              E-MAIL
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>
              SENHA
            </Text>

            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="Mínimo de 6 caracteres"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />

            <Text style={styles.label}>
              CONFIRMAR SENHA
            </Text>

            <TextInput
              style={styles.input}
              value={confirmacao}
              onChangeText={setConfirmacao}
              placeholder="Digite a senha novamente"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />

            {error !== "" && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed &&
                  styles.buttonPressed,
                loading &&
                  styles.buttonDisabled,
              ]}
              onPress={cadastrar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text
                  style={styles.buttonText}
                >
                  CRIAR CONTA
                </Text>
              )}
            </Pressable>

            <View
              style={styles.loginArea}
            >
              <Text
                style={styles.loginText}
              >
                Já possui uma conta?
              </Text>

              <Pressable
                onPress={() =>
                  router.replace("/login")
                }
              >
                <Text
                  style={styles.loginLink}
                >
                  Entrar
                </Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.footer}>
            RETRACTA • SISTEMA INTELIGENTE
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EAF0FE",
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 650,
    alignSelf: "center",
    padding: 24,
    paddingBottom: 40,
  },

  back: {
    alignSelf: "flex-start",
    marginBottom: 28,
  },

  backText: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 1.2,
    color: "#004AAD",
  },

  logoArea: {
    alignItems: "center",
    marginBottom: 35,
  },

  logo: {
    fontFamily: "LexendGigaBold",
    fontSize: 27,
    letterSpacing: 4,
    color: "#004AAD",
  },

  logoLine: {
    width: 55,
    height: 2,
    backgroundColor: "#38B6FF",
    marginTop: 13,
    marginBottom: 10,
  },

  logoSubtitle: {
    fontFamily: "InterBold",
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#545454",
  },

  header: {
    marginBottom: 20,
  },

  overline: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 2,
    color: "#004AAD",
  },

  title: {
    marginTop: 7,
    fontFamily: "LexendGigaBold",
    fontSize: 30,
    color: "#000000",
  },

  description: {
    marginTop: 8,
    fontFamily: "Inter",
    fontSize: 13,
    lineHeight: 20,
    color: "#545454",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 23,
    borderWidth: 1,
    borderColor: "#D7E5FA",
    shadowColor: "#004AAD",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 3,
  },

  label: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 1.4,
    color: "#545454",
    marginBottom: 7,
    marginTop: 3,
  },

  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7E5FA",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 15,
    fontFamily: "Inter",
    fontSize: 13,
    color: "#000000",
    marginBottom: 15,
  },

  errorBox: {
    backgroundColor: "#FFF1E8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FF944E",
  },

  errorText: {
    fontFamily: "Inter",
    fontSize: 11,
    lineHeight: 17,
    color: "#B45309",
  },

  button: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#004AAD",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontFamily: "InterBold",
    fontSize: 10,
    letterSpacing: 1.2,
    color: "#FFFFFF",
  },

  loginArea: {
    alignItems: "center",
    marginTop: 20,
  },

  loginText: {
    fontFamily: "Inter",
    fontSize: 11,
    color: "#64748B",
  },

  loginLink: {
    marginTop: 6,
    fontFamily: "InterBold",
    fontSize: 11,
    color: "#004AAD",
  },

  footer: {
    textAlign: "center",
    marginTop: 30,
    fontFamily: "InterBold",
    fontSize: 8,
    letterSpacing: 1.2,
    color: "#64748B",
  },
});