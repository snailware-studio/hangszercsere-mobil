import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScroll } from '../context/ScrollContext';

import { offline_mode } from '@/constants/debug';

import { Colors } from '../constants/theme';

type Instrument = {
  id: number;
  title: string;
  price: number;
  brand: string;
  category: string;
  images: string[];
};

export default function HomeScreen() {
  const [data, setData] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleScroll } = useScroll();

  useEffect(() => {
    loadInstruments();
  }, []);

  async function loadInstruments() {

    if (!offline_mode)
    {
      try {
        const res = await fetch('https://hangszercsere.hu/api/instruments');
        if (!res.ok) throw new Error('API died');

        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load data 😬');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }
    else
    {
      const json: Instrument[] = [ { 'brand': "fasz", 'category': "kategória", 'id': 0, 'images':[], 'price': 10000, 'title': 'fekete fasz cím' } ]
      setData(json);
      setLoading(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    loadInstruments();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={(e) =>
          handleScroll(e.nativeEvent.contentOffset.y)
        }
        scrollEventThrottle={16}
      >
        {error && <Text style={styles.error}>{error}</Text>}

        {data.map(item => {
          const imageUrl = item.images?.length
            ? `https://hangszercsere.hu/uploads/${item.images[0]}`
            : null;

          return (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => router.push(`/listing/${item.id}`)}
            >
              {imageUrl && (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                />
              )}

              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>
                  {item.brand} • {item.category}
                </Text>
                <Text style={styles.price}>
                  {item.price.toLocaleString()} Ft
                </Text>
              </View>
            </Pressable>
          );
        })}
      </Animated.ScrollView>
    </SafeAreaView>
  );
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
    fontSize: 18,
    fontWeight: '600',
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
