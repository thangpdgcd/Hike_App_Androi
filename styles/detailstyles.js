import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  detailItemColumn: {
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  detailproduct: {
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    color: "#555",
    fontWeight: "bold",
  },
  value: {
    fontSize: 18,
    color: "#333",
    flexShrink: 1,
    textAlign: "right",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  valueDesc: {
    fontSize: 16,
    color: "#444",
    marginTop: 6,
    lineHeight: 22,
  },
});
export default styles;
