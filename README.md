GUIA DE EXECUÇÃO – PROJETO MEDPRO
Disciplina: [Nome da sua Disciplina] Data: [Data de Hoje]

1. IDENTIFICAÇÃO DOS INTEGRANTES
Nome Completo:
Larissa Vieira Marinho
Matheus Henrique dos Reis
Sophia Vendramini Piovezan

2. PRÉ-REQUISITOS
Para a execução correta do sistema, certifique-se de que o ambiente possui as seguintes ferramentas instaladas:
- Java JDK 17 (ou superior)
- Maven (Gerenciador de dependências Java)
- MySQL Server (Banco de dados)
- Node.js (Ambiente JavaScript)
- Expo Go (Instalado no celular físico para testes mobile)

3. INSTRUÇÕES DE EXECUÇÃO DO APP WEB (BACKEND/API)
O Backend foi desenvolvido em Java com Spring Boot. Siga os passos abaixo para configurar e iniciar o servidor.

Passo 3.1: Configuração do Banco de Dados
- Abra o seu gerenciador de banco de dados (MySQL Workbench, DBeaver ou Terminal).
- Crie um banco de dados vazio com o nome exato: medpro_api.
- Comando SQL: CREATE DATABASE medpro_api;
- Não é necessário criar tabelas manualmente. A aplicação utiliza o Flyway, que criará as tabelas automaticamente na primeira execução.

Passo 3.2: Configuração de Credenciais
- Navegue até a pasta do projeto Backend: src/main/resources.
- Abra o arquivo application.properties.
- Verifique se o usuário e senha do MySQL correspondem aos da sua máquina:

Properties
spring.datasource.url=jdbc:mysql://localhost:3306/medpro_api
spring.datasource.username=seu_usuario_aqui  <-- ALTERE SE NECESSÁRIO
spring.datasource.password=sua_senha_aqui    <-- ALTERE SE NECESSÁRIO

Passo 3.3: Iniciando a Aplicação
- Abra o terminal na raiz da pasta do projeto Backend (onde está o arquivo pom.xml).
- Execute o comando para baixar as dependências e rodar o projeto:
Comando: mvn spring-boot:run
- Aguarde até aparecer a mensagem no console: Started MedproApplication in ... seconds.
- O servidor estará rodando em: http://localhost:8080.

4. INSTRUÇÕES DE EXECUÇÃO DO APP MOBILE
O App Mobile foi desenvolvido com React Native e Expo.

Passo 4.1: Instalação de Dependências
- Abra um novo terminal e navegue até a pasta do projeto Frontend (Mobile).
- Execute o comando para instalar as bibliotecas necessárias:

Comando: npm install

Passo 4.2: Configuração de Rede (CRÍTICO)
Para que o celular consiga se comunicar com o Backend rodando no computador, é necessário configurar o endereço IP local.
- Descubra o endereço IP (IPv4) da máquina onde o Backend está rodando:
  
Windows: Digite ipconfig no terminal.
Mac/Linux: Digite ifconfig no terminal.

No código do projeto Mobile, abra o arquivo: src/screens/Consulta/Consulta.js.
Localize a constante API_URL e atualize com o seu IP:
JavaScript

// Exemplo: Se o seu IP for 192.168.15.10
const API_URL = 'http://192.168.15.10:8080/consultas';
(Repita este processo para outros arquivos que façam chamadas à API, como Medico.js ou Paciente.js, se houver).

Passo 4.3: Iniciando o Aplicativo
No terminal, dentro da pasta do Frontend, execute:
Comando: npx expo start
Um QR Code será exibido no terminal.

Passo 4.4: Acessando no Dispositivo
Celular Físico: Abra o app Expo Go (Android/iOS), escaneie o QR Code. Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi.
Emulador: Pressione a tecla a no terminal para abrir no Emulador Android.

5. SOLUÇÃO DE PROBLEMAS COMUNS
Erro de Conexão (Network Request Failed): Verifique se o Firewall do Windows não está bloqueando a porta 8080 ou se o IP configurado no Passo 4.2 mudou.
Banco de Dados: Se houver erro ao conectar no banco, verifique se o serviço do MySQL está ativo e rodando na porta 3306.
