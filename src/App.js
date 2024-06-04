import React, { useState, useEffect } from 'react';
import { ChakraProvider, useToast, Text, Flex, Box, Card, CardBody, CardFooter, Input, Button } from '@chakra-ui/react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';

// Configure o Firebase com suas credenciais
const firebaseConfig = {
  apiKey: "AIzaSyDucIUBSwMnMVpOu8WIaK93PaGSBOdwwss",
  authDomain: "to-do-private.firebaseapp.com",
  projectId: "to-do-private",
  storageBucket: "to-do-private.appspot.com",
  messagingSenderId: "155067687628",
  appId: "1:155067687628:web:6ef1527026b3e411851869",
  measurementId: "G-D4NBEDCD3V"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Crie uma instância do useNavigate
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Se o usuário existir, redirecione para outra página
        navigate('/HomePage');
      }
    });
    // Retorne a função de limpeza para cancelar a inscrição quando o componente for desmontado
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [auth, navigate]); // Certifique-se de incluir auth e navigate como dependências

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Registro bem-sucedido",
        description: "Usuário registrado com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Usuário autenticado com sucesso, o redirecionamento será tratado pelo onAuthStateChanged
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ChakraProvider>
      <Flex justify="center" align="center" h="60vh">
        <Box maxW="300px">
          <Card>
            <CardBody>
              <Text fontSize='4xl' ml="2" mb="2" mt="-3">To-Do Private</Text>
              <Input
                placeholder="E-mail"
                value={email}
                mb="2"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </CardBody>
            <CardFooter mt="-6">
              <Button mr="2" colorScheme="green" onClick={handleSignIn}>
                Sign-In
              </Button>
              <Button colorScheme="red" onClick={handleRegister}>
                Sign-Up
              </Button>
            </CardFooter>
          </Card>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;