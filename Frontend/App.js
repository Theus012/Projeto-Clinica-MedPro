import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Imports das Telas
import Splash from './src/screens/Splash/Splash';
import MenuScreen from './src/screens/Menu/MenuScreen'; 
import Medico from './src/screens/Medico/Medico';
import CadastroEdicaoMedicoScreen from './src/screens/Medico/CadastroEdicaoMedicoScreen';
import Paciente from './src/screens/Paciente/Paciente';
import CadastroEdicaoPacienteScreen from './src/screens/Paciente/CadastroEdicaoPacienteScreen';

// Imports de Consulta
import Consulta from './src/screens/Consulta/Consulta';
import CadastroEdicaoConsultaScreen from './src/screens/Consulta/CadastroEdicaoConsultaScreen';

const Stack = createNativeStackNavigator();

function App() {
  // --- ESTADO: MÉDICOS (10 Cadastros) ---
  const [medicos, setMedicos] = useState([
    {id:1, nome:"Adriano Moreira Sales", especialidade:"Ginecologista", crm: "15.879-SP", email: "adriano@med.com", telefone: "(11) 99999-9999", endereco: "Av. Paulista, 1000"},
    {id:2, nome:"Bernardo Oliveira", especialidade:"Pediatra", crm: "22.333-SP", email: "bernardo@med.com", telefone: "(11) 98888-8888", endereco: "Rua Augusta, 500"},
    {id:3, nome:"Brenda de Almeida", especialidade:"Ortopedista", crm: "47.889-PR", email: "brenda@med.com", telefone: "(41) 97777-7777", endereco: "Av. das Graças, 633"},
    {id:4, nome:"Carlos Silva", especialidade:"Cardiologista", crm: "55.123-MG", email: "carlos@med.com", telefone: "(31) 96666-6666", endereco: "Praça da Liberdade, 100"},
    {id:5, nome:"Daniela Santos", especialidade:"Dermatologista", crm: "12.456-RJ", email: "daniela@med.com", telefone: "(21) 95555-5555", endereco: "Av. Atlântica, 200"},
    {id:6, nome:"Eduardo Costa", especialidade:"Neurologista", crm: "98.765-SP", email: "eduardo@med.com", telefone: "(11) 94444-4444", endereco: "Rua Oscar Freire, 300"},
    {id:7, nome:"Fernanda Lima", especialidade:"Oftalmologista", crm: "33.221-RS", email: "fernanda@med.com", telefone: "(51) 93333-3333", endereco: "Av. Ipiranga, 400"},
    {id:8, nome:"Gabriel Souza", especialidade:"Psiquiatra", crm: "66.777-BA", email: "gabriel@med.com", telefone: "(71) 92222-2222", endereco: "Rua Chile, 50"},
    {id:9, nome:"Helena Rocha", especialidade:"Endocrinologista", crm: "44.555-SC", email: "helena@med.com", telefone: "(48) 91111-1111", endereco: "Av. Beira Mar, 600"},
    {id:10, nome:"Igor Martins", especialidade:"Urologista", crm: "77.888-PE", email: "igor@med.com", telefone: "(81) 90000-0000", endereco: "Rua da Aurora, 700"},
  ]);

  // --- ESTADO: PACIENTES (10 Cadastros) ---
  const [pacientes, setPacientes] = useState([
    {id:1, nome:"Marcela Trindade", cpf: "111.222.333-44", email: "marcela@gmail.com", telefone: "(11) 99999-1001", logradouro: "Rua das Flores", numero: "123", cidade: "São Paulo", uf: "SP", cep: "01000-000"},
    {id:2, nome:"Carlos Eduardo de Oliveira", cpf: "222.333.444-55", email: "carlos@hotmail.com", telefone: "(12) 99999-1002", logradouro: "Av. Central", numero: "500", cidade: "São José", uf: "SP", cep: "12000-000"},
    {id:3, nome:"Pâmela Lopes", cpf: "333.444.555-66", email: "pamela@email.com", telefone: "(31) 99999-1003", logradouro: "Rua X", numero: "98", cidade: "Belo Horizonte", uf: "MG", cep: "30000-000"},
    {id:4, nome:"João da Silva", cpf: "444.555.666-77", email: "joao@email.com", telefone: "(21) 99999-1004", logradouro: "Rua Y", numero: "10", cidade: "Rio de Janeiro", uf: "RJ", cep: "20000-000"},
    {id:5, nome:"Maria Oliveira", cpf: "555.666.777-88", email: "maria@email.com", telefone: "(41) 99999-1005", logradouro: "Rua Z", numero: "20", cidade: "Curitiba", uf: "PR", cep: "80000-000"},
    {id:6, nome:"José Santos", cpf: "666.777.888-99", email: "jose@email.com", telefone: "(51) 99999-1006", logradouro: "Av. A", numero: "30", cidade: "Porto Alegre", uf: "RS", cep: "90000-000"},
    {id:7, nome:"Ana Costa", cpf: "777.888.999-00", email: "ana@email.com", telefone: "(71) 99999-1007", logradouro: "Av. B", numero: "40", cidade: "Salvador", uf: "BA", cep: "40000-000"},
    {id:8, nome:"Pedro Rocha", cpf: "888.999.000-11", email: "pedro@email.com", telefone: "(81) 99999-1008", logradouro: "Praça C", numero: "50", cidade: "Recife", uf: "PE", cep: "50000-000"},
    {id:9, nome:"Lucas Martins", cpf: "999.000.111-22", email: "lucas@email.com", telefone: "(85) 99999-1009", logradouro: "Rua D", numero: "60", cidade: "Fortaleza", uf: "CE", cep: "60000-000"},
    {id:10, nome:"Júlia Lima", cpf: "000.111.222-33", email: "julia@email.com", telefone: "(61) 99999-1010", logradouro: "Rua E", numero: "70", cidade: "Brasília", uf: "DF", cep: "70000-000"},
  ]);

  // --- ESTADO: CONSULTAS (Vazio) ---
  const [consultas, setConsultas] = useState([]);

  // --- CRUD GERAL ---
  const adicionar = (setLista, lista, item) => setLista([...lista, { ...item, id: Date.now() }]);
  const editar = (setLista, lista, item) => setLista(lista.map(i => i.id === item.id ? item : i));
  const remover = (setLista, lista, id) => setLista(lista.filter(i => i.id !== id));

  // --- WRAPPERS ---
  const MedicoList = (props) => <Medico {...props} medicos={medicos} onDelete={(id)=>remover(setMedicos, medicos, id)} />;
  const MedicoForm = (props) => <CadastroEdicaoMedicoScreen {...props} onSave={(d)=>d.id?editar(setMedicos, medicos, d):adicionar(setMedicos, medicos, d)} onDelete={(id)=>remover(setMedicos, medicos, id)} />;
  
  const PacienteList = (props) => <Paciente {...props} pacientes={pacientes} onDelete={(id)=>remover(setPacientes, pacientes, id)} />;
  const PacienteForm = (props) => <CadastroEdicaoPacienteScreen {...props} onSave={(d)=>d.id?editar(setPacientes, pacientes, d):adicionar(setPacientes, pacientes, d)} onDelete={(id)=>remover(setPacientes, pacientes, id)} />;

  const ConsultaList = (props) => <Consulta {...props} consultas={consultas} medicos={medicos} pacientes={pacientes} onDelete={(id)=>remover(setConsultas, consultas, id)} />;
  const ConsultaForm = (props) => (
    <CadastroEdicaoConsultaScreen 
        {...props} 
        medicos={medicos} 
        pacientes={pacientes} 
        consultas={consultas} 
        onSave={(d)=>d.id?editar(setConsultas, consultas, d):adicionar(setConsultas, consultas, d)} 
        onDelete={(id)=>remover(setConsultas, consultas, id)} 
    />
  );

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#0B2A45" />
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerStyle: { backgroundColor: '#0B2A45' }, headerTintColor: '#fff' }}>
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
        
        <Stack.Screen name="Medicos" component={MedicoList} options={{ title: 'Médicos' }} />
        <Stack.Screen name="CadastroEdicaoMedicoScreen" component={MedicoForm} options={{ headerShown: false }} />

        <Stack.Screen name="Pacientes" component={PacienteList} options={{ title: 'Pacientes' }} />
        <Stack.Screen name="CadastroEdicaoPacienteScreen" component={PacienteForm} options={{ headerShown: false }} />

        <Stack.Screen name="Consultas" component={ConsultaList} options={{ title: 'Consultas' }} />
        <Stack.Screen name="CadastroEdicaoConsultaScreen" component={ConsultaForm} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;