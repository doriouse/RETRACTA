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

import { loginUser } from "../services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const entrar = async () => {
    if (loading) return;

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Preencha seu e-mail e sua senha."
      );
      return;
    }

    try {
      setLoading(true);

      await loginUser(
        email,
        password
      );

      router.replace("/");
    } catch (error: any) {
      setError(
        error?.message ||
          "Não foi possível entrar."
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
              BEM-VINDO DE VOLTA
            </Text>

            <Text style={styles.title}>
              Entrar
            </Text>

            <Text
              style={styles.description}
            >
              Acesse seu sistema RETRACTA
              para acompanhar e proteger
              suas roupas.
            </Text>
          </View>

          <View style={styles.card}>
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
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              autoCapitalize="none"
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
              onPress={entrar}
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
                  ENTRAR
                </Text>
              )}
            </Pressable>

            <View
              style={styles.registerArea}
            >
              <Text
                style={styles.registerText}
              >
                Ainda não possui uma conta?
              </Text>

              <Pressable
                onPress={() =>
                  router.push("/cadastro")
                }
              >
                <Text
                  style={
                    styles.registerLink
                  }
                >
                  Criar conta
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
    justifyContent: "center",
  },

  logoArea: {
    alignItems: "center",
    marginBottom: 45,
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
    fontSize: 32,
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
    marginBottom: 17,
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

  registerArea: {
    alignItems: "center",
    marginTop: 22,
  },

  registerText: {
    fontFamily: "Inter",
    fontSize: 11,
    color: "#64748B",
  },

  registerLink: {
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