<?php
$conn = new mysqli("localhost", "root", "", "db_atvpi");

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// lê a imagem do computador
$imgData = addslashes(file_get_contents("caminho/da/imagem.jpg"));

$sql = "INSERT INTO tb_produto 
        (Pro_CodigoFabricante, Pro_Nome, Pro_Descricao, Pro_Aplicacao, Pro_Preco, Pro_Estoque, Pro_LinkProduto, Pro_Imagem, Pro_CodigoOriginal, For_ID) 
        VALUES 
        (1234, 'Peça X', 'Descrição teste', 'Carro Y', 199.90, 10, 'http://site.com/produto', '$imgData', 'ABC123', 1)";

if ($conn->query($sql) === TRUE) {
    echo "Produto inserido com sucesso!";
} else {
    echo "Erro: " . $conn->error;
}

$conn->close();
?>
