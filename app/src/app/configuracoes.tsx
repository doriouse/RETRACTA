import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

import { useState } from "react";


export default function ConfiguracoesScreen() {

  const [notificacoes, setNotificacoes] = useState(true);

  const [modoInteligente, setModoInteligente] = useState(true);


  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        contentContainerStyle={styles.content}
      >

        {/* CABEÇALHO */}

        <Text style={styles.overline}>
          SISTEMA
        </Text>

        <Text style={styles.title}>
          Configurações
        </Text>

        <Text style={styles.description}>
          Gerencie seu dispositivo, automações e
          preferências do RETRACTA.
        </Text>


        {/* DISPOSITIVO */}

        <View style={styles.card}>

          <Text style={styles.cardLabel}>
            DISPOSITIVO
          </Text>

          <View style={styles.deviceRow}>

            <View style={styles.deviceIcon}>
              <Text style={styles.deviceIconText}>
                R
              </Text>
            </View>


            <View style={styles.deviceInfo}>

              <Text style={styles.deviceName}>
                RETRACTA ESP32
              </Text>

              <Text style={styles.deviceDescription}>
                Dispositivo virtual conectado
              </Text>

            </View>


            <View style={styles.onlineBadge}>

              <View style={styles.onlineDot} />

              <Text style={styles.onlineText}>
                ONLINE
              </Text>

            </View>

          </View>


          <View style={styles.connectionBox}>

            <Text style={styles.connectionLabel}>
              STATUS DA CONEXÃO
            </Text>

            <Text style={styles.connectionText}>
              Comunicação com o sistema estabelecida.
            </Text>

          </View>

        </View>


        {/* PREFERÊNCIAS */}

        <View style={styles.card}>

          <Text style={styles.cardLabel}>
            PREFERÊNCIAS
          </Text>


          {/* NOTIFICAÇÕES */}

          <View style={styles.settingRow}>

            <View style={styles.settingInfo}>

              <Text style={styles.settingTitle}>
                Notificações
              </Text>

              <Text style={styles.settingDescription}>
                Receba avisos sobre as ações do RETRACTA.
              </Text>

            </View>


            <Pressable
              onPress={() =>
                setNotificacoes(!notificacoes)
              }
              style={[
                styles.switch,
                notificacoes && styles.switchActive,
              ]}
            >

              <View
                style={[
                  styles.switchThumb,
                  notificacoes &&
                    styles.switchThumbActive,
                ]}
              />

            </Pressable>

          </View>


          <View style={styles.separator} />


          {/* MODO INTELIGENTE */}

          <View style={styles.settingRow}>

            <View style={styles.settingInfo}>

              <Text style={styles.settingTitle}>
                Modo inteligente
              </Text>

              <Text style={styles.settingDescription}>
                Permite que o sistema tome decisões
                automáticas para proteger as roupas.
              </Text>

            </View>


            <Pressable
              onPress={() =>
                setModoInteligente(!modoInteligente)
              }
              style={[
                styles.switch,
                modoInteligente &&
                  styles.switchActive,
              ]}
            >

              <View
                style={[
                  styles.switchThumb,
                  modoInteligente &&
                    styles.switchThumbActive,
                ]}
              />

            </Pressable>

          </View>

        </View>


        {/* MANUTENÇÃO */}

        <View style={styles.card}>

          <Text style={styles.cardLabel}>
            MANUTENÇÃO
          </Text>


          <View style={styles.maintenanceRow}>

            <View style={styles.maintenanceIcon}>

              <Text style={styles.maintenanceIconText}>
                ✓
              </Text>

            </View>


            <View style={styles.maintenanceInfo}>

              <Text style={styles.maintenanceTitle}>
                Sistema funcionando normalmente
              </Text>

              <Text style={styles.maintenanceDescription}>
                Nenhuma manutenção necessária no momento.
              </Text>

            </View>

          </View>

        </View>


        {/* INFORMAÇÕES */}

        <View style={styles.infoCard}>

          <Text style={styles.infoLabel}>
            RETRACTA
          </Text>

          <Text style={styles.infoTitle}>
            Automação inteligente para sua casa.
          </Text>

          <Text style={styles.infoText}>
            O RETRACTA combina sensores ambientais,
            automação e conectividade para proteger
            suas roupas de mudanças nas condições
            climáticas.
          </Text>

          <Text style={styles.version}>
            Versão do protótipo • 1.0
          </Text>

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
    marginBottom: 16,
  },


  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },


  deviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#EAF0FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },


  deviceIconText: {
    fontFamily: "LexendGigaBold",
    fontSize: 18,
    color: "#004AAD",
  },


  deviceInfo: {
    flex: 1,
  },


  deviceName: {
    fontFamily: "LexendGigaSemiBold",
    fontSize: 14,
    color: "#000000",
  },


  deviceDescription: {
    marginTop: 4,
    fontFamily: "Inter",
    fontSize: 11,
    color: "#64748B",
  },


  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#EAFBF5",
  },


  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22D3A6",
    marginRight: 6,
  },


  onlineText: {
    fontFamily: "InterBold",
    fontSize: 8,
    letterSpacing: 1,
    color: "#008F70",
  },


  connectionBox: {
    marginTop: 18,
    padding: 15,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EAF0FE",
  },


  connectionLabel: {
    fontFamily: "InterBold",
    fontSize: 8,
    letterSpacing: 1.2,
    color: "#94A3B8",
  },


  connectionText: {
    marginTop: 5,
    fontFamily: "Inter",
    fontSize: 11,
    color: "#475569",
  },


  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 65,
  },


  settingInfo: {
    flex: 1,
    paddingRight: 18,
  },


  settingTitle: {
    fontFamily: "InterBold",
    fontSize: 13,
    color: "#000000",
  },


  settingDescription: {
    marginTop: 4,
    fontFamily: "Inter",
    fontSize: 11,
    lineHeight: 16,
    color: "#64748B",
  },


  separator: {
    height: 1,
    backgroundColor: "#EAF0FE",
    marginVertical: 10,
  },


  switch: {
    width: 48,
    height: 28,
    borderRadius: 20,
    backgroundColor: "#CBD5E1",
    padding: 3,
    justifyContent: "center",
  },


  switchActive: {
    backgroundColor: "#004AAD",
  },


  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },


  switchThumbActive: {
    alignSelf: "flex-end",
  },


  maintenanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },


  maintenanceIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EAFBF5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },


  maintenanceIconText: {
    fontFamily: "LexendGigaBold",
    fontSize: 17,
    color: "#008F70",
  },


  maintenanceInfo: {
    flex: 1,
  },


  maintenanceTitle: {
    fontFamily: "InterBold",
    fontSize: 13,
    color: "#000000",
  },


  maintenanceDescription: {
    marginTop: 4,
    fontFamily: "Inter",
    fontSize: 11,
    color: "#64748B",
  },


  infoCard: {
    backgroundColor: "#EAF0FE",
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
  },


  infoLabel: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#004AAD",
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


  version: {
    marginTop: 18,
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 1,
    color: "#64748B",
  },

});