import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ModalEliminarPrepaga from "../../components/ModalEliminarPrepaga";
import prepagaDefault from "../../assets/img/default-prepaga.png";
import { subirACloudinary } from "../../utils/Cloudinary";

function EditarPrepaga(){
    const token = localStorage.getItem("token");
    const host = import.meta.env.VITE_API_URL;
    const [prepaga, setPrepaga] = useState({_id: "", nombre: "", rnemp: "", logo: ""});
    const {id} = useParams();
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);

    // Modal eliminar
    const [showEliminar, setShowEliminar] = useState(false);
    const [prepagaActiva, setPrepagaActiva] = useState({_id: "", nombre: "", rnemp:"", logo: ""});
    const [showAlert, setShowAlert] = useState(false);

    const handleCloseModal = () => {
        setShowEliminar(false);
        setPrepagaActiva(null);
    }
    const handleShowModal = (prepagaEliminar) => {
        setPrepagaActiva({_id: prepagaEliminar._id, nombre: prepagaEliminar.nombre, rnemp: prepagaEliminar.rnemp});
        setShowEliminar(true);
    }

    function handlerChange(e){
        const { name, value, files } = e.target;
        if (name === "logo") {
            setPrepaga({ ...prepaga, logo: files[0] });
        } else {
            setPrepaga({ ...prepaga, [name]: value });
        }
    }

    async function getPrepaga(){
        try {
            const response = await fetch(`${host}/prepagas/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` // 2. Incluir el token en el header
                }
            });
            if (!response.ok) {
                alert("Error al solicitar la prepaga solicitada");
                return
            }
            const {data} = await response.json();
            setPrepaga(data);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    useEffect(() => {
        getPrepaga()
    }, [])

    // Previsualización del logo (desde File o desde URL)
    const logoPreview = prepaga.logo instanceof File
        ? URL.createObjectURL(prepaga.logo)
        : prepaga.logo
            ? prepaga.logo
            : prepagaDefault;
    
    useEffect(() => {
        return () => {
            if (prepaga.logo instanceof File) {
                URL.revokeObjectURL(prepaga.logo);
            }
        };
    }, [prepaga.logo]);

    function handlerForm(e){
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);
        editPrepaga();
    }

    async function editPrepaga(){
        try {
            // const formData = new FormData();
            // formData.append("nombre", prepaga.nombre);
            // formData.append("rnemp", prepaga.rnemp);

            // if (prepaga.logo instanceof File) {
            //     formData.append("logo", prepaga.logo); // solo si cambió el archivo
            // }
            let logoUrl = "";
            if (prepaga.logo) {
                logoUrl = await subirACloudinary(prepaga.logo);
            }
            const prepagaActualizada = {
                nombre: prepaga.nombre,
                rnemp: prepaga.rnemp,
                logo: logoUrl,
            };

            const opciones = {
                method: "PUT",
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(prepagaActualizada)
                //body: formData
            }
            const response = await fetch(`${host}/prepagas/${id}`, opciones);
            if (!response.ok) {
                const errorApi = await response.json();
                alert(`Error al modificar la prepaga - ${errorApi.msg}`);
                return
            }
            const {data} = await response.json();
            setPrepaga({...prepaga, data});
            setShowConfirm(true)
            setTimeout(() => {
                setShowConfirm(false);
                navigate("/admin/prepagas")
            }, 1000);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    async function deletePrepaga(id){
        const opciones = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        
        try {
            const response = await fetch(`${host}/prepagas/${id}`, opciones);
            if (!response.ok) {
                alert("Error al eliminar la prepaga");
                return
            }
            const data = await response.json();
            console.log(data.msg)
            navigate("/admin/prepagas")
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
                    <Col lg="10" className='mx-auto'>
                        <div>
                            <h3 className="h4">Modificar prepaga <span className="small fw-normal text-secondary">#{prepaga._id}</span></h3>
                            <p className="small">Desde este formulario usted podrá modificar los datos de una prepaga.</p>
                        </div>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handlerForm} noValidate validated={validated} encType="multipart/form-data">
                                    <Row>
                                        <Form.Group as={Col} controlId="nombre" className='mb-3'>
                                            <Form.Label>Denominación de la prepaga</Form.Label>
                                            <Form.Control 
                                                required
                                                type="text" 
                                                placeholder="Nombre" 
                                                name="nombre"
                                                value={prepaga.nombre || ""} 
                                                onChange={handlerChange} 
                                            />
                                            <Form.Control.Feedback type="invalid">Debe ingresar un nombre.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="rnemp" className='mb-3'>
                                            <Form.Label>Registro Nac. Entidad de medicina prepaga</Form.Label>
                                            <Form.Control 
                                                required
                                                type="number" 
                                                placeholder="rnemp" 
                                                name="rnemp"
                                                value={prepaga.rnemp} 
                                                onChange={handlerChange} 
                                            />
                                            <Form.Control.Feedback type="invalid">Debe ingresar un numero de registro válido.</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group controlId="logo" className="mb-3">
                                            <Form.Label>Logo</Form.Label>
                                            <div className="mb-2">
                                                <img
                                                    src={logoPreview}
                                                    alt="Logo"
                                                    width="60"
                                                    height="auto"
                                                    className="img-fluid"
                                                    onError={(e) => { e.target.src = prepagaDefault }}
                                                />
                                            </div>
                                            <Form.Control type="file" name="logo" accept="image/*" onChange={handlerChange} />
                                        </Form.Group>
                                    </Row>
                                    {showConfirm && 
                                        <Alert variant="success" className="p-2">Prepaga modificada correctamente.</Alert>
                                    }
                                    <Form.Group className="d-flex">
                                        <Button size="sm" type="button" variant='outline-primary' className='ms-auto me-2' href="/admin/prepagas">VOLVER</Button>
                                        <Button variant="danger" className="me-2" size="sm" onClick={()=>handleShowModal(prepaga)}>ELIMINAR</Button>
                                        <Button size="sm" type="submit" variant='primary'>ACTUALIZAR</Button>
                                    </Form.Group>
                                </Form>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <ModalEliminarPrepaga
                showEliminar={showEliminar} 
                handleCloseModal={handleCloseModal} 
                prepagaActiva={prepagaActiva} 
                showAlert={showAlert}
                deletePrepaga={deletePrepaga}
            />
        </>
    )
}
export default EditarPrepaga