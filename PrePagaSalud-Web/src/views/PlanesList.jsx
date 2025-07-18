import { useState, useEffect } from "react"
import CardPlanes from "../components/CardPlanes"
import { Container, Row, Col, Spinner } from "react-bootstrap"
import { getPlanes } from "../services/planService";

function Planes(){
    const [planes, setPlanes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getAllPlanes(){
            try {
                const data = await getPlanes();
                //console.log('planes listado', data)
                setPlanes(data);
            } catch(error){
                console.error(error);
                alert("Ocurrio un problema en el servidor")
            } finally {
                setLoading(false);
            }
        }
        getAllPlanes()
    }, [])

    return(
        <>
            <Container className='py-5'>
                <Row>
                    <Col lg="12" className='mx-auto'>
                        <h2>Planes</h2>
                        {loading ? (
                            <div className="text-center my-5">
                                <Spinner animation="border" role="status" variant="info" />
                                <p className="mt-3">Cargando planes...</p>
                            </div>
                        ) : planes.length === 0 ? (
                            <div className="text-center my-5">
                                <Alert variant="info">
                                    No hay planes disponibles en este momento.
                                </Alert>
                            </div>
                        ) : (
                            <Row>
                                {planes.map((plan, index)=>(
                                    <Col key={index} sm={4} className="d-flex align-items-stretch">
                                        <CardPlanes 
                                            id={plan._id}
                                            nombre={plan.nombre} 
                                            rangoEtario={plan.rangoEtario} 
                                            cobertura={plan.cobertura} 
                                            grupoFamiliar={plan.grupoFamiliar} 
                                            prepaga={plan.prepaga} 
                                            tarifa={plan.tarifa}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default Planes