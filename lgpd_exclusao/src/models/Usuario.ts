import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"

import {Link} from "./Link";


@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @OneToOne(() => Link, {nullable: false})
    @JoinColumn()
    link: Link
}