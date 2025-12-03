import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../styles/addscreenstyles";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from "react-native";
import Database from "../Database";

const EntryScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [parking, setParking] = useState(null);
  const [length, setLength] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");

  const [showPicker, setShowPicker] = useState(false);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  useEffect(() => {
    setConfirmationModalVisible(false);
  }, []);

  const handleConfirmAddHike = async () => {
    try {
      await Database.addHike(
        name,
        location,
        formattedDate,
        parking,
        length,
        level,
        description
      );
      Alert.alert("Success", "Hike added successfully!");
      setConfirmationModalVisible(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to add hike: " + error.message);
    }
  };

  const handleCancelAddHike = () => {
    setConfirmationModalVisible(false);
    Alert.alert("Canceled", "Hike addition canceled.");
  };

  const handleAddHike = () => {
    if (
      !name ||
      !location ||
      !formattedDate ||
      !parking ||
      !length ||
      !level ||
      !description
    ) {
      Alert.alert("Error", "Please enter all fields.");
      return;
    }
    setConfirmationModalVisible(true);
  };

  const handleParking = (option) => {
    setParking(option);
  };

  const options = ["Yes", "No"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name of the hike:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder='Enter name'
      />

      <Text style={styles.label}>Location:</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder='Enter location'
        multiline
      />

      {/* ----------- DATE PICKER ----------- */}
      <Text style={styles.label}>Date of the hike:</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}>
        <Text style={styles.dateButtonText}>Select Date</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Selected Date:</Text>
      <Text style={styles.dateText}>{formattedDate}</Text>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode='date'
          display='spinner'
          onChange={(event, selectedDate) => {
            if (event.type === "dismissed") {
              setShowPicker(false);
              return;
            }
            const currentDate = selectedDate || date;
            setShowPicker(false);
            setDate(currentDate);
            setFormattedDate(currentDate.toISOString().split("T")[0]);
          }}
        />
      )}

      {/* ----------- PARKING ----------- */}
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
            <Text
              style={[
                styles.radioButtonText,
                parking === option && styles.radioButtonTextSelected,
              ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ----------- LENGTH ----------- */}
      <Text style={styles.label}>Length of the hike:</Text>
      <TextInput
        style={styles.input}
        value={length}
        onChangeText={setLength}
        placeholder='Enter length'
        multiline
      />

      {/* ----------- LEVEL ----------- */}
      <Text style={styles.label}>Difficulty level:</Text>
      <Picker
        selectedValue={level}
        style={styles.input}
        itemStyle={styles.pickerItem}
        onValueChange={(itemValue) => setLevel(itemValue)}>
        <Picker.Item label='Select level' value='' />
        <Picker.Item label='Beginner' value='beginner' />
        <Picker.Item label='Easy' value='easy' />
        <Picker.Item label='Normal' value='normal' />
        <Picker.Item label='Medium' value='medium' />
        <Picker.Item label='High' value='high' />
      </Picker>

      {/* ----------- DESCRIPTION ----------- */}
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder='Enter description'
        multiline
      />

      {/* ----------- ADD BUTTON ----------- */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddHike}>
        <Text style={styles.addButtonText}>Add Hike</Text>
      </TouchableOpacity>

      {/* ----------- CONFIRMATION MODAL ----------- */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={isConfirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Hike Information</Text>

            <Text>Name: {name}</Text>
            <Text>Location: {location}</Text>
            <Text>Date: {formattedDate}</Text>
            <Text>Parking: {parking}</Text>
            <Text>Length: {length}</Text>
            <Text>Level: {level}</Text>
            <Text>Description: {description}</Text>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: "green" }]}
              onPress={handleConfirmAddHike}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: "red" }]}
              onPress={handleCancelAddHike}>
              <Text style={styles.confirmButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default EntryScreen;
