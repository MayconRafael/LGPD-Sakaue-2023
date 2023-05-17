import { Entity, PrimaryGeneratedColumn, OneToMany} from "typeorm"

import {Compra} from "./Compra";


@Entity()
export class Link {

    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => Compra, (compra) => compra.link)
    compras: Compra[]
}