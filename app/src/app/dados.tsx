import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from "react-native";

import { useCallback, useEffect, useState } from "react";

import {
  getEvents,
  getMetrics,
} from "../services/retractaApi";


type Evento = {
  tipo: string;
  descricao: string;
  horario?: string;
};


export default function DadosScreen() {

  const [eventos, setEventos] = useState<Evento[]>([]);

  const [retracoes, setRetracoes] = useState(0);

  const [horasExposto, setHorasExposto] = useState(0);

  const [refreshing, setRefreshing] = useState(false);


  const carregarDados = useCallback(async () => {

    try {

      const [eventsData, metricsData] = await Promise.all([
        getEvents(),
        getMetrics(),
      ]);

      setEventos(eventsData.eventos || []);

      setRetracoes(metricsData.retracoes || 0);

      setHorasExposto(metricsData.horas_exposto || 0);

    } catch (error) {

      console.log(
        "Erro ao carregar dados do RETRACTA:",
        error
      );

    }

  }, []);


  useEffect(() => {

    carregarDados();

    const interval = setInterval(() => {
      carregarDados();
    }, 5000);

    return () => clearInterval(interval);

  }, [carregarDados]);


  const atualizarTela = async () => {

    setRefreshing(true);

    await carregarDados();

    setRefreshing(false);

  };


  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={atualizarTela}
          />
        }
      >

        {/* CABEÇALHO */}

        <Text style={styles.overline}>
          MONITORAMENTO
        </Text>

        <Text style={styles.title}>
          Dados
        </Text>

        <Text style={styles.description}>
          Acompanhe o funcionamento do seu RETRACTA
          e o histórico de proteção das roupas.
        </Text>


        {/* MÉTRICAS */}

        <View style={styles.grid}>

          <View style={styles.card}>

            <Text style={styles.label}>
              RETRAÇÕES
            </Text>

            <Text style={styles.value}>
              {retracoes}
            </Text>

            <Text style={styles.caption}>
              Total registrado
            </Text>

          </View>


          <View style={styles.card}>

            <Text style={styles.label}>
              HORAS EXPOSTO
            </Text>

            <Text style={styles.value}>
              {horasExposto.toFixed(2)}h
            </Text>

            <Text style={styles.caption}>
              Tempo acumulado
            </Text>

          </View>

        </View>


        {/* HISTÓRICO */}

        <View style={styles.largeCard}>

          <Text style={styles.label}>
            ATIVIDADE
          </Text>

          <Text style={styles.largeTitle}>
            Histórico do sistema
          </Text>


          {eventos.length === 0 ? (

            <View style={styles.empty}>

              <Text style={styles.emptyTitle}>
                Ainda não há dados
              </Text>

              <Text style={styles.emptyText}>
                As atividades do RETRACTA aparecerão
                aqui conforme o sistema for utilizado.
              </Text>

            </View>

          ) : (

            <View style={styles.eventsList}>

              {eventos
                .slice()
                .reverse()
                .map((evento, index) => (

                  <View
                    key={`${evento.horario || "evento"}-${index}`}
                    style={styles.eventItem}
                  >

                    <View style={styles.eventIndicator} />


                    <View style={styles.eventContent}>

                      <View style={styles.eventHeader}>

                        <Text style={styles.eventType}>
                          {evento.tipo}
                        </Text>

                        {evento.horario && (
                          <Text style={styles.eventTime}>
                            {evento.horario}
                          </Text>
                        )}

                      </View>


                      <Text style={styles.eventDescription}>
                        {evento.descricao}
                      </Text>

                    </View>

                  </View>

                ))}

            </View>

          )}

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
    paddingBottom: 50,
  },


  overline: {
    marginTop: 15,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#004AAD",
  },


  title: {
    marginTop: 8,
    fontSize: 34,
    fontWeight: "800",
    color: "#000000",
  },


  description: {
    marginTop: 8,
    maxWidth: 600,
    fontSize: 14,
    lineHeight: 21,
    color: "#545454",
    marginBottom: 28,
  },


  grid: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },


  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    minHeight: 145,
    borderWidth: 1,
    borderColor: "#EAF0FE",
  },


  label: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#545454",
  },


  value: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: "800",
    color: "#004AAD",
  },


  caption: {
    marginTop: 4,
    fontSize: 11,
    color: "#545454",
  },


  largeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#EAF0FE",
  },


  largeTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },


  empty: {
    marginTop: 22,
    padding: 25,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
  },


  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#545454",
  },


  emptyText: {
    marginTop: 6,
    maxWidth: 500,
    textAlign: "center",
    fontSize: 11,
    lineHeight: 17,
    color: "#94A3B8",
  },


  eventsList: {
    marginTop: 22,
    gap: 12,
  },


  eventItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
  },


  eventIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#004AAD",
    marginTop: 5,
    marginRight: 12,
  },


  eventContent: {
    flex: 1,
  },


  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  eventType: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#004AAD",
  },


  eventTime: {
    fontSize: 10,
    color: "#94A3B8",
  },


  eventDescription: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: "#475569",
  },

});