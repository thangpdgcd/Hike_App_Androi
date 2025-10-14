// import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
// import Database from "./Database";
import DetailScreen from "./screens/DetailScreen";
import AddScreen from "../comp1786-react-native-basics/screen/AddScreen";
import HomeScreen from "../comp1786-react-native-basics/screen/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import EditScreen from "./screens/EditScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeNavigation = () => (
  <Tab.Navigator>
    <Tab.Screen name='Home' component={HomeScreen} />
    {/* <Tab.Screen name="Add Hike" component={EntryScreen} /> */}
    <Tab.Screen name='Search' component={SearchScreen} />
  </Tab.Navigator>
);

const App = () => {
  // TODO: Implement Bottom Tab navigation
  useEffect(() => {
    Database.initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
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
