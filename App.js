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

export default function App() {
  // Controls which screen is displayed
  const [currentScreen, setCurrentScreen] = useState("home");

  // Stores all the menu items
  const [menuItems, setMenuItems] = useState([]);

  // Stores information entered in the form
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [price, setPrice] = useState("");

  // Stores an error message
  const [errorMessage, setErrorMessage] = useState("");

  const clearForm = () => {
    setDishName("");
    setDescription("");
    setCourse("");
    setPrice("");
    setErrorMessage("");
  };

  const addMenuItem = () => {
    const cleanDishName = dishName.trim();
    const cleanDescription = description.trim();
    const cleanPrice = price.trim().replace(",", ".");
    const numberPrice = Number(cleanPrice);

    // Check for empty fields
    if (
      cleanDishName === "" ||
      cleanDescription === "" ||
      course === "" ||
      cleanPrice === ""
    ) {
      setErrorMessage("Please complete all the required fields.");
      return;
    }

    // Check whether the price is valid
    if (Number.isNaN(numberPrice) || numberPrice <= 0) {
      setErrorMessage("Please enter a valid price greater than R0.");
      return;
    }

    const newMenuItem = {
      id: Date.now().toString(),
      dishName: cleanDishName,
      description: cleanDescription,
      course: course,
      price: numberPrice,
    };

    // Add the new item to the menu array
    setMenuItems((currentItems) => [
      ...currentItems,
      newMenuItem,
    ]);

    clearForm();

    Alert.alert(
      "Menu Item Added",
      `${cleanDishName} was successfully added to the menu.`,
      [
        {
          text: "View Menu",
          onPress: () => setCurrentScreen("home"),
        },
      ]
    );
  };

  const displayMenuItem = ({ item }) => {
    return (
      <View style={styles.menuCard}>
        <View style={styles.cardHeading}>
          <Text style={styles.dishName}>{item.dishName}</Text>

          <Text style={styles.courseBadge}>{item.course}</Text>
        </View>

        <Text style={styles.description}>
          {item.description}
        </Text>

        <Text style={styles.price}>
          R{item.price.toFixed(2)}
        </Text>
      </View>
    );
  };

  // ADD MENU ITEM SCREEN
  if (currentScreen === "add") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFF8EE"
        />

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
              <Text style={styles.backButtonText}>
                Back to Menu
              </Text>
            </TouchableOpacity>

            <Text style={styles.formTitle}>
              Add Menu Item
            </Text>

            <Text style={styles.formSubtitle}>
              Enter the details of the new dish.
            </Text>

            <Text style={styles.label}>
              Dish Name *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. Butternut Veloute"
              placeholderTextColor="#8A8178"
              value={dishName}
              onChangeText={setDishName}
            />

            <Text style={styles.label}>
              Description *
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
              ]}
              placeholder="Enter a short description"
              placeholderTextColor="#8A8178"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              textAlignVertical="top"
            />

            <Text style={styles.label}>
              Course *
            </Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={course}
                onValueChange={(selectedCourse) =>
                  setCourse(selectedCourse)
                }
              >
                <Picker.Item
                  label="Select a course"
                  value=""
                />

                <Picker.Item
                  label="Starter"
                  value="Starter"
                />

                <Picker.Item
                  label="Main"
                  value="Main"
                />

                <Picker.Item
                  label="Dessert"
                  value="Dessert"
                />
              </Picker>
            </View>

            <Text style={styles.label}>
              Price (R) *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 85.00"
              placeholderTextColor="#8A8178"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />

            {errorMessage !== "" && (
              <Text style={styles.errorMessage}>
                {errorMessage}
              </Text>
            )}

            <TouchableOpacity
              style={styles.mainButton}
              onPress={addMenuItem}
            >
              <Text style={styles.mainButtonText}>
                Add Dish to Menu
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // HOME SCREEN
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#4A2D20"
      />

      <View style={styles.container}>
        <View style={styles.homeHeader}>
          <Text style={styles.homeTitle}>
            Christoffel's Menu
          </Text>

          <Text style={styles.homeSubtitle}>
            Private Chef Menu Manager
          </Text>
        </View>

        <View style={styles.menuHeading}>
          <Text style={styles.sectionTitle}>
            Current Menu
          </Text>

          <Text style={styles.itemCount}>
            {menuItems.length}{" "}
            {menuItems.length === 1 ? "item" : "items"}
          </Text>
        </View>

        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={displayMenuItem}
          contentContainerStyle={
            menuItems.length === 0
              ? styles.emptyList
              : styles.menuList
          }
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                No menu items added yet
              </Text>

              <Text style={styles.emptyText}>
                Press the button below to add the first dish.
              </Text>
            </View>
          }
        />

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => setCurrentScreen("add")}
          >
            <Text style={styles.mainButtonText}>
              + Add Menu Item
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF8EE",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFF8EE",
  },

  homeHeader: {
    backgroundColor: "#4A2D20",
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 25,
  },

  homeTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  homeSubtitle: {
    color: "#EEDBC8",
    fontSize: 14,
    marginTop: 5,
  },

  menuHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
  },

  sectionTitle: {
    color: "#4A2D20",
    fontSize: 21,
    fontWeight: "bold",
  },

  itemCount: {
    color: "#6D625A",
    fontSize: 14,
  },

  menuList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

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

  description: {
    color: "#6D625A",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 9,
  },

  price: {
    color: "#9A5B35",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 11,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyCard: {
    alignItems: "center",
    backgroundColor: "#F7EBDD",
    borderRadius: 14,
    padding: 28,
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

  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  mainButton: {
    backgroundColor: "#9A5B35",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 20,
  },

  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  formContainer: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 5,
  },

  backButtonText: {
    color: "#9A5B35",
    fontSize: 16,
    fontWeight: "600",
  },

  formTitle: {
    color: "#4A2D20",
    fontSize: 27,
    fontWeight: "bold",
    marginTop: 15,
  },

  formSubtitle: {
    color: "#6D625A",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },

  label: {
    color: "#3F332D",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 7,
  },

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

  descriptionInput: {
    minHeight: 90,
  },

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