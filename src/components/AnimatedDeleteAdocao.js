import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Button } from 'react-native-paper';

const AnimatedDeleteAdocao = ({ onDelete, onShowLocationDetails }) => {
  // Refs para armazenar valores animados
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  // Estado para controlar a visibilidade do componente
  const [visible, setVisible] = useState(true);

  // Efeito useEffect para realizar animações ao montar o componente
  useEffect(() => {
    // Animando translateY e opacity simultaneamente
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Estilo do contêiner, incluindo transformações animadas
  const containerStyle = [
    styles.container,
    {
      transform: [
        {
          translateY: translateY.interpolate({
            inputRange: [0, 1],
            outputRange: [400, 0],
          }),
        },
      ],
    },
    { opacity },
  ];

  return (
    // Renderiza o componente apenas se for visível
    visible && (
      <Animated.View style={containerStyle}>
        <Text style={styles.text}>Obrigado por adotar um animal! 🤍</Text>
        <Text style={styles.instructions}>
          Para concluir o processo de adoção, leve os seguintes documentos:
        </Text>
        <Text style={styles.documentList}>
          - CPF {'\n'}- Identidade {'\n'}- Comprovante de Residencia
        </Text>
        <Button
          style={styles.closeButton}
          labelStyle={{ color: '#FFFFFF' }}
          onPress={() => {
            // Oculta o componente e executa a animação de fade out(O botão "Fechar" oculta o componente e executa uma animação de fade out antes de chamar a função onDelete)
            setVisible(false);
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              easing: Easing.ease,
              useNativeDriver: true,
            }).start(() => onDelete && onDelete());
          }}
        >
          Fechar
        </Button>
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6f1ec8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  documentList: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#008000',
  },
});

export default AnimatedDeleteAdocao;
