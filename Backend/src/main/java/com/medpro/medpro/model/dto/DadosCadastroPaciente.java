package com.medpro.medpro.model.dto;

import org.hibernate.validator.constraints.br.CPF;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosCadastroPaciente(
                @NotBlank String nome,
                @NotBlank @Email String email,
                @NotBlank String telefone,
                @NotBlank @CPF String cpf,
                @NotBlank @Valid DadosEndereco endereco) {

}