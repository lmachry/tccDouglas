<?php

/**
 * Description of Pedido
 *
 * @author DouglasMachry
 */
class Pedido {
    private $id;
    private $idCliente;
    private $status;
    private $motivoCancelamento;
    private $motoboy;
    private $valorTotal;
    
    function __construct() {
        
    }

    public function getId() {
        return $this->id;
    }

    public function getIdCliente() {
        return $this->idCliente;
    }

    public function getStatus() {
        return $this->status;
    }

    public function getMotivoCancelamento() {
        return $this->motivoCancelamento;
    }

    public function getMotoboy() {
        return $this->motoboy;
    }

    public function getValorTotal() {
        return $this->valorTotal;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setIdCliente($idCliente) {
        $this->idCliente = $idCliente;
    }

    public function setStatus($status) {
        $this->status = $status;
    }

    public function setMotivoCancelamento($motivoCancelamento) {
        $this->motivoCancelamento = $motivoCancelamento;
    }

    public function setMotoboy($motoboy) {
        $this->motoboy = $motoboy;
    }

    public function setValorTotal($valorTotal) {
        $this->valorTotal = $valorTotal;
    }


}
