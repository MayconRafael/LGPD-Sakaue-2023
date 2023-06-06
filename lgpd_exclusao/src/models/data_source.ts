import "reflect-metadata"
import { DataSource } from "typeorm"
import { Compra} from "./Compra"
import { Usuario} from "./Usuario"
import { Link} from "./Link"


export const MariaDBDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3305,
    username: "root",
    password: "root",
    database: "exclusao2",
    synchronize: true,
    logging: false,
    entities: [Usuario, Compra, Link],
    migrations: [],
    subscribers: [],
})




