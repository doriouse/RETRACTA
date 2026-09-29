import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { useState } from "react";

import { activateAutomaticMode } from "../services/retractaApi";


export default function AgendaScreen() {

  const [loading, setLoading] = useState(false);

  const [resultado, setResultado] = useState(
    "O RETRACTA está pronto para verificar as condições ambientais."
  );

  const [situacao, setSituacao] = useState<
    "NORMAL" | "PROTECAO_ATIVADA" | "ATENCAO"
  >("NORMAL");


  const verificarProtecao = async () => {

    if (loading) return;

    try {

      setLoading(true);

      const data = await activateAutomaticMode();

      setSituacao(data.situacao);

      if (data.situacao === "PROTECAO_ATIVADA") {

        setResultado(
          `${data.motivo}. ${data.acao}.`
        );

      } else if (data.situacao === "ATENCAO") {

        setResultado(
          `${data.motivo}. ${data.acao}.`
        );

      } else {

        setResultado(
          "Condições normais. Nenhuma ação necessária."
        );

      }

    } catch (error) {

      console.log(
        "Erro ao verificar proteção:",
        error
      );

      setResultado(
        "Não foi possível comunicar com o sistema RETRACTA."
      );

    } finally {

      setLoading(false);

    }
  };


  const statusTitle =
    situacao === "PROTECAO_ATIVADA"
      ? "PROTEÇÃO ATIVADA"
      : situacao === "ATENCAO"
        ? "ATENÇÃO NECESSÁRIA"
        : "SISTEMA PRONTO";


  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        contentContainerStyle={styles.content}
      >

        {/* CABEÇALHO */}

        <Text style={styles.overline}>
          AUTOMAÇÃO
        </Text>

        <Text style={styles.title}>
          Agenda
        </Text>

        <Text style={styles.description}>
          Configure e acompanhe as ações automáticas
          de proteção do seu RETRACTA.
        </Text>


        {/* PROTEÇÃO INTELIGENTE */}

        <View style={styles.card}>

          <Text style={styles.cardLabel}>
            MODO INTELIGENTE
          </Text>

          <View style={styles.titleRow}>

            <View style={styles.titleArea}>

              <Text style={styles.cardTitle}>
                Proteção ambiental
              </Text>

              <Text style={styles.cardDescription}>
                O sistema analisa chuva, temperatura e
                umidade para decidir quando proteger as roupas.
              </Text>

            </View>


            <View
              style={[
                styles.statusCircle,
                situacao === "PROTECAO_ATIVADA" &&
                  styles.statusCircleActive,
              ]}
            >

              <Text style={styles.statusIcon}>
                {situacao === "PROTECAO_ATIVADA"
                  ? "!"
                  : "✓"}
              </Text>

            </View>

          </View>


          <View style={styles.statusRow}>

            <View
              style={[
                styles.dot,
                situacao === "PROTECAO_ATIVADA" &&
                  styles.dotActive,
              ]}
            />

            <Text
              style={[
                styles.status,
                situacao === "PROTECAO_ATIVADA" &&
                  styles.statusActive,
              ]}
            >
              {statusTitle}
            </Text>

          </View>


          <View style={styles.resultBox}>

            <Text style={styles.resultText}>
              {resultado}
            </Text>

          </View>


          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
              loading && styles.actionButtonDisabled,
            ]}
            onPress={verificarProtecao}
            disabled={loading}
          >

            {loading ? (

              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

            ) : (

              <Text style={styles.actionButtonText}>
                VERIFICAR CONDIÇÕES AGORA
              </Text>

            )}

          </Pressable>

        </View>


        {/* PROGRAMAÇÃO */}

        <View style={styles.card}>

          <Text style={styles.cardLabel}>
            PROGRAMAÇÃO
          </Text>

          <Text style={styles.cardTitle}>
            Rotinas automáticas
          </Text>

          <Text style={styles.cardDescription}>
            A programação de horários será usada para
            criar rotinas personalizadas de abertura e
            recolhimento do varal.
          </Text>


          <View style={styles.schedulePlaceholder}>

            <View style={styles.scheduleIcon}>
              <Text style={styles.scheduleIconText}>
                +
              </Text>
            </View>


            <View style={styles.scheduleTextArea}>

              <Text style={styles.scheduleTitle}>
                Criar programação
              </Text>

              <Text style={styles.scheduleDescription}>
                Configure horários para futuras rotinas
                automáticas do RETRACTA.
              </Text>

            </View>

          </View>

          <Text style={styles.comingSoon}>
            CONFIGURAÇÃO DE HORÁRIOS EM DESENVOLVIMENTO
          </Text>

        </View>


        {/* COMO FUNCIONA */}

        <View style={styles.infoCard}>

          <Text style={styles.cardLabel}>
            COMO FUNCIONA
          </Text>

          <Text style={styles.infoTitle}>
            O RETRACTA toma a decisão por você.
          </Text>

          <Text style={styles.infoText}>
            Quando uma condição de risco é identificada,
            o sistema pode acionar o recolhimento do varal
            para proteger as roupas.
          </Text>


          <View style={styles.ruleList}>

            <View style={styles.rule}>

              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>
                  01
                </Text>
              </View>

              <Text style={styles.ruleText}>
                Chuva detectada
              </Text>

            </View>


            <View style={styles.rule}>

              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>
                  02
                </Text>
              </View>

              <Text style={styles.ruleText}>
                Temperatura abaixo do limite
              </Text>

            </View>


            <View style={styles.rule}>

              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>
                  03
                </Text>
              </View>

              <Text style={styles.ruleText}>
                Umidade muito alta
              </Text>

            </View>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },


  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 24,
    paddingBottom: 60,
  },


  overline: {
    marginTop: 15,
    fontFamily: "InterBold",
    fontSize: 10,
    letterSpacing: 2,
    color: "#004AAD",
  },


  title: {
    marginTop: 8,
    fontFamily: "LexendGigaBold",
    fontSize: 34,
    color: "#000000",
  },


  description: {
    marginTop: 8,
    maxWidth: 650,
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 21,
    color: "#545454",
    marginBottom: 28,
  },


  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAF0FE",

    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 2,
  },


  cardLabel: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#545454",
  },


  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 9,
  },


  titleArea: {
    flex: 1,
    paddingRight: 16,
  },


  cardTitle: {
    fontFamily: "LexendGigaSemiBold",
    fontSize: 18,
    color: "#000000",
  },


  cardDescription: {
    marginTop: 8,
    fontFamily: "Inter",
    fontSize: 12,
    lineHeight: 18,
    color: "#545454",
  },


  statusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EAF0FE",
    alignItems: "center",
    justifyContent: "center",
  },


  statusCircleActive: {
    backgroundColor: "#FFF1E8",
  },


  statusIcon: {
    fontFamily: "LexendGigaBold",
    fontSize: 19,
    color: "#004AAD",
  },


  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },


  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22D3A6",
    marginRight: 8,
  },


  dotActive: {
    backgroundColor: "#FF944E",
  },


  status: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 1,
    color: "#008F70",
  },


  statusActive: {
    color: "#D96B20",
  },


  resultBox: {
    marginTop: 16,
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EAF0FE",
  },


  resultText: {
    fontFamily: "Inter",
    fontSize: 12,
    lineHeight: 18,
    color: "#334155",
  },


  actionButton: {
    marginTop: 14,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#004AAD",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },


  actionButtonPressed: {
    opacity: 0.8,
  },


  actionButtonDisabled: {
    opacity: 0.6,
  },


  actionButtonText: {
    fontFamily: "InterBold",
    fontSize: 10,
    letterSpacing: 1,
    color: "#FFFFFF",
  },


  schedulePlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EAF0FE",
  },


  scheduleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EAF0FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },


  scheduleIconText: {
    fontFamily: "LexendGigaBold",
    fontSize: 20,
    color: "#004AAD",
  },


  scheduleTextArea: {
    flex: 1,
  },


  scheduleTitle: {
    fontFamily: "InterBold",
    fontSize: 13,
    color: "#000000",
  },


  scheduleDescription: {
    marginTop: 4,
    fontFamily: "Inter",
    fontSize: 11,
    lineHeight: 16,
    color: "#64748B",
  },


  comingSoon: {
    marginTop: 14,
    fontFamily: "InterBold",
    fontSize: 8,
    letterSpacing: 1.2,
    color: "#94A3B8",
  },


  infoCard: {
    backgroundColor: "#EAF0FE",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
  },


  infoTitle: {
    marginTop: 9,
    fontFamily: "LexendGigaSemiBold",
    fontSize: 17,
    lineHeight: 25,
    color: "#004AAD",
  },


  infoText: {
    marginTop: 8,
    fontFamily: "Inter",
    fontSize: 12,
    lineHeight: 19,
    color: "#334155",
  },


  ruleList: {
    marginTop: 18,
    gap: 10,
  },


  rule: {
    flexDirection: "row",
    alignItems: "center",
  },


  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },


  ruleNumberText: {
    fontFamily: "InterBold",
    fontSize: 9,
    color: "#004AAD",
  },


  ruleText: {
    fontFamily: "InterMedium",
    fontSize: 12,
    color: "#334155",
  },

});