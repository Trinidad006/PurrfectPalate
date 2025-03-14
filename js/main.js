// Variables globales
let usuarioActual = null;
let modalRegistro = null;
let modalLogin = null;
let modalPerfil = null;
let modalPublicarReceta = null;
let modalRegistroNegocio = null;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar los modales
    modalRegistro = new bootstrap.Modal(document.getElementById('registroModal'));
    modalLogin = new bootstrap.Modal(document.getElementById('loginModal'));
    modalPerfil = new bootstrap.Modal(document.getElementById('perfilModal'));
    modalPublicarReceta = new bootstrap.Modal(document.getElementById('publicarRecetaModal'));
    modalRegistroNegocio = new bootstrap.Modal(document.getElementById('registroNegocioModal'));
    
    // Configurar event listeners
    configurarEventListeners();
    
    // Cargar contenido inicial
    cargarRecetas();
    cargarLugares();
    cargarCategorias();
});

// Configuración de event listeners
function configurarEventListeners() {
    // Botón de inicio de sesión/perfil
    document.getElementById('btnLogin').addEventListener('click', () => {
        if (usuarioActual) {
            mostrarPerfil();
        } else {
            modalLogin.show();
        }
    });

    // Botón de registro
    document.getElementById('btnRegistro').addEventListener('click', () => {
        modalRegistro.show();
    });

    // Botón de publicar receta
    document.getElementById('btnPublicarReceta').addEventListener('click', () => {
        if (!usuarioActual) {
            alert('Debes iniciar sesión para publicar una receta');
            modalRegistro.show();
            return;
        }
        modalPublicarReceta.show();
    });

    // Botón de registro de negocio
    document.getElementById('btnRegistrarNegocio').addEventListener('click', () => {
        if (!usuarioActual) {
            alert('Debes iniciar sesión para registrar un negocio');
            modalRegistro.show();
            return;
        }
        modalRegistroNegocio.show();
    });

    // Formulario de registro
    document.getElementById('registroForm').addEventListener('submit', (e) => {
        e.preventDefault();
        procesarRegistro();
    });

    // Formulario de inicio de sesión
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        procesarLogin();
    });

    // Formulario de publicación de receta
    document.getElementById('publicarRecetaForm').addEventListener('submit', (e) => {
        e.preventDefault();
        procesarPublicacionReceta();
    });

    // Formulario de registro de negocio
    document.getElementById('registroNegocioForm').addEventListener('submit', (e) => {
        e.preventDefault();
        procesarRegistroNegocio();
    });

    // Buscador
    const buscador = document.querySelector('.search-box input');
    buscador.addEventListener('input', (e) => {
        filtrarContenido(e.target.value);
    });
}

// Funciones de carga de contenido
function cargarRecetas() {
    const container = document.getElementById('recetasContainer');
    container.innerHTML = '';

    data.recetas.forEach(receta => {
        const card = crearTarjetaReceta(receta);
        container.appendChild(card);
    });
}

function cargarLugares() {
    const container = document.getElementById('lugaresContainer');
    container.innerHTML = '';

    data.lugares.forEach(lugar => {
        const card = crearTarjetaLugar(lugar);
        container.appendChild(card);
    });
}

function cargarCategorias() {
    const container = document.querySelector('.categorias-container');
    if (!container) return;

    container.innerHTML = '';
    data.categorias.forEach(categoria => {
        const badge = crearBadgeCategoria(categoria);
        container.appendChild(badge);
    });
}

// Funciones de creación de elementos
function crearTarjetaReceta(receta) {
    const div = document.createElement('div');
    div.className = 'col-md-4';
    div.innerHTML = `
        <div class="card receta-card">
            <img src="${receta.imagen}" class="card-img-top" alt="${receta.titulo}">
            <div class="card-body">
                <h5 class="card-title">${receta.titulo}</h5>
                <p class="card-text">${receta.descripcion}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-primary">${receta.categoria}</span>
                    <div class="interacciones">
                        <i class="fas fa-heart"></i> ${receta.likes}
                        <i class="fas fa-comment"></i> ${receta.comentarios}
                    </div>
                </div>
                <div class="mt-2">
                    ${receta.etiquetas.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="mt-3">
                    <button class="btn btn-sm btn-outline-primary" onclick="verDetallesReceta(${receta.id})">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    `;
    return div;
}

