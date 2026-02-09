import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import CookieManager from "@react-native-cookies/cookies";

import { Colors } from "@/constants/theme";

export default function LoginModal() {
  const [visible, setVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin()
  {
    try {
      const res = await fetch("https://hangszercsere.hu/api/users/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          password: password,
        }),
      });

      if (!res.ok) throw new Error("Login failed");

      const setCookie = res.headers.get("set-cookie");
      if (setCookie) {
        await CookieManager.setFromResponse("https://hangszercsere.hu", setCookie);
      }

      const data = await res.json();
      console.log("fasz");
      console.log(cookieStore.getAll());
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      {/* Open button */}
      <Pressable style={styles.openBtn} onPress={() => setVisible(true)}>
        <Text style={styles.btnText}>Bejelentkezés</Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>

            <Pressable style={styles.closeBtn} onPress={() => setVisible(false)}>
              <Text style={styles.closeX}>✕</Text>
            </Pressable>

            <Text style={styles.title}>Bejelentkezés</Text>

            <Text style={styles.label}>Felhasználónév</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.label}>Jelszó</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable style={styles.loginBtn}>
              <Text style={styles.btnText} onPress={handleLogin}>Belépés</Text>
            </Pressable>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  openBtn: {
    backgroundColor: Colors.dark.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "85%",
    backgroundColor: Colors.dark.cardBg,
    padding: 20,
    borderRadius: 12,
  },

  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "600",
    color: Colors.dark.textPrimary,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.dark.accent,
    borderRadius: 6,
    padding: 10,
    color: Colors.dark.textPrimary,
    backgroundColor: Colors.dark.background,
  },

  loginBtn: {
    marginTop: 16,
    backgroundColor: Colors.dark.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: Colors.dark.textPrimary,
    fontWeight: "600",
  },

  close: {
    marginTop: 12,
    textAlign: "center",
    color: Colors.dark.textSecondary,
  },
  
  title: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark.textPrimary,
    marginBottom: 12,
  },

  closeBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 6,
  },

  closeX: {
    fontSize: 18,
    color: Colors.dark.textSecondary,
  },
});
