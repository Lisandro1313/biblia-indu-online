import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, ScrollView, ActivityIndicator, Share,
} from 'react-native';
import { TEXTOS_SAGRADOS } from '../data/dioses';
import { getCapitulosGita, getVersosCapitulo, Capitulo, Verso } from '../data/gitaApi';
import { useFavoritos } from '../context/FavoritosContext';

type Vista = 'lista' | 'capitulos' | 'versos';

export default function TextosScreen() {
  const [vista, setVista] = useState<Vista>('lista');
  const [capitulosGita, setCapitulosGita] = useState<Capitulo[]>([]);
  const [versos, setVersos] = useState<Verso[]>([]);
  const [capSeleccionado, setCapSeleccionado] = useState<Capitulo | null>(null);
  const [cargando, setCargando] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const { toggleFavorito, esFavorito } = useFavoritos();

  const abrirGita = async () => {
    setCargando(true);
    try {
      const caps = await getCapitulosGita();
      setCapitulosGita(caps);
      setVista('capitulos');
    } catch {
      setVista('capitulos');
    } finally {
      setCargando(false);
    }
  };

  const abrirCapitulo = async (cap: Capitulo) => {
    setCapSeleccionado(cap);
    setCargando(true);
    try {
      const v = await getVersosCapitulo(cap.chapter_number);
      setVersos(v);
      setVista('versos');
    } catch {
      setVersos([]);
      setVista('versos');
    } finally {
      setCargando(false);
    }
  };

  if (vista === 'versos' && capSeleccionado) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setVista('capitulos')} style={styles.btnVolver}>
            <Text style={styles.btnVolverText}>‹ वापस</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitulo}>{capSeleccionado.name}</Text>
            <Text style={styles.headerSub}>{capSeleccionado.name_meaning}</Text>
          </View>
          <View style={styles.fontControls}>
            <TouchableOpacity onPress={() => setFontSize(s => Math.max(12, s - 2))}>
              <Text style={styles.fontBtn}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFontSize(s => Math.min(26, s + 2))}>
              <Text style={styles.fontBtn}>A+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {cargando ? (
          <View style={styles.centrado}>
            <ActivityIndicator size="large" color="#FFB300" />
          </View>
        ) : (
          <FlatList
            data={versos}
            keyExtractor={item => `${item.chapter}-${item.verse}`}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            ListHeaderComponent={
              <View style={styles.capResumen}>
                <Text style={styles.capResumenTexto}>{capSeleccionado.chapter_summary}</Text>
              </View>
            }
            renderItem={({ item }) => {
              const ref = `गीता ${item.chapter}:${item.verse}`;
              const traduccion = item.translations?.find(t => t.language === 'english');
              const fav = esFavorito(ref);
              return (
                <View style={styles.versoCard}>
                  <Text style={styles.versoNum}>{item.chapter}:{item.verse}</Text>
                  <Text style={[styles.versoSanscrito, { fontSize: fontSize + 2 }]}>{item.text}</Text>
                  {item.transliteration && (
                    <Text style={[styles.versoTranslit, { fontSize: fontSize - 2 }]}>{item.transliteration}</Text>
                  )}
                  {traduccion && (
                    <Text style={[styles.versoTraduccion, { fontSize }]}>{traduccion.description}</Text>
                  )}
                  <View style={styles.versoAcciones}>
                    <TouchableOpacity onPress={() => toggleFavorito({ ref, texto: item.text })}>
                      <Text style={{ fontSize: 20 }}>{fav ? '⭐' : '☆'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Share.share({ message: `${ref}\n\n${item.text}\n\n${traduccion?.description ?? ''}\n\nHindu Dharma App` })}>
                      <Text style={{ fontSize: 18 }}>📤</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    );
  }

  if (vista === 'capitulos') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setVista('lista')} style={styles.btnVolver}>
            <Text style={styles.btnVolverText}>‹ वापस</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>📖 भगवद्गीता</Text>
        </View>

        {cargando ? (
          <View style={styles.centrado}>
            <ActivityIndicator size="large" color="#FFB300" />
            <Text style={styles.cargandoText}>अध्याय लोड हो रहे हैं...</Text>
          </View>
        ) : (
          <FlatList
            data={capitulosGita.length > 0 ? capitulosGita : Array.from({ length: 18 }, (_, i) => ({
              chapter_number: i + 1,
              name: `अध्याय ${i + 1}`,
              name_meaning: '',
              name_translation: `Chapter ${i + 1}`,
              verses_count: 0,
              chapter_summary: '',
            }))}
            keyExtractor={item => item.chapter_number.toString()}
            contentContainerStyle={{ padding: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.capCard} onPress={() => abrirCapitulo(item)}>
                <View style={styles.capNumBox}>
                  <Text style={styles.capNumTexto}>{item.chapter_number}</Text>
                </View>
                <View style={styles.capInfo}>
                  <Text style={styles.capNombre}>{item.name}</Text>
                  <Text style={styles.capSignificado} numberOfLines={1}>{item.name_meaning || item.name_translation}</Text>
                  {item.verses_count > 0 && (
                    <Text style={styles.capVersos}>{item.verses_count} श्लोक</Text>
                  )}
                </View>
                <Text style={styles.capArrow}>›</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listaContent}>
      <Text style={styles.listaTitulo}>पवित्र ग्रंथ</Text>
      {TEXTOS_SAGRADOS.map(texto => (
        <TouchableOpacity
          key={texto.id}
          style={styles.textoCard}
          onPress={() => texto.id === 'gita' ? abrirGita() : null}
        >
          <Text style={styles.textoEmoji}>{texto.emoji}</Text>
          <View style={styles.textoInfo}>
            <Text style={styles.textoNombre}>{texto.nombre}</Text>
            <Text style={styles.textoHindi}>{texto.hindi}</Text>
            <Text style={styles.textoDesc}>{texto.descripcion}</Text>
          </View>
          {texto.id === 'gita' ? (
            <Text style={styles.textoArrow}>›</Text>
          ) : (
            <Text style={styles.textoProximo}>जल्द</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  centrado: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  cargandoText: { color: '#888', fontSize: 15 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#3a2500',
  },
  btnVolver: { paddingRight: 12, paddingVertical: 4 },
  btnVolverText: { color: '#FFB300', fontSize: 18, fontWeight: '600' },
  headerInfo: { flex: 1 },
  headerTitulo: { color: '#FFE082', fontSize: 17, fontWeight: '700' },
  headerSub: { color: '#888', fontSize: 12, marginTop: 2 },
  fontControls: { flexDirection: 'row', gap: 8 },
  fontBtn: { color: '#FFB300', fontWeight: '700', fontSize: 14, padding: 6, backgroundColor: '#2a1500', borderRadius: 8 },
  capResumen: {
    backgroundColor: '#2a1500', borderRadius: 12, padding: 16, marginBottom: 16,
  },
  capResumenTexto: { color: '#ccc', fontSize: 14, lineHeight: 22 },
  versoCard: {
    backgroundColor: '#2a1500', borderRadius: 12, padding: 16, marginBottom: 12,
  },
  versoNum: { color: '#FFB300', fontWeight: '700', fontSize: 12, marginBottom: 8 },
  versoSanscrito: { color: '#FFE082', lineHeight: 30, fontStyle: 'italic' },
  versoTranslit: { color: '#888', marginTop: 8, lineHeight: 22 },
  versoTraduccion: { color: '#e8d5b0', marginTop: 10, lineHeight: 24 },
  versoAcciones: { flexDirection: 'row', gap: 16, marginTop: 10, justifyContent: 'flex-end' },
  capCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2a1500', borderRadius: 12,
    padding: 14, marginBottom: 8,
  },
  capNumBox: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#FFB30022', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  capNumTexto: { color: '#FFB300', fontWeight: '700', fontSize: 18 },
  capInfo: { flex: 1 },
  capNombre: { color: '#FFE082', fontSize: 16, fontWeight: '600' },
  capSignificado: { color: '#888', fontSize: 13, marginTop: 2 },
  capVersos: { color: '#666', fontSize: 12, marginTop: 2 },
  capArrow: { color: '#555', fontSize: 22 },
  listaContent: { padding: 16, paddingBottom: 40 },
  listaTitulo: {
    fontSize: 22, fontWeight: 'bold', color: '#FFB300', marginBottom: 16,
  },
  textoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2a1500', borderRadius: 16, padding: 18, marginBottom: 12,
  },
  textoEmoji: { fontSize: 36, marginRight: 14 },
  textoInfo: { flex: 1 },
  textoNombre: { color: '#FFE082', fontSize: 18, fontWeight: '700' },
  textoHindi: { color: '#888', fontSize: 13, marginTop: 2 },
  textoDesc: { color: '#ccc', fontSize: 13, marginTop: 4 },
  textoArrow: { color: '#FFB300', fontSize: 22 },
  textoProximo: { color: '#555', fontSize: 12, backgroundColor: '#3a2500', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
});
