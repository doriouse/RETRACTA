import {
  getSession,
  logoutUser,
} from "../services/auth";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  activateAutomaticMode,
  getDecision,
  getStatus,
  retractClothesline,
} from "../services/retractaApi";


type RetractaStatus = {
  temperatura: number;
  umidade: number;
  chuva: boolean;
  varal: "aberto" | "recolhido" | string;
};


type RetractaDecision = {
  situacao:
    | "NORMAL"
    | "ATENCAO"
    | "PROTECAO_ATIVADA";

  motivo: string;
  acao: string;
  varal: string;
};


export default function HomeScreen() {

  /* =========================
     SPLASH / AUTENTICAÇÃO
  ========================= */

  const [splashVisible, setSplashVisible] =
    useState(true);

  const [authChecking, setAuthChecking] =
    useState(true);


  useEffect(() => {

    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 4200);

    return () => clearTimeout(timer);

  }, []);


  useEffect(() => {

    let mounted = true;

    const verificarSessao = async () => {

      try {

        const session = await getSession();

        if (!mounted) return;

        setAuthChecking(false);

        if (!session) {
          router.replace("/login");
        }

      } catch (error) {

        console.log(
          "Erro ao verificar sessão:",
          error
        );

        if (!mounted) return;

        setAuthChecking(false);

        router.replace("/login");
      }
    };


    verificarSessao();


    return () => {
      mounted = false;
    };

  }, []);


  /* =========================
     SAIR DA CONTA
  ========================= */

  const sair = async () => {

    try {

      await logoutUser();

      router.replace("/login");

    } catch (error) {

      console.log(
        "Erro ao sair da conta:",
        error
      );

    }
  };


  /* =========================
     ESTADOS
  ========================= */

  const [status, setStatus] =
    useState<RetractaStatus | null>(null);


  const [decision, setDecision] =
    useState<RetractaDecision | null>(null);


  const [online, setOnline] =
    useState(false);


  const [loading, setLoading] =
    useState(true);


  const [refreshing, setRefreshing] =
    useState(false);


  const [actionLoading, setActionLoading] =
    useState(false);


  const [activity, setActivity] = useState(
    "Monitoramento automático ativado"
  );


  /* =========================
     CARREGAR STATUS
  ========================= */

  const carregarStatus = useCallback(
    async () => {

      try {

        const [
          statusData,
          decisionData,
        ] = await Promise.all([
          getStatus(),
          getDecision(),
        ]);


        setStatus(statusData);

        setDecision(decisionData);

        setOnline(true);

      } catch (error) {

        console.log(
          "Erro ao conectar ao RETRACTA:",
          error
        );

        setOnline(false);

      } finally {

        setLoading(false);

        setRefreshing(false);
      }

    },
    []
  );


  /* =========================
     ATUALIZAÇÃO AUTOMÁTICA
  ========================= */

  useEffect(() => {

    if (
      splashVisible ||
      authChecking
    ) {
      return;
    }


    carregarStatus();


    const interval = setInterval(() => {
      carregarStatus();
    }, 5000);


    return () =>
      clearInterval(interval);

  }, [
    carregarStatus,
    splashVisible,
    authChecking,
  ]);


  /* =========================
     ATUALIZAR TELA
  ========================= */

  const atualizarTela = async () => {

    setRefreshing(true);

    await carregarStatus();

  };


  /* =========================
     RECOLHER VARAL
  ========================= */

  const recolherVaral = async () => {

    if (actionLoading) return;


    try {

      setActionLoading(true);


      await retractClothesline();


      setActivity(
        "Varal recolhido manualmente"
      );


      await carregarStatus();

    } catch (error) {

      console.log(
        "Erro ao recolher varal:",
        error
      );


      setActivity(
        "Falha ao acionar o varal"
      );

    } finally {

      setActionLoading(false);

    }

  };


  /* =========================
     MODO AUTOMÁTICO
  ========================= */

  const ativarModoAutomatico =
    async () => {

      if (actionLoading) return;


      try {

        setActionLoading(true);


        const result =
          await activateAutomaticMode();


        if (
          result.situacao ===
          "PROTECAO_ATIVADA"
        ) {

          setActivity(result.acao);

        } else {

          setActivity(
            "Condições normais. Nenhuma ação necessária."
          );

        }


        await carregarStatus();

      } catch (error) {

        console.log(
          "Erro no modo automático:",
          error
        );


        setActivity(
          "Falha ao executar modo automático"
        );

      } finally {

        setActionLoading(false);

      }

    };


  /* =========================
     VALORES
  ========================= */

  const varalAberto =
    status?.varal === "aberto";


  const chuvaDetectada =
    status?.chuva === true;


  const temperatura =
    status?.temperatura ?? 0;


  const umidade =
    status?.umidade ?? 0;


  const temperaturaNormal =
    temperatura >= 16
      ? "NORMAL"
      : "ATENÇÃO";


  const umidadeNormal =
    umidade < 85
      ? "NORMAL"
      : "ATENÇÃO";


  /* =========================
     SPLASH SCREEN
  ========================= */

  if (
    splashVisible ||
    authChecking
  ) {

    return (

      <View
        style={styles.splashContainer}
      >

        <View
          style={
            styles.splashLogoContainer
          }
        >

          <Text
            style={styles.splashLogo}
          >
            RETRACTA
          </Text>


          <View
            style={styles.splashLine}
          />


          <Text
            style={styles.splashSubtitle}
          >
            SISTEMA INTELIGENTE
          </Text>


          <Text
            style={styles.splashSubtitle}
          >
            DE AUTOMAÇÃO RESIDENCIAL
          </Text>

        </View>


        <View
          style={styles.splashBottom}
        >

          <ActivityIndicator
            size="small"
            color="#004AAD"
          />


          <Text
            style={styles.splashLoading}
          >
            INICIALIZANDO SISTEMA
          </Text>

        </View>

      </View>

    );
  }


  /* =========================
     HOME
  ========================= */

  return (

    <SafeAreaView
      style={styles.safeArea}
    >

      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={atualizarTela}
            tintColor="#004AAD"
          />
        }
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View>

            <Text style={styles.logo}>
              RETRACTA
            </Text>


            <Text
              style={styles.subtitle}
            >
              SISTEMA INTELIGENTE DE AUTOMAÇÃO
            </Text>

          </View>


          <View
            style={[
              styles.onlineContainer,
              !online &&
                styles.offlineContainer,
            ]}
          >

            <View
              style={[
                styles.onlineDot,
                !online &&
                  styles.offlineDot,
              ]}
            />


            <Text
              style={[
                styles.onlineText,
                !online &&
                  styles.offlineText,
              ]}
            >
              {online
                ? "ONLINE"
                : "OFFLINE"}
            </Text>

          </View>

        </View>


        {/* SAUDAÇÃO */}

        <View
          style={styles.greeting}
        >

          <Text
            style={styles.greetingSmall}
          >
            MONITORAMENTO
          </Text>


          <Text
            style={styles.greetingTitle}
          >
            Tudo sob controle.
          </Text>


          <Text
            style={
              styles.greetingDescription
            }
          >
            O RETRACTA está monitorando
            as condições do ambiente.
          </Text>

        </View>


        {/* STATUS DO VARAL */}

        <View
          style={styles.mainCard}
        >

          <View
            style={styles.cardHeader}
          >

            <View>

              <Text
                style={styles.cardLabel}
              >
                VARAL
              </Text>


              {loading ? (

                <ActivityIndicator
                  size="small"
                  color="#004AAD"
                />

              ) : (

                <Text
                  style={
                    styles.mainStatus
                  }
                >
                  {varalAberto
                    ? "ABERTO"
                    : "RECOLHIDO"}
                </Text>

              )}

            </View>


            <View
              style={
                styles.statusCircle
              }
            >

              <Text
                style={
                  styles.statusIcon
                }
              >
                {varalAberto
                  ? "↗"
                  : "↓"}
              </Text>

            </View>

          </View>


          <View
            style={styles.divider}
          />


          <View
            style={styles.cardBottom}
          >

            <View>

              <Text
                style={styles.infoLabel}
              >
                MODO
              </Text>


              <Text
                style={styles.infoValue}
              >
                INTELIGENTE
              </Text>

            </View>


            <View>

              <Text
                style={styles.infoLabel}
              >
                DISPOSITIVO
              </Text>


              <Text
                style={styles.infoValue}
              >
                ESP32
              </Text>

            </View>


            <View>

              <Text
                style={styles.infoLabel}
              >
                SISTEMA
              </Text>


              <Text
                style={styles.infoValue}
              >
                {online
                  ? "ATIVO"
                  : "SEM CONEXÃO"}
              </Text>

            </View>

          </View>

        </View>


        {/* DECISÃO DO SISTEMA */}

        {decision && (

          <View
            style={[
              styles.decisionCard,
              decision.situacao ===
                "PROTECAO_ATIVADA" &&
                styles.decisionCardAlert,
            ]}
          >

            <View
              style={
                styles.decisionHeader
              }
            >

              <View
                style={
                  styles.decisionTitleArea
                }
              >

                <Text
                  style={
                    styles.decisionLabel
                  }
                >
                  STATUS DO SISTEMA
                </Text>


                <Text
                  style={
                    styles.decisionStatus
                  }
                >

                  {decision.situacao ===
                  "NORMAL"
                    ? "CONDIÇÕES NORMAIS"
                    : decision.situacao ===
                        "ATENCAO"
                      ? "ATENÇÃO NECESSÁRIA"
                      : "PROTEÇÃO ATIVADA"}

                </Text>

              </View>


              <View
                style={[
                  styles.decisionCircle,
                  decision.situacao ===
                    "PROTECAO_ATIVADA" &&
                    styles.decisionCircleAlert,
                ]}
              >

                <Text
                  style={
                    styles.decisionIcon
                  }
                >

                  {decision.situacao ===
                  "NORMAL"
                    ? "✓"
                    : "!"}

                </Text>

              </View>

            </View>


            <View
              style={styles.divider}
            />


            <Text
              style={
                styles.decisionReason
              }
            >
              {decision.motivo}
            </Text>


            <Text
              style={
                styles.decisionAction
              }
            >
              {decision.acao}
            </Text>

          </View>

        )}


        {/* SENSORES */}

        <Text
          style={styles.sectionTitle}
        >
          CONDIÇÕES DO AMBIENTE
        </Text>


        <View
          style={styles.sensorGrid}
        >

          <View
            style={styles.sensorCard}
          >

            <Text
              style={styles.sensorIcon}
            >
              °
            </Text>


            <Text
              style={styles.sensorLabel}
            >
              TEMPERATURA
            </Text>


            <Text
              style={styles.sensorValue}
            >
              {loading
                ? "--"
                : `${temperatura}°C`}
            </Text>


            <Text
              style={[
                styles.sensorStatus,
                temperaturaNormal ===
                  "ATENÇÃO" &&
                  styles.warningText,
              ]}
            >
              {loading
                ? "AGUARDANDO"
                : temperaturaNormal}
            </Text>

          </View>


          <View
            style={styles.sensorCard}
          >

            <Text
              style={styles.sensorIcon}
            >
              ≈
            </Text>


            <Text
              style={styles.sensorLabel}
            >
              UMIDADE
            </Text>


            <Text
              style={styles.sensorValue}
            >
              {loading
                ? "--"
                : `${umidade}%`}
            </Text>


            <Text
              style={[
                styles.sensorStatus,
                umidadeNormal ===
                  "ATENÇÃO" &&
                  styles.warningText,
              ]}
            >
              {loading
                ? "AGUARDANDO"
                : umidadeNormal}
            </Text>

          </View>

        </View>


        {/* CHUVA */}

        <View
          style={[
            styles.rainCard,
            chuvaDetectada &&
              styles.rainCardAlert,
          ]}
        >

          <View
            style={[
              styles.rainIconContainer,
              chuvaDetectada &&
                styles.rainIconAlert,
            ]}
          >

            <Text
              style={styles.rainIcon}
            >
              ☁
            </Text>

          </View>


          <View
            style={styles.rainInfo}
          >

            <Text
              style={styles.sensorLabel}
            >
              PRECIPITAÇÃO
            </Text>


            <Text
              style={styles.rainTitle}
            >
              {chuvaDetectada
                ? "Chuva detectada"
                : "Sem chuva detectada"}
            </Text>


            <Text
              style={
                styles.rainDescription
              }
            >
              {chuvaDetectada
                ? "O RETRACTA identificou precipitação no ambiente."
                : "O ambiente apresenta condições normais."}
            </Text>

          </View>


          <View
            style={[
              styles.rainIndicator,
              chuvaDetectada &&
                styles.rainIndicatorAlert,
            ]}
          />

        </View>


        {/* CONTROLE */}

        <Text
          style={styles.sectionTitle}
        >
          CONTROLE
        </Text>


        <TouchableOpacity
          style={[
            styles.primaryButton,
            actionLoading &&
              styles.buttonDisabled,
          ]}
          onPress={recolherVaral}
          disabled={actionLoading}
          activeOpacity={0.8}
        >

          <View>

            <Text
              style={styles.buttonTitle}
            >
              {actionLoading
                ? "ACIONANDO..."
                : "RECOLHER VARAL"}
            </Text>


            <Text
              style={
                styles.buttonSubtitle
              }
            >
              Acionar proteção manualmente
            </Text>

          </View>


          {actionLoading ? (

            <ActivityIndicator
              color="#FFFFFF"
            />

          ) : (

            <Text
              style={styles.buttonArrow}
            >
              →
            </Text>

          )}

        </TouchableOpacity>


        {/* MODO AUTOMÁTICO */}

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={
            ativarModoAutomatico
          }
          disabled={actionLoading}
          activeOpacity={0.8}
        >

          <View>

            <Text
              style={
                styles.secondaryButtonTitle
              }
            >
              MODO AUTOMÁTICO
            </Text>


            <Text
              style={
                styles.secondaryButtonSubtitle
              }
            >
              Verificar condições e proteger
              o varal
            </Text>

          </View>


          <Text
            style={
              styles.secondaryButtonIcon
            }
          >
            ◉
          </Text>

        </TouchableOpacity>


        {/* ATIVIDADE */}

        <Text
          style={styles.sectionTitle}
        >
          ATIVIDADE RECENTE
        </Text>


        <View
          style={styles.activityCard}
        >

          <View
            style={styles.activityIcon}
          >

            <Text
              style={
                styles.activityIconText
              }
            >
              ✓
            </Text>

          </View>


          <View
            style={styles.activityContent}
          >

            <Text
              style={styles.activityTitle}
            >
              Sistema RETRACTA
            </Text>


            <Text
              style={
                styles.activityDescription
              }
            >
              {activity}
            </Text>

          </View>


          <Text
            style={styles.activityTime}
          >
            AGORA
          </Text>

        </View>


        {/* SAIR DA CONTA */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={sair}
          activeOpacity={0.8}
        >

          <Text
            style={styles.logoutText}
          >
            SAIR DA CONTA
          </Text>

        </TouchableOpacity>


        {/* FOOTER */}

        <View
          style={styles.footer}
        >

          <Text
            style={styles.footerLogo}
          >
            RETRACTA
          </Text>


          <Text
            style={styles.footerText}
          >
            Tecnologia para proteger o que
            importa.
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>

  );
}


