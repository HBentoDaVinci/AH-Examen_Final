import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import CardPlan from "../components/CardPlan";

import { Container, Row, Col } from "react-bootstrap"

function PlanView(){
    const host = import.meta.env.VITE_API_URL;
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const {id} = useParams();
    const [plan, setPlan] = useState({
        nombre: "", 
        rangoEtario: {
            min: 0,
            max: 0
        },
        cobertura: "",
        grupoFamiliar: [],
        prepaga:"",
        tarifa: ""
    });

    async function getPlanById(){
        try {
            const response = await fetch(`${host}/planes/${id}`);
            if (!response.ok) {
                alert("Error al solicitar los planes");
                return
            }
            const {data} = await response.json();
            setPlan(data);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    useEffect(() => {
        getPlanById()
    }, [])

    return(
        <>
            <Container className='py-5'>
                <Row className="mb-5">
                    <Col lg="8" className='mx-auto'>
                        <div>
                            <h3 className="h4">Plan <small className="fw-normal">#{id}</small></h3>
                        </div>
                        <CardPlan 
                            id={plan._id}
                            nombre={plan.nombre} 
                            rangoEtario={plan.rangoEtario} 
                            cobertura={plan.cobertura} 
                            grupoFamiliar={plan.grupoFamiliar}
                            prepaga={plan.prepaga}
                            tarifa={plan.tarifa}
                        />

                        <Card className="mb-4">
                            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                            <Card.Body>
                                <div className="d-flex mb-2 justify-content-between align-items-center">
                                    <Card.Title className="pe-2 mb-0">{plan.nombre}</Card.Title>
                                    {plan.prepaga.logo &&
                                        <img src={`${baseUrl}/${plan.prepaga?.logo}`} width="auto" height={32} alt={plan.prepaga?.nombre}/>
                                    }
                                </div>
                                <ul className="list-unstyled">
                                    <li><small className="text-secondary">Prepaga: </small><span className="h6">{plan.prepaga?.nombre}</span></li>
                                    <li><small className="text-secondary">Edad:</small> {plan.rangoEtario.min} a {plan.rangoEtario.max} años.</li>
                                    <li><small className="text-secondary">Grupo Familiar:</small> {plan.grupoFamiliar.join(', ')}</li>
                                </ul>
                                {plan.cobertura &&
                                    <p><strong>Cobertura: </strong><br/>{plan.cobertura}</p>
                                }
                                <p className="h6 fw-normal"><strong>Tarifa:</strong> $ {plan.tarifa}</p>
                            </Card.Body>
                            <Card.Footer>
                                <div className="d-flex">
                                    <Button variant="primary" disabled size="sm">Consultar</Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default PlanView