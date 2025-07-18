import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { getPlanById } from "../services/planService";

function PlanView(){
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
    const navigate = useNavigate();

    function handleVolver() {
       navigate(-1);
    }

    useEffect(() => {
        async function getCurrentPlan() {
            try {
                const data = await getPlanById(id);
                setPlan(data);
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        }

        getCurrentPlan();
    }, [id])

    return(
        <>
            <Container className='py-5'>
                <Row className="mb-5">
                    <Col lg="8" className='mx-auto'>
                        <div className="d-flex justify-content-between mb-3">
                            <h3 className="h4">Plan <small className="fw-normal">#{id}</small></h3>
                            <Button variant="primary" size="sm" onClick={handleVolver}> {'<'} Volver</Button>
                        </div>

                        <Card className="mb-4">
                            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                            <Card.Header className="bg-white">
                                <div className="d-flex justify-content-between align-items-center py-3">
                                    <h4 className="pe-2 mb-0">{plan.nombre}</h4>
                                    {plan.prepaga.logo &&
                                        <div style={{maxWidth: '130px', height: "auto"}}>
                                            <img src={plan.prepaga?.logo} width="100%" style={{ maxHeight: "32px"}} alt={plan.prepaga?.nombre}/>
                                        </div>
                                    }
                                </div>
                            </Card.Header>
                            <Card.Body>
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
                                    <Button variant="success" disabled size="sm">Consultar</Button>
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