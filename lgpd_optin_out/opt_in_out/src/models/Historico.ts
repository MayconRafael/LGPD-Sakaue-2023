import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm"

import {Usuario} from "./Usuario";

@Entity()
export class Historico {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    aceitaSms: boolean

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @ManyToOne(() => Usuario, (usuario) => usuario.historicos, {nullable: false})
    @JoinColumn()
    usuario: Usuario   
}