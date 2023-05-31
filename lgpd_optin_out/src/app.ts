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

import { Historico} from "./models/Historico"

import { Regra } from "./models/Regra"

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

app.get('/listHistorico', listHistorico);
app.post('/addHistorico', addHistorico);
app.post('/atualizaHistorico', atualizaHistorico);
app.delete('/deleteHistorico', deleteHistorico);
app.get('/listHistoricoId', listHistoricoId);
app.get('/listHistoricoUsuario', listHistoricoUsuario);

app.get('/listRegra', listRegra);
app.post('/addRegra', addRegra);

app.get('/listUsuarioAceita', listUsuarioAceita)
app.get('/listAceita', listAceita)


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
    let regras = await service.listAllRegra();
    if(regras.length == 0){
        res.send("Deve haver uma regra para criar um usuário")
    } else {
        console.log("Usuário adicionado com sucesso!");    
        let novo_usuario = {
            'nome': req.body.nome,
            'senha': req.body.senha,
            'telefone': req.body.telefone
        }         
        await service.insertUsuario(novo_usuario);
        let novo_usuario_i = JSON.stringify(novo_usuario);
        res.setHeader('Content-Type', 'application/json');
        res.end(novo_usuario_i);   

        let regras = await service.listAllRegra();
        let cont = 0;
        regras.map((item, index) => {
            cont = item.id;
        })

        let usuarios = await service.listAllUsuarios();   
        let cont2 = 0;
        usuarios.map((item, index) => {
            cont2 = item.id;
        })

        let novo_historico = {
            'aceitaRegra': false, 
            'aceitaSms': false, 
            'usuario': cont2, 
            'regra': cont  
        }         
        await service.insertHistorico(novo_historico);           
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
        res.end("Usuário não existe!");
    } else {    
        await service.deleteUsuario(id_usuario); 
        console.log("Usuário deletado com sucesso!");
    }      
}




//Compra

async function listHistorico(req, res){ 
    console.log("Requisição de listagem recebida."); //Para debug somente.
    let historico = await service.listAllHistorico();  
    let historico_list = JSON.stringify(historico);
    res.setHeader('Content-Type', 'application/json');
    res.end(historico_list);     
}

async function addHistorico(req,res){
    console.log("Historico adicionado com sucesso!");     
    let id_usuario = req.body.usuarioId;
    let usuario = await service.listUsuarioPorId(id_usuario);  
    let id_regra = req.body.regraId;
    let regra = await service.listRegraPorId(id_regra);  
    if (usuario == null){
        res.send("Usuário não existe!");
    } 
    if (regra == null){
        res.send("Regra não existe!");
    } else {
        let novo_historico = {
            'aceitaRegra': req.body.aceitaRegra, 
            'aceitaSms': req.body.aceitaSms, 
            'usuario': req.body.usuarioId, 
            'regra': req.body.regraId  
        }         
        await service.insertHistorico(novo_historico);
        let novo_historico_i = JSON.stringify(novo_historico);
        res.setHeader('Content-Type', 'application/json');
        res.end(novo_historico_i);    
    }
}

async function atualizaHistorico(req,res){ 
    let id_usuario = req.body.usuarioId;
    let usuario = await service.listUsuarioPorId(id_usuario);  
    if (usuario == null){
        res.send("Usuário não existe!");
    } else {
        let regras = await service.listAllRegra();
        let cont = 0;
        regras.map((item, index) => {
            cont = item.id
        })  

        let ultAceitaRegra = false;
        let ultAceitaSms = false;

        let id_historico = req.body.usuarioId;
        let ultHistorico = await service.listHistoricoPorUsuario(id_historico);
        ultHistorico.map((item, index) => {
            ultAceitaRegra = item.aceitaRegra
            ultAceitaSms = item.aceitaSms
        })

        if(ultAceitaRegra == req.body.aceitaRegra && ultAceitaSms == req.body.aceitaSms){
            res.send("Essa alteração é equivalente a última");
        }
        else if(req.body.aceitaRegra == false && req.body.aceitaSms == true){
            res.send("Deve aceitar a regra para poder aceitar SMS");
        } else {
            let novo_historico = {
                'aceitaRegra': req.body.aceitaRegra, 
                'aceitaSms': req.body.aceitaSms, 
                'usuario': req.body.usuarioId, 
                'regra': cont
            } 
            console.log("Historico adicionado com sucesso!");    
            await service.insertHistorico(novo_historico);
            let novo_historico_i = JSON.stringify(novo_historico);
            res.setHeader('Content-Type', 'application/json');
            res.end(novo_historico_i);    
        }
    }
}

