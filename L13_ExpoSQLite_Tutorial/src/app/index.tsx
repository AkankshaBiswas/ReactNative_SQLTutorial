import ItemRow from "@/components/ItemRow";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  deleteItem,
  fetchItems,
  insertItem,
  type Item,
  updateItem,
} from "../data/db";

export default function App() {
  const db = useSQLiteContext();

  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const value = await fetchItems(db);
      setItems(value);
    } catch (err) {
      console.log("Failed to fetch items", err);
    }
  };

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setName(item.name);
    setQuantity(String(item.quantity));
  };

  const saveOrUpdate = async () => {
    if (!name.trim()) return;
    const parsedQuantity = parseInt(quantity, 10);
    if (Number.isNaN(parsedQuantity)) return;

    try {
      if (editingId === null) {
        await insertItem(db, name.trim(), parsedQuantity);
      } else {
        await updateItem(db, editingId, name.trim(), parsedQuantity);
      }
      await loadItems();
      setName("");
      setQuantity("");
      setEditingId(null);
    } catch (err) {
      console.log("Failed to save/update item", err);
    }
  };

  const confirmDelete = (id: number) => {
    Alert.alert("Delete item?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteItem(db, id);
            await loadItems();
            if (editingId===id) {
              setEditingId(null);
              setName("");
              setQuantity("");
            }
          } catch (err) {
            console.log("Failed to delete item", err);
          }
        },
      },
    ]);
  }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SQLite Example</Text>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Button
        title={editingId === null ? "Save Item" : "Update Item"}
        onPress={saveOrUpdate}
      />
      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: "#eee",
              marginLeft: 14,
              marginRight: 14,
            }}
          />
        )}
        renderItem={({ item }) => (
          <ItemRow
            name={item.name}
            quantity={item.quantity}
            onEdit={() => startEdit(item)}
            onDelete={() => confirmDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 24, color: "#888" }}>
            No items yet. Add your first one above.
          </Text>
        }
        contentContainerStyle={
          items.length === 0
            ? { flexGrow: 1, justifyContent: "center" }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "System",
    color: "#f72626",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  list: {
    marginTop: 20,
    width: "100%",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
