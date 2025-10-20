import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import Database from "../Database";

const EditScreen = ({ navigation, route }) => {
  const todo = route?.params?.todo ?? {};
  console.log("✅ Received todo:", todo);
  const [id, setId] = useState(todo.id);
  const [name, setName] = useState(todo.name);
  const [location, setLocation] = useState(todo.location);
  const [date, setDate] = useState(new Date(todo.date || new Date()));
  const [showPicker, setShowPicker] = useState(false); // 🔹 Ẩn picker ban đầu
  const [formattedDate, setFormattedDate] = useState(
    todo.date || date.toISOString().split("T")[0]
  );

  const [parking, setParking] = useState(todo.parking);
  const [length, setLength] = useState(todo.length);
  const [level, setLevel] = useState(todo.level);
  const [description, setDescription] = useState(todo.description);

  const handleParking = (option) => setParking(option);

  const handleEditHike = async () => {
    try {
      const hasChanges =
        name !== todo.name ||
        location !== todo.location ||
        formattedDate !== todo.date ||
        parking !== todo.parking ||
        length !== todo.length ||
        level !== todo.level ||
        description !== todo.description;

      if (!hasChanges) {
        Alert.alert("No Change", "No meaningful changes were made.");
        return;
      }

      if (
        !name ||
        !location ||
        !date ||
        !parking ||
        !length ||
        !level ||
        !description
      ) {
        Alert.alert("Validation Error", "Please fill in all fields.");
        return;
      }

      Alert.alert("CONFIRM EDIT!", "Are you sure you want to edit this hike?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            const rowsAffected = await Database.editHike(
              id,
              name,
              location,
              formattedDate,
              parking,
              length,
              level,
              description
            );

            if (rowsAffected > 0) {
              navigation.goBack();
            } else {
              Alert.alert(`Hike with ID ${id} not found.`);
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to edit the hike. Please try again.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false); // 🔹 Ẩn sau khi chọn
    if (selectedDate) {
      const currentDate = selectedDate;
      setDate(currentDate);
      setFormattedDate(currentDate.toISOString().split("T")[0]);
    }
  };

  const options = ["Yes", "No"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name of the hike:</Text>
      <TextInput
        style={styles.input}
        defaultValue={todo.name}
        onChangeText={setName}
        placeholder='Enter name'
      />

      <Text style={styles.label}>Location:</Text>
      <TextInput
        style={styles.input}
        defaultValue={todo.location}
        onChangeText={setLocation}
        placeholder='Enter location'
        multiline
      />

      <Text style={styles.label}>Date of the hike:</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)} // 🔹 Chỉ mở picker khi nhấn
      >
        <Text style={styles.dateText}>{formattedDate}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode='date'
          display='spinner'
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Parking available:</Text>
      <View style={styles.radioButtonContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.radioButton,
              parking === option && styles.radioButtonSelected,
            ]}
            onPress={() => handleParking(option)}>
            <Text style={{ color: parking === option ? "white" : "black" }}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Length of the hike:</Text>
      <TextInput
        style={styles.input}
        defaultValue={todo.length}
        onChangeText={setLength}
        placeholder='Enter length'
        multiline
      />

      <Text style={styles.label}>Difficulty level:</Text>
      <Picker
        selectedValue={level}
        onValueChange={(itemValue) => setLevel(itemValue)}>
        <Picker.Item label='Beginner' value='beginner' />
        <Picker.Item label='Easy' value='easy' />
        <Picker.Item label='Normal' value='normal' />
        <Picker.Item label='Medium' value='medium' />
        <Picker.Item label='High' value='high' />
      </Picker>

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        defaultValue={todo.description}
        onChangeText={setDescription}
        placeholder='Enter description'
        multiline
      />

      <TouchableOpacity style={styles.editButton} onPress={handleEditHike}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
    padding: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  editButton: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  radioButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    padding: 12,
    marginRight: 8,
    alignItems: "center",
  },
  radioButtonSelected: {
    backgroundColor: "green",
  },
});

export default EditScreen;
