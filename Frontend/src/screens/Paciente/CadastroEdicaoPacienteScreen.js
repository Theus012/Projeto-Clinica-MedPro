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

export default function CadastroEdicaoPacienteScreen({ navigation, route, onSave, onDelete }) {
  const isEditing = !!route.params?.paciente;
  const paciente = route.params?.paciente || {};

  const [nome, setNome] = useState(paciente.nome || '');
  const [cpf, setCpf] = useState(paciente.cpf || '');
  const [email, setEmail] = useState(paciente.email || '');
  const [telefone, setTelefone] = useState(paciente.telefone || '');
  const [logradouro, setLogradouro] = useState(paciente.logradouro || '');
  const [numero, setNumero] = useState(paciente.numero || '');
  const [complemento, setComplemento] = useState(paciente.complemento || '');
  const [cidade, setCidade] = useState(paciente.cidade || '');
  const [uf, setUf] = useState(paciente.uf || '');
  const [cep, setCep] = useState(paciente.cep || '');

  // --- MÁSCARA CPF ---
  const handleCpfChange = (text) => {
    let numbers = text.replace(/\D/g, "");
    if (numbers.length > 11) numbers = numbers.slice(0, 11);
    numbers = numbers.replace(/(\d{3})(\d)/, "$1.$2");
    numbers = numbers.replace(/(\d{3})(\d)/, "$1.$2");
    numbers = numbers.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(numbers);
  };

  // --- MÁSCARA TELEFONE ---
  const handleTelefoneChange = (text) => {
    let t = text.replace(/\D/g, ''); 
    if (t.length > 11) t = t.slice(0, 11);
    t = t.replace(/^(\d{2})(\d)/g, '($1) $2'); 
    t = t.replace(/(\d)(\d{4})$/, '$1-$2');
    setTelefone(t);
  };

  const handleConcluir = () => {
    if (!nome || !cpf || !telefone) {
        Alert.alert("Erro", "Preencha Nome, CPF e Telefone!");
        return;
    }
    onSave({ id: paciente.id, nome, cpf, email, telefone, logradouro, numero, complemento, cidade, uf, cep });
    navigation.goBack();
  };

  const handleDesativar = () => {
    Alert.alert("Desativar Perfil", "Tem certeza?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Desativar", style: 'destructive', onPress: () => { if (onDelete && paciente.id) { onDelete(paciente.id); navigation.goBack(); } } }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Paciente' : 'Novo Paciente'}</Text>
        <View style={{width: 28}} /> 
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Paciente</Text>
            <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
            <TextInput 
                style={styles.input} 
                placeholder="CPF (000.000.000-00)" 
                value={cpf} 
                onChangeText={handleCpfChange} 
                keyboardType="numeric" 
                maxLength={14} 
            />

            <Text style={styles.sectionTitle}>Contatos</Text>
            <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
            
            {/* INPUT TELEFONE COM MÁSCARA */}
            <TextInput 
                style={styles.input} 
                placeholder="Telefone (XX) XXXXX-XXXX" 
                value={telefone} 
                onChangeText={handleTelefoneChange} 
                keyboardType="phone-pad"
                maxLength={15} 
            />

            <Text style={styles.sectionTitle}>Endereço</Text>
            <TextInput style={styles.input} placeholder="Logradouro" value={logradouro} onChangeText={setLogradouro} />
            
            <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder="Número" value={numero} onChangeText={setNumero} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Complemento" value={complemento} onChangeText={setComplemento} />
            </View>

            <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
            
            <View style={styles.row}>
                <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder="UF" value={uf} onChangeText={setUf} maxLength={2} />
                <TextInput style={[styles.input, { flex: 2 }]} placeholder="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" />
            </View>

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