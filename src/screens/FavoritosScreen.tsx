import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native';
import { useFavoritos } from '../context/FavoritosContext';

export default function FavoritosScreen() {
  const { favoritos, toggleFavorito } = useFavoritos();

  if (favoritos.length === 0) {
    return (
      <View style={styles.vacio}>
        <Text style={styles.vacioEmoji}>🕉️</Text>
        <Text style={styles.vacioTexto}>कोई पसंदीदा नहीं</Text>
        <Text style={styles.vacioSub}>श्लोकों पर ⭐ दबाएं</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>⭐ पसंदीदा श्लोक</Text>
      <FlatList
        data={favoritos}
        keyExtractor={item => item.ref}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.ref}>{item.ref}</Text>
            <Text style={styles.texto}>{item.texto}</Text>
            <View style={styles.acciones}>
              <TouchableOpacity onPress={() => Share.share({ message: `${item.ref}\n\n${item.texto}\n\nHindu Dharma App` })}>
                <Text style={styles.btnCompartir}>📤 साझा करें</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleFavorito(item)}>
                <Text style={styles.btnEliminar}>🗑 हटाएं</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  titulo: {
    fontSize: 20, fontWeight: 'bold', color: '#FFB300',
    padding: 16,
  },
  card: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#2a1500', borderRadius: 14, padding: 18,
    borderLeftWidth: 3, borderLeftColor: '#FFB300',
  },
  ref: { color: '#FFB300', fontWeight: '700', fontSize: 13, marginBottom: 8 },
  texto: { color: '#FFE082', fontSize: 16, lineHeight: 26, fontStyle: 'italic' },
  acciones: { flexDirection: 'row', gap: 20, marginTop: 12 },
  btnCompartir: { color: '#FFB300', fontSize: 14, fontWeight: '600' },
  btnEliminar: { color: '#E74C3C', fontSize: 14, fontWeight: '600' },
  vacio: { flex: 1, backgroundColor: '#1a0a00', alignItems: 'center', justifyContent: 'center' },
  vacioEmoji: { fontSize: 60, marginBottom: 16 },
  vacioTexto: { fontSize: 20, color: '#ccc', fontWeight: '600' },
  vacioSub: { fontSize: 14, color: '#666', marginTop: 8 },
});
