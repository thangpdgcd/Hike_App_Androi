// import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
// import Database from "./Database";
import { StyleSheet } from "react-native";
import DetailScreen from "../App_Androi/screen/DetailScreen.js";
import AddScreen from "../App_Androi/screen/AddScreen.js";
import HomeScreen from "../App_Androi/screen/HomeScreen.js";
import { NavigationContainer } from "@react-navigation/native";
import Database from "../App_Androi/Database.js";
import EditScreen from "../App_Androi/screen/EditScreen.js";
import SearchScreen from "../App_Androi/screen/SearchScreen.js";
import { MaterialIcons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeNavigation = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: "#007AFF",
    }}>
    <Tab.Screen
      name='Home'
      component={HomeScreen}
      style={styles.names}
      options={{
        name: "Home",
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name='home' color={color} size={size} />
        ),
      }}></Tab.Screen>

    <Tab.Screen
      name='SEARCH'
      component={SearchScreen}
      options={{
        name: "Search",
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name='search' color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  useEffect(() => {
    const initDB = async () => {
      const datas = await Database.initDatabase(); // đảm bảo DB sẵn sàng
      console.log("check data", datas);
    };
    initDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Back'>
        <Stack.Screen
          name='Back'
          component={HomeNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Add Hike' component={AddScreen} />
        <Stack.Screen name='Detail' component={DetailScreen} />
        <Stack.Screen name='Edit' component={EditScreen} />
        <Stack.Screen name='Search' component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
const styles = StyleSheet.create({
  names: {
    fontSize: 24,
    color: "#000",
  },
});
