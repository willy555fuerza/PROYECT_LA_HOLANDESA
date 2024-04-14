function mayus(e) {
    e.value = e.value.toUpperCase();
}
const formAgregarUsuario = document.getElementById('myForm');

formAgregarUsuario.addEventListener("submit", async function(event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Obtener los valores del formulario
    const nombre_proveedor = document.getElementById('nombre_proveedor').value;
    const telefono = document.getElementById('telefono').value;
    const descripcion = document.getElementById('descripcion').value;
    const direccion = document.getElementById('direccion').value;
    
    console.log(nombre_proveedor)
    console.log(telefono)
    console.log(descripcion)
    console.log(direccion)


    try {
        // Enviar los datos al servidor para crear el nuevo usuario
        const response = await fetch('http://localhost:3009/La_holandesa/create_proveedor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_proveedor,
                telefono,
                descripcion,
                direccion
            })
        });

        if (response.ok) {
            alert('Proveedor creado correctamente');
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Error al crear proveedor');
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud');
    }
}); 

const proveedor = document;

const paginaCategorias = proveedor.querySelector('#proveedor')

const Categorias = ({id_proveedor, nombre_proveedor, telefono, descripcion, direccion, fecha_registro, estado}) => {
    // Convertir la fecha de registro a un formato de año-mes-día
    const formattedDate = new Date(fecha_registro).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });

    const buttonColor = estado === true ? 'green' : 'red';
    const buttontxt = estado === true ? 'SI' : 'NO';

    return `
        <tr id="categoria-row-${id_proveedor}"> <!-- Agregar un ID único para la fila -->
            <td>${id_proveedor}</td>
            <td>${nombre_proveedor}</td>
            <td>${telefono}</td>
            <td>${descripcion}</td>
            <td>${direccion}</td>
            <td>${formattedDate}</td>
            <td>
            <div class="container-btn-state">
                <button class="btn-state" style="background-color: ${buttonColor}" >${buttontxt}</button>
            </div>
            </td>
            <td>
                <div class="button-eliminar-editar">
                    <button class="editar" onclick="editCategoria(${id_proveedor})"><i class="fi fi-rr-pen-field"></i></button> <!-- Llamar a la función editCategoria -->
                    <button class="estado" onclick="changeState(${id_proveedor}, ${estado})"><i class="fi fi-sr-cross-small"></i></button>
                </div>
            </td>
        </tr>
    `;
}

const editCategoria = (id_proveedor) => {
    const row = document.getElementById(`categoria-row-${id_proveedor}`);
    const cells = row.getElementsByTagName('td');

    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        const oldValue = cell.innerText.trim();
        cell.innerHTML = `<input class="tab" type="text" value="${oldValue}" onkeyup="mayus(this);" style="width: 100%; ">`;
    }

    const editButton = cells[cells.length - 1].getElementsByTagName('button')[0];
    editButton.innerHTML = '<i class="fi fi-rr-check"></i>';
    editButton.setAttribute('onclick', `saveChanges(${id_proveedor})`);
}

// Función para guardar los cambios realizados en la fila
const saveChanges = async (id_proveedor) => {
    const row = document.getElementById(`categoria-row-${id_proveedor}`);
    const cells = row.getElementsByTagName('td');
    const newValues = [];

    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        const newValue = cell.getElementsByTagName('input')[0].value;
        newValues.push(newValue);
    }

    try {
        const response = await fetch(`http://localhost:3009/La_holandesa/proveedor/${id_proveedor}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_proveedor: newValues[0],
                telefono: newValues[1],
                descripcion: newValues[2],
                direccion: newValues[3]
            })
        });
        
        if (response.status !== 200) throw new Error('Error al actualizar los proveedores');
        
        alert('Proveedor actualizado correctamente');
        getAll();
    } catch (error) {
        alert('Error ' + error);
    }
}

const render = (array)=>{
    //const filteredUsers = array.filter(user => user.estado === 1); // Filtrar usuarios con state igual a 1
    const cardsHTML = array.map(item => Categorias(item)).join('');
    paginaCategorias.innerHTML = cardsHTML;
}

const getAll = async ()=>{
    try {
        const response = await fetch('http://localhost:3009/La_holandesa/proveedor')
        if (response.status !== 200) throw new Error('Error en la solicitud')
        const data = await response.json()
        render(data)
    } catch (error) {
        alert('Error ' + error)
    }
}

// CAmbiar state del usaurio (deshabilitacion logica)
const changeState = async (userId, currentState) => {
    try {
        let newState = 1;
        if (currentState == 1) {
            newState = 0;
        }
        const response = await fetch(`http://localhost:3009/La_holandesa/proveedor/${userId}/state`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ state: newState }) // Cambiar el estado a 0
        });
        if (response.status !== 200) throw new Error('Error al cambiar el estado del proveedor');
        // Actualizar la tabla después de cambiar el estado
        getAll();
    } catch (error) {
        alert('Error ' + error);
    }
}

getAll()
