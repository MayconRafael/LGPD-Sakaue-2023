import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToOne} from "typeorm"

import {Usuario} from "./Usuario";

import { Regra } from "./Regra";

@Entity()
export class Historico {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    aceitaRegra: boolean

    @Column()
    aceitaSms: boolean

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @ManyToOne(() => Usuario, (usuario) => usuario.historicos, {nullable: false})
    @JoinColumn()
    usuario: Usuario   

    @ManyToOne(() => Regra, (regra) => regra.historicos, {nullable: false})
    @JoinColumn()
    regra: Regra   
}