function crearTarjetaLugar(lugar) {
    const div = document.createElement('div');
    div.className = 'col-md-4';
    div.innerHTML = `
        <div class="card lugar-card">
            <img src="${lugar.imagen}" class="card-img-top" alt="${lugar.nombre}">
            <div class="card-body">
                <h5 class="card-title">${lugar.nombre}</h5>
                <p class="card-text">${lugar.descripcion}</p>
                <p class="card-text"><small class="text-muted">${lugar.direccion}</small></p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-primary">${lugar.categoria}</span>
                    <div class="valoracion">
                        <i class="fas fa-star"></i> ${lugar.valoracion}
                    </div>
                </div>
                <div class="mt-2">
                    ${lugar.etiquetas.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="mt-3">
                    <button class="btn btn-sm btn-outline-primary" onclick="verDetallesLugar(${lugar.id})">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>
    `;
    return div;
}

function crearBadgeCategoria(categoria) {
    const span = document.createElement('span');
    span.className = 'categoria-badge';
    span.innerHTML = `<i class="${categoria.icono}"></i> ${categoria.nombre}`;
    span.addEventListener('click', () => filtrarPorCategoria(categoria.id));
    return span;
}

// Funciones de procesamiento
function procesarRegistro() {
    const form = document.getElementById('registroForm');
    const formData = new FormData(form);
    
    // Verificar si las contraseñas coinciden
    if (formData.get('password') !== formData.get('confirmPassword')) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    // Verificar si el email ya existe
    if (buscarUsuario(formData.get('email'))) {
        alert('Este correo electrónico ya está registrado');
        return;
    }
    
    // Crear objeto de usuario
    const nuevoUsuario = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        password: formData.get('password'),
        preferencias: Array.from(formData.getAll('preferencias')),
        alergias: Array.from(formData.getAll('alergias'))
    };
    
    // Agregar usuario al JSON
    agregarUsuario(nuevoUsuario);
    
    // Iniciar sesión automáticamente
    usuarioActual = nuevoUsuario;
    
    modalRegistro.hide();
    alert('¡Registro exitoso!');
    actualizarUIUsuario();
}

function procesarLogin() {
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Verificar credenciales
    if (!verificarCredenciales(email, password)) {
        alert('Correo electrónico o contraseña incorrectos');
        return;
    }
    
    // Obtener datos completos del usuario
    usuarioActual = buscarUsuario(email);
    
    modalLogin.hide();
    alert('¡Inicio de sesión exitoso!');
    actualizarUIUsuario();
}

function procesarPublicacionReceta() {
    const form = document.getElementById('publicarRecetaForm');
    const formData = new FormData(form);
    
    // Crear objeto con los datos de la receta
    const nuevaReceta = {
        titulo: formData.get('titulo'),
        descripcion: formData.get('descripcion'),
        imagen: formData.get('imagen').size > 0 ? URL.createObjectURL(formData.get('imagen')) : 'img/recetas/default-recipe.jpg',
        categoria: formData.get('categoria'),
        tiempoPreparacion: formData.get('tiempoPreparacion'),
        dificultad: formData.get('dificultad'),
        ingredientes: formData.get('ingredientes').split('\n').filter(i => i.trim()),
        pasos: formData.get('pasos').split('\n').filter(p => p.trim()),
        etiquetas: formData.get('etiquetas').split(',').map(t => t.trim()),
        autor: usuarioActual.nombre
    };
    
    // Agregar la receta al JSON
    agregarReceta(nuevaReceta);
    
    // Cerrar el modal y actualizar la vista
    modalPublicarReceta.hide();
    alert('¡Receta publicada exitosamente!');
    cargarRecetas(); // Recargar la lista de recetas
}

