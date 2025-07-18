import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ModalEliminarPlan from "../../components/ModalEliminarPlan";
import CardPlan from "../../components/CardPlan";
import { getPlanById, deletePlan as deletePlanService } from "../../services/planService";

function VerPlan(){
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

    // Modal eliminar
    const [showEliminar, setShowEliminar] = useState(false);
    const [planActivo, setPlanActivo] = useState({_id: "", nombre: ""});
    const [showAlert, setShowAlert] = useState(false);

    const handleCloseModal = () => {
        setShowEliminar(false);
        setPlanActivo(null);
    }
    const handleShowModal = (planEliminar) => {
        setPlanActivo({_id: planEliminar._id, nombre: planEliminar.nombre});
        setShowEliminar(true);
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

    async function deletePlan(id){
        try {
            await deletePlanService(id);
            navigate("/admin/planes")
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }
    
    return(
        <>
            <Container className="py-5">
                <Row className="text-center mb-5">
                    <Col lg="8" className="mx-auto">
                        <h2 className="h5 mb-3">Administrador</h2>
                    </Col>
                </Row>
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
                            handleShowModal={handleShowModal}
                        />
                    </Col>
                </Row>
            </Container>
            <ModalEliminarPlan 
                showEliminar={showEliminar} 
                handleCloseModal={handleCloseModal} 
                planActivo={planActivo} 
                showAlert={showAlert}
                deletePlan={deletePlan}
            />
        </>
    )
}
export default VerPlan