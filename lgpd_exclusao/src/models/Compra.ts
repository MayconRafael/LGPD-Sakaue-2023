import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm"

import {Link} from "./Link";

@Entity()
export class Compra {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    produto: string

    @Column()
    valor: number

    @ManyToOne(() => Link, (link) => link.compras, {nullable: false})
    @JoinColumn()
    link: Link   
}