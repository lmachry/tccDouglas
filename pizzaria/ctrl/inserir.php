<?php
/* REGRAS:
 * - ANTES DO BOT�O "ENVIAR", O FORMUL�RIO DEVE TER UM INPUT TYPE HIDDEN,
 *   COM O NOME DE "form" E O VALOR DEVE SER O MESMO NOME DO ARQUIVO OBJETO.
 * - OS M�TODOS GET E SET DEVEM ESTAR NA MESMA SEQU�NCIA DOS CAMPOS DO FORMUL�RIO
 * 
 * 
 *  */

//echo "<script>alert('teste');</script>";
// plugin para tratar os dados antes de inserir
require_once 'ctrl/antiInjection.php';
//Criando os arrays para guardar o nome dos campos, dos valores, dos m�todod Get e Set
$campos = array();
$valores = array();
$setClass = array();
$getClass = array();
$mCampos =  array();
$valArray = array();
//O �ndice ser� utilizado futuramente para percorrer as arrays criadas.
$indice = 0;
//Aqui n�s percorremos os dados passados via POST e colocamos o nome dos campos do formul�rio
//em um array, e os valores em outro array.
foreach ($_POST as $campo => $valor) {
    if(is_array($valor)){ //Se for array, faz um loop tratando os dados de cada posi��o
        foreach ($valor as $v){
            $valArray[] = antiInjection($v);
        }
        $campos[] = $campo;
        $valores[] = $valArray;
    }else{
        $campos[] = antiInjection($campo);
        $valores[] = antiInjection(utf8_decode($valor));
    }
}
// O �ltimo campo � um hidden com o nome da Classe que ser� instanciada para 
// adicionar os dados
$classe = end($valores);
//echo $classe;

// Incluindo a Classe e seu respectivo DAO
require_once './model/' . $classe . '.php';
require_once './ctrl/' . $classe . 'DAO.php';

// Instanciando a Classe rec�m inclu�da
$objeto = (object) new $classe();

// Recuperando dados sobre a Classe (atributos, m�todos, etc..)
$metodos = new ReflectionClass($classe);
// Aqui percorremos a classe em busca dos m�todos
foreach ($metodos->getMethods() as $metodo) {
    $nomeMetodo = $metodo->getName(); //passamos o nome do m�todo a uma vari�vel
    if (substr($nomeMetodo, 0, 3) == "get") // caso o m�todo inicie com "get",
        $getClass[] = $nomeMetodo;          // ser� adicionado � array $getClass[]
    if (substr($nomeMetodo, 0, 3) == "set") // caso o m�todo inicie com "set"
        $setClass[] = $nomeMetodo;          // ser� adicionado � array $setClass[]
    
}

array_pop($campos); //elimino a �ltima posi��o do array, pois � o nome do objeto a ser instanciado
array_pop($valores); //idem ao anterior
array_shift($setClass); // remove o primeiro m�todo Set (setId) 
array_shift($getClass); // remove o primeiro m�todo Get (getId)

//Loop no array $setClass, jogando os valores do formul�rio para o respectivo objeto
foreach ($setClass as $set){
    if(is_array($valores[$indice])){
        foreach($valores[$indice] as $val){
            $mCampos[] = $val;
        }
        $objeto->$set($mCampos);
        $mCampos = array();
    }
    $objeto->$set($valores[$indice]);
    $indice++;
}

$dao = $classe."DAO";
$dao = (object) new $dao();

$inserir = $dao->inserir($objeto);
return $inserir;
/*foreach ($getClass as $get){
    echo $objeto->$get($campos[$indice]);
}*/

?>