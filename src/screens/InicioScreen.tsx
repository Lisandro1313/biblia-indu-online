import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getVersoDelDia, VERSOS_DESTACADOS } from '../data/gitaApi';
import type { StackScreenProps } from '@react-navigation/stack';
import type { MainStackParamList } from '../navigation/types';

type Props = StackScreenProps<MainStackParamList, 'Inicio'>;

export default function InicioScreen({ navigation }: Props) {
  const versoDelDia = getVersoDelDia();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.om}>🕉️</Text>
      <Text style={styles.titulo}>हिंदू धर्म</Text>
      <Text style={styles.subtitulo}>Hindu Dharma</Text>

      {/* Verso del día */}
      <View style={styles.versoCard}>
        <Text style={styles.versoLabel}>✨ आज का श्लोक</Text>
        <Text style={styles.versoTexto}>{versoDelDia.texto}</Text>
        <View style={styles.versoDivider} />
        <Text style={styles.versoSignificado}>{versoDelDia.significado}</Text>
        <Text style={styles.versoRef}>— {versoDelDia.ref}</Text>
      </View>

      {/* Botones principales */}
      <View style={styles.botonesRow}>
        <TouchableOpacity style={[styles.btnPrincipal, styles.btnDioses]} onPress={() => navigation.navigate('Dioses')}>
          <Text style={styles.btnEmoji}>🌺</Text>
          <Text style={styles.btnTexto}>देवी-देवता</Text>
          <Text style={styles.btnSub}>20 देवता</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnPrincipal, styles.btnTextos]} onPress={() => navigation.navigate('Textos')}>
          <Text style={styles.btnEmoji}>📖</Text>
          <Text style={styles.btnTexto}>पवित्र ग्रंथ</Text>
          <Text style={styles.btnSub}>गीता, वेद, रामायण</Text>
        </TouchableOpacity>
      </View>

      {/* Versos populares */}
      <Text style={styles.seccionTitulo}>प्रमुख श्लोक</Text>
      {VERSOS_DESTACADOS.map((v, i) => (
        <View key={i} style={styles.miniVersoCard}>
          <Text style={styles.miniVersoRef}>{v.ref}</Text>
          <Text style={styles.miniVersoTexto}>{v.texto}</Text>
          <Text style={styles.miniVersoSignificado}>{v.significado}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  content: { paddingBottom: 40 },
  om: { fontSize: 52, textAlign: 'center', paddingTop: 24 },
  titulo: {
    fontSize: 30, fontWeight: 'bold', color: '#FFB300',
    textAlign: 'center', marginTop: 4,
  },
  subtitulo: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20 },
  versoCard: {
    margin: 16, backgroundColor: '#2a1500',
    borderRadius: 18, padding: 22,
    borderLeftWidth: 4, borderLeftColor: '#FFB300',
  },
  versoLabel: { fontSize: 13, color: '#FFB300', fontWeight: '700', marginBottom: 10 },
  versoTexto: {
    fontSize: 18, color: '#FFE082', lineHeight: 28,
    fontStyle: 'italic', textAlign: 'center',
  },
  versoDivider: { height: 1, backgroundColor: '#3a2500', marginVertical: 12 },
  versoSignificado: { fontSize: 15, color: '#e8d5b0', lineHeight: 22, textAlign: 'center' },
  versoRef: { fontSize: 13, color: '#888', marginTop: 10, textAlign: 'right', fontWeight: '600' },
  botonesRow: { flexDirection: 'row', marginHorizontal: 16, gap: 12, marginBottom: 24 },
  btnPrincipal: {
    flex: 1, borderRadius: 18, padding: 20, alignItems: 'center',
  },
  btnDioses: { backgroundColor: '#4a1900' },
  btnTextos: { backgroundColor: '#1a3000' },
  btnEmoji: { fontSize: 36, marginBottom: 8 },
  btnTexto: { color: '#FFE082', fontSize: 16, fontWeight: '700' },
  btnSub: { color: '#888', fontSize: 12, marginTop: 4 },
  seccionTitulo: {
    fontSize: 16, color: '#FFB300', fontWeight: '700',
    marginLeft: 16, marginBottom: 12,
  },
  miniVersoCard: {
    marginHorizontal: 16, marginBottom: 10,
    backgroundColor: '#2a1500', borderRadius: 12, padding: 16,
  },
  miniVersoRef: { fontSize: 12, color: '#FFB300', fontWeight: '600', marginBottom: 6 },
  miniVersoTexto: { fontSize: 14, color: '#FFE082', fontStyle: 'italic', marginBottom: 6 },
  miniVersoSignificado: { fontSize: 13, color: '#ccc', lineHeight: 20 },
});
