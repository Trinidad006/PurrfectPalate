// Estructura de datos inicial
let data = {
    recetas: [
        {
            id: 1,
            titulo: "Tarta de Manzana Clásica",
            descripcion: "Una deliciosa tarta de manzana con canela y azúcar moreno",
            imagen: "img/recetas/tarta-manzana.jpg",
            categoria: "Postres",
            tiempoPreparacion: "1 hora",
            dificultad: "Media",
            ingredientes: [
                "500g de manzanas",
                "200g de harina",
                "100g de mantequilla",
                "100g de azúcar",
                "1 huevo",
                "Canela al gusto"
            ],
            pasos: [
                "Precalentar el horno a 180°C",
                "Mezclar la harina con la mantequilla",
                "Añadir el azúcar y el huevo",
                "Pelar y cortar las manzanas",
                "Colocar las manzanas en la masa",
                "Hornear durante 45 minutos"
            ],
            etiquetas: ["postre", "dulce", "horneado"],
            likes: 120,
            comentarios: [],
            autor: "Ana García"
        },
        {
            id: 2,
            titulo: "Ensalada Mediterránea",
            descripcion: "Una fresca ensalada con ingredientes típicos del Mediterráneo",
            imagen: "img/recetas/ensalada-mediterranea.jpg",
            categoria: "Ensaladas",
            tiempoPreparacion: "20 minutos",
            dificultad: "Fácil",
            ingredientes: [
                "Lechuga",
                "Tomates cherry",
                "Pepino",
                "Aceitunas negras",
                "Queso feta",
                "Aceite de oliva"
            ],
            pasos: [
                "Lavar y cortar la lechuga",
                "Cortar los tomates por la mitad",
                "Pelar y cortar el pepino",
                "Mezclar todos los ingredientes",
                "Aderezar con aceite de oliva"
            ],
            etiquetas: ["ensalada", "saludable", "fresco"],
            likes: 85,
            comentarios: [],
            autor: "Carlos Ruiz"
        }
    ],
    lugares: [
        {
            id: 1,
            nombre: "La Cocina de María",
            direccion: "Calle Principal 123",
            descripcion: "Restaurante familiar con cocina casera tradicional",
            imagen: "img/lugares/la-cocina-maria.jpg",
            categoria: "Restaurante",
            precio: "€€",
            horario: "L-V: 12:00-23:00",
            telefono: "555-0123",
            valoracion: 4.5,
            reseñas: [
                {
                    usuario: "Ana García",
                    texto: "Excelente comida casera",
                    valoracion: 5,
                    fecha: "2024-03-15"
                }
            ],
            etiquetas: ["casero", "tradicional", "familiar"]
        },
        {
            id: 2,
            nombre: "Sushi Express",
            direccion: "Avenida Central 456",
            descripcion: "Sushi fresco y auténtico a precios accesibles",
            imagen: "img/lugares/sushi-express.jpg",
            categoria: "Restaurante",
            precio: "€€",
            horario: "L-D: 11:00-22:00",
            telefono: "555-0456",
            valoracion: 4.8,
            reseñas: [
                {
                    usuario: "Carlos Ruiz",
                    texto: "El mejor sushi de la ciudad",
                    valoracion: 5,
                    fecha: "2024-03-14"
                }
            ],
            etiquetas: ["japonés", "sushi", "fresco"]
        }
    ],
    categorias: [
        {
            id: 1,
            nombre: "Postres",
            icono: "fas fa-cake-candles"
        },
        {
            id: 2,
            nombre: "Almuerzos",
            icono: "fas fa-utensils"
        },
        {
            id: 3,
            nombre: "Desayunos",
            icono: "fas fa-coffee"
        },
        {
            id: 4,
            nombre: "Cenas",
            icono: "fas fa-moon"
        },
        {
            id: 5,
            nombre: "Bebidas",
            icono: "fas fa-glass-martini-alt"
        }
    ],
    usuarios: []
};

