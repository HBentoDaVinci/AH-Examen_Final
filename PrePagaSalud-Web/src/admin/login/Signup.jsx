import { useState } from "react";
import { Container, Row, Col, Button, Card, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { subirACloudinary } from "../../utils/Cloudinary";

function Signup(){
    const host = import.meta.env.VITE_API_URL;
    const [usuarios, setUsuarios] = useState([]);
    const [usuario, setUsuario] = useState({nombre: "", email: "", password:"", avatar: ""});
    const navigate = useNavigate();
    const [showAlertUsuario, setShowAlertUsuario] = useState(false);

    const [validated, setValidated] = useState(false);

    function handlerForm(e){
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);
         addUsuario();
    }

    function handlerChange(e){
        const { name, value, files } = e.target;
        if (name === "avatar") {
            setUsuario({ ...usuario, avatar: files[0] });
        } else {
            setUsuario({ ...usuario, [name]: value });
        }
    }

    async function addUsuario(){
        // const formData = new FormData();
        // formData.append("nombre", usuario.nombre);
        // formData.append("email", usuario.email);
        // formData.append("password", usuario.password);
        // if (usuario.avatar) {
        //     formData.append("avatar", usuario.avatar);
        // }
        
        try {
            let avatarUrl = "";
            if (usuario.avatar) {
                avatarUrl = await subirACloudinary(usuario.avatar);
            }
            const nuevoUsuario = {
                nombre: usuario.nombre,
                email: usuario.email,
                password: usuario.password,
                avatar: avatarUrl,
            };

            const opciones = {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                    //Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(nuevoUsuario)
                //body: formData
            };

            const response = await fetch(`${host}/usuarios`, opciones);
            if (!response.ok) {
                const errorApi = await response.json();
                alert(`Error al agregar un nuevo usuario - ${errorApi.msg}`);
                return
            }
            const {data} = await response.json();
            setShowAlertUsuario(true)
            setTimeout(() => {
                setShowAlertUsuario(false);
            }, 1000);
            setUsuarios([...usuarios, data]);
            setUsuario({nombre: "", email: "", password:"", avatar: ""})
            setValidated(false);
            navigate('/admin/login')
        } catch(error){
            console.error(error);
            alert("Ocurrio un problema en el servidor")
        }
    }

    function resetoForm() {
        setUsuario({nombre: "", email: "", password:"", avatar: ""})
        setShowAlertUsuario(false);
        setValidated(false);
    }
    
    return(
        <>
            <Container className="py-5">
                <Row className="text-center mb-5">
                    <Col lg="8" className="mx-auto">
                        <h2 className="h5 mb-3">Bienvenido</h2>
                    </Col>
                </Row>
                <Row className="mb-5">
                    <Col lg="10" className='mx-auto'>
                        <Card>
                            <Card.Header>
                                <div>
                                    <h3 className="h4">Registro de usuario</h3>
                                    <p className="small mb-0">Ingrese sus datos para crear una cuenta nueva</p>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handlerForm} noValidate validated={validated} encType="multipart/form-data">
                                    <Row>
                                        <Form.Group as={Col} controlId="nombre" className='mb-3'>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control 
                                                required
                                                type="text" 
                                                placeholder="Nombre" 
                                                name="nombre"
                                                value={usuario?.nombre || ""} 
                                                onChange={handlerChange} 
                                            />
                                            <Form.Control.Feedback type="invalid">Debe ingresar un nombre.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="email" className='mb-3'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control 
                                                required
                                                type="email" 
                                                placeholder="Email" 
                                                name="email"
                                                value={usuario.email} 
                                                onChange={handlerChange} 
                                            />
                                            <Form.Control.Feedback type="invalid">Debe ingresar un email válido.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="password" className='mb-3'>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control 
                                                required
                                                type="password" 
                                                placeholder="Password" 
                                                name="password"
                                                value={usuario.password} 
                                                onChange={handlerChange} 
                                            />
                                            <Form.Control.Feedback type="invalid">Debe ingresar una password.</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Form.Group controlId="avatar" className="mb-3">
                                            <Form.Label>Avatar</Form.Label>
                                            <Form.Control type="file" name="avatar" accept="image/*" onChange={handlerChange} />
                                        </Form.Group>
                                    </Row>
                                    {showAlertUsuario && 
                                        <Alert variant="success" className="p-2">Usuario agregado correctamente.</Alert>
                                    }
                                    <Form.Group className="d-flex justify-content-end">
                                        <Button size="sm" type="button" variant='outline-primary' className='ms-auto me-2' onClick={resetoForm}>BORRAR</Button>
                                        <Button size="sm" type="submit" variant='primary'>REGISTRAR</Button>
                                    </Form.Group>
                                </Form>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default Signup