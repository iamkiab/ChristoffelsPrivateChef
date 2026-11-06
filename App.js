
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const COURSES = ["Starter", "Main Course", "Dessert"];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [menuItems, setMenuItems] = useState([]);

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const clearForm = () => {
    setDishName("");
    setDescription("");
    setCourse("");
    setPrice("");
    setErrorMessage("");
    setEditingItemId(null);
  };

  const saveMenuItem = () => {
    const name = dishName.trim();
    const details = description.trim();
    const cleanPrice = price.trim().replace(",", ".");
    const amount = Number(cleanPrice);

    if (!name || !details || !course || !cleanPrice) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setErrorMessage("Enter a valid price greater than R0.");
      return;
    }

    if (editingItemId !== null) {
      setMenuItems((items) =>
        items.map((item) =>
          item.id === editingItemId
            ? { ...item, dishName: name, description: details, course, price: amount }
            : item
        )
      );
      clearForm();
      setCurrentScreen("home");
      showMessage("Menu Item Updated", `${name} was successfully updated.`);
    } else {
      const newItem = {
        id: Date.now().toString(),
        dishName: name,
        description: details,
        course,
        price: amount,
      };

      setMenuItems((items) => [...items, newItem]);
      clearForm();
      setCurrentScreen("home");
      showMessage("Menu Item Added", `${name} was added successfully.`);
    }
  };

  const showMessage = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const editMenuItem = (item) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(String(item.price));
    setEditingItemId(item.id);
    setErrorMessage("");
    setCurrentScreen("add");
  };

  const deleteMenuItem = (item) => {
    const confirmDelete = () => {
      setMenuItems((items) =>
        items.filter((menuItem) => menuItem.id !== item.id)
      );
      showMessage("Item Deleted", `${item.dishName} was removed from the menu.`);
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Are you sure you want to delete ${item.dishName}?`)) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        "Delete Menu Item",
        `Are you sure you want to delete ${item.dishName}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: confirmDelete },
        ]
      );
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesName = item.dishName
      .toLowerCase()
      .includes(searchText.trim().toLowerCase());

    const matchesCourse =
      selectedFilter === "All" || item.course === selectedFilter;

    return matchesName && matchesCourse;
  });

  const totalItems = menuItems.length;
  const averagePrice =
    totalItems > 0
      ? menuItems.reduce((total, item) => total + item.price, 0) / totalItems
      : 0;

  const courseCount = (courseName) =>
    menuItems.filter((item) => item.course === courseName).length;

  const displayMenuItem = ({ item }) => (
    <View style={styles.menuCard}>
      <View style={styles.cardHeading}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <Text style={styles.courseBadge}>{item.course}</Text>
      </View>

      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>R{item.price.toFixed(2)}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editMenuItem(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteMenuItem(item)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (currentScreen === "add") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF8EE" />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.formContainer}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                clearForm();
                setCurrentScreen("home");
              }}
            >
              <Text style={styles.backButtonText}>← Back to Menu</Text>
            </TouchableOpacity>

            <Text style={styles.formTitle}>
              {editingItemId !== null ? "Edit Menu Item" : "Add Menu Item"}
            </Text>
            <Text style={styles.formSubtitle}>
              Enter the details of your dish.
            </Text>

            <Text style={styles.label}>Dish Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Butternut Veloute"
              placeholderTextColor="#8A8178"
              value={dishName}
              onChangeText={setDishName}
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Enter a short description"
              placeholderTextColor="#8A8178"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.label}>Course *</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={course} onValueChange={setCourse}>
                <Picker.Item label="Select a course" value="" />
                {COURSES.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Price (R) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 85.00"
              placeholderTextColor="#8A8178"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />

            {!!errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}

            <TouchableOpacity style={styles.mainButton} onPress={saveMenuItem}>
              <Text style={styles.mainButtonText}>
                {editingItemId !== null ? "Save Changes" : "Add Dish to Menu"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4A2D20" />

      <View style={styles.container}>
        <View style={styles.homeHeader}>
          <Text style={styles.homeTitle}>Christoffel's Menu</Text>
          <Text style={styles.homeSubtitle}>Private Chef Menu Manager</Text>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.homeContent}
        >
          <View style={styles.menuHeading}>
            <Text style={styles.sectionTitle}>Current Menu</Text>
            <Text style={styles.itemCount}>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Text>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search menu by dish name..."
            placeholderTextColor="#8A8178"
            value={searchText}
            onChangeText={setSearchText}
          />

          <Text style={styles.label}>Filter by Course</Text>
          <View style={styles.filterRow}>
            {["All", ...COURSES].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.activeFilter,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {(searchText !== "" || selectedFilter !== "All") && (
            <TouchableOpacity
              onPress={() => {
                setSearchText("");
                setSelectedFilter("All");
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear Search and Filter</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Menu Items</Text>

          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <View key={item.id}>
                {displayMenuItem({ item })}
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                {menuItems.length === 0
                  ? "No menu items added yet"
                  : "No matching dishes found"}
              </Text>
              <Text style={styles.emptyText}>
                {menuItems.length === 0
                  ? "Add your first dish using the button below."
                  : "Try another search or clear your filters."}
              </Text>
            </View>
          )}

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Menu Statistics</Text>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Menu Items</Text>
              <Text style={styles.statValue}>{totalItems}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Average Menu Price</Text>
              <Text style={styles.statValue}>R{averagePrice.toFixed(2)}</Text>
            </View>

            <Text style={styles.statsSubtitle}>Items per Course</Text>

            {COURSES.map((courseName) => (
              <View key={courseName} style={styles.courseStat}>
                <Text style={styles.courseStatName}>{courseName}</Text>
                <Text style={styles.courseStatValue}>
                  {courseCount(courseName)}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => {
              clearForm();
              setCurrentScreen("add");
            }}
          >
            <Text style={styles.mainButtonText}>+ Add Menu Item</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF8EE" },
  container: { flex: 1, backgroundColor: "#FFF8EE" },
  homeHeader: {
    backgroundColor: "#4A2D20",
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 25,
  },
  homeTitle: { color: "#FFFFFF", fontSize: 28, fontWeight: "bold" },
  homeSubtitle: { color: "#EEDBC8", fontSize: 14, marginTop: 5 },
  homeContent: { paddingHorizontal: 20, paddingBottom: 30 },
  menuHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 22,
    paddingBottom: 10,
  },
  sectionTitle: {
    color: "#4A2D20",
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 10,
  },
  itemCount: { color: "#6D625A", fontSize: 14 },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9CABE",
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    color: "#2E2723",
    marginTop: 8,
  },
  label: {
    color: "#3F332D",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 7,
  },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  filterButton: {
    borderWidth: 1,
    borderColor: "#C88454",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 5,
  },
  activeFilter: { backgroundColor: "#9A5B35" },
  filterText: { color: "#7A4527", fontSize: 12 },
  activeFilterText: { color: "#FFFFFF", fontWeight: "bold" },
  clearButton: { alignSelf: "flex-end", padding: 8 },
  clearButtonText: { color: "#9A5B35", fontWeight: "600" },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#C88454",
    elevation: 2,
  },
  cardHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dishName: {
    color: "#352923",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  courseBadge: {
    color: "#7A4527",
    backgroundColor: "#F5E5D5",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    overflow: "hidden",
  },
  description: { color: "#6D625A", fontSize: 14, lineHeight: 20, marginTop: 9 },
  price: {
    color: "#9A5B35",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 11,
  },
  actionButtons: { flexDirection: "row", marginTop: 15, gap: 10 },
  editButton: {
    flex: 1,
    backgroundColor: "#9A5B35",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#B3261E",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 10,
  },
  actionButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "#F7EBDD",
    borderRadius: 14,
    padding: 25,
    marginTop: 10,
  },
  emptyTitle: {
    color: "#4A2D20",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyText: {
    color: "#6D625A",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  statsContainer: {
    backgroundColor: "#F7EBDD",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  statLabel: { color: "#6D625A", fontSize: 14 },
  statValue: {
    color: "#9A5B35",
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 5,
  },
  statsSubtitle: {
    color: "#4A2D20",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  courseStat: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E3D0BF",
  },
  courseStatName: { color: "#4A2D20", fontSize: 14 },
  courseStatValue: { color: "#9A5B35", fontWeight: "bold", fontSize: 15 },
  bottomSection: { paddingHorizontal: 20, paddingBottom: 20 },
  mainButton: {
    backgroundColor: "#9A5B35",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 20,
  },
  mainButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  formContainer: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 40 },
  backButton: { alignSelf: "flex-start", paddingVertical: 5 },
  backButtonText: { color: "#9A5B35", fontSize: 16, fontWeight: "600" },
  formTitle: {
    color: "#4A2D20",
    fontSize: 27,
    fontWeight: "bold",
    marginTop: 15,
  },
  formSubtitle: { color: "#6D625A", fontSize: 14, marginTop: 5, marginBottom: 10 },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9CABE",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2E2723",
  },
  descriptionInput: { minHeight: 90 },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9CABE",
    borderRadius: 10,
    overflow: "hidden",
  },
  errorMessage: {
    color: "#B3261E",
    backgroundColor: "#FDECEA",
    borderRadius: 8,
    padding: 11,
    marginTop: 15,
    fontSize: 14,
  },
});
