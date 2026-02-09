import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../../constants/theme';
export default function cartPage()
{
    return (
        <SafeAreaView>
            <View style={styles.info}>
                <Text style={styles.title}>Kosarad</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },

  container: {
    flex: 1,
    padding: 12,
  },

  card: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 180,
  },

  info: {
    padding: 12,
  },

  title: {
    color: Colors.dark.textPrimary,
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
  },

  meta: {
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },

  price: {
    color: Colors.dark.accent,
    marginTop: 6,
    fontSize: 16,
    fontWeight: 'bold',
  },

  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

