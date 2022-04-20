import React, { useState, useEffect } from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Swal from 'sweetalert2'

function App() {
  const baseUrl = "https://localhost:44381/api/empleados";
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState({
    id: '',
    nombre: '',
    edad: '',
    telefono: '',
    correo: '',
    area: ''
  })

  const mostrarAlertaInsertar = () => {
    Swal.fire({
      title: '¡Correcto!',
      text: 'Se ha insertado exitosamente!',
      icon: 'success',
      confirmButtonText: 'Cool'
    })
  }

  const mostrarAlerta = () => {
    Swal.fire({
      title: 'Correcto!',
      text: 'Se ha editado correctamente',
      icon: 'success',
      confirmButtonText: 'Cool'
    })
  }

  const mostrarAlertaEliminar = () => {
    Swal.fire({
      title: '¡Eliminado!',
      text: 'Se ha eliminado correctamente',
      icon: 'success',
      confirmButtonText: 'Cool'
    })
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setEmpleadoSeleccionado({
      ...empleadoSeleccionado,
      [name]: value
    });
    console.log(empleadoSeleccionado);
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const peticionGet = async () => {
    await axios.get(baseUrl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPost = async () => {
    delete empleadoSeleccionado.id;
    empleadoSeleccionado.edad = parseInt(empleadoSeleccionado.edad);
    await axios.post(baseUrl, empleadoSeleccionado)
      .then(response => {
        setData(data.concat(response.data));
        mostrarAlertaInsertar();
        abrirCerrarModalInsertar();
      }).catch(error => {
        console.log('Falta agregar campos'+error);
      })
  }

  const peticionPut = async () => {
    empleadoSeleccionado.edad = parseInt(empleadoSeleccionado.edad);
    await axios.put(baseUrl + "/" + empleadoSeleccionado.id, empleadoSeleccionado)
      .then(response => {
        var respuesta = response.data;
        var dataAuxiliar = data;
        dataAuxiliar.map(empleado => {
          if (empleado.id === empleadoSeleccionado.id) {
            empleado.nombre = respuesta.nombre;
            empleado.edad = respuesta.edad;
            empleado.telefono = respuesta.telefono;
            empleado.correo = respuesta.correo;
            empleado.area = respuesta.area;
          }
        });
        mostrarAlerta();
        abrirCerrarModalEditar();
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionDelete = async () => {
    await axios.delete(baseUrl + "/" + empleadoSeleccionado.id)
      .then(response => {
        setData(data.filter(empleado => empleado.id !== response.data));
        mostrarAlertaEliminar();
        abrirCerrarModalEliminar();
      }).catch(error => {
        console.log(error);
      })
  }

  const seleccionarEmpleado = (empleado, caso) => {
    setEmpleadoSeleccionado(empleado);
    (caso === "Editar") ?
      abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  }

  useEffect(() => {
    peticionGet();
  })

  return (
    <div className="App">

      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">React JS</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="">Empleados</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="">Áreas</a>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      <br /><br />
      <div ><h3>SISTEMA DE GESTIÓN DE EMPLEADOS</h3></div>
      <br /><br />
      
      <button onClick={() => abrirCerrarModalInsertar()} className="btn btn-success">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
        </svg> Nuevo Empleado</button>
      <br /><br />
      
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Área</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(empleado => (
            <tr key={empleado.id}>
              <td>{empleado.id}</td>
              <td>{empleado.nombre}</td>
              <td>{empleado.edad}</td>
              <td>{empleado.telefono}</td>
              <td>{empleado.correo}</td>
              <td>{empleado.area}</td>
              <td>
                <button className="btn btn-outline-primary" onClick={() => seleccionarEmpleado(empleado, "Editar")} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                  </svg> <b>Editar</b></button>{" "}
                <button className="btn btn-outline-danger" onClick={() => seleccionarEmpleado(empleado, "Eliminar")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                  </svg> <b>Eliminar</b></button>
              </td>
            </tr>

          ))}

        </tbody>
      </table>
     
      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Nuevo Empleado</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre:</label>
            <br />
            <input type="text" className="form-control" name="nombre" onChange={handleChange} />
            <br />
            <label>Edad:</label>
            <br />
            <input type="text" className="form-control" name="edad" onChange={handleChange} />
            <br />
            <label>Teléfono:</label>
            <br />
            <input type="text" className="form-control" name="telefono" onChange={handleChange} />
            <br />
            <label>Correo Electrónico:</label>
            <br />
            <input type="text" className="form-control" name="correo" onChange={handleChange} />
            <br />
            <label>Área:</label>
            <br />
            <input type="text" className="form-control" name="area" onChange={handleChange} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()}>Insertar</button>{" "}
          <button className="btn btn-danger" onClick={() => abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Empleado</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID:</label>
            <br />
            <input type="text" className="form-control" readOnly value={empleadoSeleccionado && empleadoSeleccionado.id} />
            <br />
            <label>Nombre:</label>
            <br />
            <input type="text" className="form-control" name="nombre" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.nombre} />
            <br />
            <label>Edad:</label>
            <br />
            <input type="text" className="form-control" name="edad" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.edad} />
            <br />
            <label>Teléfono:</label>
            <br />
            <input type="text" className="form-control" name="telefono" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.telefono} />
            <br />
            <label>Correo Electrónico:</label>
            <br />
            <input type="text" className="form-control" name="correo" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.correo} />
            <br />
            <label>Área:</label>
            <br />
            <input type="text" className="form-control" name="area" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.area} />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPut()}>Editar</button>{" "}
          <button className="btn btn-danger" onClick={() => abrirCerrarModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          ¿Seguro que deseas eliminar el registro {empleadoSeleccionado && empleadoSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>Sí</button>
          <button className="btn btn-secondary" onClick={() => abrirCerrarModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>



    </div>
  );
}

export default App;
