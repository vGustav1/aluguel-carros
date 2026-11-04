package com.example.aluguelcarros.model;

import jakarta.persistence.Entity;

@Entity
public abstract class Agente extends Usuario {

    @Override
    public String getPerfil() {
        return "AGENTE";
    }
}