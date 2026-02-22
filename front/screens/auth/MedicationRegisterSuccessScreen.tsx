import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/localization/i18n";

// Primary color for Akilha Medication Tracking System
const PRIMARY_COLOR = "#5C88C6"; // Medical blue

import { AuthStackParamList } from "@/navigation/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

type MedicationRegisterSuccessScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "RegisterSuccess">;
  route: RouteProp<AuthStackParamList, "RegisterSuccess">;
};

const MedicationRegisterSuccessScreen: React.FC<MedicationRegisterSuccessScreenProps> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { userType, facilityName } = route.params || { userType: "patient", facilityName: "" };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#fff" }]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/akilha.jpg')}
            style={styles.logoImage}
          />
        </View>
        <Text style={[styles.headerTitle, { color: "#333" }]}>Akilha</Text>
      </View>
      
      <View style={styles.successContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="check-circle"
            size={wp("25%")}
            color={PRIMARY_COLOR}
          />
        </View>
        
        <Text style={styles.successTitle}>{t("registration_successful")}</Text>
        
        <Text style={styles.successMessage}>
          {t("your_account_has_been_created")}
        </Text>
        
        <View style={styles.facilityContainer}>
          <MaterialCommunityIcons
            name="hospital-building"
            size={wp("6%")}
            color="#666"
          />
          <Text style={styles.facilityText}>{facilityName}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons 
              name="information-outline" 
              size={wp("5%")} 
              color="#666"
            />
            <Text style={styles.infoText}>
              {t("verification_email_sent")}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialCommunityIcons 
              name="cellphone-check" 
              size={wp("5%")} 
              color="#666" 
            />
            <Text style={styles.infoText}>
              {t("device_pairing_instructions_sent")}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: PRIMARY_COLOR }]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>{t("proceed_to_login")}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {/* Navigate to help/support */}}
        >
          <MaterialCommunityIcons 
            name="help-circle-outline" 
            size={wp("5%")} 
            color={PRIMARY_COLOR} 
          />
          <Text style={[styles.helpButtonText, { color: PRIMARY_COLOR }]}>
            {t("need_help")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("3%"),
    marginBottom: hp("3%"),
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: wp("35%"),
    height: wp("35%"),
    marginBottom: hp("2%"),
  },
  logoImage: {
    width: wp("33%"),
    height: wp("33%"),
    borderRadius: wp("16.5%"),
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  headerTitle: {
    fontSize: wp("8%"),
    fontWeight: "bold",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: wp("5%"),
  },
  iconContainer: {
    marginBottom: hp("3%"),
  },
  successTitle: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#333",
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  successMessage: {
    fontSize: wp("4%"),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("3%"),
    lineHeight: wp("5.5%"),
  },
  facilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 12,
    marginBottom: hp("4%"),
  },
  facilityText: {
    fontSize: wp("4%"),
    color: "#333",
    fontWeight: "600",
    marginLeft: wp("2%"),
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: wp("5%"),
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp("2%"),
  },
  infoText: {
    fontSize: wp("3.8%"),
    color: "#555",
    marginLeft: wp("3%"),
    flex: 1,
  },
  bottomContainer: {
    padding: wp("5%"),
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  loginButton: {
    paddingVertical: hp("2%"),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("2%"),
  },
  loginButtonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("1%"),
  },
  helpButtonText: {
    fontSize: wp("3.8%"),
    marginLeft: wp("1%"),
  },
});

export default MedicationRegisterSuccessScreen;
