package com.example.aluguelcarros.model;

import java.math.BigDecimal;

import jakarta.persistence.Embeddable;

@Embeddable
public class Rendimento {

    private String entidadeEmpregadora;
    private BigDecimal valor;


    public String getEntidadeEmpregadora() {
        return entidadeEmpregadora;
    }
    public void setEntidadeEmpregadora(String entidadeEmpregadora) {
        this.entidadeEmpregadora = entidadeEmpregadora;
    }
    public BigDecimal getValor() {
        return valor;
    }
    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    
}