async function deleteHistorico(req, res){ 
    // console.log("Compra deletada com sucesso!"); //Para debug somente.
    let id_historico = req.body.id;

    let existe = await service.listHistoricoPorId(id_historico);

    if (existe == null){
        res.end("Historico não existe!");
    } else {    
        await service.deleteHistorico(id_historico); 
        console.log("Historico deletado com sucesso!");
    }      
}

async function listHistoricoId(req, res){ 
    console.log("Listagem concluida!"); //Para debug somente.
    let id_historico = req.body.id;
    let historico = await service.listHistoricoPorId(id_historico);
    let historico_list = JSON.stringify(historico);
    res.end(historico_list);
}

async function listHistoricoUsuario(req, res){ 
    console.log("Listagem concluida!"); //Para debug somente.
    let id_usuario = req.body.usuarioId;
    let historico = await service.listHistoricoPorUsuario(id_usuario);
    let historico_list = JSON.stringify(historico);
    res.end(historico_list);
}


async function listRegra(req, res){ 
    console.log("Requisição de listagem recebida."); 
    let regra = await service.listAllRegra();  
    let regra_list = JSON.stringify(regra);
    res.setHeader('Content-Type', 'application/json');
    res.end(regra_list);     
}

async function addRegra(req,res){
    console.log("Regra adicionada com sucesso!"); 
    let nova_regra = {
        'versao': req.body.versao,
        'termo1': req.body.termo1,
        'termo2': req.body.termo2,        
    }   
    await service.insertRegra(nova_regra);
    let nova_regra_i = JSON.stringify(nova_regra);
    res.setHeader('Content-Type', 'application/json');
    res.end(nova_regra_i); 
    
    let regras = await service.listAllRegra();
    let cont = 0;
    regras.map((item, index) => {
        cont = item.id;
    })

    let usuarios = await service.listAllUsuarios();
    if(usuarios.length != 0){

        usuarios.map(async (item, index) => {
            let novo_historico = {
                'aceitaRegra': false, 
                'aceitaSms': false, 
                'usuario': item.id, 
                'regra': cont  
            }         
            await service.insertHistorico(novo_historico);        
        }); 

    }
}

async function listUsuarioAceita(req, res){

    let a = false;

    let id_historico = req.body.usuarioId;
    let ultHistorico = await service.listHistoricoPorUsuario(id_historico);
    ultHistorico.map((item, index) => {
        a = item.aceitaSms
    })

    if (a != false){
        res.send("Pode enviar SMS");
    } else {
        res.send("Não pode enviar SMS");
    }

}


async function listAceita(req, res){

    // var ids = new Array(1, 4, 9); 

    // let usuarios = await service.listAllUsuarios();
    // usuarios.map(async (item, index) => {
    //     let id_historico = item.id;
    //     let ultHistorico = await service.listHistoricoPorUsuario(id_historico);
    //     let tamanho = ultHistorico.length;
    //     console.log(tamanho)
    //     ultHistorico.map((item, index) => {
    //         if(tamanho == index+1){
    //             ids.push(2); 
    //             console.log(ids)
    //         }
    //     })

    //     let tamanhoUsuario = usuarios.length; 
    // })
}

function listenHandler(){
    console.log(`Escutando na porta ${port}!`);
}