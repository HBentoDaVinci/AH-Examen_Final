import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import CardPlan from "../components/CardPlan";

import { Container, Row, Col } from "react-bootstrap"

function PlanView(){
    const host = import.meta.env.VITE_API_URL;
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
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default PlanView