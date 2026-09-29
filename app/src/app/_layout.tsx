import { Tabs } from "expo-router";
import { useFonts } from "expo-font";

import {
  LexendGiga_400Regular,
  LexendGiga_600SemiBold,
  LexendGiga_700Bold,
} from "@expo-google-fonts/lexend-giga";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    LexendGiga: LexendGiga_400Regular,
    LexendGigaSemiBold:
      LexendGiga_600SemiBold,
    LexendGigaBold:
      LexendGiga_700Bold,

    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold:
      Inter_600SemiBold,
    InterBold: Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          "#004AAD",

        tabBarInactiveTintColor:
          "#545454",

        tabBarStyle: {
          height: 70,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: "#EAF0FE",
          backgroundColor: "#FFFFFF",
        },

        tabBarLabelStyle: {
          fontFamily: "Inter",
          fontSize: 10,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
        }}
      />

      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
        }}
      />

      <Tabs.Screen
        name="dados"
        options={{
          title: "Dados",
        }}
      />

      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Config.",
        }}
      />

      {/* ROTAS DE AUTENTICAÇÃO
          Não aparecem na barra inferior. */}

      <Tabs.Screen
        name="login"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="cadastro"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}