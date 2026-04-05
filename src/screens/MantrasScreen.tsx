import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView,
} from 'react-native';

interface Mantra {
  nombre: string;
  sanskrit: string;
  pronunciacion: string;
  significado: string;
  uso: string;
  dios: string;
  emoji: string;
  color: string;
}

const MANTRAS: Mantra[] = [
  {
    nombre: 'Om',
    sanskrit: 'ॐ',
    pronunciacion: 'Ohhm (larga vibración)',
    significado: 'El sonido primordial del universo. Representa la consciencia absoluta y la unión de cuerpo, mente y espíritu.',
    uso: 'Inicio y fin de toda oración o meditación',
    dios: 'Universal',
    emoji: '🕉️',
    color: '#FFB300',
  },
  {
    nombre: 'Gayatri Mantra',
    sanskrit: 'ॐ भूर्भुव: स्व: तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो न: प्रचोदयात्',
    pronunciacion: 'Om Bhur Bhuva Svaha / Tat Savitur Varenyam / Bhargo Devasya Dhimahi / Dhiyo Yo Nah Prachodayat',
    significado: 'Meditamos en la gloria de esa Luz que ha creado el universo. Que nos ilumine la mente.',
    uso: 'Meditación matutina, purificación mental',
    dios: 'Surya (Sol)',
    emoji: '☀️',
    color: '#FF9800',
  },
  {
    nombre: 'Om Namah Shivaya',
    sanskrit: 'ॐ नमः शिवाय',
    pronunciacion: 'Om Na-mah Shi-vaa-ya',
    significado: 'Saludo a Shiva. Me rindo ante la consciencia pura que habita en cada ser.',
    uso: 'Devoción, liberación del ego',
    dios: 'Shiva',
    emoji: '🔱',
    color: '#7C4DFF',
  },
  {
    nombre: 'Om Mani Padme Hum',
    sanskrit: 'ॐ मणि पद्मे हूँ',
    pronunciacion: 'Om Ma-ni Pad-me Hum',
    significado: 'El jewel en el loto. Invoca la compasión y sabiduría universal.',
    uso: 'Compasión, meditación budista-hindú',
    dios: 'Avalokiteshvara / Compasión',
    emoji: '🪷',
    color: '#E91E63',
  },
  {
    nombre: 'Hare Krishna',
    sanskrit: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे',
    pronunciacion: 'Ha-re Krish-na Ha-re Krish-na / Krish-na Krish-na Ha-re Ha-re',
    significado: 'Invocación a la energía divina de Krishna. Purifica el corazón y eleva la consciencia.',
    uso: 'Bhakti yoga, devoción a Krishna',
    dios: 'Krishna / Vishnu',
    emoji: '🦚',
    color: '#1E88E5',
  },
  {
    nombre: 'Om Shri Ganeshaya Namah',
    sanskrit: 'ॐ श्री गणेशाय नमः',
    pronunciacion: 'Om Shri Ga-ne-sha-ya Na-mah',
    significado: 'Saludo al gran Ganesha. Se recita para remover obstáculos y comenzar nuevos proyectos.',
    uso: 'Inicio de actividades, remoción de obstáculos',
    dios: 'Ganesha',
    emoji: '🐘',
    color: '#FF5722',
  },
  {
    nombre: 'Om Shanti',
    sanskrit: 'ॐ शांति शांति शांति',
    pronunciacion: 'Om Shan-ti Shan-ti Shan-ti',
    significado: 'Paz en cuerpo, mente y espíritu. Las tres repeticiones purifican los tres planos de existencia.',
    uso: 'Cierre de meditación, paz interior',
    dios: 'Universal',
    emoji: '☮️',
    color: '#43A047',
  },
  {
    nombre: 'Mahamrityunjaya',
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
    pronunciacion: 'Om Trayam-bakam Ya-ja-mahe / Su-gan-dhim Push-ti-vardhanam',
    significado: 'El gran mantra de Shiva para vencer la muerte. Infunde vitalidad y libera del miedo.',
    uso: 'Salud, protección, superación del miedo',
    dios: 'Shiva',
    emoji: '🌙',
    color: '#546E7A',
  },
];

export default function MantrasScreen() {
  const [expandido, setExpandido] = useState<number | null>(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>🕉️ Mantras Sagrados</Text>
      <Text style={styles.subtitulo}>Pronunciación y significado</Text>

      {MANTRAS.map((m, i) => {
        const abierto = expandido === i;
        return (
          <TouchableOpacity
            key={i}
            style={[styles.card, { borderLeftColor: m.color }, abierto && styles.cardAbierta]}
            onPress={() => setExpandido(abierto ? null : i)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardEmoji}>{m.emoji}</Text>
              <View style={styles.cardTitleBox}>
                <Text style={[styles.cardNombre, { color: m.color }]}>{m.nombre}</Text>
                <Text style={styles.cardDios}>{m.dios}</Text>
              </View>
              <Text style={styles.cardArrow}>{abierto ? '▲' : '▼'}</Text>
            </View>

            <Text style={styles.cardSanskrit}>{m.sanskrit}</Text>

            {abierto && (
              <View style={styles.cardDetalle}>
                <View style={styles.detalleBloque}>
                  <Text style={styles.detalleTitulo}>🗣️ Pronunciación</Text>
                  <Text style={styles.detallePron}>{m.pronunciacion}</Text>
                </View>
                <View style={styles.detalleBloque}>
                  <Text style={styles.detalleTitulo}>💡 Significado</Text>
                  <Text style={styles.detalleTexto}>{m.significado}</Text>
                </View>
                <View style={[styles.usoChip, { backgroundColor: m.color + '22', borderColor: m.color }]}>
                  <Text style={[styles.usoTexto, { color: m.color }]}>✦ {m.uso}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  content: { padding: 16, paddingBottom: 40 },
  titulo: { fontSize: 22, fontWeight: '800', color: '#FFB300', marginBottom: 4 },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 20 },

  card: {
    backgroundColor: '#2a1500', borderRadius: 16, padding: 16,
    marginBottom: 10, borderLeftWidth: 4,
  },
  cardAbierta: { backgroundColor: '#3a2000' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardEmoji: { fontSize: 28 },
  cardTitleBox: { flex: 1 },
  cardNombre: { fontSize: 17, fontWeight: '800' },
  cardDios: { color: '#888', fontSize: 12, marginTop: 2 },
  cardArrow: { color: '#666', fontSize: 16 },
  cardSanskrit: {
    color: '#FFE082', fontSize: 16, marginTop: 8,
    lineHeight: 24, fontStyle: 'italic',
  },

  cardDetalle: { marginTop: 14, gap: 10 },
  detalleBloque: {
    backgroundColor: '#1a0a00', borderRadius: 10, padding: 12,
  },
  detalleTitulo: { color: '#FFB300', fontWeight: '700', fontSize: 12, marginBottom: 6 },
  detallePron: { color: '#4FC3F7', fontSize: 15, fontWeight: '600', lineHeight: 22 },
  detalleTexto: { color: '#ddd', fontSize: 14, lineHeight: 22 },
  usoChip: {
    borderRadius: 10, padding: 10, borderWidth: 1,
  },
  usoTexto: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