function procesarRegistroNegocio() {
    const form = document.getElementById('registroNegocioForm');
    const formData = new FormData(form);
    
    // Crear objeto con los datos del negocio
    const nuevoNegocio = {
        nombre: formData.get('nombre'),
        direccion: formData.get('direccion'),
        descripcion: formData.get('descripcion'),
        imagen: formData.get('imagen').size > 0 ? URL.createObjectURL(formData.get('imagen')) : 'img/lugares/default-restaurant.jpg',
        categoria: formData.get('categoria'),
        precio: formData.get('precio'),
        horario: formData.get('horario'),
        telefono: formData.get('telefono'),
        valoracion: 0,
        reseñas: [],
        etiquetas: formData.get('etiquetas').split(',').map(t => t.trim()),
        autor: usuarioActual.nombre
    };
    
    // Agregar el negocio al JSON
    agregarLugar(nuevoNegocio);
    
    // Cerrar el modal y actualizar la vista
    modalRegistroNegocio.hide();
    alert('¡Negocio registrado exitosamente!');
    cargarLugares(); // Recargar la lista de lugares
}

function filtrarContenido(busqueda) {
    const busquedaLower = busqueda.toLowerCase();
    
    // Filtrar recetas
    const recetasFiltradas = data.recetas.filter(receta => 
        receta.titulo.toLowerCase().includes(busquedaLower) ||
        receta.descripcion.toLowerCase().includes(busquedaLower) ||
        receta.etiquetas.some(tag => tag.toLowerCase().includes(busquedaLower))
    );
    
    // Filtrar lugares
    const lugaresFiltrados = data.lugares.filter(lugar => 
        lugar.nombre.toLowerCase().includes(busquedaLower) ||
        lugar.descripcion.toLowerCase().includes(busquedaLower) ||
        lugar.etiquetas.some(tag => tag.toLowerCase().includes(busquedaLower))
    );
    
    // Actualizar la vista
    actualizarVistaFiltrada(recetasFiltradas, lugaresFiltrados);
}

function filtrarPorCategoria(categoriaId) {
    // Implementar filtrado por categoría
    console.log('Filtrando por categoría:', categoriaId);
}

function actualizarVistaFiltrada(recetas, lugares) {
    const recetasContainer = document.getElementById('recetasContainer');
    const lugaresContainer = document.getElementById('lugaresContainer');
    
    recetasContainer.innerHTML = '';
    lugaresContainer.innerHTML = '';
    
    recetas.forEach(receta => {
        recetasContainer.appendChild(crearTarjetaReceta(receta));
    });
    
    lugares.forEach(lugar => {
        lugaresContainer.appendChild(crearTarjetaLugar(lugar));
    });
}

