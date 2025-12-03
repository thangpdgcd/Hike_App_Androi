import { useIsFocused } from "@react-navigation/native";
import { useLayoutEffect, useEffect, useState, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Animated,
  Easing,
  Dimensions,
  Pressable,
  StyleSheet,
} from "react-native";
import styles from "../styles/homestyles.js";
import Database from "../Database.js";

const HomeScreen = ({ navigation }) => {
  const [hikeApp, setHikes] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedHikeId, setExpandedHikeId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  const screenWidth = Dimensions.get("window").width;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 16 }}
          onPress={() => setMenuVisible((prev) => !prev)}>
          <MaterialIcons
            name='menu'
            size={26}
            color={darkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => navigation.navigate("Add Hike")}>
          <MaterialIcons
            name='add'
            size={26}
            color={darkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: darkMode ? "#020617" : "#fff",
      },
      headerTitleStyle: {
        color: darkMode ? "#fff" : "#000",
      },
    });
  }, [navigation, darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Database.getHike();
        setHikes(data);
      } catch (error) {
        console.log("Error fetching hikeApp", error);
      }
    };
    fetchData();
  }, [isFocused]);

  // Animation cho menu mỗi lần mở
  useEffect(() => {
    if (menuVisible) {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [menuVisible]);

  const handleDeleteHike = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this hike?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            await Database.deleteHike(id);
            const data = await Database.getHike();
            setHikes(data);
          },
        },
      ]
    );
  };

  // ⭐ HÀM XOÁ TẤT CẢ
  const handleDeleteAllHike = () => {
    Alert.alert(
      "Delete all hikes",
      "Are you sure you want to delete ALL hikes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          style: "destructive",
          onPress: async () => {
            try {
              await Database.deleteAllHike();
              const data = await Database.getHike(); // lúc này sẽ là []
              setHikes(data);
              setMenuVisible(false);
            } catch (err) {
              console.log("Error deleting all hikes:", err);
            }
          },
        },
      ]
    );
  };

  const renderHikeItem = ({ item }) => {
    const isExpanded = expandedHikeId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.card,
          darkMode && { backgroundColor: "#0f172a", borderColor: "#1f2937" },
        ]}
        onPress={() => setExpandedHikeId(isExpanded ? null : item.id)}>
        <View style={styles.infoContainer}>
          <Text style={[styles.title, darkMode && { color: "#e5e7eb" }]}>
            {item.name}
          </Text>

          <Text style={[styles.label, darkMode && { color: "#cbd5f5" }]}>
            <Text style={[styles.bold, darkMode && { color: "#e5e7eb" }]}>
              Location:
            </Text>{" "}
            {item.location}
          </Text>

          <Text style={[styles.label, darkMode && { color: "#cbd5f5" }]}>
            <Text style={[styles.bold, darkMode && { color: "#e5e7eb" }]}>
              Date:
            </Text>{" "}
            {item.date}
          </Text>

          <Text style={[styles.label, darkMode && { color: "#cbd5f5" }]}>
            <Text style={[styles.bold, darkMode && { color: "#e5e7eb" }]}>
              Parking:
            </Text>{" "}
            {item.parking}
          </Text>

          <Text style={[styles.label, darkMode && { color: "#cbd5f5" }]}>
            <Text style={[styles.bold, darkMode && { color: "#e5e7eb" }]}>
              Length:
            </Text>{" "}
            {item.length}
          </Text>

          <Text style={[styles.label, darkMode && { color: "#cbd5f5" }]}>
            <Text style={[styles.bold, darkMode && { color: "#e5e7eb" }]}>
              Level:
            </Text>{" "}
            {item.level}
          </Text>

          <Text style={[styles.label, darkMode && { color: "#cbd5f5" }]}>
            <Text style={[styles.bold, darkMode && { color: "#e5e7eb" }]}>
              Description:
            </Text>{" "}
            {item.description}
          </Text>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Detail", { todo: item })}
              style={[styles.actionButton, { backgroundColor: "#27ae60" }]}>
              <MaterialIcons name='book' size={20} color='#fff' />
              <Text style={styles.actionText}>View Detail</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#e74c3c" }]}
              onPress={() => handleDeleteHike(item.id)}>
              <MaterialIcons name='delete' size={20} color='#fff' />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, darkMode && { backgroundColor: "#020617" }]}>
      {hikeApp.length > 0 ? (
        <FlatList
          data={hikeApp}
          renderItem={renderHikeItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, darkMode && { color: "#e5e7eb" }]}>
            No hikes available
          </Text>
        </View>
      )}

      {/* Submenu + overlay */}
      {menuVisible && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { zIndex: 20, justifyContent: "flex-start" },
          ]}>
          {/* overlay trong suốt, bấm để tắt menu */}
          <Pressable
            style={[styles.overlay, { backgroundColor: "transparent" }]}
            onPress={() => setMenuVisible(false)}
          />

          {/* dropdown nằm trên overlay */}
          <Animated.View
            style={[
              styles.dropdown,
              {
                position: "absolute",
                left: 5,
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
                backgroundColor: darkMode ? "#020617" : "#fff",
              },
            ]}>
            <View
              style={[
                styles.triangle,
                darkMode && { borderBottomColor: "#020617" },
              ]}
            />

            {/* Dark Mode toggle */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setDarkMode((prev) => !prev)}>
              <MaterialIcons
                name={darkMode ? "light-mode" : "dark-mode"}
                size={22}
                color={darkMode ? "#e5e7eb" : "#000"}
              />
              <Text style={[styles.menuText, darkMode && { color: "#e5e7eb" }]}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Text>
            </TouchableOpacity>

            {/* ⭐ DÙNG HÀM DELETE ALL THẬT SỰ */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDeleteAllHike}>
              <MaterialIcons
                name='delete'
                size={22}
                color={darkMode ? "#e5e7eb" : "#000"}
              />
              <Text style={[styles.menuText, darkMode && { color: "#e5e7eb" }]}>
                Delete All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert("Fields Hike", "Function under development.");
              }}>
              <MaterialIcons
                name='add'
                size={22}
                color={darkMode ? "#e5e7eb" : "#000"}
              />
              <Text style={[styles.menuText, darkMode && { color: "#e5e7eb" }]}>
                Fields Hike
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;
