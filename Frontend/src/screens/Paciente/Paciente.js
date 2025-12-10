import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, SectionList, TouchableOpacity, Platform, LayoutAnimation, UIManager, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Filtra e Agrupa
const groupAndFilter = (data, searchText) => {
  const lista = data || [];
  const filtered = lista.filter(item => 
    item.nome.toLowerCase().includes(searchText.toLowerCase()) || 
    (item.cpf && item.cpf.includes(searchText))
  );

  const grouped = filtered.reduce((acc, curr) => {
    const letra = curr.nome[0].toUpperCase();
    if (!acc[letra]) acc[letra] = [];
    acc[letra].push(curr);
    return acc;
  }, {});

  return Object.keys(grouped).sort().map(letra => ({ title: letra, data: grouped[letra] }));
};

const PacienteCard = ({ paciente, navigation, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  // Função para formatar o endereço em uma linha só para visualização
  const enderecoCompleto = `${paciente.logradouro || ''}, ${paciente.numero || ''} ${paciente.complemento ? '- ' + paciente.complemento : ''} - ${paciente.cidade || ''}/${paciente.uf || ''}`;

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={toggleExpand} style={styles.cardHeader} activeOpacity={0.7}>
        <View style={{flex: 1}}>
          <Text style={styles.cardName}>{paciente.nome}</Text>
          {/* No design de paciente, mostra o telefone em destaque embaixo do nome */}
          <Text style={styles.cardSub}>{paciente.telefone}</Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#0B2A45" style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.cardBody}>
          <Text style={styles.label}>E-mail: <Text style={styles.value}>{paciente.email}</Text></Text>
          <Text style={styles.label}>CPF: <Text style={styles.value}>{paciente.cpf}</Text></Text>
          <Text style={styles.label}>Endereço: <Text style={styles.value}>{enderecoCompleto}</Text></Text>

          <View style={styles.cardActions}>
            <TouchableOpacity 
                style={styles.btnOutline} 
                onPress={() => navigation.navigate('CadastroEdicaoPacienteScreen', { paciente: paciente })}
            >
               <Text style={styles.btnOutlineText}>Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.btnOutline, { borderColor: 'red' }]} 
                onPress={() => Alert.alert("Remover", `Deseja remover ${paciente.nome}?`, [{text: "Cancelar"}, {text: "Sim", onPress:()=>onDelete(paciente.id)}])}
            >
               <Text style={[styles.btnOutlineText, { color: 'red' }]}>Desativar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default function Paciente({ navigation, pacientes, onDelete }) {
  const [searchText, setSearchText] = useState('');
  const sections = useMemo(() => groupAndFilter(pacientes, searchText), [pacientes, searchText]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Pesquisar (Nome ou CPF)" value={searchText} onChangeText={setSearchText} />
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PacienteCard paciente={item} navigation={navigation} onDelete={onDelete} />}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        contentContainerStyle={{ paddingBottom: 80 }} 
      />

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('CadastroEdicaoPacienteScreen')}>
          <Text style={styles.btnPrimaryText}>Cadastrar novo perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', margin: 15, borderRadius: 8, paddingHorizontal: 15, height: 50 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  searchIcon: { marginLeft: 10 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 5 },
  cardContainer: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingHorizontal: 20, paddingVertical: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSub: { fontSize: 14, color: '#888', marginTop: 2 },
  cardBody: { marginTop: 5 },
  label: { fontSize: 14, color: '#555', marginTop: 5 },
  value: { color: '#333', fontWeight: '500' },
  cardActions: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', gap: 10 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: '#0B2A45', borderRadius: 5, paddingVertical: 8, alignItems: 'center' },
  btnOutlineText: { color: '#0B2A45', fontWeight: 'bold' },
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 15, borderTopWidth: 1, borderTopColor: '#eee', elevation: 5 },
  btnPrimary: { backgroundColor: '#0B2A45', borderRadius: 8, paddingVertical: 15, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});