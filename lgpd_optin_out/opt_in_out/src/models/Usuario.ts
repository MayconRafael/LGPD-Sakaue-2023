import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm"

import {Historico} from "./Historico";

import {Regra} from "./Regra";


@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @Column()
    senha: string

    @Column()
    telefone: string

    @OneToMany(() => Historico, (historico) => historico.usuario)
    historicos: Historico[]

    @ManyToOne(() => Regra, (regra) => regra.usuarios, {nullable: false})
    @JoinColumn()
    regra: Regra   
}