import "./global.css";
import { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

import AppNavigation from "components/navigation/AppNavigation";
import WelcomeScreen from "components/screens/WelcomeScreen";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";

// Prevent splash from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(null);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  useEffect(() => {
    prepareApp();
  }, []);

  const prepareApp = async () => {
    try {
      const name = await AsyncStorage.getItem("userName");
      setIsFirstTime(name === null);
    } catch (e) {
      console.warn(e);
    } finally {
      setAppReady(true);
    }
  };

  // Hide splash ONLY when everything is ready
  const onLayoutRootView = useCallback(async () => {
    if (appReady && fontsLoaded && isFirstTime !== null) {
      await SplashScreen.hideAsync();
    }
  }, [appReady, fontsLoaded, isFirstTime]);

  // ⛔ BLOCK UI COMPLETELY
  if (!appReady || !fontsLoaded || isFirstTime === null) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StatusBar style="light" />
        <NavigationContainer>
          {isFirstTime ? (
            <WelcomeScreen onDone={() => setIsFirstTime(false)} />
          ) : (
            <AppNavigation />
          )}
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