// Funciones para manejar las recetas
function agregarReceta(nuevaReceta) {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para agregar una receta');
        return null;
    }

    // Encontrar el ID más alto actual y sumar 1
    const maxId = data.recetas.reduce((max, receta) => Math.max(max, receta.id), 0);
    nuevaReceta.id = maxId + 1;
    
    nuevaReceta.likes = 0;
    nuevaReceta.comentarios = [];
    nuevaReceta.etiquetas = nuevaReceta.etiquetas || [];
    nuevaReceta.ingredientes = nuevaReceta.ingredientes || [];
    nuevaReceta.pasos = nuevaReceta.pasos || [];
    nuevaReceta.imagen = nuevaReceta.imagen || 'img/recetas/default-recipe.jpg';
    nuevaReceta.autor = usuarioActual.nombre;
    
    data.recetas.push(nuevaReceta);
    guardarDatos();
    actualizarInterfaz(); // Actualizar la interfaz inmediatamente
    return nuevaReceta;
}

function guardarDatos() {
    try {
        // Asegurarse de que los arrays de comentarios y reseñas existan
        data.recetas.forEach(receta => {
            if (!Array.isArray(receta.comentarios)) {
                receta.comentarios = [];
            }
        });
        
        data.lugares.forEach(lugar => {
            if (!Array.isArray(lugar.reseñas)) {
                lugar.reseñas = [];
            }
        });

        localStorage.setItem('purrfectPalateData', JSON.stringify(data));
        console.log('Datos guardados correctamente:', data);
    } catch (error) {
        console.error('Error al guardar datos:', error);
    }
}

