import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Modal, ScrollView, Share,
} from 'react-native';
import { DIOSES, Dios } from '../data/dioses';

export default function DiosesScreen() {
  const [seleccionado, setSeleccionado] = useState<Dios | null>(null);

  const compartir = async (dios: Dios) => {
    await Share.share({
      message: `${dios.nombreHindi} — ${dios.titulo}\n\nमंत्र: ${dios.mantra}\n\n${dios.descripcion}\n\nHindu Dharma App`,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DIOSES}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.diosCard, { borderColor: item.color + '66' }]}
            onPress={() => setSeleccionado(item)}
          >
            <Text style={styles.diosEmoji}>{item.emoji}</Text>
            <Text style={[styles.diosNombreHindi, { color: item.color === '#FFFFFF' ? '#FFE082' : item.color }]}>
              {item.nombreHindi}
            </Text>
            <Text style={styles.diosNombre}>{item.nombre}</Text>
            <Text style={styles.diosTitulo} numberOfLines={2}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal detalle dios */}
      <Modal visible={!!seleccionado} animationType="slide" onRequestClose={() => setSeleccionado(null)}>
        {seleccionado && (
          <ScrollView style={styles.modalContainer} contentContainerStyle={styles.modalContent}>
            {/* Header */}
            <View style={[styles.modalHeader, { backgroundColor: seleccionado.color + '22' }]}>
              <TouchableOpacity style={styles.btnCerrar} onPress={() => setSeleccionado(null)}>
                <Text style={styles.btnCerrarText}>‹ वापस</Text>
              </TouchableOpacity>
              <Text style={styles.modalEmoji}>{seleccionado.emoji}</Text>
              <Text style={[styles.modalNombreHindi, { color: seleccionado.color === '#FFFFFF' ? '#FFE082' : seleccionado.color }]}>
                {seleccionado.nombreHindi}
              </Text>
              <Text style={styles.modalNombre}>{seleccionado.nombre}</Text>
              <Text style={styles.modalTitulo}>{seleccionado.titulo}</Text>
            </View>

            {/* Descripción */}
            <View style={styles.seccionCard}>
              <Text style={styles.seccionLabel}>📜 परिचय</Text>
              <Text style={styles.descripcionTexto}>{seleccionado.descripcion}</Text>
            </View>

            {/* Mantra */}
            <View style={[styles.seccionCard, styles.mantraCard]}>
              <Text style={styles.seccionLabel}>🕉️ मंत्र</Text>
              <Text style={styles.mantraTexto}>{seleccionado.mantra}</Text>
              <View style={styles.mantraDivider} />
              <Text style={styles.mantraSignificado}>{seleccionado.mantraSignificado}</Text>
            </View>

            {/* Atributos */}
            <View style={styles.seccionCard}>
              <Text style={styles.seccionLabel}>⚜️ विशेषताएं</Text>
              <View style={styles.atributosRow}>
                {seleccionado.atributos.map((a, i) => (
                  <View key={i} style={[styles.atributoBadge, { borderColor: seleccionado.color + '88' }]}>
                    <Text style={[styles.atributoTexto, { color: seleccionado.color === '#FFFFFF' ? '#FFE082' : seleccionado.color }]}>
                      {a}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Festival */}
            <View style={styles.seccionCard}>
              <Text style={styles.seccionLabel}>🎊 प्रमुख त्योहार</Text>
              <Text style={styles.festivalTexto}>{seleccionado.festival}</Text>
            </View>

            {/* Compartir */}
            <TouchableOpacity
              style={[styles.btnCompartir, { backgroundColor: seleccionado.color === '#FFFFFF' ? '#FFB300' : seleccionado.color }]}
              onPress={() => compartir(seleccionado)}
            >
              <Text style={styles.btnCompartirText}>📤 साझा करें</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  grid: { padding: 12, gap: 12 },
  diosCard: {
    flex: 1, backgroundColor: '#2a1500', borderRadius: 16,
    padding: 16, alignItems: 'center', margin: 4,
    borderWidth: 1,
  },
  diosEmoji: { fontSize: 40, marginBottom: 8 },
  diosNombreHindi: { fontSize: 20, fontWeight: 'bold', marginBottom: 2 },
  diosNombre: { fontSize: 13, color: '#888', marginBottom: 4 },
  diosTitulo: { fontSize: 12, color: '#ccc', textAlign: 'center' },
  modalContainer: { flex: 1, backgroundColor: '#1a0a00' },
  modalContent: { paddingBottom: 40 },
  modalHeader: {
    alignItems: 'center', paddingTop: 60, paddingBottom: 28, paddingHorizontal: 20,
  },
  btnCerrar: { position: 'absolute', top: 56, left: 16, padding: 8 },
  btnCerrarText: { color: '#FFB300', fontSize: 18, fontWeight: '600' },
  modalEmoji: { fontSize: 72, marginBottom: 12 },
  modalNombreHindi: { fontSize: 36, fontWeight: 'bold' },
  modalNombre: { fontSize: 18, color: '#888', marginTop: 4 },
  modalTitulo: { fontSize: 15, color: '#ccc', marginTop: 6, textAlign: 'center' },
  seccionCard: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#2a1500', borderRadius: 14, padding: 18,
  },
  seccionLabel: { fontSize: 13, color: '#FFB300', fontWeight: '700', marginBottom: 10 },
  descripcionTexto: { fontSize: 16, color: '#e8d5b0', lineHeight: 26 },
  mantraCard: { borderLeftWidth: 3, borderLeftColor: '#FFB300' },
  mantraTexto: {
    fontSize: 20, color: '#FFE082', textAlign: 'center',
    fontStyle: 'italic', lineHeight: 32,
  },
  mantraDivider: { height: 1, backgroundColor: '#3a2500', marginVertical: 12 },
  mantraSignificado: { fontSize: 14, color: '#ccc', textAlign: 'center', lineHeight: 22 },
  atributosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  atributoBadge: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
    backgroundColor: '#1a0a00',
  },
  atributoTexto: { fontSize: 13, fontWeight: '600' },
  festivalTexto: { fontSize: 18, color: '#FFE082', fontWeight: '600' },
  btnCompartir: {
    marginHorizontal: 16, paddingVertical: 16,
    borderRadius: 14, alignItems: 'center', marginTop: 8,
  },
  btnCompartirText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
