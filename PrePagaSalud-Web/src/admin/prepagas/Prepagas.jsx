import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Form, Table, Collapse, Alert } from "react-bootstrap";
import ModalEliminarPrepaga from "../../components/ModalEliminarPrepaga";
import prepagaDefault from "../../assets/img/default-prepaga.png";

function Prepagas(){
    const token = localStorage.getItem("token");
    const host = import.meta.env.VITE_API_URL;
    const [open, setOpen] = useState(false);
    const [prepagas, setPrepagas] = useState([]);
    const [prepaga, setPrepaga] = useState({nombre: "", rnemp: "", logo: ""});
    const [showAlertPrepaga, setShowAlertPrepaga] = useState(false);
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

    async function getPrepagas(){
        try {
            const response = await fetch(`${host}/prepagas`);
            if (!response.ok) {
                alert("Error al solicitar las prepagas cargadas");
                return
            }
            const {data} = await response.json();
            setPrepagas(data);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    useEffect(() => {
        getPrepagas()
    }, [])

    function handlerForm(e){
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);
        addPrepaga();
    }

    async function addPrepaga(){
        console.log('nueva prepaga', prepaga);
        const formData = new FormData();
        formData.append("nombre", prepaga.nombre);
        formData.append("rnemp", prepaga.rnemp);
        if (prepaga.logo) {
            formData.append("logo", prepaga.logo);
        }
        const opciones = {
            method: "POST",
            headers: {
                //"Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            },
            //body: JSON.stringify(prepaga)
            body: formData
        }
        try {
            const response = await fetch(`${host}/prepagas`, opciones);
            if (!response.ok) {
                alert("Error al guardar la nueva prepaga");
                return
            }
            const {data} = await response.json();
            setShowAlertPrepaga(true)
            setTimeout(() => {
                setShowAlertPrepaga(false);
            }, 1000);
            setPrepagas([...prepagas, data]);
            setPrepaga({nombre: "", rnemp:"", logo: ""});
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
            await getPrepagas();
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
                handleCloseModal();
            }, 3000);
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    function reseteoForm() {
        setPrepaga({nombre: "", rnemp: "", logo: ""})
        setShowAlertPrepaga(false)
        setValidated(false);
    }
    
    return(
        <>
            <Container className="py-5">
                <Row className="text-center mb-5">
                    <Col lg="8" className="mx-auto">
                        <h2 className="h5 mb-3">Administrador</h2>
                    </Col>
                </Row>
                <Row>
                    <Col lg="10" className="mx-auto">
                        <div className="d-flex justify-content-between mb-3">
                            <h3 className="h4">Listado de prepagas cargadas</h3>
                            <Button variant="success" size="sm" onClick={() => setOpen(!open)} aria-controls="example-fade-text" aria-expanded={open}>
                                {!open && <>Agregar nueva prepaga</>}
                                {open && <>Cerrar</>}
                            </Button>
                        </div>
                        <Collapse in={open}>
                            <div id="example-collapse-text" className="mb-5">
                                <Card>
                                    <Card.Header>
                                        <div>
                                            <h3 className="h4">Nueva prepaga</h3>
                                            <p className="small mb-0">Desde este formulario usted podrá agregar una nueva prepaga.</p>
                                        </div>
                                    </Card.Header>
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
                                                    <Form.Control.Feedback type="invalid">Debe ingresar un numero de registro.</Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            <Row>
                                                <Form.Group controlId="logo" className="mb-3">
                                                    <Form.Label>Logo</Form.Label>
                                                    <Form.Control type="file" name="logo" accept="image/*" onChange={handlerChange} />
                                                </Form.Group>
                                            </Row>
                                            {showAlertPrepaga && 
                                                <Alert variant="success" className="p-2">Prepaga agregada correctamente.</Alert>
                                            }
                                            <Form.Group className="d-flex">
                                                <Button size="sm" type="button" variant='outline-primary' className='ms-auto me-2' onClick={reseteoForm}>BORRAR</Button>
                                                <Button size="sm" type="submit" variant='primary'>AGREGAR</Button>
                                            </Form.Group>
                                        </Form>

                                    </Card.Body>
                                </Card>

                            </div>
                        </Collapse>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Logo</th>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Rnemp</th>
                                    <th colSpan={2}>Acciones</th>
                                </tr>
                            </thead>
                        <tbody>
                            {prepagas.map((pre, i)=>(
                                <tr key={i}>
                                    <td className="align-middle">
                                        {pre.logo &&
                                            <img alt={pre.nombre} src={`${host.replace('/api', '')}/${pre.logo}`} width="40" height="auto" className="d-inline-block align-middle img-fluid"/>
                                        }
                                        {!pre.logo &&
                                            <img alt={pre.nombre} src={prepagaDefault} width="40" height="auto" className="d-inline-block align-middle img-fluid"/>
                                        }
                                    </td>
                                    <td className="align-middle">{pre._id}</td>
                                    <td className="align-middle">{pre.nombre}</td>
                                    <td className="align-middle">{pre.rnemp}</td>
                                    <td className="text-center"><Button variant="outline-primary" size="sm" href={`/admin/editarPrepaga/${pre._id}`}>Editar</Button></td>
                                    <td className="text-center"><Button variant="danger" size="sm" onClick={()=>handleShowModal(pre)}>Eliminar</Button></td>
                                </tr>
                            ))}
                        </tbody>
                        </Table>
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
export default Prepagas