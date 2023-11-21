import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedDelete = ({ onDelete, position }) => {
  // Ref para armazenar o valor animado de opacidade
  const opacity = useRef(new Animated.Value(1)).current;

  // useEffect para realizar animação ao montar o componente
  useEffect(() => {
    // Animando a opacidade para 0 (fade out)
    Animated.timing(opacity, {
      toValue: 0,
      duration: 800, // duração para um efeito
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => onDelete && onDelete()); // Chama a função onDelete após a animação ser concluída
  }, []);

  const containerStyle = [
    styles.container,
    { opacity },
    position && { top: position.y, left: position.x }, // Adiciona as coordenadas ao estilo
  ];

  return (
    <Animated.View style={containerStyle}>
      <Text style={styles.text}>Item excluído</Text>
      <Icon name="delete" size={40} color="#FF6347" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 99, 71, 0.5)', // Cor de fundo com opacidade
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999, // Define a ordem de empilhamento
  },
  text: {
    color: '#333', // Tonalidade mais escura de texto para melhor contraste
    fontSize: 16,
    marginBottom: 8,
  },
});

export default AnimatedDelete;
