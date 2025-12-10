import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, SafeAreaView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Função para agrupar consultas por data
const groupConsultas = (consultas, medicos, pacientes, searchText) => {
  // Filtra primeiro
  const filtered = consultas.filter(c => {
    const med = medicos.find(m => m.id === c.medicoId);
    const pac = pacientes.find(p => p.id === c.pacienteId);
    const termo = searchText.toLowerCase();
    return (med?.nome.toLowerCase().includes(termo) || pac?.nome.toLowerCase().includes(termo) || c.data.includes(termo));
  });

  // Agrupa por Data
  const grouped = filtered.reduce((acc, curr) => {
    const dataKey = curr.data;
    if (!acc[dataKey]) acc[dataKey] = [];
    acc[dataKey].push(curr);
    return acc;
  }, {});

  // Ordena as datas (simples string sort por enquanto)
  return Object.keys(grouped).sort().map(date => ({ title: date, data: grouped[date] }));
};

const ConsultaCard = ({ consulta, medicos, pacientes, navigation, onDelete }) => {
  const medico = medicos.find(m => m.id === consulta.medicoId) || { nome: 'Médico removido', especialidade: '-' };
  const paciente = pacientes.find(p => p.id === consulta.pacienteId) || { nome: 'Paciente removido' };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.time}>{consulta.horario}</Text>
        <View style={styles.divider} />
        <View style={{flex: 1}}>
            <Text style={styles.doctorName}>{medico.nome}</Text>
            <Text style={styles.doctorSpec}>{medico.especialidade} | CRM {medico.crm}</Text>
            <Text style={styles.patientName}>Paciente: {paciente.nome}</Text>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnAction} onPress={() => navigation.navigate('CadastroEdicaoConsultaScreen', { consulta })}>
            <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnAction, {borderColor: 'red'}]} onPress={() => Alert.alert("Cancelar", "Deseja cancelar esta consulta?", [{text: "Não"}, {text: "Sim", onPress: ()=>onDelete(consulta.id)}])}>
            <Text style={[styles.btnText, {color: 'red'}]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Consulta({ navigation, consultas, medicos, pacientes, onDelete }) {
  const [searchText, setSearchText] = useState('');
  const sections = useMemo(() => groupConsultas(consultas, medicos, pacientes, searchText), [consultas, medicos, pacientes, searchText]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Pesquisar consultas" value={searchText} onChangeText={setSearchText} />
        <Ionicons name="search" size={20} color="#888" />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderBox}>
            <Text style={styles.sectionHeaderTitle}>{title}</Text>
            <View style={styles.line} />
          </View>
        )}
        renderItem={({ item }) => <ConsultaCard consulta={item} medicos={medicos} pacientes={pacientes} navigation={navigation} onDelete={onDelete} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('CadastroEdicaoConsultaScreen')}>
            <Text style={styles.btnPrimaryText}>Agendar nova consulta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', margin: 15, borderRadius: 8, paddingHorizontal: 15, height: 50 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  sectionHeaderBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 5, backgroundColor: '#fff' },
  sectionHeaderTitle: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', marginRight: 10 },
  line: { flex: 1, height: 1, backgroundColor: '#eee' },
  card: { marginHorizontal: 20, marginBottom: 15, padding: 15, borderRadius: 10, backgroundColor: '#fff', elevation: 2, borderWidth: 1, borderColor: '#eee' },
  cardHeader: { flexDirection: 'row' },
  time: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 15 },
  divider: { width: 4, backgroundColor: '#eee', borderRadius: 2, marginRight: 15 },
  doctorName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  doctorSpec: { fontSize: 12, color: '#888', marginBottom: 5 },
  patientName: { fontSize: 14, color: '#0B2A45', fontWeight: '600' },
  cardActions: { flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end', gap: 10 },
  btnAction: { paddingVertical: 5, paddingHorizontal: 15, borderWidth: 1, borderColor: '#0B2A45', borderRadius: 5 },
  btnText: { color: '#0B2A45', fontWeight: 'bold', fontSize: 12 },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 15, borderTopWidth: 1, borderTopColor: '#eee', elevation: 5 },
  btnPrimary: { backgroundColor: '#0B2A45', borderRadius: 8, paddingVertical: 15, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});