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

    // Escuchar el evento de comentario agregado
    document.addEventListener('comentarioAgregado', (e) => {
        const { tipo, id } = e.detail;
        if (tipo === 'receta') {
            verDetallesReceta(id);
        } else if (tipo === 'lugar') {
            verDetallesLugar(id);
        }
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
                        <i class="fas fa-comment"></i> ${Array.isArray(receta.comentarios) ? receta.comentarios.length : receta.comentarios}
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
        alergias: Array.from(formData.getAll('alergias')),
        favoritos: {
            recetas: [],
            restaurantes: []
        }
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
        alert('Receta no encontrada');
        return;
    }

    const modalContent = document.getElementById('detallesRecetaModalContent');
    modalContent.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">${receta.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${receta.imagen}" alt="${receta.titulo}" class="img-fluid mb-3">
                <p>${receta.descripcion}</p>
                <div class="receta-meta">
                    <span><i class="fas fa-clock"></i> ${receta.tiempoPreparacion}</span>
                    <span><i class="fas fa-signal"></i> ${receta.dificultad}</span>
                </div>
                <h3>Ingredientes:</h3>
                <ul>
                    ${receta.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                <h3>Pasos:</h3>
                <ol>
                    ${receta.pasos.map(paso => `<li>${paso}</li>`).join('')}
                </ol>
                <div class="receta-interacciones">
                    <button onclick="toggleMeGusta('receta', ${receta.id})" class="btn btn-outline-danger">
                        <i class="fas fa-heart"></i> ${receta.likes || 0}
                    </button>
                    <button onclick="toggleFavorito('recetas', ${receta.id})" class="btn btn-outline-warning">
                        <i class="fas fa-star"></i>
                    </button>
                    ${receta.autor === usuarioActual?.nombre ? `
                        <button onclick="eliminarReceta(${receta.id})" class="btn btn-outline-danger">
                            <i class="fas fa-trash"></i> Eliminar Receta
                        </button>
                    ` : ''}
                </div>
                <div class="comentarios mt-4">
                    <h3>Comentarios</h3>
                    <div class="comentarios-lista">
                        ${Array.isArray(receta.comentarios) && receta.comentarios.length > 0 
                            ? receta.comentarios.map((com, index) => `
                                <div class="comentario p-3 border-bottom">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <p class="mb-1">${com.texto}</p>
                                            <small class="text-muted">${new Date(com.fecha).toLocaleDateString()}</small>
                                        </div>
                                        ${com.usuario === usuarioActual?.email ? `
                                            <button onclick="eliminarComentario('receta', ${receta.id}, ${index})" class="btn btn-sm btn-outline-danger">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('') 
                            : '<p>No hay comentarios aún</p>'}
                    </div>
                    <form onsubmit="event.preventDefault(); agregarComentario('receta', ${receta.id}, this.comentario.value); this.reset();" class="mt-3">
                        <div class="mb-3">
                            <textarea name="comentario" class="form-control" placeholder="Escribe un comentario..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Comentar</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('detallesRecetaModal'));
    modal.show();
}

function verDetallesLugar(id) {
    const lugar = data.lugares.find(l => l.id === id);
    if (!lugar) {
        alert('Lugar no encontrado');
        return;
    }

    const modalContent = document.getElementById('detallesLugarModalContent');
    modalContent.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">${lugar.nombre}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${lugar.imagen}" alt="${lugar.nombre}" class="img-fluid mb-3">
                <p>${lugar.descripcion}</p>
                <div class="lugar-meta">
                    <span><i class="fas fa-utensils"></i> ${lugar.categoria}</span>
                    <span><i class="fas fa-dollar-sign"></i> ${lugar.precio}</span>
                    <span><i class="fas fa-clock"></i> ${lugar.horario}</span>
                </div>
                <p><strong><i class="fas fa-map-marker-alt"></i> Dirección:</strong> ${lugar.direccion}</p>
                <p><strong><i class="fas fa-phone"></i> Teléfono:</strong> ${lugar.telefono}</p>
                ${lugar.menu ? `<h3>Menú:</h3><p>${lugar.menu}</p>` : ''}
                <div class="lugar-interacciones">
                    <button onclick="toggleMeGusta('lugar', ${lugar.id})" class="btn btn-outline-danger">
                        <i class="fas fa-heart"></i> ${lugar.valoracion || 0}
                    </button>
                    <button onclick="toggleFavorito('restaurantes', ${lugar.id})" class="btn btn-outline-warning">
                        <i class="fas fa-star"></i>
                    </button>
                    ${lugar.autor === usuarioActual?.nombre ? `
                        <button onclick="eliminarLugar(${lugar.id})" class="btn btn-outline-danger">
                            <i class="fas fa-trash"></i> Eliminar Lugar
                        </button>
                    ` : ''}
                </div>
                <div class="comentarios mt-4">
                    <h3>Reseñas</h3>
                    <div class="comentarios-lista">
                        ${Array.isArray(lugar.reseñas) && lugar.reseñas.length > 0
                            ? lugar.reseñas.map((reseña, index) => `
                                <div class="comentario p-3 border-bottom">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <p class="mb-1">${reseña.texto}</p>
                                            <small class="text-muted">${new Date(reseña.fecha).toLocaleDateString()}</small>
                                        </div>
                                        ${reseña.usuario === usuarioActual?.email ? `
                                            <button onclick="eliminarComentario('lugar', ${lugar.id}, ${index})" class="btn btn-sm btn-outline-danger">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('')
                            : '<p>No hay reseñas aún</p>'}
                    </div>
                    <form onsubmit="event.preventDefault(); agregarComentario('lugar', ${lugar.id}, this.comentario.value); this.reset();" class="mt-3">
                        <div class="mb-3">
                            <textarea name="comentario" class="form-control" placeholder="Escribe una reseña..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Comentar</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('detallesLugarModal'));
    modal.show();
}

function mostrarPerfil() {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para ver tu perfil');
        return;
    }

    const modalContent = document.getElementById('perfilModalContent');
    modalContent.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Mi Perfil</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="perfil-info">
                    <p><strong>Nombre:</strong> ${usuarioActual.nombre}</p>
                    <p><strong>Email:</strong> ${usuarioActual.email}</p>
                    <p><strong>Preferencias:</strong> ${usuarioActual.preferencias ? usuarioActual.preferencias.join(', ') : 'Ninguna'}</p>
                    <p><strong>Alergias:</strong> ${usuarioActual.alergias ? usuarioActual.alergias.join(', ') : 'Ninguna'}</p>
                </div>
                <div class="favoritos mt-4">
                    <h3>Mis Favoritos</h3>
                    <div class="favoritos-recetas">
                        <h4>Recetas Favoritas</h4>
                        ${usuarioActual.favoritos && usuarioActual.favoritos.recetas && usuarioActual.favoritos.recetas.length > 0 
                            ? data.categorias.map(categoria => {
                                const recetasFavoritas = data.recetas.filter(r => 
                                    usuarioActual.favoritos.recetas.includes(r.id) && 
                                    r.categoria === categoria.nombre
                                );
                                return recetasFavoritas.length > 0 ? `
                                    <div class="categoria-favoritos mb-3">
                                        <h5><i class="${categoria.icono}"></i> ${categoria.nombre}</h5>
                                        <div class="list-group">
                                            ${recetasFavoritas.map(r => `
                                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                                    <span>${r.titulo}</span>
                                                    <button onclick="toggleFavorito('recetas', ${r.id})" class="btn btn-sm btn-outline-danger">
                                                        <i class="fas fa-trash"></i> Quitar de favoritos
                                                    </button>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : '';
                            }).join('')
                            : '<p>No tienes recetas favoritas</p>'}
                    </div>
                    <div class="favoritos-restaurantes mt-4">
                        <h4>Restaurantes Favoritos</h4>
                        ${usuarioActual.favoritos && usuarioActual.favoritos.restaurantes && usuarioActual.favoritos.restaurantes.length > 0
                            ? data.lugares.filter(l => usuarioActual.favoritos.restaurantes.includes(l.id))
                                .map(l => `
                                    <div class="list-group-item d-flex justify-content-between align-items-center">
                                        <span>${l.nombre}</span>
                                        <button onclick="toggleFavorito('restaurantes', ${l.id})" class="btn btn-sm btn-outline-danger">
                                            <i class="fas fa-trash"></i> Quitar de favoritos
                                        </button>
                                    </div>
                                `).join('')
                            : '<p>No tienes restaurantes favoritos</p>'}
                    </div>
                </div>
                <button onclick="cerrarSesion()" class="btn btn-danger mt-3">Cerrar Sesión</button>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('perfilModal'));
    modal.show();
}

function actualizarUIUsuario() {
    const btnLogin = document.getElementById('btnLogin');
    const btnRegistro = document.getElementById('btnRegistro');
    const btnPublicarReceta = document.getElementById('btnPublicarReceta');
    const btnRegistrarNegocio = document.getElementById('btnRegistrarNegocio');

    if (usuarioActual) {
        btnLogin.textContent = 'Mi Perfil';
        btnRegistro.style.display = 'none';
        btnPublicarReceta.style.display = 'block';
        btnRegistrarNegocio.style.display = 'block';
    } else {
        btnLogin.textContent = 'Iniciar Sesión';
        btnRegistro.style.display = 'block';
        btnPublicarReceta.style.display = 'none';
        btnRegistrarNegocio.style.display = 'none';
    }
}

function cerrarSesion() {
    usuarioActual = null;
    actualizarUIUsuario();
    const modal = bootstrap.Modal.getInstance(document.getElementById('perfilModal'));
    if (modal) {
        modal.hide();
    }
    alert('Sesión cerrada');
}

function mostrarFormularioReceta() {
    const modal = document.getElementById('formularioRecetaModal');
    const modalContent = document.getElementById('formularioRecetaModalContent');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Agregar Nueva Receta</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="formularioReceta" onsubmit="guardarReceta(event)">
                <div class="mb-3">
                    <label for="tituloReceta" class="form-label">Título</label>
                    <input type="text" class="form-control" id="tituloReceta" required>
                </div>
                <div class="mb-3">
                    <label for="descripcionReceta" class="form-label">Descripción</label>
                    <textarea class="form-control" id="descripcionReceta" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="imagenReceta" class="form-label">Imagen de la Receta</label>
                    <input type="file" class="form-control" id="imagenReceta" accept="image/*" required>
                    <div id="previewImagenReceta" class="mt-2"></div>
                </div>
                <div class="mb-3">
                    <label for="categoriaReceta" class="form-label">Categoría</label>
                    <select class="form-select" id="categoriaReceta" required>
                        ${data.categorias.map(cat => `<option value="${cat.nombre}">${cat.nombre}</option>`).join('')}
                    </select>
                </div>
                <div class="mb-3">
                    <label for="tiempoPreparacion" class="form-label">Tiempo de Preparación</label>
                    <input type="text" class="form-control" id="tiempoPreparacion" required>
                </div>
                <div class="mb-3">
                    <label for="dificultad" class="form-label">Dificultad</label>
                    <select class="form-select" id="dificultad" required>
                        <option value="Fácil">Fácil</option>
                        <option value="Media">Media</option>
                        <option value="Difícil">Difícil</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="ingredientes" class="form-label">Ingredientes (uno por línea)</label>
                    <textarea class="form-control" id="ingredientes" rows="5" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="pasos" class="form-label">Pasos (uno por línea)</label>
                    <textarea class="form-control" id="pasos" rows="5" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="etiquetas" class="form-label">Etiquetas (separadas por comas)</label>
                    <input type="text" class="form-control" id="etiquetas">
                </div>
                <button type="submit" class="btn btn-primary">Guardar Receta</button>
            </form>
        </div>
    `;

    // Agregar evento para previsualizar la imagen
    const inputImagen = document.getElementById('imagenReceta');
    const previewImagen = document.getElementById('previewImagenReceta');
    
    inputImagen.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImagen.innerHTML = `<img src="${e.target.result}" class="img-thumbnail" style="max-height: 200px;">`;
            }
            reader.readAsDataURL(file);
        }
    });

    modal.classList.add('show');
    modal.style.display = 'block';
}

function guardarReceta(event) {
    event.preventDefault();
    
    const imagenInput = document.getElementById('imagenReceta');
    const imagenFile = imagenInput.files[0];
    
    if (!imagenFile) {
        alert('Por favor, selecciona una imagen para la receta');
        return;
    }

    // Convertir la imagen a base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const nuevaReceta = {
            titulo: document.getElementById('tituloReceta').value,
            descripcion: document.getElementById('descripcionReceta').value,
            imagen: e.target.result, // Guardamos la imagen en base64
            categoria: document.getElementById('categoriaReceta').value,
            tiempoPreparacion: document.getElementById('tiempoPreparacion').value,
            dificultad: document.getElementById('dificultad').value,
            ingredientes: document.getElementById('ingredientes').value.split('\n').filter(i => i.trim()),
            pasos: document.getElementById('pasos').value.split('\n').filter(p => p.trim()),
            etiquetas: document.getElementById('etiquetas').value.split(',').map(e => e.trim()).filter(e => e)
        };

        if (agregarReceta(nuevaReceta)) {
            const modal = document.getElementById('formularioRecetaModal');
            modal.classList.remove('show');
            modal.style.display = 'none';
            alert('Receta agregada correctamente');
        }
    };
    reader.readAsDataURL(imagenFile);
}

function mostrarFormularioLugar() {
    const modal = document.getElementById('formularioLugarModal');
    const modalContent = document.getElementById('formularioLugarModalContent');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h5 class="modal-title">Agregar Nuevo Lugar</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="formularioLugar" onsubmit="guardarLugar(event)">
                <div class="mb-3">
                    <label for="nombreLugar" class="form-label">Nombre del Lugar</label>
                    <input type="text" class="form-control" id="nombreLugar" required>
                </div>
                <div class="mb-3">
                    <label for="descripcionLugar" class="form-label">Descripción</label>
                    <textarea class="form-control" id="descripcionLugar" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="imagenLugar" class="form-label">Imagen del Lugar</label>
                    <input type="file" class="form-control" id="imagenLugar" accept="image/*" required>
                    <div id="previewImagenLugar" class="mt-2"></div>
                </div>
                <div class="mb-3">
                    <label for="categoriaLugar" class="form-label">Categoría</label>
                    <select class="form-select" id="categoriaLugar" required>
                        <option value="Restaurante">Restaurante</option>
                        <option value="Café">Café</option>
                        <option value="Bar">Bar</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="precio" class="form-label">Rango de Precio</label>
                    <select class="form-select" id="precio" required>
                        <option value="€">€ (Económico)</option>
                        <option value="€€">€€ (Medio)</option>
                        <option value="€€€">€€€ (Alto)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="horario" class="form-label">Horario</label>
                    <input type="text" class="form-control" id="horario" required>
                </div>
                <div class="mb-3">
                    <label for="telefono" class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" id="telefono" required>
                </div>
                <div class="mb-3">
                    <label for="direccion" class="form-label">Dirección</label>
                    <input type="text" class="form-control" id="direccion" required>
                </div>
                <div class="mb-3">
                    <label for="etiquetasLugar" class="form-label">Etiquetas (separadas por comas)</label>
                    <input type="text" class="form-control" id="etiquetasLugar">
                </div>
                <button type="submit" class="btn btn-primary">Guardar Lugar</button>
            </form>
        </div>
    `;

    // Agregar evento para previsualizar la imagen
    const inputImagen = document.getElementById('imagenLugar');
    const previewImagen = document.getElementById('previewImagenLugar');
    
    inputImagen.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImagen.innerHTML = `<img src="${e.target.result}" class="img-thumbnail" style="max-height: 200px;">`;
            }
            reader.readAsDataURL(file);
        }
    });

    modal.classList.add('show');
    modal.style.display = 'block';
}

function guardarLugar(event) {
    event.preventDefault();
    
    const imagenInput = document.getElementById('imagenLugar');
    const imagenFile = imagenInput.files[0];
    
    if (!imagenFile) {
        alert('Por favor, selecciona una imagen para el lugar');
        return;
    }

    // Convertir la imagen a base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const nuevoLugar = {
            nombre: document.getElementById('nombreLugar').value,
            descripcion: document.getElementById('descripcionLugar').value,
            imagen: e.target.result, // Guardamos la imagen en base64
            categoria: document.getElementById('categoriaLugar').value,
            precio: document.getElementById('precio').value,
            horario: document.getElementById('horario').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            etiquetas: document.getElementById('etiquetasLugar').value.split(',').map(e => e.trim()).filter(e => e)
        };

        if (agregarLugar(nuevoLugar)) {
            const modal = document.getElementById('formularioLugarModal');
            modal.classList.remove('show');
            modal.style.display = 'none';
            alert('Lugar agregado correctamente');
        }
    };
    reader.readAsDataURL(imagenFile);
}