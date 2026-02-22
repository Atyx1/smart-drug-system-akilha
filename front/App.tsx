import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ManagerProvider } from "@/context/ManagerContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { LoggingProvider } from "@/context/LoggingContext";
import { CompartmentProvider } from "@/context/CompartmentContext";
import AppNavigator from "./navigation/AppNavigator";
import UpdateNotification from "@/components/alNoMessages/UpdateNotification";
import { DeviceProvider } from "@/context/DeviceContext";
import { ToastProvider } from "@/components/toast/ToastManager";
import ToastInitializer from "@/components/toast/ToastInitializer";

const rootViewStyle = { flex: 1 };

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <ActionSheetProvider>
                <ManagerProvider>
                  <LoggingProvider>
                    <DeviceProvider>
                      <CompartmentProvider>
                        <ToastProvider>
                          <GestureHandlerRootView style={rootViewStyle}>
                            <StatusBar style="auto" />
                            <ToastInitializer />
                            <AppNavigator />
                            <UpdateNotification />
                          </GestureHandlerRootView>
                        </ToastProvider>
                      </CompartmentProvider>
                    </DeviceProvider>
                  </LoggingProvider>
                </ManagerProvider>
              </ActionSheetProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