function verDetallesReceta(id) {
    const receta = data.recetas.find(r => r.id === id);
    if (!receta) {
        alert('No se encontró la receta');
        return;
    }

    // Crear el contenido del modal
    const contenido = `
        <div class="modal-header">
            <h5 class="modal-title">${receta.titulo}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <img src="${receta.imagen}" class="img-fluid mb-3" alt="${receta.titulo}">
            <p class="lead">${receta.descripcion}</p>
            
            <div class="row mb-3">
                <div class="col-md-4">
                    <strong>Tiempo de Preparación:</strong> ${receta.tiempoPreparacion}
                </div>
                <div class="col-md-4">
                    <strong>Dificultad:</strong> ${receta.dificultad}
                </div>
                <div class="col-md-4">
                    <strong>Categoría:</strong> ${receta.categoria}
                </div>
            </div>

            <h6>Ingredientes:</h6>
            <ul>
                ${receta.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
            </ul>

            <h6>Pasos:</h6>
            <ol>
                ${receta.pasos.map(paso => `<li>${paso}</li>`).join('')}
            </ol>

            <div class="mt-3">
                <strong>Etiquetas:</strong>
                ${receta.etiquetas.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}
            </div>

            <div class="mt-3">
                <strong>Autor:</strong> ${receta.autor}
            </div>

            <div class="mt-3">
                <button class="btn btn-outline-primary me-2">
                    <i class="fas fa-heart"></i> ${receta.likes}
                </button>
                <button class="btn btn-outline-primary">
                    <i class="fas fa-comment"></i> ${receta.comentarios}
                </button>
            </div>
        </div>
    `;

    // Crear y mostrar el modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'detallesRecetaModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                ${contenido}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    // Eliminar el modal cuando se cierre
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function verDetallesLugar(id) {
    // Implementar vista de detalles de lugar
    console.log('Ver detalles de lugar:', id);
}

function actualizarUIUsuario() {
    const btnLogin = document.getElementById('btnLogin');
    const btnRegistro = document.getElementById('btnRegistro');
    const preferenciasDropdown = document.getElementById('preferenciasDropdown');
    
    if (usuarioActual) {
        btnLogin.textContent = 'Mi Perfil';
        btnRegistro.style.display = 'none';
        preferenciasDropdown.style.display = 'block';
    } else {
        btnLogin.textContent = 'Iniciar Sesión';
        btnRegistro.style.display = 'inline-block';
        preferenciasDropdown.style.display = 'none';
    }
}

// Funciones de perfil
function mostrarPerfil() {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para ver tu perfil');
        modalLogin.show();
        return;
    }
    
    // Actualizar información del usuario
    document.getElementById('perfilNombre').textContent = usuarioActual.nombre;
    document.getElementById('perfilEmail').textContent = usuarioActual.email;
    
    // Cargar recetas del usuario
    cargarRecetasUsuario();
    
    // Cargar restaurantes del usuario
    cargarRestaurantesUsuario();
    
    // Mostrar el modal
    modalPerfil.show();
}

function cargarRecetasUsuario() {
    const container = document.getElementById('recetasUsuario');
    container.innerHTML = '';
    
    // Filtrar recetas del usuario actual
    const recetasUsuario = data.recetas.filter(receta => receta.autor === usuarioActual.nombre);
    
    if (recetasUsuario.length === 0) {
        container.innerHTML = '<p class="text-muted">No has publicado ninguna receta aún.</p>';
        return;
    }
    
    recetasUsuario.forEach(receta => {
        const div = document.createElement('div');
        div.className = 'list-group-item d-flex justify-content-between align-items-center';
        div.innerHTML = `
            <div>
                <h6 class="mb-1">${receta.titulo}</h6>
                <small class="text-muted">${receta.categoria}</small>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="verDetallesReceta(${receta.id})">
                    Ver
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarReceta(${receta.id})">
                    Eliminar
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function cargarRestaurantesUsuario() {
    const container = document.getElementById('restaurantesUsuario');
    container.innerHTML = '';
    
    // Filtrar restaurantes del usuario actual
    const restaurantesUsuario = data.lugares.filter(lugar => lugar.autor === usuarioActual.nombre);
    
    if (restaurantesUsuario.length === 0) {
        container.innerHTML = '<p class="text-muted">No has registrado ningún restaurante aún.</p>';
        return;
    }
    
    restaurantesUsuario.forEach(restaurante => {
        const div = document.createElement('div');
        div.className = 'list-group-item d-flex justify-content-between align-items-center';
        div.innerHTML = `
            <div>
                <h6 class="mb-1">${restaurante.nombre}</h6>
                <small class="text-muted">${restaurante.categoria}</small>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="verDetallesLugar(${restaurante.id})">
                    Ver
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarRestaurante(${restaurante.id})">
                    Eliminar
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function eliminarReceta(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
        // Eliminar la receta del array
        data.recetas = data.recetas.filter(receta => receta.id !== id);
        // Guardar cambios
        guardarDatos();
        // Actualizar la vista
        cargarRecetas();
        cargarRecetasUsuario();
    }
}

function eliminarRestaurante(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este restaurante?')) {
        // Eliminar el restaurante del array
        data.lugares = data.lugares.filter(lugar => lugar.id !== id);
        // Guardar cambios
        guardarDatos();
        // Actualizar la vista
        cargarLugares();
        cargarRestaurantesUsuario();
    }
} 