import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAppFonts, colors } from "./src/theme";
import { initDatabase } from "./src/db/database";
import RootNavigator from "./src/navigation/RootNavigator";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const fontsLoaded = useAppFonts();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((err) => {
        console.error("Gagal inisialisasi database:", err);
        setDbReady(true);
      });
  }, []);

  const appReady = fontsLoaded && dbReady;

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        onLayout={onLayoutRootView}
      >
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>

        <StatusBar
          style="dark"
          backgroundColor={colors.background}
          translucent={false}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
