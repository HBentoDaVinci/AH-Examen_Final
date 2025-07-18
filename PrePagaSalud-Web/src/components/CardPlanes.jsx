import React, {Fragment} from "react";
import { Card, Button } from "react-bootstrap"

function CardPlanes({id, nombre, rangoEtario, cobertura, grupoFamiliar, prepaga, tarifa}){

    return (
        <>
            <Card className="mb-4 w-100">
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Header className="bg-white">
                    <div className="d-flex justify-content-between align-items-center py-3">
                        <h4 className="pe-2 mb-0">{nombre}</h4>
                        {prepaga.logo &&
                            <div style={{maxWidth: '130px', height: "auto"}}>
                                <img src={prepaga?.logo} width="100%" style={{ maxHeight: "32px"}} alt={prepaga?.nombre}/>
                            </div>
                        }
                    </div>
                </Card.Header>
                <Card.Body>
                    <ul className="list-unstyled">
                        <li><small className="text-secondary">Prepaga: </small><span className="h6">{prepaga?.nombre}</span></li>
                        <li><small className="text-secondary">Edad:</small> {rangoEtario.min} a {rangoEtario.max} años.</li>
                        <li><small className="text-secondary">Grupo Familiar:</small> {grupoFamiliar.join(', ')}</li>
                    </ul>
                    {cobertura &&
                        <p><strong>Cobertura: </strong><br/>{cobertura}</p>
                    }
                    <p className="h6">$ {tarifa}</p>
                </Card.Body>
                <Card.Footer>
                    {/*<Button variant="primary" disabled size="sm">Consultar</Button>*/}
                    <Button variant="primary" size="sm" href={`/planes/${id}`}>Ver</Button>
                </Card.Footer>
            </Card>
        </>
    )

}
export default CardPlanes