import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import styles from "../styles/detailstyles";
import { MaterialIcons } from "@expo/vector-icons";
const DetailScreen = ({ route, navigation }) => {
  const todo = route?.params?.todo ?? {};
  console.log("✅ Received todo:", todo);

  const formatDate = (date) => {
    const d = new Date(date);
    return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "N/A";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Hike Detail</Text>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{todo.name || "N/A"}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{todo.location || "N/A"}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(todo.date)}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Parking:</Text>
          <Text style={styles.value}>{todo.parking || "N/A"}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Length:</Text>
          <Text style={styles.value}>{todo.length || "N/A"}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Level:</Text>
          <Text style={styles.value}>{todo.level || "N/A"}</Text>
        </View>

        <View style={styles.detailItemColumn}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.valueDesc}>{todo.description || "N/A"}</Text>
        </View>
        <View style={styles.detailproduct}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Edit", { todo })}
            style={[styles.actionButton, { backgroundColor: "#27ae60" }]}>
            <MaterialIcons name='edit' size={20} color='#fff' />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailScreen;
