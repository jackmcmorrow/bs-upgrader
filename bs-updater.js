//Bootstrap 2.X to 3.0
//A Node.js script for PHP projects.
//by cav_dan

var fs  = require('fs');
//var _ = require('./underscore.js');
var bs  = 'bootstrap-3.0.min.css';
var log = 'bootstrap3-upgradelog.txt'
var fileTypes = '.phtml' //Filetypes to be searched for bootstrap 2.3 classes.
var erros = new Array();

//Criar arquivo de log
fs.writeFileSync(log, '');

//Função pra escrever no log e no console ao mesmo tempo
var msg = function(s, e) {
	console.log(s);
	fs.appendFileSync('bootstrap3upgradelog.txt', s + '\n');
	if (e === true) erros.push(s);
}

//função para alterar uma das classes


//carrega a hash que vai ser usada para alterar os arquivos
var novasClasses = {
	'container-fluid' 					: 'container',
	'row-fluid' 						: 'row',
	'span' 								: 'col-md-',
	'offset' 							: 'col-md-offset-',
	'brand'				 				: 'navbar-brand',
	'nav-collapse' 						: 'navbar-collapse',
	'nav-toggle' 						: 'navbar-toggle',
	'btn-navbar' 						: 'navbar-btn',
	'hero-unit' 						: 'jumbotron',
	'icon-' 							: 'glyphicon glyphicon-',
	'btn' 								: 'btn btn-default',
	'btn btn-default btn-primary'		: 'btn btn-primary',
	'btn-mini' 							: 'btn-xs',
	'btn-small' 						: 'btn-sm',
	'btn-large' 						: 'btn-lg',
	'visible-phone' 					: 'visible-sm',
	'visible-tablet' 					: 'visible-md',
	'visible-desktop' 					: 'visible-lg',
	'hidden-phone' 						: 'hidden-sm',
	'hidden-tablet' 					: 'hidden-md',
	'hidden-desktop' 					: 'hidden-lg',
	'input-small' 						: 'input-sm',
	'input-large' 						: 'input-lg',
	'checkbox inline' 					: 'checkbox-inline',
	'radio inline' 						: 'radio-inline',
	'input-prepend' 					: 'input-group',
	'input-append' 						: 'input-group',
	'add-on' 							: 'input-group-addon',
	'thumbnail' 						: 'img-thumbnail',
	'control-group' 					: 'form-group'
}

//percorre e identifica as pastas dentro de modules, printa tudo com as mudanças, salva um log.
msg('::::Iniciando processo de atualização do Bootstrap:::::')
var listarArquivos = function (currentPath) {
	
	msg('\n' + '-|' + currentPath + '/\n |');

	
	var arqs = fs.readdirSync(currentPath);
	for (var i in arqs) {
		var arq = currentPath + '/' + arqs[i];
		var stats = fs.statSync(arq); //pra verificar se isso é um arquivo ou não

		if (stats.isFile() ) {
			var extensao = [].concat( arq.match(/\..*/) );
			//class=".+?\" <--- REGEX pra pegar as classes.
			if (extensao[0] === '.phtml') { //Buscar apenas nos PHTML
				msg(' |\t- ' + arqs[i].toString())
				var arqCont = fs.readFileSync(arq);	//class=".+?\"
				var buscarClasses = /class=".+?"/g;
				var arqClasses = [].concat(arqCont.toString('utf8').match(buscarClasses) ); //[\w:\-]?class[\s]*?=[\s]*?("[^"]+"|'[^']+'|\w+)
				
				//Se tiver algum elemento com classe definida
				if (arqClasses[0] != null) {
					var escrever = true;
					
					//Passa por todos os eles
					for (j = 0; j < arqClasses.length; j++) {
					//Verifica se tem que ter alguma mudança nessas classes
						for (var classeAntiga in novasClasses) {
							//console.log(classeAntiga)
							var selecionar = new RegExp('('+classeAntiga+')');
							var impedir = new RegExp('('+novasClasses[classeAntiga]+'(?!-))'); //sem traço no final
							
							//console.log(impedir);
							//se já tiver a classe nova correspondente, não modifica
							if (arqClasses[j].match(impedir) ) {
								msg(' |\t-\t' + arqClasses[j] + '\n |\t|\t -->  elemento já foi alterado ::::');
								var arqCont = arqCont.toString('utf8');
							} 
							//Do contrário, escreve o novo conjunto de classes, substituindo a antiga pela nova
							else if ( arqClasses[j].match(selecionar) != null ) {
								var novaClasse = arqClasses[j].replace(selecionar, novasClasses[classeAntiga]);
								var classeAtual = new RegExp('('+arqClasses[j]+')');
								var arqCont = arqCont.toString('utf8').replace(classeAtual, novaClasse);

								//E modifica a string da classe sendo modificada, pra não passar por cima no próximo loop;
								arqClasses[j] = novaClasse;

								msg( ' |\t|\t' + arqClasses[j] + '\n |\t|\t|-> ' + classeAntiga + ' >> ' + novasClasses[classeAntiga]);
								
							}

						}
					}

					if (escrever === true) {
						//Faz a alteração no conteúdo.
						fs.writeFileSync(arq, arqCont);
					}
				}
				

				//Reescreve o arquivo
			}
		}
		else if (stats.isDirectory() ) {
			listarArquivos(arq);
		}
	}

	
}


listarArquivos('.');
//
//S:/!malkmus/site/application/views/scripts/empresa
//'S:/!malkmus/site/application/views/scripts/contato'

//ESCREVER TODOS OS ERROS NO LOG
fs.appendFileSync(log, erros.toString('utf8', '\n'));



//começa por application/views/scripts, depois vai para helpers

//faz um prompt antes de entrar em cada módulo, alterando apenas .phtml