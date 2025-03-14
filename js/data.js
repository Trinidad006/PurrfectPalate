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
            comentarios: 15,
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
            comentarios: 10,
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
    nuevaReceta.id = data.recetas.length + 1;
    nuevaReceta.likes = 0;
    nuevaReceta.comentarios = 0;
    data.recetas.push(nuevaReceta);
    guardarDatos();
    return nuevaReceta;
}

function guardarDatos() {
    try {
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
    try {
        nuevoLugar.id = data.lugares.length + 1;
        data.lugares.push(nuevoLugar);
        guardarDatos();
        console.log('Lugar agregado:', nuevoLugar);
    } catch (error) {
        console.error('Error al agregar lugar:', error);
    }
}

// Cargar datos al iniciar
cargarDatos();
verificarDatosGuardados(); 