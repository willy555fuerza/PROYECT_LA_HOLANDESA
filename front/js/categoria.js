function mayus(e) {
    e.value = e.value.toUpperCase();
}
const formAgregarUsuario = document.getElementById('myForm');

formAgregarUsuario.addEventListener("submit", async function(event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Obtener los valores del formulario
    const nombre_categoria = document.getElementById('nombre_categoria').value;
    const descripcion = document.getElementById('descripcion').value;
    
    console.log(nombre_categoria)
    console.log(descripcion)

    try {
        // Enviar los datos al servidor para crear el nuevo usuario
        const response = await fetch('http://localhost:3009/La_holandesa/create_categoria', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_categoria,
                descripcion
            })
        });

        if (response.ok) {
            alert('Categoria creada correctamente');
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Error al crear usuario');
        }
    } catch (error) {
        console.error('Error al enviar la solicitud:', error);
        alert('Error al enviar la solicitud');
    }
}); 

const categorias = document;

const paginaCategorias = categorias.querySelector('#categorias')

const Categorias = ({id_categoria, nombre_categoria, descripcion, fecha_registro, estado}) => {
    // Convertir la fecha de registro a un formato de año-mes-día
    const formattedDate = new Date(fecha_registro).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });

    const buttonColor = estado === true ? 'green' : 'red';
    const buttontxt = estado === true ? 'SI' : 'NO';

    return `
        <tr id="categoria-row-${id_categoria}"> <!-- Agregar un ID único para la fila -->
            <td>${id_categoria}</td>
            <td>${nombre_categoria}</td>
            <td>${descripcion}</td>
            <td>${formattedDate}</td>
            <td>
            <div class="container-btn-state">
                <button class="btn-state" style="background-color: ${buttonColor}" >${buttontxt}</button>
            </div>
            </td>
            <td>
                <div class="button-eliminar-editar">
                    <button class="editar" onclick="editCategoria(${id_categoria})"><i class="fi fi-rr-pen-field"></i></button> <!-- Llamar a la función editCategoria -->
                    <button class="estado" onclick="changeState(${id_categoria}, ${estado})"><i class="fi fi-sr-cross-small"></i></button>
                </div>
            </td>
        </tr>
    `;
}

const editCategoria = (id_categoria) => {
    const row = document.getElementById(`categoria-row-${id_categoria}`);
    const cells = row.getElementsByTagName('td');

    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        const oldValue = cell.innerText.trim();
        cell.innerHTML = `<input class="tab" type="text" value="${oldValue}" onkeyup="mayus(this);" style="width: 60%; ">`;
    }

    const editButton = cells[cells.length - 1].getElementsByTagName('button')[0];
    editButton.innerHTML = '<i class="fi fi-rr-check"></i>';
    editButton.setAttribute('onclick', `saveChanges(${id_categoria})`);
}

// Función para guardar los cambios realizados en la fila
const saveChanges = async (id_categoria) => {
    const row = document.getElementById(`categoria-row-${id_categoria}`);
    const cells = row.getElementsByTagName('td');
    const newValues = [];

    for (let i = 1; i < cells.length - 1; i++) {
        const cell = cells[i];
        const newValue = cell.getElementsByTagName('input')[0].value;
        newValues.push(newValue);
    }

    try {
        const response = await fetch(`http://localhost:3009/La_holandesa/categoria/${id_categoria}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_categoria: newValues[0],
                descripcion: newValues[1],
            })
        });
        
        if (response.status !== 200) throw new Error('Error al actualizar la categoría');
        
        alert('Categoría actualizada correctamente');
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
        const response = await fetch('http://localhost:3009/La_holandesa/categoria')
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
        const response = await fetch(`http://localhost:3009/La_holandesa/categoria/${userId}/state`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ state: newState }) // Cambiar el estado a 0
        });
        if (response.status !== 200) throw new Error('Error al cambiar el estado de la categoría');
        // Actualizar la tabla después de cambiar el estado
        getAll();
    } catch (error) {
        alert('Error ' + error);
    }
}

getAll()
