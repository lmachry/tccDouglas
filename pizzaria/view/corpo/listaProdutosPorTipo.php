<?php
+extract($_POST);
include_once '../../ctrl/ProdutoDAO.php';
$produtos = new ProdutoDAO();
$produtos = $produtos->pesquisarElementoPorTipo($tipo);

echo "<select id='produto'>";
while($produto = mysql_fetch_array($produtos)){
    echo "<option value = ".$produto['preco']."_".$produto['id']."'>".
                $produto['nome'].
         "</option>";
}
echo "</select>";
?>