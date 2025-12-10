import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Alert, 
    Modal, 
    FlatList, 
    KeyboardAvoidingView, 
    Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroEdicaoConsultaScreen({ navigation, route, medicos, pacientes, consultas, onSave }) {
  const isEditing = !!route.params?.consulta;
  const consulta = route.params?.consulta || {};
  const listaConsultas = consultas || [];

  // Estados
  const [medicoId, setMedicoId] = useState(consulta.medicoId || null);
  const [pacienteId, setPacienteId] = useState(consulta.pacienteId || null);
  const [data, setData] = useState(consulta.data || '');
  const [horario, setHorario] = useState(consulta.horario || '');

  // Modais
  const [modalMedicoVisible, setModalMedicoVisible] = useState(false);
  const [modalPacienteVisible, setModalPacienteVisible] = useState(false);
  const [modalCalendarioVisible, setModalCalendarioVisible] = useState(false);
  const [modalHorarioVisible, setModalHorarioVisible] = useState(false);

  const medicoSelecionado = medicos.find(m => m.id === medicoId);
  const pacienteSelecionado = pacientes.find(p => p.id === pacienteId);

  // --- CONFIGURAÇÃO DE HORÁRIOS ---
  const HORARIOS_DISPONIVEIS = [
      '08:00', '09:00', '10:00', '11:00', 
      '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // --- VALIDAÇÕES DE TEMPO (PASSADO/FUTURO) ---

  // Verifica se uma data (string DD/MM/AAAA) é anterior a hoje
  const isDataPassada = (dateString) => {
      const [dia, mes, ano] = dateString.split('/').map(Number);
      // Cria a data à meia-noite para comparar apenas o dia
      const dateToCheck = new Date(ano, mes - 1, dia);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera hora de hoje para comparação justa
      
      return dateToCheck < hoje;
  };

  // Verifica se o horário já passou (considerando apenas se for HOJE)
  const isHorarioPassado = (horaCheck) => {
      if (!data) return false;

      const [dia, mes, ano] = data.split('/').map(Number);
      const dateSelected = new Date(ano, mes - 1, dia);
      const hoje = new Date();

      // Se a data selecionada for HOJE, verifica a hora
      if (dateSelected.toDateString() === hoje.toDateString()) {
          const [hCheck, mCheck] = horaCheck.split(':').map(Number);
          const horaAtual = hoje.getHours();
          
          // Se a hora do slot for menor que a hora atual, já passou.
          // Ex: Agora são 10:00. O slot de 09:00 retorna true (passado).
          if (hCheck <= horaAtual) return true; 
      }
      return false;
  };

  // --- LÓGICA DE BLOQUEIO GERAL (Passado OU Ocupado) ---
  const isHorarioIndisponivel = (horaCheck) => {
      // 1. Verifica se já passou
      if (isHorarioPassado(horaCheck)) return true;

      // 2. Verifica se está ocupado por outro paciente
      if (!medicoId || !data) return false; 
      return listaConsultas.some(c => 
          c.medicoId === medicoId &&    
          c.data === data &&            
          c.horario === horaCheck &&    
          c.id !== consulta.id 
      );
  };

  const handleConcluir = () => {
    if (!medicoId || !pacienteId || !data || !horario) {
        Alert.alert("Erro", "Preencha todos os campos!");
        return;
    }
    onSave({ id: consulta.id, medicoId, pacienteId, data, horario, status: 'Agendado' });
    navigation.goBack();
  };

  // --- MODAIS ---

  // 1. Modal de Lista Genérica (Atualizado para mostrar Especialidade do Médico)
  const SelectionModal = ({ visible, onClose, data, onSelect, title, isMedico }) => (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity>
                </View>
                <FlatList
                    data={data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.modalItem} onPress={() => { onSelect(item.id); onClose(); }}>
                            <Text style={styles.modalItemText}>
                                {item.nome}
                                {/* Se for médico, mostra a especialidade ao lado ou embaixo */}
                                {isMedico && item.especialidade ? ` - ${item.especialidade}` : ''}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    </Modal>
  );

  // 2. Modal de Calendário (Com bloqueio de dias passados)
  const CalendarModal = ({ visible, onClose, onSelect }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

    const generateDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let days = [];
        for(let i=1; i<=daysInMonth; i++) {
            const dayString = i < 10 ? `0${i}` : `${i}`;
            const monthString = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
            days.push(`${dayString}/${monthString}/${year}`);
        }
        return days;
    };

    const diasDoMes = generateDays();

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { height: 'auto', paddingBottom: 20 }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Selecione a Data</Text>
                        <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity>
                    </View>
                    <View style={styles.calendarNav}>
                        <TouchableOpacity onPress={prevMonth} style={styles.navBtn}><Ionicons name="chevron-back" size={24} color="#0B2A45" /></TouchableOpacity>
                        <Text style={styles.monthTitle}>{nomesMeses[viewDate.getMonth()]} {viewDate.getFullYear()}</Text>
                        <TouchableOpacity onPress={nextMonth} style={styles.navBtn}><Ionicons name="chevron-forward" size={24} color="#0B2A45" /></TouchableOpacity>
                    </View>
                    <View style={styles.calendarGrid}>
                        {diasDoMes.map((dia) => {
                            const passado = isDataPassada(dia); // Verifica se é passado
                            return (
                                <TouchableOpacity 
                                    key={dia} 
                                    disabled={passado} // Bloqueia clique
                                    style={[
                                        styles.calendarDay, 
                                        data === dia && styles.calendarDaySelected,
                                        passado && styles.calendarDayDisabled // Estilo visual bloqueado
                                    ]} 
                                    onPress={() => { onSelect(dia); onClose(); setHorario(''); }}
                                >
                                    <Text style={[
                                        styles.calendarDayText, 
                                        data === dia && {color: '#fff'},
                                        passado && {color: '#ccc'} // Texto cinza claro
                                    ]}>
                                        {dia.split('/')[0]}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
  };

  // 3. Modal de Horários (Com bloqueio de horário passado)
  const TimeModal = ({ visible, onClose }) => (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { height: 'auto', paddingBottom: 30 }]}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Horários Disponíveis</Text>
                    <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity>
                </View>
                
                {!medicoId || !data ? (
                    <View style={{padding: 20, alignItems: 'center'}}>
                        <Ionicons name="alert-circle-outline" size={40} color="#f0ad4e" />
                        <Text style={{textAlign: 'center', marginTop: 10, color: '#555'}}>Selecione Médico e Data primeiro.</Text>
                    </View>
                ) : (
                    <View style={styles.timeGrid}>
                        {HORARIOS_DISPONIVEIS.map((hora) => {
                            const indisponivel = isHorarioIndisponivel(hora);
                            const passado = isHorarioPassado(hora);
                            
                            // Define o texto de status
                            let statusText = null;
                            if (passado) statusText = "Encerrado";
                            else if (indisponivel) statusText = "Ocupado";

                            return (
                                <TouchableOpacity 
                                    key={hora}
                                    disabled={indisponivel} 
                                    style={[
                                        styles.timeBadge, 
                                        horario === hora && styles.timeBadgeSelected, 
                                        indisponivel && styles.timeBadgeBusy // Aplica estilo cinza/vermelho
                                    ]}
                                    onPress={() => { setHorario(hora); onClose(); }}
                                >
                                    <Text style={[
                                        styles.timeText, 
                                        horario === hora && {color: '#fff'},
                                        indisponivel && {color: '#999'} // Texto cinza se indisponível
                                    ]}>
                                        {hora}
                                    </Text>
                                    {statusText && <Text style={{fontSize: 8, color: passado ? '#999' : '#d32f2f'}}>{statusText}</Text>}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </View>
        </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={28} color="#fff" /></TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Consulta' : 'Agendar Consulta'}</Text>
        <View style={{width: 28}} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.content}>
            
            <Text style={styles.sectionTitle}>Envolvidos</Text>
            
            {/* Seleção de Paciente */}
            <Text style={styles.label}>Nome do paciente</Text>
            <TouchableOpacity style={styles.fakeInput} onPress={() => setModalPacienteVisible(true)}>
                <Text style={{ color: pacienteSelecionado ? '#333' : '#aaa' }}>
                    {pacienteSelecionado ? pacienteSelecionado.nome : "Selecione o paciente"}
                </Text>
                <Ionicons name="caret-down" size={20} color="#666" />
            </TouchableOpacity>

            {/* Seleção de Médico (Agora mostra Especialidade no input também) */}
            <Text style={styles.label}>Nome do médico</Text>
            <TouchableOpacity style={styles.fakeInput} onPress={() => { setModalMedicoVisible(true); setHorario(''); }}>
                <Text style={{ color: medicoSelecionado ? '#333' : '#aaa' }}>
                    {medicoSelecionado 
                        ? `${medicoSelecionado.nome} - ${medicoSelecionado.especialidade}` 
                        : "Selecione o médico"}
                </Text>
                <Ionicons name="caret-down" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Data e horário</Text>
            
            <Text style={styles.label}>Data da consulta</Text>
            <TouchableOpacity style={styles.fakeInput} onPress={() => setModalCalendarioVisible(true)}>
                <Text style={{ color: data ? '#333' : '#aaa' }}>{data || "Selecione a data"}</Text>
                <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.label}>Horário da consulta</Text>
            <TouchableOpacity style={styles.fakeInput} onPress={() => setModalHorarioVisible(true)}>
                <Text style={{ color: horario ? '#333' : '#aaa' }}>{horario || "Selecione o horário"}</Text>
                <Ionicons name="time-outline" size={20} color="#666" />
            </TouchableOpacity>

        </ScrollView>

        <View style={styles.footer}>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleConcluir}>
                <Text style={styles.btnPrimaryText}>{isEditing ? 'Salvar alteração' : 'Agendar consulta'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.goBack()}>
                <Text style={styles.btnSecondaryText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <SelectionModal visible={modalPacienteVisible} onClose={() => setModalPacienteVisible(false)} data={pacientes} onSelect={setPacienteId} title="Selecione o Paciente" isMedico={false} />
      {/* Passamos isMedico=true para ativar a exibição da especialidade na lista */}
      <SelectionModal visible={modalMedicoVisible} onClose={() => setModalMedicoVisible(false)} data={medicos} onSelect={setMedicoId} title="Selecione o Médico" isMedico={true} />
      <CalendarModal visible={modalCalendarioVisible} onClose={() => setModalCalendarioVisible(false)} onSelect={setData} />
      <TimeModal visible={modalHorarioVisible} onClose={() => setModalHorarioVisible(false)} />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#0B2A45', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0B2A45', marginTop: 15, marginBottom: 15, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 5 },
  label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: '600' },
  fakeInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff', position: 'absolute', bottom: 0, left: 0, right: 0 },
  btnPrimary: { backgroundColor: '#0B2A45', borderRadius: 8, padding: 15, alignItems: 'center', marginBottom: 10 },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  btnSecondary: { borderWidth: 1, borderColor: '#0B2A45', borderRadius: 8, padding: 15, alignItems: 'center' },
  btnSecondaryText: { color: '#0B2A45', fontWeight: 'bold', fontSize: 16 },
  
  // Estilos Modais
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%' },
  modalHeader: { padding: 15, borderBottomWidth: 1, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0B2A45' },
  modalItem: { padding: 15, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  modalItemText: { fontSize: 16, color: '#333' },
  
  // Estilos Calendário
  calendarNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#f9f9f9', marginHorizontal: 10, borderRadius: 8, marginTop: 10 },
  navBtn: { padding: 5 },
  monthTitle: { fontSize: 16, fontWeight: 'bold', color: '#0B2A45' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'center' },
  calendarDay: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', margin: 5, borderRadius: 20, backgroundColor: '#f0f0f0' },
  calendarDaySelected: { backgroundColor: '#0B2A45' },
  calendarDayDisabled: { backgroundColor: '#f5f5f5', opacity: 0.5 }, // Estilo para dia passado
  calendarDayText: { fontWeight: 'bold', color: '#333' },

  // Estilos Horários
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 20, justifyContent: 'center' },
  timeBadge: { paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f9f9f9', width: '30%', alignItems: 'center', justifyContent: 'center' },
  timeBadgeSelected: { backgroundColor: '#0B2A45', borderColor: '#0B2A45' },
  timeBadgeBusy: { backgroundColor: '#f5f5f5', borderColor: '#ccc' }, // Cinza para bloqueado
  timeText: { fontSize: 16, fontWeight: '600', color: '#333' },
});