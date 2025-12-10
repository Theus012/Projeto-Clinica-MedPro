import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroEdicaoMedicoScreen({ navigation, route, onSave, onDelete }) {
  const medicoEditar = route.params?.medico || {};
  const isEditing = !!route.params?.medico;

  const [nome, setNome] = useState(medicoEditar.nome || '');
  const [especialidade, setEspecialidade] = useState(medicoEditar.especialidade || '');
  const [crm, setCrm] = useState(medicoEditar.crm || '');
  const [email, setEmail] = useState(medicoEditar.email || '');
  const [telefone, setTelefone] = useState(medicoEditar.telefone || '');
  const [endereco, setEndereco] = useState(medicoEditar.endereco || '');

  // --- MÁSCARA DE TELEFONE ---
  const handleTelefoneChange = (text) => {
    let t = text.replace(/\D/g, ''); // Remove tudo que não é número
    if (t.length > 11) t = t.slice(0, 11); // Limita a 11 dígitos

    // Aplica a formatação (XX) XXXXX-XXXX
    t = t.replace(/^(\d{2})(\d)/g, '($1) $2'); 
    t = t.replace(/(\d)(\d{4})$/, '$1-$2');

    setTelefone(t);
  };

  const handleConcluir = () => {
    if (!nome || !especialidade || !crm) {
        Alert.alert("Erro", "Preencha os campos obrigatórios!");
        return;
    }

    const dadosMedico = {
        id: medicoEditar.id || null,
        nome, especialidade, crm, email, telefone, endereco
    };

    onSave(dadosMedico);
    navigation.goBack();
  };

  const handleDesativar = () => {
      Alert.alert(
          "Desativar Perfil",
          "Tem certeza que deseja excluir este médico?",
          [
              { text: "Cancelar", style: "cancel" },
              { text: "Desativar", style: 'destructive', onPress: () => { if (onDelete && medicoEditar.id) { onDelete(medicoEditar.id); navigation.goBack(); } } }
          ]
      );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar' : 'Novo perfil'}</Text>
        <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Profissional</Text>
            <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
            
            <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 2, marginRight: 10 }]} placeholder="Especialidade" value={especialidade} onChangeText={setEspecialidade} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="CRM" value={crm} onChangeText={setCrm} />
            </View>

            <Text style={styles.sectionTitle}>Contatos</Text>
            <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
            
            {/* INPUT TELEFONE COM MÁSCARA */}
            <TextInput 
                style={styles.input} 
                placeholder="Telefone (XX) XXXXX-XXXX" 
                value={telefone} 
                onChangeText={handleTelefoneChange} 
                keyboardType="phone-pad"
                maxLength={15} // (11) 91234-5678 = 15 chars
            />

            <Text style={styles.sectionTitle}>Endereço profissional</Text>
            <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />

            {isEditing && (
                <TouchableOpacity style={styles.btnDelete} onPress={handleDesativar}>
                    <Text style={styles.btnDeleteText}>Desativar este perfil</Text>
                </TouchableOpacity>
            )}
        </ScrollView>

        <View style={styles.footer}>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleConcluir}>
                <Text style={styles.btnPrimaryText}>{isEditing ? 'Concluir edição' : 'Concluir cadastro'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.goBack()}>
                <Text style={styles.btnSecondaryText}>Cancelar</Text>
            </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#0B2A45', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 15, color: '#333' },
  row: { flexDirection: 'row' },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
  btnPrimary: { backgroundColor: '#0B2A45', borderRadius: 8, padding: 15, alignItems: 'center', marginBottom: 10 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnSecondary: { borderWidth: 1, borderColor: '#0B2A45', borderRadius: 8, padding: 15, alignItems: 'center' },
  btnSecondaryText: { color: '#0B2A45', fontWeight: 'bold', fontSize: 16 },
  btnDelete: { marginTop: 10, alignSelf: 'center' },
  btnDeleteText: { color: 'red', fontWeight: 'bold' }
});