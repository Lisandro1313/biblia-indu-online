import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Animated,
} from 'react-native';
import { Audio } from 'expo-av';

interface Sesion {
  minutos: number;
  etiqueta: string;
  emoji: string;
}

const SESIONES: Sesion[] = [
  { minutos: 5, etiqueta: '5 min', emoji: '🌱' },
  { minutos: 10, etiqueta: '10 min', emoji: '🌿' },
  { minutos: 15, etiqueta: '15 min', emoji: '🌳' },
  { minutos: 20, etiqueta: '20 min', emoji: '🌺' },
  { minutos: 30, etiqueta: '30 min', emoji: '🧘' },
  { minutos: 45, etiqueta: '45 min', emoji: '🕉️' },
];

const MANTRAS_AUDIO = [
  { label: 'Om', subtitulo: 'Sonido primordial' },
  { label: 'Silencio', subtitulo: 'Meditación en silencio' },
  { label: 'Om Shanti', subtitulo: 'Paz interior' },
];

function formatTiempo(seg: number) {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function MeditacionScreen() {
  const [sesionSel, setSesionSel] = useState<Sesion>(SESIONES[1]);
  const [mantraIdx, setMantraIdx] = useState(0);
  const [activo, setActivo] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [completadas, setCompletadas] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      pulseLoop.current?.stop();
    };
  }, []);

  const iniciar = () => {
    setTiempoRestante(sesionSel.minutos * 60);
    setActivo(true);

    // Animación de respiración
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 4000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();

    timerRef.current = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          pulseLoop.current?.stop();
          pulseAnim.setValue(1);
          setActivo(false);
          setCompletadas(c => c + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pausar = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    pulseLoop.current?.stop();
    setActivo(false);
  };

  const reanudar = () => {
    setActivo(true);
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 4000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();

    timerRef.current = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          pulseLoop.current?.stop();
          pulseAnim.setValue(1);
          setActivo(false);
          setCompletadas(c => c + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelar = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
    setActivo(false);
    setTiempoRestante(0);
  };

  const enCurso = tiempoRestante > 0;
  const pct = enCurso ? (tiempoRestante / (sesionSel.minutos * 60)) * 100 : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.titulo}>🧘 Temporizador</Text>
      <Text style={styles.subtitulo}>Meditación guiada</Text>

      {completadas > 0 && !enCurso && (
        <View style={styles.completadosBanner}>
          <Text style={styles.completadosText}>🌟 {completadas} sesión{completadas !== 1 ? 'es' : ''} completada{completadas !== 1 ? 's' : ''} hoy</Text>
        </View>
      )}

      {/* Círculo de meditación */}
      <View style={styles.circuloWrapper}>
        <Animated.View style={[styles.circuloOuter, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.circulo}>
            {enCurso ? (
              <>
                <Text style={styles.omSymbol}>🕉️</Text>
                <Text style={styles.tiempoTexto}>{formatTiempo(tiempoRestante)}</Text>
                <Text style={styles.respiracionTexto}>
                  {tiempoRestante % 8 < 4 ? 'Inhala...' : 'Exhala...'}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.omSymbol}>🕉️</Text>
                <Text style={styles.circuloSel}>{sesionSel.emoji}</Text>
                <Text style={styles.circuloMin}>{sesionSel.etiqueta}</Text>
              </>
            )}
          </View>
        </Animated.View>

        {/* Barra de progreso circular simplificada */}
        {enCurso && (
          <View style={styles.progresoBarFondo}>
            <View style={[styles.progresoBar, { width: `${100 - pct}%` }]} />
          </View>
        )}
      </View>

      {/* Selector de duración */}
      {!enCurso && (
        <>
          <Text style={styles.secLabel}>Duración</Text>
          <View style={styles.sesionesGrid}>
            {SESIONES.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.sesionBtn, sesionSel.minutos === s.minutos && styles.sesionBtnActivo]}
                onPress={() => setSesionSel(s)}
              >
                <Text style={styles.sesionEmoji}>{s.emoji}</Text>
                <Text style={[styles.sesionLabel, sesionSel.minutos === s.minutos && styles.sesionLabelActivo]}>
                  {s.etiqueta}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selector de mantra */}
          <Text style={styles.secLabel}>Ambiente</Text>
          <View style={styles.mantrasRow}>
            {MANTRAS_AUDIO.map((m, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.mantraBtn, mantraIdx === i && styles.mantraBtnActivo]}
                onPress={() => setMantraIdx(i)}
              >
                <Text style={[styles.mantraLabel, mantraIdx === i && styles.mantraLabelActivo]}>
                  {m.label}
                </Text>
                <Text style={styles.mantraSub}>{m.subtitulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Controles */}
      <View style={styles.controles}>
        {!enCurso && tiempoRestante === 0 && (
          <TouchableOpacity style={styles.btnIniciar} onPress={iniciar}>
            <Text style={styles.btnIniciarText}>▶ Comenzar meditación</Text>
          </TouchableOpacity>
        )}
        {enCurso && (
          <>
            <TouchableOpacity style={styles.btnPausar} onPress={pausar}>
              <Text style={styles.btnPausarText}>⏸ Pausar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={cancelar}>
              <Text style={styles.btnCancelarText}>✕ Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
        {!enCurso && tiempoRestante > 0 && (
          <>
            <TouchableOpacity style={styles.btnIniciar} onPress={reanudar}>
              <Text style={styles.btnIniciarText}>▶ Reanudar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnCancelar} onPress={cancelar}>
              <Text style={styles.btnCancelarText}>✕ Cancelar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Consejo */}
      <View style={styles.consejoCard}>
        <Text style={styles.consejoTitulo}>💡 Consejo de meditación</Text>
        <Text style={styles.consejoTexto}>
          Concentrá tu atención en la respiración. Cuando la mente divague, traela suavemente de vuelta al mantra. No hay meditación "incorrecta".
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a00' },
  content: { padding: 16, paddingBottom: 40, alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: '800', color: '#FFB300', marginBottom: 4, alignSelf: 'flex-start' },
  subtitulo: { fontSize: 14, color: '#666', marginBottom: 16, alignSelf: 'flex-start' },

  completadosBanner: {
    backgroundColor: '#FFB30022', borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: '#FFB300', marginBottom: 16, alignSelf: 'stretch',
  },
  completadosText: { color: '#FFB300', textAlign: 'center', fontWeight: '700', fontSize: 13 },

  circuloWrapper: { alignItems: 'center', marginVertical: 20 },
  circuloOuter: {
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#2a1500',
    borderWidth: 3, borderColor: '#FFB30044',
    alignItems: 'center', justifyContent: 'center',
  },
  circulo: { alignItems: 'center', gap: 6 },
  omSymbol: { fontSize: 28 },
  tiempoTexto: { fontSize: 42, fontWeight: '200', color: '#FFB300', letterSpacing: 2 },
  respiracionTexto: { color: '#FFE082', fontSize: 16, fontStyle: 'italic' },
  circuloSel: { fontSize: 32 },
  circuloMin: { color: '#FFB300', fontSize: 22, fontWeight: '300' },

  progresoBarFondo: {
    width: 220, height: 4, backgroundColor: '#3a2500',
    borderRadius: 2, marginTop: 14, overflow: 'hidden',
  },
  progresoBar: { height: '100%', backgroundColor: '#FFB300', borderRadius: 2 },

  secLabel: { color: '#888', fontSize: 12, letterSpacing: 1, marginBottom: 10, marginTop: 4, alignSelf: 'flex-start', textTransform: 'uppercase' },
  sesionesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20, alignSelf: 'stretch' },
  sesionBtn: {
    width: '30%', backgroundColor: '#2a1500', borderRadius: 14, padding: 12,
    alignItems: 'center', borderWidth: 2, borderColor: '#3a2500',
  },
  sesionBtnActivo: { borderColor: '#FFB300', backgroundColor: '#FFB30011' },
  sesionEmoji: { fontSize: 22, marginBottom: 4 },
  sesionLabel: { color: '#888', fontSize: 12, fontWeight: '600' },
  sesionLabelActivo: { color: '#FFB300' },

  mantrasRow: { flexDirection: 'row', gap: 8, marginBottom: 20, alignSelf: 'stretch' },
  mantraBtn: {
    flex: 1, backgroundColor: '#2a1500', borderRadius: 12, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: '#3a2500',
  },
  mantraBtnActivo: { borderColor: '#FFB300', backgroundColor: '#FFB30011' },
  mantraLabel: { color: '#888', fontSize: 13, fontWeight: '700' },
  mantraLabelActivo: { color: '#FFB300' },
  mantraSub: { color: '#555', fontSize: 10, marginTop: 3, textAlign: 'center' },

  controles: { gap: 10, alignSelf: 'stretch', marginBottom: 20 },
  btnIniciar: {
    backgroundColor: '#FFB300', borderRadius: 50,
    paddingVertical: 18, alignItems: 'center',
  },
  btnIniciarText: { color: '#1a0a00', fontWeight: '800', fontSize: 18 },
  btnPausar: {
    backgroundColor: '#2a1500', borderRadius: 50,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#FFB300',
  },
  btnPausarText: { color: '#FFB300', fontWeight: '700', fontSize: 16 },
  btnCancelar: {
    borderRadius: 50, paddingVertical: 12, alignItems: 'center',
  },
  btnCancelarText: { color: '#555', fontSize: 15 },

  consejoCard: {
    backgroundColor: '#2a1500', borderRadius: 16, padding: 16,
    borderLeftWidth: 3, borderLeftColor: '#FFB300', alignSelf: 'stretch',
  },
  consejoTitulo: { color: '#FFB300', fontWeight: '700', fontSize: 13, marginBottom: 8 },
  consejoTexto: { color: '#ccc', fontSize: 14, lineHeight: 21 },
});