function cargarDatos() {
    try {
        const datosGuardados = localStorage.getItem('purrfectPalateData');
        if (datosGuardados) {
            data = JSON.parse(datosGuardados);
            inicializarArrays(); // Inicializar arrays después de cargar los datos
            console.log('Datos cargados correctamente:', data);
        } else {
            console.log('No hay datos guardados, usando datos iniciales');
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

// Funciones para manejar usuarios
function agregarUsuario(usuario) {
    try {
        data.usuarios.push(usuario);
        guardarDatos();
        console.log('Usuario agregado:', usuario);
    } catch (error) {
        console.error('Error al agregar usuario:', error);
    }
}

function buscarUsuario(email) {
    return data.usuarios.find(usuario => usuario.email === email);
}

function verificarCredenciales(email, password) {
    const usuario = buscarUsuario(email);
    if (usuario && usuario.password === password) {
        console.log('Credenciales verificadas correctamente');
        return true;
    }
    console.log('Credenciales incorrectas');
    return false;
}

// Función para verificar datos guardados
function verificarDatosGuardados() {
    const datosGuardados = localStorage.getItem('purrfectPalateData');
    console.log('Datos guardados en localStorage:', datosGuardados);
    
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        console.log('Usuarios registrados:', datos.usuarios);
        console.log('Recetas guardadas:', datos.recetas);
    } else {
        console.log('No hay datos guardados en localStorage');
    }
}

// Funciones para manejar los lugares
function agregarLugar(nuevoLugar) {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para agregar un lugar');
        return null;
    }

    // Encontrar el ID más alto actual y sumar 1
    const maxId = data.lugares.reduce((max, lugar) => Math.max(max, lugar.id), 0);
    nuevoLugar.id = maxId + 1;
    
    nuevoLugar.valoracion = 0;
    nuevoLugar.reseñas = [];
    nuevoLugar.etiquetas = nuevoLugar.etiquetas || [];
    nuevoLugar.imagen = nuevoLugar.imagen || 'img/lugares/default-restaurant.jpg';
    nuevoLugar.autor = usuarioActual.nombre;
    
    data.lugares.push(nuevoLugar);
    guardarDatos();
    actualizarInterfaz(); // Actualizar la interfaz inmediatamente
    return nuevoLugar;
}

// Asegurarse de que todos los elementos tengan sus arrays inicializados
function inicializarArrays() {
    data.recetas.forEach(receta => {
        if (!Array.isArray(receta.comentarios)) {
            receta.comentarios = [];
        }
        if (!Array.isArray(receta.etiquetas)) {
            receta.etiquetas = [];
        }
        if (!Array.isArray(receta.ingredientes)) {
            receta.ingredientes = [];
        }
        if (!Array.isArray(receta.pasos)) {
            receta.pasos = [];
        }
    });

    data.lugares.forEach(lugar => {
        if (!Array.isArray(lugar.reseñas)) {
            lugar.reseñas = [];
        }
        if (!Array.isArray(lugar.etiquetas)) {
            lugar.etiquetas = [];
        }
    });
}

// Función para agregar/remover de favoritos
function toggleFavorito(tipo, id) {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para agregar a favoritos');
        return false;
    }

    // Asegurarse de que el usuario tenga la estructura de favoritos
    if (!usuarioActual.favoritos) {
        usuarioActual.favoritos = {
            recetas: [],
            restaurantes: []
        };
    }

    const lista = tipo === 'recetas' ? usuarioActual.favoritos.recetas : usuarioActual.favoritos.restaurantes;
    const index = lista.indexOf(id);

    if (index === -1) {
        lista.push(id);
        alert('Agregado a favoritos');
    } else {
        lista.splice(index, 1);
        alert('Removido de favoritos');
    }

    // Actualizar el usuario en el array de usuarios
    const usuarioIndex = data.usuarios.findIndex(u => u.email === usuarioActual.email);
    if (usuarioIndex !== -1) {
        data.usuarios[usuarioIndex] = usuarioActual;
        guardarDatos();
        
        // Actualizar solo la vista del perfil si está abierto
        const modalPerfil = document.getElementById('perfilModal');
        if (modalPerfil && modalPerfil.classList.contains('show')) {
            const modalContent = document.getElementById('perfilModalContent');
            if (modalContent) {
                const favoritosRecetas = modalContent.querySelector('.favoritos-recetas');
                const favoritosRestaurantes = modalContent.querySelector('.favoritos-restaurantes');
                
                if (favoritosRecetas) {
                    const recetasFavoritas = data.recetas.filter(r => 
                        usuarioActual.favoritos.recetas.includes(r.id)
                    );
                    
                    if (recetasFavoritas.length === 0) {
                        favoritosRecetas.innerHTML = '<h4>Recetas Favoritas</h4><p>No tienes recetas favoritas</p>';
                    } else {
                        favoritosRecetas.innerHTML = `
                            <h4>Recetas Favoritas</h4>
                            ${data.categorias.map(categoria => {
                                const recetasCategoria = recetasFavoritas.filter(r => r.categoria === categoria.nombre);
                                return recetasCategoria.length > 0 ? `
                                    <div class="categoria-favoritos mb-3">
                                        <h5><i class="${categoria.icono}"></i> ${categoria.nombre}</h5>
                                        <div class="list-group">
                                            ${recetasCategoria.map(r => `
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
                            }).join('')}
                        `;
                    }
                }

                if (favoritosRestaurantes) {
                    const restaurantesFavoritos = data.lugares.filter(l => 
                        usuarioActual.favoritos.restaurantes.includes(l.id)
                    );
                    
                    if (restaurantesFavoritos.length === 0) {
                        favoritosRestaurantes.innerHTML = '<h4>Restaurantes Favoritos</h4><p>No tienes restaurantes favoritos</p>';
                    } else {
                        favoritosRestaurantes.innerHTML = `
                            <h4>Restaurantes Favoritos</h4>
                            ${restaurantesFavoritos.map(l => `
                                <div class="list-group-item d-flex justify-content-between align-items-center">
                                    <span>${l.nombre}</span>
                                    <button onclick="toggleFavorito('restaurantes', ${l.id})" class="btn btn-sm btn-outline-danger">
                                        <i class="fas fa-trash"></i> Quitar de favoritos
                                    </button>
                                </div>
                            `).join('')}
                        `;
                    }
                }
            }
        }
    }

    return true;
}

// Función para dar/remover me gusta
function toggleMeGusta(tipo, id) {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para dar me gusta');
        return;
    }

    let item;
    if (tipo === 'receta') {
        item = data.recetas.find(r => r.id === id);
        if (item) {
            item.likes = (item.likes || 0) + 1;
        }
    } else if (tipo === 'lugar') {
        item = data.lugares.find(l => l.id === id);
        if (item) {
            item.valoracion = (item.valoracion || 0) + 1;
        }
    }

    if (item) {
        guardarDatos();
        actualizarInterfaz();
    }
}

// Función para agregar comentario
function agregarComentario(tipo, id, texto) {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para comentar');
        return;
    }

    let item;
    let comentarios;
    if (tipo === 'receta') {
        item = data.recetas.find(r => r.id === id);
        if (item) {
            if (!Array.isArray(item.comentarios)) {
                item.comentarios = [];
            }
            item.comentarios.push({
                usuario: usuarioActual.email,
                texto: texto,
                fecha: new Date().toISOString()
            });
            comentarios = item.comentarios;
            console.log('Comentario agregado a receta:', item.comentarios);
        }
    } else if (tipo === 'lugar') {
        item = data.lugares.find(l => l.id === id);
        if (item) {
            if (!Array.isArray(item.reseñas)) {
                item.reseñas = [];
            }
            item.reseñas.push({
                usuario: usuarioActual.email,
                texto: texto,
                fecha: new Date().toISOString()
            });
            comentarios = item.reseñas;
            console.log('Reseña agregada a lugar:', item.reseñas);
        }
    }

    if (item) {
        guardarDatos();
        actualizarInterfaz();
        
        // Actualizar la vista de comentarios en el modal
        const modalId = tipo === 'receta' ? 'detallesRecetaModal' : 'detallesLugarModal';
        const modalContent = document.getElementById(modalId + 'Content');
        if (modalContent) {
            const comentariosLista = modalContent.querySelector('.comentarios-lista');
            if (comentariosLista) {
                // Limpiar el mensaje de "No hay comentarios" si existe
                if (comentariosLista.innerHTML === '<p>No hay comentarios aún</p>') {
                    comentariosLista.innerHTML = '';
                }
                
                // Crear el nuevo comentario
                const nuevoComentario = document.createElement('div');
                nuevoComentario.className = 'comentario p-3 border-bottom';
                nuevoComentario.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <p class="mb-1">${texto}</p>
                            <small class="text-muted">${new Date().toLocaleDateString()}</small>
                        </div>
                        <button onclick="eliminarComentario('${tipo}', ${id}, ${comentarios.length - 1})" class="btn btn-sm btn-outline-danger">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Insertar el nuevo comentario al principio de la lista
                comentariosLista.insertBefore(nuevoComentario, comentariosLista.firstChild);
                
                // Limpiar el formulario
                const form = modalContent.querySelector('form');
                if (form) {
                    form.reset();
                }
            }
        }
    }
}

