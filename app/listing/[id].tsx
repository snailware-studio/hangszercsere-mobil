import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { offline_mode } from '../../constants/debug';
import { Colors } from '../../constants/theme';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = 280;

type Instrument = {
  id: number;
  title: string;
  price: number;
  description: string;
  brand: string;
  model: string;
  condition: string;
  category: string;
  images: string[];
};

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [data, setData] = useState<Instrument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const modalRef = useRef<FlatList<string>>(null); 

  useEffect(() => {
    if (!id) return;
    loadInstrument();
  }, [id]);

  // 🔥 Hide system UI ONLY when fullscreen
  useEffect(() => {
    if (fullscreen) {
      StatusBar.setHidden(true, 'fade');
      StatusBar.setBackgroundColor('black');
    } else {
      StatusBar.setHidden(false, 'fade');
      StatusBar.setBackgroundColor(Colors.dark.background);
    }
  }, [fullscreen]);

  // 🎯 Jump to selected image when modal opens
  useEffect(() => {
    if (!fullscreen) return;

    const timer = setTimeout(() => {
      modalRef.current?.scrollToIndex({
        index: page,
        animated: false,
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [fullscreen, page]);

  async function loadInstrument() {
    if (!offline_mode)
    {
      try {
        const res = await fetch(
          `https://hangszercsere.hu/api/instrument/${id}`
        );
        if (!res.ok) throw new Error('baj van');

        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('baj van, azkomgec');
      } finally {
        setLoading(false);
      }
    }
    else
    {
        const json: any = {
              title: '',
              price: 10000,
              brand: "Márka",
              model: "Model",
              category: "Kategória",
              images: [],
              condition: "Minőség",
              description: "LeírásLeírás Leírás Le ír ás LeírásLeírásLeírás Leírás Leírás Leírás LeírásLeírás Leírás Le írás Lorem ipsum dolor amet todor"
        }
        
        setData(json);
        setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.error}>{error ?? 'No data'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      {/* ✅ Normal screen uses SafeArea */}
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* 🔥 Top Carousel */}
          <View style={styles.carouselWrapper}>
            <FlatList
              data={data.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => i.toString()}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );
                setPage(index);
              }}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.slide}
                  onPress={() => setFullscreen(true)}
                >
                  <Image
                    source={{
                      uri: `https://hangszercsere.hu/uploads/${item}`,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </Pressable>
              )}
            />

            {/* ● Dots */}
            <View style={styles.dots}>
              {data.images.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === page && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* ℹ️ Info */}
          <View style={styles.info}>
            <Text style={styles.title}>{data.title}</Text>

            <Text style={styles.price}>
              {data.price.toLocaleString()} Ft
            </Text>

            <Text style={styles.meta}>
              {data.brand} {data.model}
            </Text>

            <Text style={styles.meta}>
              Kategória: {data.category}
            </Text>

            <Text style={styles.meta}>
              Állapot: {data.condition}
            </Text>

            <Text style={styles.description}>
              {data.description}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* 🚀 Fullscreen Modal OUTSIDE SafeArea */}
      <Modal
        visible={fullscreen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setFullscreen(false)}
      >
        <View style={styles.modalBackdrop}>
          <FlatList
            ref={modalRef}
            data={data.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => `modal-${i}`}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / width
              );
              setPage(index);
            }}
            renderItem={({ item }) => (
              <Pressable
                style={styles.modalSlide}
                onPress={() => setFullscreen(false)}
              >0
                <Image
                  source={{
                    uri: `https://hangszercsere.hu/uploads/${item}`,
                  }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },

  container: {
    flex: 1,
  },

  carouselWrapper: {
    width,
    height: IMAGE_HEIGHT,
  },

  slide: {
    width,
    height: IMAGE_HEIGHT,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  dots: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 20,
    backgroundColor: '#666',
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: '#fff',
  },

  info: {
    padding: 16,
  },

  title: {
    color: Colors.dark.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },

  price: {
    color: Colors.dark.accent,
    fontSize: 20,
    marginTop: 6,
    fontWeight: 'bold',
  },

  meta: {
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },

  description: {
    color: Colors.dark.textSecondary,
    marginTop: 12,
    lineHeight: 20,
  },

  error: {
    color: 'red',
    marginTop: 40,
    textAlign: 'center',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'black',
  },

  modalSlide: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalImage: {
    width: '100%',
    height: '100%',
  },
});
