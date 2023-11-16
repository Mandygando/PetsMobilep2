import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnimatedDelete = ({ onDelete, position }) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 800, // Aumentei um pouco mais a duração para um efeito ainda mais suave
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => onDelete && onDelete());
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
    backgroundColor: 'rgba(255, 99, 71, 0.5)', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999, 
  },
  text: {
    color: '#333', // Tonalidade mais escura de texto para melhor contraste
    fontSize: 16,
    marginBottom: 8,
  },
});

export default AnimatedDelete;
