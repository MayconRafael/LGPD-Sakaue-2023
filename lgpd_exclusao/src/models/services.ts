import { MariaDBDataSource } from "./data_source";
import {Compra} from "./Compra";
import {Usuario} from "./Usuario";
import {Link} from "./Link";
import { Equal } from "typeorm";
import { IDExcluido } from "./IDExcluido";

const compraRepository = MariaDBDataSource.getRepository(Compra)
const usuarioRepository = MariaDBDataSource.getRepository(Usuario)
const linkRepository = MariaDBDataSource.getRepository(Link)
const idexcluidoRepository = MariaDBDataSource.getRepository(IDExcluido)


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


    //Services Compra
    async insertCompra(nova_compra){         
        await compraRepository.save(nova_compra);      
    }

    async listAllCompras(){
       let list = await compraRepository.find();
       return list;
    }     

    async deleteCompra(id_compra){
        const delecaoCompra = await compraRepository.findOneBy({
            id: Equal(id_compra),
        });
        await compraRepository.manager.remove(delecaoCompra);
    }

    async listCompraPorId(id_compra){ 
        let list = await compraRepository.findOneBy({
            id: Equal(id_compra),
        }) 
        return list;       
    }

    async listComprasPorUsuario(id_usuario){ 
        let list = await compraRepository.findBy({
            link: Equal(id_usuario),
        })
        return list;       
    }


    //Services Link
    async listAllLink(){
        let list = await linkRepository.find();
        return list;
    }   

    async insertLink(novo_link){
        await linkRepository.save(novo_link);          
    }

    async listLinkPorId(id_link){ 
        let list = await linkRepository.findOneBy({
            id: Equal(id_link),
        }) 
        return list;       
    }

    //Services IDExcluido
    async listAllExcluidos(){
        let list = await idexcluidoRepository.find();
        return list;
    } 
    
    async insertExcluido(novo_excluido){
        await idexcluidoRepository.save(novo_excluido);          
    }
}

