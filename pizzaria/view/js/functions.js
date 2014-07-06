$(document).ready(function() {
    var i = 0;
    $("form").validationEngine();




    $(".submenu a").click(function() {
        i = 0;
        $("#formulario").fadeIn(1000);
        var id = this.id;


        $("#formulario").load("view/corpo/" + id + ".php", function() {
            $(".numero").keypress(verificaNumero);
            $(".cpf").mask("999.999.999-99");
            $(".cpf").validacpf();
            $(".phone").mask("(99)9999-9999");
            $("input").addClass("validate[required]");
            $("form").validationEngine();
            $(".preco").maskMoney({decimal: ',', thousands: '.'});
            if (id === "novo_pedido") {
                $("#campo").change(function() {
                    $("#pesquisaCliente").val("");
                    switch ($(this).val()) {
                        case "Cpf":
                            $("#pesquisaCliente").mask("999.999.999-99");
                            break;
                        case "Rg":
                            $("#pesquisaCliente").mask("9999999999");
                            break;
                        case "nome":

                            $("#pesquisaCliente").unmask();
                            break;
                        default:

                            $("#pesquisaCliente").unmask();
                            break;
                    }
                });
            }
            if (id === "ger_receitas" || id === "ger_precos") {
                var sabor = $("#sabor option:selected").text();
                var tamanho = $("#tamanho option:selected").text();
                $("#nomeReceita").val(sabor + " " + tamanho);
                if (id === "ger_receita" || id === "ger_precos") {
                    if (id === "ger_receitas") {
                        $("select").change(function() {
                            sabor = $("#sabor option:selected").text();
                            tamanho = $("#tamanho option:selected").text();
                            $("#nomeReceita").val(sabor + " " + tamanho);

                            if (sabor.val() !== "" && tamanho.val() !== "") {

                                $(".colDireita").load("view/corpo/listaProdutos.php", {nome: $("#nomeReceita").val()}, function() {
                                    $("#quantProduto").keypress(verificaNumero);
                                    $("#quantProduto").addClass("validate[required]");
                                    $("#quantProduto").validationEngine();
                                });
                            }
                        });
                    } else {
                        $("select").change(function() {
                            sabor = $("#sabor option:selected").text();
                            tamanho = $("#tamanho option:selected").text();
                            $("#nomeReceita").val(sabor + " " + tamanho);
                        });
                        var table = $("#formulario input:hidden").val();
                        $(".colDireita").load("view/corpo/listaDados.php", {form: table});

                    }


                } else {

                    var table = $("#formulario input:hidden").val();
                    $(".colDireita").load("view/corpo/listaDados.php", {form: table});
                }
            } else {
                $("input").addClass("validate[required]");
                $("form").validationEngine();
                var table = $("#formulario input:hidden").val();
                $(".colDireita").load("view/corpo/listaDados.php", {form: table});
            }

        });
    });


    $(document).on("click", "#addTelefone", function() {
        if (i < 2) {
            $(".telefones").append("<label><input type='text' name='telefone[]' class='phone' /><span class='removerCampo'><img src='./view/img/remove.png' /></span><br /></label>");
            $(".phone").mask("(99)9999-9999");
            i++;

            if (i === 2)
                $("#addTelefone").hide();
        } else {
            return false;
        }
    });

    $(document).on("click", "#addIngrediente", function() {
        var url = ".?a=inserir",
                nome = $("#nomeReceita").val(),
                sabor = $("#sabor").val(),
                tamanho = $("#tamanho").val(),
                produto = $("#produto").val(),
                quant = $("#quantProduto").val(),
                medida = $("#medida").val(),
                form = "Receita";
        //alert(medida);
        $.post(url, {
            nome: nome,
            sabor: sabor,
            tamanho: tamanho,
            produto: produto,
            quant: quant,
            medida: medida,
            form: form},
        function() {
            $(".colDireita").load("view/corpo/listaProdutos.php", {nome: nome});
        });




    });

    $(document).on("click", ".removeProduto", function() {
        var id = $(".removeProduto").index(this);
        $(".removeProduto").eq(id).parents("tr").remove();

    });

    $(document).on("click", ".removerPedido", function() {
        var id = $(".removerPedido").index(this);
        $(".removerPedido").eq(id).parents("tr").remove();

    });


    $(document).on("click", ".removerCampo", function() {
        if (i === 2)
            $("#addTelefone").show();
        var id = $(".removerCampo").index(this);
        $(".removerCampo").eq(id).parent().remove();
        i--;
    });

    $(document).on("click", "#addTipoProduto", function() {
        var campo = "Nova classifica&ccedil;&atilde;o: <br /><input type='text' name='novoTipoProduto' />";
        campo += "<button class='novoTipoProduto'>Inserir</button>";
        $("#formTipoProduto").html(campo);
        $("input[name='novoTipoProduto']").addClass("validate[required]");
        $(".novoTipoProduto").click(function() {
            var url = ".?a=inserir";
            var valor = $("#formulario input[name='novoTipoProduto']").val();
            //var form = $("#formulario #formTipoSabor input:hidden").val();
            alert(valor);
            $.post(url, {nome: valor, form: "TipoProduto"}, function() {
                $("#formTipoProduto").load("view/corpo/ger_produtos.php #formTipoProduto");
            });
        });
    });

    $(document).on("submit", "#formulario form", function(e) {
        e.preventDefault();

        var table = $("#formulario input:hidden[name='form']").val();
        var $form = $(this),
                url = $form.attr("action");

        //var txt = $form.serialize();
        //alert(txt);
        $.post(url, $form.serialize(), function(data) {
            //alert(data);
            $(".colDireita").empty().load("view/corpo/listaDados.php", {form: table});
            var botao = $("#formulario input:submit").val();
            if (botao === "Cadastrar") {
                $("#msg").attr("class", "msgconfirm");
                $("#formulario #msg").html("Cadastro efetuado com sucesso");
            } else {
                $("#msg").attr("class", "msgconfirm");
                $("#formulario #msg").html("Atualiza&ccedil;&atilde;o efetuada com sucesso");
                $("#formulario input:submit").val("Cadastrar");
                $("#formulario form").attr('action', '.?a=inserir');
            }

            $("#formulario input:text").val("");
            $("#formulario select option:selected").removeAttr("selected");
            $("#formulario input:first").focus();


        });
    });

    $(document).on("click", ".editar", function() {
        var table = $("#formulario input:hidden[name='form']").val();
        var el = this.id.substr(1);
        var campoId = $("#formulario input:hidden[name='id']");
        if (campoId.length) {
            campoId.remove();
        }
        //var campos = $("#formulario input:text");
        //alert(el);
        $.post("view/corpo/carregaDados.php", {form: table, cod: el}, function(data) {
            //alert(data);
            var valores = data.split('/');
            $(".removerCampo").click();
            var index = 0;
            var v = 0;
            var a = 0;
            $("#formulario form").attr('action', '.?a=editar');
            $("#formulario form input:text,select, input:password,textarea").each(function() {
                //alert(valores[index]);
                var campos = $(this).attr('name');
                var tipoCampo = this.tagName;
                //alert(tipoCampo);
                if (tipoCampo === "SELECT") {
                    $("#formulario select[name='" + campos + "'] option[value='" + valores[index] + "']").attr('selected', 'selected');
                }
                if (campos === "telefone[]" && v === 0) {

                    for (a = 0; a < valores[index] - 1; a++) {
                        $("#addTelefone").click();
                    }
                    index++;
                    $("#formulario input:text[name='" + campos + "']").each(function() {
                        $(this).val(valores[index].replace("(", "").replace(")", "").replace("-", ""));
                        index++;
                    });
                    $(".phone").mask("(99)9999-9999");
                } else {
                    if (campos === "preco") {
                        var valor = valores[index].replace(".", ",");
                        $("#formulario input:text[name='" + campos + "']").val(valor);
                    } else {
                        $("#formulario input:text[name='" + campos + "']").val(valores[index]);
                    }
                    index++;
                }



            });
        });
        $("#formulario form").prepend("<input type='hidden' name='id' value='" + el + "' />");
        $("#formulario input:submit").val("Atualizar");
    });
    $(document).on("click", ".remover", function() {
        var conf = confirm('Tem certeza que deseja remover este item?');
        if (conf == true) {
            var table = $("#formulario input:hidden[name='form']").val();
            var el = this.id.substr(1);
            var url = ".?a=remover";
            //alert(table);
            $.post(url, {form: table, id: el}, function() {
                if (table == "Receita") {
                    $(".colDireita").load("view/corpo/listaProdutos.php", {nome: $("#nomeReceita").val()});
                } else {
                    $(".colDireita").load("view/corpo/listaDados.php", {form: table});
                }
                $("#msg").attr("class", "msgconfirm");
                $("#msg").html("Item removido com sucesso.");
            });
        } else {
            return false;
        }
    });



    function verificaNumero(e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    }



    $(document).on("click", "#pesquisar", function() {
        var campoPesquisa = $("#campo").val(),
                dadoPesquisa = $("#pesquisaCliente").val();
        if (dadoPesquisa === "") {
            $(".msgerro").html("Preencha o campo de pesquisa");
        } else {
            $(".msgerro").html("");
            $("#listaPedidos").load("view/corpo/listaPedidos.php");
            $("#listaClientes").load("view/corpo/listaClientes.php", {
                campo: campoPesquisa,
                dado: dadoPesquisa
            }, function() {
                var idCl, td, nome;
                $(".cliente").click(function() {

                    $(".dados tr").removeAttr("style");
                    $(this).css("background-color", "#FFA500");
                    idCl = this.id.substr(2);
                    td = $(this).find("td:first");
                    nome = $(td).text();
                    $("#novoPedido").click(function() {

                        $(".colEsquerda").load("view/corpo/form_pedido.php",
                                {id: idCl, nome: nome},
                        function() {
                            var id_quant = $("#tamanhos").val().split("_");
                            var nomeTamanho = $("#tamanhos option:selected").text();
                            var arraySabores = new Array();
                            //alert(nomeTamanho);
                            $("#sabores").load("view/corpo/listaSabores.php", {id: id_quant[0], quant: id_quant[1]}, function() {
                                var sabores = $("#sabores select[name='sabor[]']");
                                sabores.each(function() {
                                    var txt = $(this).find("option:selected").val();
                                    //alert(txt);
                                    arraySabores.push(txt);
                                });
                                $("#precoPizza").load("view/corpo/precoPizza.php", {nomeTamanho: nomeTamanho, idSabor: arraySabores}, function(data) {
                                    $("#precoFinal").maskMoney({decimal: ',', thousands: '.'});
                                });
                                $(sabores).change(function() {
                                    arraySabores = new Array();
                                    //sabores = $("#sabores select[name='sabor[]']");
                                    sabores.each(function() {
                                        var txt = $(this).find("option:selected").val();
                                        //alert(txt);
                                        arraySabores.push(txt);
                                    });
                                    $("#precoPizza").load("view/corpo/precoPizza.php", {nomeTamanho: nomeTamanho, idSabor: arraySabores}, function(data) {
                                        $("#precoFinal").maskMoney({decimal: ',', thousands: '.'});
                                    });
                                });
                            });
                            $("#tamanhos").change(function() {
                                var id_quant = $("#tamanhos").val().split("_");
                                var nomeTamanho = $("#tamanhos option:selected").text();
                                var arraySabores = new Array();
                                //alert(nomeTamanho);
                                $("#sabores").load("view/corpo/listaSabores.php", {id: id_quant[0], quant: id_quant[1]}, function() {
                                    var sabores = $("#sabores select[name='sabor[]']");
                                    sabores.each(function() {
                                        var txt = $(this).find("option:selected").val();
                                        //alert(txt);
                                        arraySabores.push(txt);
                                    });
                                    $("#precoPizza").load("view/corpo/precoPizza.php", {nomeTamanho: nomeTamanho, idSabor: arraySabores}, function(data) {
                                        $("#precoFinal").maskMoney({decimal: ',', thousands: '.'});
                                    });
                                    $(sabores).change(function() {
                                        arraySabores = new Array();
                                        //sabores = $("#sabores select[name='sabor[]']");
                                        sabores.each(function() {
                                            var txt = $(this).find("option:selected").val();
                                            //alert(txt);
                                            arraySabores.push(txt);
                                        });
                                        $("#precoPizza").load("view/corpo/precoPizza.php", {nomeTamanho: nomeTamanho, idSabor: arraySabores}, function() {
                                            $("#precoFinal").maskMoney({decimal: ',', thousands: '.'});
                                        });
                                    });
                                });
                            });
                            var tipo = $("#tipoProdutos").val();
                            $("#carregaProdutos").load("view/corpo/listaProdutosPorTipo.php", {tipo: tipo}, function() {
                                var preco_id = $("#produto").val().split("_");
                                $("#precoProduto").html("Pre&ccedil;o (R$): <input type='text' id='precoFinalProduto' value='" + preco_id[0].replace(".", ",") + "' />");
                                $("#produto").change(function() {
                                    var preco_id = $("#produto").val().split("_");
                                    $("#precoProduto").html("Pre&ccedil;o (R$): <input type='text' id='precoFinalProduto' value='" + preco_id[0].replace(".", ",") + "' />");
                                });
                            });
                            $("#tipoProdutos").change(function() {
                                var tipo = $("#tipoProdutos").val();
                                $("#carregaProdutos").load("view/corpo/listaProdutosPorTipo.php", {tipo: tipo}, function() {
                                    var preco_id = $("#produto").val().split("_");
                                    $("#precoProduto").html("Pre&ccedil;o (R$): <input type='text' id='precoFinalProduto' value='" + preco_id[0].replace(".", ",") + "' />");
                                    $("#produto").change(function() {
                                        var preco_id = $("#produto").val().split("_");
                                        $("#precoProduto").html("Pre&ccedil;o (R$): <input type='text' id='precoFinalProduto' value='" + preco_id[0].replace(".", ",") + "' />");
                                    });
                                });
                            });
                            $("#listaPedido").load("view/corpo/listaPedido.php", function() {
                                $("#campoTelentrega").on("click", function() {
                                    if (this.checked === true) {
                                        $("#motoboy").css("color", "#000");
                                        $("#motoboy input").removeAttr("disabled");
                                    } else {
                                        $("#motoboy").css("color", "#999999");
                                        $("#motoboy input").attr("disabled", true);
                                    }
                                });
                                $("#finalPedido").click(function(){
                                    var countLinhas = $("#lista table tr").length;
                                    if(countLinhas === 1){
                                        $("#erroPedido").show();
                                    }else{
                                        var idCliente = $(".clientePedido").attr("id");
                                        
                                        alert(idCliente);
                                    }
                                });

                            });
                            $("#addPizza").click(function() {
                                var
                                    tipoSabor = $("#nomeTipoSabor").val(),
                                    preco = $("#precoFinal").val(),
                                    novaLinha = "<tr><td>Pizza  " + tipoSabor + "</td>";
                                    novaLinha += "<td>" + preco + "</td>";
                                    novaLinha += "<td><span class='removerPedido'><img src='./view/img/remove.png' /></span></td></tr>";

                                $("#listaPedido table").append(novaLinha);
                                var precoCampo = parseFloat(preco.replace(",","."));
                                var somaPreco = parseFloat($("#valorTotalPedido").text().replace(",","."));
                                var precoFinal = precoCampo + somaPreco;
                                $("#valorTotalPedido").html(precoFinal.toFixed(2).replace(".",","));
                            });
                            $("#addProduto").click(function() {
                                var
                                produto = $("#produto option:selected").text(),
                                preco = $("#precoFinalProduto").val(),
                                novaLinha = "<tr><td>" + produto + "</td>";
                                novaLinha += "<td>" + preco + "</td>";
                                novaLinha += "<td><span class='removerPedido'><img src='./view/img/remove.png' /></span></td></tr>";
                                $("#listaPedido table").append(novaLinha);
                                var precoCampo = parseFloat(preco.replace(",","."));
                                var somaPreco = parseFloat($("#valorTotalPedido").text().replace(",","."));
                                var precoFinal = precoCampo + somaPreco;
                                $("#valorTotalPedido").html(precoFinal.toFixed(2).replace(".",","));
                            });
                        });



                    });

                });

            });
        }
        ;
    });
});







