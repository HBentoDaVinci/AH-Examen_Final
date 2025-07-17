import React, {Fragment} from "react";
import { Card, Button } from "react-bootstrap"

function CardPlanes({nombre, rangoEtario, cobertura, grupoFamiliar, prepaga, tarifa}){
    const baseUrl = import.meta.env.VITE_BASE_URL;

    return (
        <>
            <Card className="mb-4 w-100">
                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                <Card.Body>
                    <div className="d-flex">
                        <Card.Title>{nombre}</Card.Title>
                        {prepaga.logo &&
                            <img src={`${baseUrl}/${prepaga?.logo}`} width={40} alt={prepaga?.nombre} className="img-fluid"/>
                        }
                    </div>
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
                    <Button variant="primary" disabled size="sm">Consultar</Button>
                </Card.Footer>
            </Card>
        </>
    )

}
export default CardPlanes