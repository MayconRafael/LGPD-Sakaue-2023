import "reflect-metadata"
import { DataSource } from "typeorm"
import { Compra} from "./Compra"
import { Usuario} from "./Usuario"
import { Link} from "./Link"
import { IDExcluido } from "./IDExcluido"


export const MariaDBDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "exclusao",
    synchronize: true,
    logging: false,
    entities: [Usuario, Compra, Link, IDExcluido],
    migrations: [],
    subscribers: [],
})