// Función para eliminar comentario
function eliminarComentario(tipo, id, indexComentario) {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para eliminar comentarios');
        return;
    }

    let item;
    if (tipo === 'receta') {
        item = data.recetas.find(r => r.id === id);
        if (item && item.comentarios[indexComentario].usuario === usuarioActual.email) {
            item.comentarios.splice(indexComentario, 1);
        }
    } else if (tipo === 'lugar') {
        item = data.lugares.find(l => l.id === id);
        if (item && item.reseñas[indexComentario].usuario === usuarioActual.email) {
            item.reseñas.splice(indexComentario, 1);
        }
    }

    if (item) {
        guardarDatos();
        actualizarInterfaz();
        
        // Encontrar y eliminar el elemento del comentario del DOM
        const modalId = tipo === 'receta' ? 'detallesRecetaModal' : 'detallesLugarModal';
        const modalContent = document.getElementById(modalId + 'Content');
        if (modalContent) {
            const comentariosLista = modalContent.querySelector('.comentarios-lista');
            if (comentariosLista) {
                const comentarios = comentariosLista.querySelectorAll('.comentario');
                if (comentarios[indexComentario]) {
                    comentarios[indexComentario].remove();
                }
                
                // Si no hay más comentarios, mostrar mensaje
                if (comentariosLista.children.length === 0) {
                    comentariosLista.innerHTML = '<p>No hay comentarios aún</p>';
                }
            }
        }
    }
}

