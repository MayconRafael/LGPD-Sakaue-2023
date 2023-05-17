import { MariaDBDataSource } from "./data_source";
import {Historico} from "./Historico";
import {Usuario} from "./Usuario";
import {Regra} from "./Regra";
import { Equal } from "typeorm";

const historicoRepository = MariaDBDataSource.getRepository(Historico)
const usuarioRepository = MariaDBDataSource.getRepository(Usuario)
const regraRepository = MariaDBDataSource.getRepository(Regra)


export class Service{    
    start(){       
            MariaDBDataSource.initialize().then( ()=>{
                console.log("Inicializada a fonte de dados...");
            }).catch((err)=>{
                console.error("Erro de inicialização da fonte de dados!!");
            }) 
    }

    //Services Usuario
    async insertUsuario(novo_usuario){
        await usuarioRepository.save(novo_usuario);          
    }

    async listAllUsuarios(){
        let list = await usuarioRepository.find();
        return list;
    }

    async listUsuarioPorId(id_usuario){
        let list = await usuarioRepository.findOneBy({
            id: Equal(id_usuario),
        }) 
        return list;  
    }

    async deleteUsuario(id_usuario){
        const delecaoUsuario = await usuarioRepository.findOneBy({
            id: Equal(id_usuario),
        });
        await usuarioRepository.remove(delecaoUsuario);
    }


    //Services Historico
    async insertHistorico(novo_historico){         
        await historicoRepository.save(novo_historico);      
    }

    async listAllHistorico(){
       let list = await historicoRepository.find();
       return list;
    }     

    async deleteHistorico(id_historico){
        const delecaoCompra = await historicoRepository.findOneBy({
            id: Equal(id_historico),
        });
        await historicoRepository.manager.remove(delecaoCompra);
    }

    async listHistoricoPorId(id_historico){ 
        let list = await historicoRepository.findOneBy({
            id: Equal(id_historico),
        }) 
        return list;       
    }

    async listHistoricoPorUsuario(id_usuario){ 
        let list = await historicoRepository.findBy({
            usuario: Equal(id_usuario),
        })
        return list;       
    }


    //Services Regra
    async listAllRegra(){
        let list = await regraRepository.find();
        return list;
    }   

    async insertRegra(nova_regra){
        await regraRepository.save(nova_regra);          
    }

    async listRegraPorId(id_regra){ 
        let list = await regraRepository.findOneBy({
            id: Equal(id_regra),
        }) 
        return list;       
    }
}

