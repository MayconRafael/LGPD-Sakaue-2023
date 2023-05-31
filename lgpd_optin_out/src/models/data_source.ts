import "reflect-metadata"
import { DataSource } from "typeorm"
import { Historico} from "./Historico"
import { Usuario} from "./Usuario"
import { Regra } from "./Regra"


export const MariaDBDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3305,
    username: "root",
    password: "root",
    database: "opt_in_out",
    synchronize: true,
    logging: false,
    entities: [Usuario, Historico, Regra],
    migrations: [],
    subscribers: [],
})




