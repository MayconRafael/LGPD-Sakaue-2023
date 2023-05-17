import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"

import {Usuario} from "./Usuario";

@Entity()
export class Regra {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @Column()
    compartilhaDados: boolean

    @Column()
    notificacoes: boolean

    @OneToMany(() => Usuario, (usuario) => usuario.regra)
    usuarios: Usuario[]
}