const styles = StyleSheet.create({

  /* =========================
     SPLASH
  ========================= */

  splashContainer: {
    flex: 1,
    backgroundColor: "#EAF0FE",
    alignItems: "center",
    justifyContent: "center",
  },


  splashLogoContainer: {
    alignItems: "center",
  },


  splashLogo: {
    fontFamily: "LexendGigaBold",
    fontSize: 32,
    letterSpacing: 5,
    color: "#004AAD",
  },


  splashLine: {
    width: 70,
    height: 2,
    backgroundColor: "#38B6FF",
    marginTop: 18,
    marginBottom: 15,
  },


  splashSubtitle: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 2,
    color: "#545454",
    textAlign: "center",
    marginTop: 3,
  },


  splashBottom: {
    position: "absolute",
    bottom: 55,
    alignItems: "center",
  },


  splashLoading: {
    marginTop: 12,
    fontFamily: "InterBold",
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#004AAD",
  },


  /* =========================
     BASE
  ========================= */

  safeArea: {
    flex: 1,
    backgroundColor: "#EAF0FE",
  },


  container: {
    flex: 1,
  },


  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 50,
  },


  /* =========================
     HEADER
  ========================= */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 42,
  },


  logo: {
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: 4,
    color: "#000000",
    fontFamily: "LexendGiga",
  },


  subtitle: {
    marginTop: 5,
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#545454",
    fontFamily: "Inter",
  },


  onlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EAF0FE",
    borderWidth: 1,
    borderColor: "#38B6FF",
  },


  offlineContainer: {
    backgroundColor: "#F2F2F2",
    borderColor: "#545454",
  },


  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#00C2CB",
  },


  offlineDot: {
    backgroundColor: "#545454",
  },


  onlineText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#004AAD",
    fontFamily: "Inter",
  },


  offlineText: {
    color: "#545454",
  },


  /* =========================
     SAUDAÇÃO
  ========================= */

  greeting: {
    marginBottom: 26,
  },


  greetingSmall: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#004AAD",
    marginBottom: 8,
    fontFamily: "Inter",
  },


  greetingTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    fontFamily: "LexendGiga",
  },


  greetingDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: "#545454",
    maxWidth: 600,
    fontFamily: "Inter",
  },


  /* =========================
     CARD PRINCIPAL
  ========================= */

  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#D7E5FA",
    shadowColor: "#004AAD",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 3,
    marginBottom: 20,
  },


  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#545454",
    marginBottom: 7,
    fontFamily: "Inter",
  },


  mainStatus: {
    fontSize: 30,
    fontWeight: "800",
    color: "#004AAD",
    letterSpacing: 1,
    fontFamily: "LexendGiga",
  },


  statusCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF0FE",
    borderWidth: 1,
    borderColor: "#38B6FF",
  },


  statusIcon: {
    fontSize: 25,
    color: "#004AAD",
    fontWeight: "700",
  },


  divider: {
    height: 1,
    backgroundColor: "#EAF0FE",
    marginVertical: 22,
  },


  cardBottom: {
    flexDirection: "row",
    gap: 35,
    flexWrap: "wrap",
  },


  infoLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#545454",
    marginBottom: 5,
    fontFamily: "Inter",
  },


  infoValue: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Inter",
  },


  /* =========================
     DECISÃO
  ========================= */

  decisionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#D7E5FA",
    marginBottom: 28,
    shadowColor: "#004AAD",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 2,
  },


  decisionCardAlert: {
    borderColor: "#FF944E",
  },


  decisionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  decisionTitleArea: {
    flex: 1,
    paddingRight: 15,
  },


  decisionLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#545454",
    marginBottom: 7,
    fontFamily: "Inter",
  },


  decisionStatus: {
    fontSize: 15,
    fontWeight: "800",
    color: "#004AAD",
    fontFamily: "LexendGiga",
  },


  decisionCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF0FE",
    borderWidth: 1,
    borderColor: "#38B6FF",
  },


  decisionCircleAlert: {
    borderColor: "#FF944E",
    backgroundColor: "#FFF1E8",
  },


  decisionIcon: {
    fontSize: 20,
    fontWeight: "800",
    color: "#004AAD",
  },


  decisionReason: {
    fontSize: 12,
    lineHeight: 18,
    color: "#545454",
    fontFamily: "Inter",
  },


  decisionAction: {
    marginTop: 7,
    fontSize: 12,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Inter",
  },


  /* =========================
     SEÇÕES
  ========================= */

  sectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#004AAD",
    marginBottom: 12,
    fontFamily: "Inter",
  },


  /* =========================
     SENSORES
  ========================= */

  sensorGrid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },


  sensorCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D7E5FA",
    shadowColor: "#004AAD",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,
  },


  sensorIcon: {
    fontSize: 23,
    color: "#38B6FF",
    fontWeight: "700",
    marginBottom: 12,
  },


  sensorLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#545454",
    fontFamily: "Inter",
  },


  sensorValue: {
    marginTop: 7,
    fontSize: 25,
    fontWeight: "800",
    color: "#000000",
    fontFamily: "LexendGiga",
  },


  sensorStatus: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#004AAD",
    fontFamily: "Inter",
  },


  warningText: {
    color: "#FF944E",
  },


  /* =========================
     CHUVA
  ========================= */

  rainCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D7E5FA",
    marginBottom: 28,
    shadowColor: "#004AAD",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,
  },


  rainCardAlert: {
    borderColor: "#FF944E",
    backgroundColor: "#FFFDFC",
  },


  rainIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF0FE",
    marginRight: 14,
  },


  rainIconAlert: {
    backgroundColor: "#FFF1E8",
  },


  rainIcon: {
    fontSize: 23,
    color: "#004AAD",
  },


  rainInfo: {
    flex: 1,
  },


  rainTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Inter",
  },


  rainDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 16,
    color: "#545454",
    fontFamily: "Inter",
  },


  rainIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00C2CB",
    marginLeft: 10,
  },


  rainIndicatorAlert: {
    backgroundColor: "#FF944E",
  },


  /* =========================
     BOTÕES
  ========================= */

  primaryButton: {
    minHeight: 70,
    borderRadius: 20,
    backgroundColor: "#004AAD",
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },


  buttonDisabled: {
    opacity: 0.6,
  },


  buttonTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#FFFFFF",
    fontFamily: "Inter",
  },


  buttonSubtitle: {
    marginTop: 5,
    fontSize: 10,
    color: "#EAF0FE",
    fontFamily: "Inter",
  },


  buttonArrow: {
    fontSize: 27,
    color: "#FFFFFF",
    fontWeight: "300",
  },


  secondaryButton: {
    minHeight: 70,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D7E5FA",
    marginBottom: 28,
  },


  secondaryButtonTitle: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#004AAD",
    fontFamily: "Inter",
  },


  secondaryButtonSubtitle: {
    marginTop: 5,
    fontSize: 10,
    color: "#545454",
    fontFamily: "Inter",
  },


  secondaryButtonIcon: {
    fontSize: 20,
    color: "#38B6FF",
  },


  /* =========================
     ATIVIDADE
  ========================= */

  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D7E5FA",
  },


  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF0FE",
    marginRight: 13,
  },


  activityIconText: {
    color: "#004AAD",
    fontSize: 17,
    fontWeight: "800",
  },


  activityContent: {
    flex: 1,
  },


  activityTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000000",
    fontFamily: "Inter",
  },


  activityDescription: {
    marginTop: 4,
    fontSize: 10,
    color: "#545454",
    fontFamily: "Inter",
  },


  activityTime: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#94A3B8",
    marginLeft: 8,
    fontFamily: "Inter",
  },


  /* =========================
     SAIR
  ========================= */

  logoutButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E5FA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },


  logoutText: {
    fontFamily: "InterBold",
    fontSize: 9,
    letterSpacing: 1.3,
    color: "#004AAD",
  },


  /* =========================
     FOOTER
  ========================= */

  footer: {
    alignItems: "center",
    marginTop: 45,
    paddingBottom: 10,
  },


  footerLogo: {
    fontFamily: "LexendGigaBold",
    fontSize: 13,
    letterSpacing: 3,
    color: "#004AAD",
  },


  footerText: {
    marginTop: 7,
    fontFamily: "Inter",
    fontSize: 9,
    color: "#64748B",
    textAlign: "center",
  },

});