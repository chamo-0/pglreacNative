import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

// --- INTERFACES ---
interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}

interface DeckResponse {
  deck_id: string;
  cards: Card[];
  remaining: number;
}

const Blackjack = () => {
  const api_base = 'https://deckofcardsapi.com/api/deck';

  // --- ESTADOS ---
  const [deckId, setDeckId] = useState<string>("");
  
  // Estados para las manos
  const [cartasJugador, setCartasJugador] = useState<Card[]>([]);
  const [cartasCrupier, setCartasCrupier] = useState<Card[]>([]);
  
  // Estado del juego
  const [puntosJugador, setPuntosJugador] = useState(0);
  const [puntosCrupier, setPuntosCrupier] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [mensajeFinal, setMensajeFinal] = useState("");

  // --- 1. LÓGICA DE PUNTOS ---
  // Esta función calcula el valor de una mano teniendo en cuenta el AS
  const calcularPuntaje = (cartas: Card[]) => {
    let total = 0;
    let ases = 0;

    cartas.forEach(carta => {
      if (['KING', 'QUEEN', 'JACK'].includes(carta.value)) {
        total += 10;
      } else if (carta.value === 'ACE') {
        total += 11;
        ases += 1;
      } else {
        total += parseInt(carta.value);
      }
    });

    // Si nos pasamos de 21 y tenemos Ases, los convertimos de 11 a 1
    while (total > 21 && ases > 0) {
      total -= 10;
      ases -= 1;
    }
    return total;
  };

  // --- 2. INICIAR JUEGO ---
  const iniciarJuego = async () => {
    try {
      // Reiniciamos estados visuales
      setJuegoTerminado(false);
      setMensajeFinal("");
      setCartasJugador([]);
      setCartasCrupier([]);
      setPuntosJugador(0);
      setPuntosCrupier(0);

      // 1. Crear/Barajar mazo
      const resMazo = await axios.get(`${api_base}/new/shuffle/?deck_count=1`);
      const id = resMazo.data.deck_id;
      setDeckId(id);

      // 2. Repartir iniciales: 2 para jugador, 2 para crupier
      const resDraw = await axios.get(`${api_base}/${id}/draw/?count=4`);
      const cartas : Card[] = resDraw.data.cards;

      // Asignamos: 0 y 2 para jugador, 1 y 3 para crupier (alternadas)
      const manoJugador = [cartas[0], cartas[2]];
      const manoCrupier = [cartas[1], cartas[3]];

      setCartasJugador(manoJugador);
      setCartasCrupier(manoCrupier);

      setPuntosJugador(calcularPuntaje(manoJugador));
      setPuntosCrupier(calcularPuntaje(manoCrupier));

    } catch (error) {
      console.error("Error iniciando", error);
    }
  };

  useEffect(() => {
    iniciarJuego();
  }, []);


  // --- 3. ACCIÓN: PEDIR CARTA (JUGADOR) ---
  const pedirCarta = async () => {
    if (juegoTerminado) return;

    try {
      const res = await axios.get(`${api_base}/${deckId}/draw/?count=1`);
      const nuevaCarta = res.data.cards[0];
      
      const nuevaMano = [...cartasJugador, nuevaCarta];
      setCartasJugador(nuevaMano);
      
      const puntaje = calcularPuntaje(nuevaMano);
      setPuntosJugador(puntaje);

      if (puntaje > 21) {
        finalizarJuego(puntaje, puntosCrupier, "¡Te pasaste! Gana la casa.");
      }

    } catch (error) {
      console.error(error);
    }
  };

  // --- 4. ACCIÓN: PLANTARSE (JUGADOR TERMINA, JUEGA CRUPIER) ---
  const plantarse = async () => {
    let manoActualCrupier = [...cartasCrupier];
    let puntajeCrupier = calcularPuntaje(manoActualCrupier);

    // Bucle infinito que romperemos manualmente (break)
    while (true) {
      let debePedir = false;

      // REGLA 1: Si tiene menos de 17, está obligado a pedir (Regla clásica)
      if (puntajeCrupier < 17) {
        debePedir = true;
      } 
      // REGLA 2 (NUEVA): Si tiene 17 o más (pero no se ha pasado), 
      // tiramos una moneda de 3 caras (1/3 de probabilidad)
      else if (puntajeCrupier <= 21) {
        // Generamos un número entre 0 y 1. Si es menor a 0.33, es un "sí" (33%)
        const esTemerario = Math.random() < 0.33; 
        
        if (esTemerario) {
          console.log(`¡El crupier está loco! Pide carta teniendo ${puntajeCrupier}`);
          debePedir = true;
        } else {
          debePedir = false; // Se planta (lo normal)
        }
      }
      // Si ya se pasó de 21, obviamente no pide más
      else {
        debePedir = false;
      }

      // Si decidimos no pedir, rompemos el bucle
      if (!debePedir) break;

      // Si decidimos pedir, hacemos la llamada a la API
      try {
        const res = await axios.get(`${api_base}/${deckId}/draw/?count=1`);
        const nuevaCarta = res.data.cards[0];
        manoActualCrupier.push(nuevaCarta);
        
        // Recalculamos el puntaje para la siguiente vuelta del bucle
        puntajeCrupier = calcularPuntaje(manoActualCrupier);
      } catch (error) {
        console.error("Error crupier", error);
        break; 
      }
    }

    // Actualizamos estado final visual y lógico del crupier
    setCartasCrupier(manoActualCrupier);
    setPuntosCrupier(puntajeCrupier);

    // Determinar ganador
    determinarGanador(puntosJugador, puntajeCrupier);
  };

  const determinarGanador = (puntosJ: number, puntosC: number) => {
    let mensaje = "";
    if (puntosC > 21) {
      mensaje = "¡El crupier se pasó! Ganaste.";
    } else if (puntosJ > puntosC) {
      mensaje = "¡Ganaste!";
    } else if (puntosC > puntosJ) {
      mensaje = "Gana la casa.";
    } else {
      mensaje = "Empate.";
    }
    finalizarJuego(puntosJ, puntosC, mensaje);
  };

  const finalizarJuego = (pJ: number, pC: number, msg: string) => {
    setJuegoTerminado(true);
    setMensajeFinal(msg);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Blackjack React Native</Text>

      {/* ÁREA CRUPIER */}
      <View style={styles.areaJuego}>
        <Text style={styles.subtitulo}>
          Crupier: {juegoTerminado ? puntosCrupier : "?"}
        </Text>
        <View style={styles.cartasContainer}>
          {cartasCrupier.map((carta, index) => {
            // Si el juego NO ha terminado, ocultamos la segunda carta (index 1)
            // A menos que sea la primera carta, esa siempre se ve.
            const mostrar = juegoTerminado || index === 0; 
            
            return (
              <Image
                key={index}
                source={{ 
                  uri: mostrar 
                    ? carta.image 
                    : 'https://deckofcardsapi.com/static/img/back.png' 
                }}
                style={styles.imagenCarta}
              />
            );
          })}
        </View>
      </View>

      {/* RESULTADO */}
      {juegoTerminado && (
        <View style={styles.resultadoContainer}>
          <Text style={styles.textoResultado}>{mensajeFinal}</Text>
          <Button title="Jugar de Nuevo" onPress={iniciarJuego} color="#28a745" />
        </View>
      )}

      {/* ÁREA JUGADOR */}
      <View style={styles.areaJuego}>
        <Text style={styles.subtitulo}>Tú: {puntosJugador}</Text>
        <View style={styles.cartasContainer}>
          {cartasJugador.map((carta, index) => (
            <Image
              key={index}
              source={{ uri: carta.image }}
              style={styles.imagenCarta}
            />
          ))}
        </View>
      </View>

      {/* BOTONES DE ACCIÓN */}
      {!juegoTerminado && (
        <View style={styles.botonesContainer}>
          <Button title="Pedir Carta" onPress={pedirCarta} />
          <View style={{ width: 20 }} />
          <Button title="Plantarse" onPress={plantarse} color="#d9534f" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#f0f0f0', alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  areaJuego: { alignItems: 'center', marginBottom: 30, minHeight: 180 },
  subtitulo: { fontSize: 18, marginBottom: 10, fontWeight: '600' },
  cartasContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  imagenCarta: { width: 80, height: 115, resizeMode: 'contain' },
  botonesContainer: { flexDirection: 'row', marginTop: 20 },
  resultadoContainer: { marginVertical: 10, alignItems: 'center' },
  textoResultado: { fontSize: 22, color: 'blue', fontWeight: 'bold', marginBottom: 10 }
});

export default Blackjack;