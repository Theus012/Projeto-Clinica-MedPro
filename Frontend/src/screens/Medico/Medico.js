import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SectionList, 
  TouchableOpacity, 
  Platform,
  LayoutAnimation,
  UIManager,
  SafeAreaView,
  Alert // Importando Alert para confirmação
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Habilita animação no Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// =========================================================================
// LÓGICA DE FILTRO E AGRUPAMENTO
// =========================================================================
const groupAndFilterMedicos = (medicos, searchText) => {
  // Garante que medicos é um array para evitar erro se vier undefined
  const listaSegura = medicos || [];

  const filtered = listaSegura.filter(m => 
    m.nome.toLowerCase().includes(searchText.toLowerCase()) || 
    m.especialidade.toLowerCase().includes(searchText.toLowerCase())
  );

  const grouped = filtered.reduce((acc, curr) => {
    const letra = curr.nome[0].toUpperCase();
    if (!acc[letra]) acc[letra] = [];
    acc[letra].push(curr);
    return acc;
  }, {});

  return Object.keys(grouped).sort().map(letra => ({
    title: letra,
    data: grouped[letra]
  }));
};

// =========================================================================
// COMPONENTE CARD (ITEM DA LISTA)
// =========================================================================
// Recebe agora o onDelete via props
const MedicoCard = ({ medico, navigation, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const handleDesativar = () => {
    Alert.alert(
      "Desativar Perfil",
      `Tem certeza que deseja remover ${medico.nome}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Desativar", 
          style: 'destructive', 
          onPress: () => onDelete(medico.id) // Chama a função que vem do App.js
        }
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      {/* Cabeçalho do Card (Sempre visível) */}
      <TouchableOpacity onPress={toggleExpand} style={styles.cardHeader} activeOpacity={0.7}>
        <View style={{flex: 1}}>
          <Text style={styles.cardName}>{medico.nome}</Text>
          <Text style={styles.cardSub}>{medico.especialidade} | CRM: {medico.crm}</Text>
        </View>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color="#0B2A45" 
          style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
        />
      </TouchableOpacity>

      {/* Detalhes (Visível apenas quando expandido) */}
      {expanded && (
        <View style={styles.cardBody}>
          <Text style={styles.label}>E-mail: <Text style={styles.value}>{medico.email}</Text></Text>
          <Text style={styles.label}>Telefone: <Text style={styles.value}>{medico.telefone}</Text></Text>
          <Text style={styles.label}>Endereço: <Text style={styles.value}>{medico.endereco}</Text></Text>

          <View style={styles.cardActions}>
            {/* Botão Editar: Navega passando o objeto medico atual */}
            <TouchableOpacity 
                style={styles.btnOutline} 
                onPress={() => navigation.navigate('CadastroEdicaoMedicoScreen', { medico: medico })}
            >
               <Text style={styles.btnOutlineText}>Editar</Text>
            </TouchableOpacity>
            
            {/* Botão Desativar: Chama o alerta */}
            <TouchableOpacity 
                style={[styles.btnOutline, { borderColor: 'red' }]} 
                onPress={handleDesativar}
            >
               <Text style={[styles.btnOutlineText, { color: 'red' }]}>Desativar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// =========================================================================
// TELA PRINCIPAL (MEDICO)
// =========================================================================
// Recebe medicos e onDelete via props do App.js
export default function Medico({ navigation, medicos, onDelete }) {
  const [searchText, setSearchText] = useState('');
  
  // Usando os dados REAIS (medicos) que vêm do App.js em vez de DADOS_MOCK
  const sections = useMemo(() => groupAndFilterMedicos(medicos, searchText), [medicos, searchText]);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Pesquisar"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      </View>

      {/* Lista de Médicos */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <MedicoCard 
                medico={item} 
                navigation={navigation} 
                onDelete={onDelete} // Passando a função para o card
            />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 80 }} 
      />

      {/* Botão Flutuante/Fixo Inferior */}
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('CadastroEdicaoMedicoScreen')}>
          <Text style={styles.btnPrimaryText}>Cadastrar novo perfil</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// =========================================================================
// ESTILOS (STYLESHEET)
// =========================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Pesquisa
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
  },
  // Section Header (A, B, C...)
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF', 
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  // Card
  cardContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSub: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  cardBody: {
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  value: {
    color: '#333',
    fontWeight: '500',
  },
  // Botões do Card
  cardActions: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    gap: 10,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#0B2A45',
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnOutlineText: {
    color: '#0B2A45',
    fontWeight: 'bold',
  },
  // Footer
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 5, 
  },
  btnPrimary: {
    backgroundColor: '#0B2A45', 
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});