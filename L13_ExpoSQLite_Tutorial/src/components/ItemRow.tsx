import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  
} from "react-native";
import MaterialIcons from "@react-native-vector-icons/material-icons";

type Props = {
  name: string;
  quantity: number;
  onEdit: () => void;
  onDelete: () => void;
};

const ItemRow: React.FC<Props> = ({ name, quantity, onEdit, onDelete,   }) => {
  return (
    

    <View style={styles.container}>
       <View style={styles.actions}>
        <TouchableOpacity
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${name}`}
          style={styles.iconButton}
        >
          <MaterialIcons name="edit" size={24} color="#007BFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${name}`}
          style={styles.iconButton}
        >
          <MaterialIcons name="delete" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      {/* Left side: Item info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.qty}>Qty: {quantity}</Text>
      </View>
    </View>
  );
};

export default ItemRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  info: { flexShrink: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  qty: { fontSize: 14, color: "#666", marginTop: 2 },
  actions: { flexDirection: "row", gap: 8 },
  iconButton: {
    padding: 4,
  },
});
