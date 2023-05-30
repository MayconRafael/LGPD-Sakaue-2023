import { Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm"

import { Historico } from "./Historico"

@Entity()
export class Regra {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    versao: string

    @Column()
    termo1: string

    @Column()
    termo2: string

    @OneToMany(() => Historico, (historico) => historico.regra)
    historicos: Historico[]
}