function mayus(e) {
    e.value = e.value.toUpperCase();
}
const formAgregarUsuario = document.getElementById('myForm');

formAgregarUsuario.addEventListener("submit", async function(event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Obtener los valores del formulario
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const perfil = document.getElementById('perfil').value; // Nuevo campo de perfil
    const usuario = document.getElementById('usuario').value;
    const contraseña = document.getElementById('contraseña').value;

    try {
        // Enviar los datos al servidor para crear el nuevo usuario
        const response = await fetch('http://localhost:3009/La_holandesa/create_users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombres,
                apellidos,
                perfil,
                usuario,
                contraseña
            })
        });

        if (response.ok) {
            alert('Usuario creado correctamente');
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Error al crear usuario');
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud');
    }
});

const users = document;

const paginaUsers = users.querySelector('#usuarios')

const Users = ({id_usuario, nombres, apellidos, perfil, usuario, fecha_registro, estado}) => {
    // Convertir la fecha de registro a un formato de año-mes-día
    const formattedDate = new Date(fecha_registro).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    const buttonColor = estado === true ? 'green' : 'red';
    const buttontxt = estado === true ? 'SI' : 'NO';

    let fotoHTML = '';
    /* if (foto && typeof foto === 'string') {
        fotoHTML = `<img src="${foto}" alt="Foto de perfil" style="width: 50px; height: 50px;">`;
    } */

    return `
        <tr id="user-row-${id_usuario}"> <!-- Agregar un ID único para la fila -->
            <td>${id_usuario}</td>
            <td>${nombres}</td>
            <td>${apellidos}</td>
            <td>${perfil}</td>
            <td>${usuario}</td>
            <td>${formattedDate}</td>
            <td>
            <div class="container-btn-state">
                <button class="btn-state" style="background-color: ${buttonColor}" >${buttontxt}</button>
            </div>
            </td>
            <td>
                <div class="button-eliminar-editar">
                    <button class="editar" onclick="editUser(${id_usuario})"><i class="fi fi-rr-pen-field"></i></button> <!-- Llamar a la función editUser -->
                    <button class="estado" onclick="changeState(${id_usuario}, ${estado})"><i class="fi fi-sr-cross-small"></i></button>
                </div>
            </td>
        </tr>
    `;
}

const editUser = (id_usuario) => {
    const row = document.getElementById(`user-row-${id_usuario}`);
    const cells = row.getElementsByTagName('td');

    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        const oldValue = cell.innerText.trim();
        cell.innerHTML = `<input class="tab" type="text" value="${oldValue}" onkeyup="mayus(this);" style="width: 100%; ">`;
    }

    const editButton = cells[cells.length - 1].getElementsByTagName('button')[0];
    editButton.innerHTML = '<i class="fi fi-rr-check"></i>';
    editButton.setAttribute('onclick', `saveChanges(${id_usuario})`);
}

const saveChanges = async (id_usuario) => {
    const row = document.getElementById(`user-row-${id_usuario}`);
    const cells = row.getElementsByTagName('td');
    const newValues = [];

    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        const newValue = cell.getElementsByTagName('input')[0].value;
        newValues.push(newValue);
    }

    try {
        const response = await fetch(`http://localhost:3009/La_holandesa/Users/${id_usuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombres: newValues[0],
                apellidos: newValues[1],
                perfil: newValues[2],
                usuario: newValues[3],
                fecha_registro: newValues[4],
            })
        });
        
        if (response.status !== 200) throw new Error('Error al actualizar el usuario');
        
        alert('Usuario actualizado correctamente');
        getAll();
    } catch (error) {
        alert('Error ' + error);
    }
}

const render = (array)=>{
    //const filteredUsers = array.filter(user => user.estado === 1); // Filtrar usuarios con state igual a 1
    const cardsHTML = array.map(item => Users(item)).join('');
    paginaUsers.innerHTML = cardsHTML;
}

const getAll = async ()=>{
    try {
        const response = await fetch('http://localhost:3009/La_holandesa/Users')
        if (response.status !== 200) throw new Error('Error en la solicitud')
        const data = await response.json()
        render(data)
    } catch (error) {
        alert('Error ' + error)
    }
}

const changeState = async (userId, currentState) => {
    try {
        let newState = 1;
        if (currentState == 1) {
            newState = 0;
        }
        const response = await fetch(`http://localhost:3009/La_holandesa/Users/${userId}/state`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ state: newState }) // Cambiar el estado a 0
        });
        if (response.status !== 200) throw new Error('Error al cambiar el estado del usuario');
        // Actualizar la tabla después de cambiar el estado
        getAll();
    } catch (error) {
        alert('Error ' + error);
    }
}

getAll()