function actualizarInterfaz() {
    // Actualizar la vista de recetas
    const recetasContainer = document.getElementById('recetasContainer');
    if (recetasContainer) {
        recetasContainer.innerHTML = '';
        data.recetas.forEach(receta => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${receta.imagen}" class="card-img-top" alt="${receta.titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${receta.titulo}</h5>
                        <p class="card-text">${receta.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">${receta.categoria}</span>
                            <div>
                                <button onclick="toggleMeGusta('receta', ${receta.id})" class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-heart"></i> ${receta.likes || 0}
                                </button>
                                <button onclick="toggleFavorito('recetas', ${receta.id})" class="btn btn-outline-warning btn-sm">
                                    <i class="fas fa-star"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mt-3">
                            <button onclick="verDetallesReceta(${receta.id})" class="btn btn-primary w-100">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
            recetasContainer.appendChild(card);
        });
    }

    // Actualizar la vista de lugares
    const lugaresContainer = document.getElementById('lugaresContainer');
    if (lugaresContainer) {
        lugaresContainer.innerHTML = '';
        data.lugares.forEach(lugar => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${lugar.imagen}" class="card-img-top" alt="${lugar.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${lugar.nombre}</h5>
                        <p class="card-text">${lugar.descripcion}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">${lugar.categoria}</span>
                            <div>
                                <button onclick="toggleMeGusta('lugar', ${lugar.id})" class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-heart"></i> ${lugar.valoracion || 0}
                                </button>
                                <button onclick="toggleFavorito('restaurantes', ${lugar.id})" class="btn btn-outline-warning btn-sm">
                                    <i class="fas fa-star"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mt-3">
                            <button onclick="verDetallesLugar(${lugar.id})" class="btn btn-primary w-100">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
            lugaresContainer.appendChild(card);
        });
    }
}

// Cargar datos al iniciar
cargarDatos();
verificarDatosGuardados();

// Función para eliminar receta
function eliminarReceta(id) {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para eliminar una receta');
        return;
    }

    const receta = data.recetas.find(r => r.id === id);
    if (!receta) {
        alert('Receta no encontrada');
        return;
    }

    if (receta.autor !== usuarioActual.nombre) {
        alert('No tienes permiso para eliminar esta receta');
        return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
        data.recetas = data.recetas.filter(r => r.id !== id);
        guardarDatos();
        actualizarInterfaz();
        alert('Receta eliminada correctamente');
    }
}

// Función para eliminar lugar
function eliminarLugar(id) {
    if (!usuarioActual) {
        alert('Debes iniciar sesión para eliminar un lugar');
        return;
    }

    const lugar = data.lugares.find(l => l.id === id);
    if (!lugar) {
        alert('Lugar no encontrado');
        return;
    }

    if (lugar.autor !== usuarioActual.nombre) {
        alert('No tienes permiso para eliminar este lugar');
        return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este lugar?')) {
        data.lugares = data.lugares.filter(l => l.id !== id);
        guardarDatos();
        actualizarInterfaz();
        alert('Lugar eliminado correctamente');
    }
} 