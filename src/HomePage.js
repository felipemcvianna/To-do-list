import React, { useState, useEffect } from 'react';
import { ChakraProvider, Text, Divider, Flex, Button, Table, Thead, Tbody, Tr, Th, Td, Input, IconButton, Box, Card, CardBody, Switch } from '@chakra-ui/react';
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc, where } from 'firebase/firestore';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';

// Configurações do Firebase
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
const db = getFirestore(app);

function HomePage() {
  const navigate = useNavigate();
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Verifique se o usuário está autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return; // Se não estiver autenticado, não faça nada
    }
    
    // Crie um listener em tempo real para as tarefas do usuário atual
    const q = query(collection(db, 'tasks'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, name: doc.data().name, completed: doc.data().completed });
      });
      setTasks(tasksData);
    });
    
    // Retorne a função de limpeza para cancelar a inscrição quando o componente for desmontado
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [auth.currentUser, db]);

  const handleAddTask = async () => {
    try {
      // Obtenha o ID do usuário atual
      const userId = auth.currentUser.uid;
      
      // Adicione uma nova tarefa ao Firestore com o ID do usuário
      await addDoc(collection(db, 'tasks'), {
        userId: userId,
        name: taskInput,
        completed: false // Definir a tarefa como não concluída por padrão
      });
      setTaskInput(''); // Limpe o campo de entrada
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Exclua a tarefa do Firestore
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      // Atualize o status de conclusão da tarefa no Firestore
      await updateDoc(doc(db, 'tasks', taskId), {
        completed: !completed // Inverter o status de conclusão da tarefa
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ChakraProvider>
      <Flex justify="center" align="center" mt="10">
        <Flex justify="center" align="center"  flexDirection="column">
          <Box maxW="400px">
            <Text fontSize='4xl' ml="2" mb="2" mt="-3">To-Do List</Text>
            <Divider mt="-2" mb="5"></Divider>
            <Flex mb={4}>
              <Input placeholder="Digite uma nova tarefa" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} mr={2} />
              <IconButton
                colorScheme="green"
                aria-label="Adicionar Tarefa"
                icon={<AddIcon />}
                onClick={handleAddTask}
              />
            </Flex>
            <Card>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Tarefa</Th>
                      <Th>Estado</Th> {/* Nova coluna para o Switch */}
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tasks.map(task => (
                      <Tr key={task.id}>
                        <Td>
                          <Text textDecoration={task.completed ? 'line-through' : 'none'}>{task.name}</Text>
                        </Td>
                        <Td>
                          <Switch
                            isChecked={task.completed}
                            onChange={() => handleToggleTask(task.id, task.completed)}
                            colorScheme="green"
                            size="md"
                          />
                        </Td>
                        <Td>
                          <IconButton
                            colorScheme="red"
                            aria-label="Excluir Tarefa"
                            icon={<DeleteIcon />}
                            onClick={() => handleDeleteTask(task.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </Box>
          <Button mt={4} colorScheme="red" onClick={handleSignOut}>Sign Out</Button>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default HomePage;
