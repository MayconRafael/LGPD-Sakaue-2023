/*
Exemplo simples de um serviço web para inserção e listagem de dados em um
SGBD relacional, utilizando typeORM.
Autor: Fabrício G. M. de Carvalho, Ph.D
*/

/* importando o express */
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

/* Em uma mesma máquina, aplicações web diferentes devem ser executadas
em portas diferentes.*/
const port = 5000;

/* importando o modelo */
import { Usuario} from "./models/Usuario"

import { Compra} from "./models/Compra"

import { Link } from "./models/Link"

/* importanto o data source inicializado */
import {Service} from "./models/services"



/* Configuração para leitura de parâmetros em requisição do tipo post em form */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ type: '*/*' }));
/* Habilitação de requisições partindo de outras aplicações */
app.use(cors({
    oringin: '*',
    credentials: true
})); 

/* Inicializando a fonte de dados via serviço: */
var service = new Service();
service.start();

/* Criação das rotas para o serviço. */
app.get('/listUsuario', listUsuario);
app.post('/addUsuario', addUsuario);
app.get('/listUsuarioId', listUsuarioId);
app.delete('/deleteUsuario', deleteUsuario);

app.get('/listCompra', listCompra);
app.post('/addCompra', addCompra);
app.delete('/deleteCompra', deleteCompra);
app.get('/listCompraId', listComprasId);
app.get('/listComprasUsuario', listComprasUsuario);

app.get('/listLink', listLink);
app.post('/addLink', addLink);

app.get('/listExcluido', listExcluido)
app.get('/removeBackup', removeBackup)


/* Execução do servidor */
app.listen(port, listenHandler);

//Usuário

async function listUsuario(req, res){ 
    console.log("Requisição de listagem recebida."); 
    let usuarios = await service.listAllUsuarios();  
    let usr_list = JSON.stringify(usuarios);
    res.setHeader('Content-Type', 'application/json');
    res.end(usr_list);     
}

async function addUsuario(req,res){
    console.log("Usuário adicionado com sucesso!");     
    let id_link = req.body.linkId;
    let link = await service.listLinkPorId(id_link);  
    if (link == null){
        res.send("Link não existe!");
    } else {
        let novo_usuario = {
            'nome': req.body.nome,
            'link': link.id
        }         
        await service.insertUsuario(novo_usuario);
        let novo_usuario_i = JSON.stringify(novo_usuario);
        res.setHeader('Content-Type', 'application/json');
        res.end(novo_usuario_i);    
    }  
}

async function listUsuarioId(req, res){ 
    let id_usuario = req.body.id;
    let usuario = await service.listUsuarioPorId(id_usuario);  
    let usr_list = JSON.stringify(usuario);
    res.setHeader('Content-Type', 'application/json');     
    if(usuario == null){
        console.log("Usuário não existe");
        res.send("Usuário não existe"); 
    } else{
        console.log("Listagem concluida."); 
        res.end(usr_list);   
    }    
}

async function deleteUsuario(req, res){ 
    // console.log("Compra deletada com sucesso!"); //Para debug somente.
    let id_usuario = req.body.id;

    let existe = await service.listUsuarioPorId(id_usuario);

    if (existe == null){
        res.send("Usuário não existe!");
    } else {    
        await service.deleteUsuario(id_usuario); 
        let novo_excluido = {
            "idExcluido": id_usuario
        }
        await service.insertExcluido(novo_excluido);
        res.send("Usuário deletado com sucesso!");
    }      
}




//Compra

async function listCompra(req, res){ 
    console.log("Requisição de listagem recebida."); //Para debug somente.
    let compras = await service.listAllCompras();  
    let compras_list = JSON.stringify(compras);
    res.setHeader('Content-Type', 'application/json');
    res.end(compras_list);     
}

async function addCompra(req,res){
    console.log("Compra adicionada com sucesso!");     
    let id_usuario = req.body.usuarioId;
    let usuario = await service.listUsuarioPorId(id_usuario);  
    if (usuario == null){
        res.send("Usuário não existe!");
    } else {
        let nova_compra = {
            'produto': req.body.produto,
            'valor': req.body.valor,
            'link': usuario.id,
        }         
        await service.insertCompra(nova_compra);
        let nova_compra_i = JSON.stringify(nova_compra);
        res.setHeader('Content-Type', 'application/json');
        res.end(nova_compra_i);    
    }
}

async function deleteCompra(req, res){ 
    // console.log("Compra deletada com sucesso!"); //Para debug somente.
    let id_compra = req.body.id;

    let existe = await service.listCompraPorId(id_compra);

    if (existe == null){
        res.end("Compra não existe!");
    } else {    
        await service.deleteCompra(id_compra); 
        console.log("Compra deletada com sucesso!");
    }      
}

async function listComprasId(req, res){ 
    console.log("Listagem concluida!"); //Para debug somente.
    let id_compra = req.body.id;
    let compra = await service.listCompraPorId(id_compra);
    let compra_list = JSON.stringify(compra);
    res.end(compra_list);
}

async function listComprasUsuario(req, res){ 
    console.log("Listagem concluida!"); //Para debug somente.
    let id_usuario = req.body.usuarioId;
    let compras = await service.listComprasPorUsuario(id_usuario);
    let compras_list = JSON.stringify(compras);
    res.end(compras_list);
}


async function listLink(req, res){ 
    console.log("Requisição de listagem recebida."); 
    let link = await service.listAllLink();  
    let link_list = JSON.stringify(link);
    res.setHeader('Content-Type', 'application/json');
    res.end(link_list);     
}

async function addLink(req,res){
    console.log("Link adicionado com sucesso!"); 
    let novo_link = new Link();   
    await service.insertLink(novo_link);
    let novo_link_i = JSON.stringify(novo_link);
    res.setHeader('Content-Type', 'application/json');
    res.end(novo_link_i);     
}

async function listExcluido(req, res){
    console.log("Requisição de listagem recebida."); 
    let excluido = await service.listAllExcluidos();  
    let excluido_list = JSON.stringify(excluido);
    res.setHeader('Content-Type', 'application/json');
    res.end(excluido_list);     
}

async function removeBackup(req, res){
    console.log("Requisição de listagem recebida."); 
    let excluido = await service.listAllExcluidos();
    let excluir = [];
    excluido.map((item, index) => {
        excluir.push(item.idExcluido)             
    })  
    console.log("Listagem concluída")
    res.send("DELETE FROM usuario WHERE id IN ("+excluir+");");  
}


function listenHandler(){
    console.log(`Escutando na porta ${port}!`);
}