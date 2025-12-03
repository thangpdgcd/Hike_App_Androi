import { useState } from "react";
import styles from "../styles/searchstyles";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Database from "../Database";
import { MaterialIcons } from "@expo/vector-icons";

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    setHasSearched(true);
    Keyboard.dismiss();

    const data = await Database.getHikesByName(searchText.trim());
    setSearchResults(data || []);
    setLoading(false);
  };

  const handlePressItem = (item) => {
    // 👇 ĐI TỚI MÀN EDIT
    // Đổi "Edit" thành tên route thật sự của màn chỉnh sửa, ví dụ: "Edit Hike"
    navigation.navigate("Edit", { todo: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handlePressItem(item)}
      style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name='terrain' size={22} color='#2563EB' />
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>

      {item.location ? (
        <Text style={styles.cardMeta}>
          <Text style={styles.cardMetaLabel}>Location: </Text>
          {item.location}
        </Text>
      ) : null}

      {item.date ? (
        <Text style={styles.cardMeta}>
          <Text style={styles.cardMetaLabel}>Date: </Text>
          {item.date}
        </Text>
      ) : null}

      {item.level ? (
        <Text style={styles.cardMeta}>
          <Text style={styles.cardMetaLabel}>Level: </Text>
          {item.level}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Search hikes</Text>
      <Text style={styles.subtitle}>
        Type a hike name to quickly find your saved trails.
      </Text>

      {/* Search box */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <MaterialIcons
            name='search'
            size={20}
            color='#9CA3AF'
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder='Search by hike name...'
            placeholderTextColor='#9CA3AF'
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType='search'
            onSubmitEditing={handleSearch}
          />
        </View>

        <TouchableOpacity
          style={[styles.searchButton, !searchText.trim() && { opacity: 0.6 }]}
          activeOpacity={0.8}
          onPress={handleSearch}
          disabled={!searchText.trim() || loading}>
          {loading ? (
            <Text style={styles.searchButtonText}>Searching...</Text>
          ) : (
            <>
              <MaterialIcons name='search' size={18} color='#fff' />
              <Text style={styles.searchButtonText}>Search</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Result info */}
      {hasSearched && (
        <Text style={styles.resultInfo}>
          {searchResults.length > 0
            ? `Found ${searchResults.length} result${
                searchResults.length > 1 ? "s" : ""
              }`
            : "No hikes match your search. Try another name."}
        </Text>
      )}

      {/* List results */}
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          searchResults.length === 0 ? { flexGrow: 1 } : styles.listContent
        }
        ListEmptyComponent={
          !hasSearched ? (
            <View style={styles.emptyState}>
              <MaterialIcons
                name='search'
                size={40}
                color='#CBD5F5'
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.emptyTitle}>Start searching</Text>
              <Text style={styles.emptyText}>
                Enter a hike name above and tap{" "}
                <Text style={{ fontWeight: "600" }}>Search</Text> to see results
                here.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default SearchScreen;
