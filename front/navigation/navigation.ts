// types/navigation.ts
import { RouteProp, NavigatorScreenParams } from "@react-navigation/native";

import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Root Stack Types
// types/navigation.ts
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AdminStack: NavigatorScreenParams<AdminStackParamList>;
  ManagerStack: NavigatorScreenParams<ManagerStackParamList>;
  UserStack: NavigatorScreenParams<UserStackParamList>;
  PendingApproval: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  MedicationRegister: undefined;
  ForgotPassword: undefined;
  RegistrationSuccess: {
    message: string;
  };
  RegisterSuccess: {
    userType: string;
    facilityName: string;
  };
};

// Common Stack Types (Shared screens)
export type CommonStackParamList = {
  Profile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  Notifications: undefined;
};

// Admin Tab Types
export type AdminTabParamList = {
  DailyEntry: undefined;
  SessionHistory: undefined;
  AdminTasks: undefined;
};

// Manager Tab Types
export type ManagerTabParamList = {
  ManageUsers: undefined;
  ApproveRequests: undefined;
  ReportsScreen: undefined;
  Dashboard: undefined;
  ManagerTasks: undefined;
};

// User Tab Types
export type UserTabParamList = {
  UserTasks: undefined;
  PendingRequests: undefined;
};

// Task Specific Stack Param Lists
export type ManagerTaskStackParamList = {
  ManagerTasks: undefined;
  TaskDetails: { taskId: number; instanceId: number; isUserView?: boolean };
  TaskWizard: undefined;
};

export type UserTaskStackParamList = {
  UserTasks: undefined;
  TaskDetails: { taskId: number; instanceId: number; isUserView?: boolean };
  SubmitTask: { taskId: number; instanceId: number };
};

export type AdminTaskStackParamList = {
  AdminTasks: undefined;
  TaskDetails: { taskId: number; instanceId: number; isUserView?: boolean };
};

export type ManagerStackParamList = {
  Tasks: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type UserStackParamList = {
  Tasks: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type AdminStackParamList = {
  Dashboard: undefined;
  Stores: undefined;
  Tasks: undefined;
  Users: undefined;
  Settings: undefined;
  Profile: undefined;
};

// Navigation Props
export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp =
  NativeStackNavigationProp<AuthStackParamList>;
export type CommonStackNavigationProp =
  NativeStackNavigationProp<CommonStackParamList>;
export type AdminTabNavigationProp = BottomTabNavigationProp<AdminTabParamList>;
export type ManagerTabNavigationProp =
  BottomTabNavigationProp<ManagerTabParamList>;
export type UserTabNavigationProp = BottomTabNavigationProp<UserTabParamList>;

export type ManagerTaskStackNavigationProp<
  T extends keyof ManagerTaskStackParamList
> = NativeStackNavigationProp<ManagerTaskStackParamList, T>;

export type UserTaskStackNavigationProp<
  T extends keyof UserTaskStackParamList
> = NativeStackNavigationProp<UserTaskStackParamList, T>;

export type AdminTaskStackNavigationProp<
  T extends keyof AdminTaskStackParamList
> = NativeStackNavigationProp<AdminTaskStackParamList, T>;

export type ManagerStackNavigationProp<T extends keyof ManagerStackParamList> =
  NativeStackNavigationProp<ManagerStackParamList, T>;

export type UserStackNavigationProp<T extends keyof UserStackParamList> =
  NativeStackNavigationProp<UserStackParamList, T>;

export type AdminStackNavigationProp<T extends keyof AdminStackParamList> =
  NativeStackNavigationProp<AdminStackParamList, T>;

// Route Props
export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

export type AuthStackRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;

export type CommonStackRouteProp<T extends keyof CommonStackParamList> =
  RouteProp<CommonStackParamList, T>;

export type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "ForgotPassword">;
  route: RouteProp<AuthStackParamList, "ForgotPassword">;
};

// Screen Props
export interface AuthScreenProps {
  navigation: AuthStackNavigationProp;
  route: AuthStackRouteProp<keyof AuthStackParamList>;
}

export interface CommonScreenProps {
  navigation: CommonStackNavigationProp;
  route: CommonStackRouteProp<keyof CommonStackParamList>;
}

export interface RegistrationSuccessScreenProps {
  navigation: AuthStackNavigationProp;
  route: AuthStackRouteProp<"RegistrationSuccess">;
}

// Composite Navigation Types (for nested navigators)
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = {
  navigation: NativeStackNavigationProp<AuthStackParamList, T>;
  route: RouteProp<AuthStackParamList, T>;
};

export type CommonStackScreenProps<T extends keyof CommonStackParamList> = {
  navigation: NativeStackNavigationProp<CommonStackParamList, T>;
  route: RouteProp<CommonStackParamList, T>;
};

export type ManagerTaskStackRouteProp<
  T extends keyof ManagerTaskStackParamList
> = RouteProp<ManagerTaskStackParamList, T>;

export type UserTaskStackRouteProp<T extends keyof UserTaskStackParamList> =
  RouteProp<UserTaskStackParamList, T>;

export type AdminTaskStackRouteProp<T extends keyof AdminTaskStackParamList> =
  RouteProp<AdminTaskStackParamList, T>;
