import { useIsFocused } from "@react-navigation/native";
import { useLayoutEffect, useEffect, useState, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Animated,
  Easing,
  Pressable,
  Dimensions,
} from "react-native";
import styles from "../styles/homestyles.js";
import Database from "../Database.js";

const HomeScreen = ({ navigation }) => {
  const [hikeApp, setHikes] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedHikeId, setExpandedHikeId] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  const screenWidth = Dimensions.get("window").width;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 16 }} onPress={toggleMenu}>
          <MaterialIcons name='menu' size={26} color='#000' />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => navigation.navigate("Add Hike")}>
          <MaterialIcons name='add' size={26} color='#000' />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
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
  };

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

  const renderHikeItem = ({ item }) => {
    const isExpanded = expandedHikeId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={() => setExpandedHikeId(isExpanded ? null : item.id)}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Location:</Text> {item.location}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Date:</Text> {item.date}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Parking:</Text> {item.parking}
          </Text>

          <Text style={styles.label}>
            <Text style={styles.bold}>Length:</Text> {item.length}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Level:</Text> {item.level}
          </Text>
          <Text style={styles.label}>
            <Text style={styles.bold}>Description:</Text> {item.description}
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
    <View style={styles.container}>
      {hikeApp.length > 0 ? (
        <FlatList
          data={hikeApp}
          renderItem={renderHikeItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hikes available</Text>
        </View>
      )}

      {/* Menu ngay dưới icon 3 gạch */}
      <Modal transparent visible={menuVisible} animationType='none'>
        <Pressable style={styles.overlay} onPressOut={toggleMenu}>
          <Animated.View
            style={[
              styles.dropdown,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
                position: "absolute",
                top: 55,
                left: 15,
              },
            ]}>
            <View style={styles.triangle} />

            <TouchableOpacity style={styles.menuItem}>
              <MaterialIcons name='settings' size={22} color='#000' />
              <Text style={styles.menuText}>Setting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert("Đăng xuất", "Bạn đã đăng xuất!");
              }}>
              <MaterialIcons name='delete' size={22} color='#000' />
              <Text style={styles.menuText}>Delete All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                Alert.alert("Đăng xuất", "Bạn đã đăng xuất!");
              }}>
              <MaterialIcons name='add' size={22} color='#000' />
              <Text style={styles.menuText}>Fields Hike</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default HomeScreen;
