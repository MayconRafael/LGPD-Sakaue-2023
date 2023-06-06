import { Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class IDExcluido {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    idExcluido: string

}