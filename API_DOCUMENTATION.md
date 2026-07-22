# API Documentation - ALOA Dog Adoption Platform

## Overview
Esta documentación describe los endpoints de la API para gestionar perros en la plataforma ALOA, incluyendo los nuevos campos educativos para información detallada sobre alimentación, cuidados, comportamiento, juegos y recomendaciones post-adopción.

## Base URL
```
http://localhost:3000/api/dogs
```

## Authentication
Los endpoints POST, PUT y PATCH requieren autenticación JWT. Incluye el token en el header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. GET /api/dogs
Obtener todos los perros registrados.

**Headers:**
- Ninguno requerido

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Max",
    "breedName": "Golden Retriever",
    "age": "3 años",
    "image": "https://res.cloudinary.com/.../dog_image.jpg",
    "category": "Raza Grande",
    "history": "Max fue rescatado de la calle...",
    "status": true,
    "alimentacion": {
      "tipoComida": { "value": "adulto", "label": "Adulto" },
      "porcionesDiarias": { "cantidad": "2.5 tazas", "frecuencia": "2 veces al día" },
      "restriccionesMedicas": {
        "tieneRestricciones": false,
        "detalles": "",
        "alimentosEvitar": []
      },
      "tooltip": "Una alimentación adecuada es fundamental..."
    },
    "cuidadosBasicos": {
      "cepillado": {
        "frecuencia": "3-4 veces por semana",
        "tipoPelo": "Largo y denso",
        "herramientasRecomendadas": ["Cepillo de cerdas suaves", "Peine de dientes finos"]
      },
      "ejercicio": { "nivel": "alto", "minutosDiarios": 60, "tipoActividad": "Caminatas largas" },
      "salud": {
        "vacunasAlDia": true,
        "desparasitacionesAlDia": true,
        "proximaVacuna": "En 6 meses",
        "proximaDesparasitacion": "En 3 meses"
      },
      "aseo": {
        "banioFrecuencia": "Cada 6-8 semanas",
        "corteUñas": "Cada 3-4 semanas",
        "limpiezaOidos": "Semanal",
        "cuidadoDental": "Diario"
      },
      "tooltip": "Los cuidados regulares previenen enfermedades..."
    },
    "comportamiento": {
      "convivenciaNinos": {
        "compatible": true,
        "edadMinima": "5 años",
        "observaciones": "Es muy paciente con niños"
      },
      "relacionPerros": {
        "compatible": true,
        "preferencias": "Le gusta jugar con perros de similar tamaño",
        "observaciones": ""
      },
      "relacionGatos": {
        "compatible": false,
        "observaciones": "No se recomienda convivencia con gatos"
      },
      "nivelEnergia": {
        "valor": "alto",
        "descripcion": "Necesita mucha actividad física diaria"
      },
      "toleranciaSoledad": {
        "horasMaximas": 4,
        "recomendaciones": "No dejar solo más de 4 horas seguidas"
      },
      "tooltip": "Conocer el comportamiento ayuda a encontrar el hogar ideal..."
    },
    "juegosFavoritos": {
      "actividadesPreferidas": [
        { "nombre": "Buscar la pelota", "descripcion": "Le encanta perseguir pelotas", "duracion": "20-30 minutos" }
      ],
      "juguetesRecomendados": [
        { "tipo": "Pelota de goma", "razon": "Resistente y segura", "seguridad": "Supervisar el uso" }
      ],
      "juegosEvitar": ["Juegos de fuerza excesiva"],
      "tooltip": "El juego es esencial para el bienestar del perro..."
    },
    "recomendacionesPostAdopcion": {
      "primerosDias": {
        "periodoAdaptacion": "2-4 semanas",
        "preparacionEspacio": ["Cama cómoda", "Comedero y bebedero", "Zona segura"],
        "rutinasEstablecer": ["Horarios de comida", "Paseos regulares", "Tiempo de descanso"]
      },
      "consejosSemana1": ["Dar espacio para que se adapte", "Establecer rutinas básicas"],
      "consejosSemana2": ["Iniciar entrenamiento básico", "Socializar gradualmente"],
      "consejosSemana3": ["Reforzar vínculo", "Explorar nuevas actividades"],
      "senalesAdaptacion": ["Come normalmente", "Juega activamente", "Descansa tranquilo"],
      "cuandoContactarVeterinario": "Si muestra signos de estrés prolongado o problemas de salud",
      "tooltip": "Los primeros días son cruciales para una adaptación exitosa..."
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 2. GET /api/dogs/:id
Obtener un perro específico por ID.

**Headers:**
- Ninguno requerido

**Parameters:**
- `id` (path parameter): ID del perro (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Max",
  "breedName": "Golden Retriever",
  "age": "3 años",
  "image": "https://res.cloudinary.com/.../dog_image.jpg",
  "category": "Raza Grande",
  "history": "Max fue rescatado de la calle...",
  "status": true,
  "alimentacion": { ... },
  "cuidadosBasicos": { ... },
  "comportamiento": { ... },
  "juegosFavoritos": { ... },
  "recomendacionesPostAdopcion": { ... },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Perro no encontrado"
}
```

---

### 3. POST /api/dogs
Crear un nuevo perro con información educativa completa.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body (form-data):**
- `name` (string, required): Nombre del perro
- `breedName` (string, required): Raza del perro
- `category` (string, required): Categoría ('Raza Pequeña', 'Raza Mediana', 'Raza Grande')
- `history` (string, required): Historia del perro
- `age` (string, optional): Edad del perro
- `image` (file, required): Imagen del perro
- `alimentacion` (object, optional): Información de alimentación
- `cuidadosBasicos` (object, optional): Información de cuidados básicos
- `comportamiento` (object, optional): Información de comportamiento
- `juegosFavoritos` (object, optional): Información de juegos favoritos
- `recomendacionesPostAdopcion` (object, optional): Recomendaciones post-adopción

**Example Request Body (JSON fields):**
```json
{
  "name": "Luna",
  "breedName": "Labrador",
  "category": "Raza Grande",
  "age": "2 años",
  "history": "Luna fue encontrada abandonada en un parque...",
  "alimentacion": {
    "tipoComida": { "value": "adulto", "label": "Adulto" },
    "porcionesDiarias": { "cantidad": "3 tazas", "frecuencia": "2 veces al día" },
    "restriccionesMedicas": {
      "tieneRestricciones": true,
      "detalles": "Alergia al pollo",
      "alimentosEvitar": ["Pollo", "Productos derivados del pollo"]
    },
    "tooltip": "Luna requiere alimentación especial debido a alergias..."
  },
  "cuidadosBasicos": {
    "cepillado": {
      "frecuencia": "Diario",
      "tipoPelo": "Corto y denso",
      "herramientasRecomendadas": ["Cepillo de goma", "Guante de masaje"]
    },
    "ejercicio": { "nivel": "alto", "minutosDiarios": 90, "tipoActividad": "Natación, caminatas" },
    "salud": {
      "vacunasAlDia": true,
      "desparasitacionesAlDia": true,
      "proximaVacuna": "En 4 meses",
      "proximaDesparasitacion": "En 2 meses"
    },
    "aseo": {
      "banioFrecuencia": "Cada 4-6 semanas",
      "corteUñas": "Cada 2-3 semanas",
      "limpiezaOidos": "Semanal",
      "cuidadoDental": "Diario"
    },
    "tooltip": "Luna necesita ejercicio intenso diario..."
  },
  "comportamiento": {
    "convivenciaNinos": {
      "compatible": true,
      "edadMinima": "3 años",
      "observaciones": "Muy cariñosa con niños"
    },
    "relacionPerros": {
      "compatible": true,
      "preferencias": "Le gusta jugar con perros de cualquier tamaño",
      "observaciones": ""
    },
    "relacionGatos": {
      "compatible": true,
      "observaciones": "Convive bien con gatos socializados"
    },
    "nivelEnergia": {
      "valor": "alto",
      "descripcion": "Muy activa, necesita mucho ejercicio"
    },
    "toleranciaSoledad": {
      "horasMaximas": 3,
      "recomendaciones": "No dejar sola más de 3 horas"
    },
    "tooltip": "Luna es sociable y energética..."
  },
  "juegosFavoritos": {
    "actividadesPreferidas": [
      { "nombre": "Nadar", "descripcion": "Le encanta el agua", "duracion": "30-45 minutos" },
      { "nombre": "Buscar objetos", "descripcion": "Juego de buscar pelotas o juguetes", "duracion": "20-30 minutos" }
    ],
    "juguetesRecomendados": [
      { "tipo": "Pelota flotante", "razon": "Ideal para natación", "seguridad": "Material seguro" },
      { "tipo": "Cuerda resistente", "razon": "Para juegos de tira y afloja", "seguridad": "Supervisar uso" }
    ],
    "juegosEvitar": ["Juegos bruscos", "Saltos excesivos"],
    "tooltip": "Luna disfruta mucho actividades acuáticas..."
  },
  "recomendacionesPostAdopcion": {
    "primerosDias": {
      "periodoAdaptacion": "1-2 semanas",
      "preparacionEspacio": ["Zona de descanso tranquila", "Juguetes variados", "Acceso a agua fresca"],
      "rutinasEstablecer": ["Paseos matinales y vespertinos", "Horarios de comida fijos", "Tiempo de juego diario"]
    },
    "consejosSemana1": ["Dar tiempo de adaptación", "Evitar sobreestimulación", "Establecer límites claros"],
    "consejosSemana2": ["Iniciar entrenamiento básico", "Socializar con otros perros", "Reforzar comportamientos positivos"],
    "consejosSemana3": ["Explorar nuevos entornos", "Aumentar actividad física", "Fortalecer vínculo"],
    "senalesAdaptacion": ["Come con normalidad", "Interactúa con la familia", "Descansa tranquila"],
    "cuandoContactarVeterinario": "Si muestra pérdida de apetito, letargo o comportamiento anormal",
    "tooltip": "Luna se adapta rápidamente con rutinas claras..."
  }
}
```

**Response (201 Created):**
```json
{
  "message": "Perro registrado exitosamente",
  "dog": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Luna",
    "breedName": "Labrador",
    "age": "2 años",
    "image": "https://res.cloudinary.com/.../luna_image.jpg",
    "category": "Raza Grande",
    "history": "Luna fue encontrada abandonada en un parque...",
    "status": true,
    "alimentacion": { ... },
    "cuidadosBasicos": { ... },
    "comportamiento": { ... },
    "juegosFavoritos": { ... },
    "recomendacionesPostAdopcion": { ... },
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### 4. PUT /api/dogs/:id
Actualizar completamente un perro existente.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Parameters:**
- `id` (path parameter): ID del perro

**Body:** Same as POST endpoint (all fields, but all optional)

**Response (200 OK):**
```json
{
  "message": "Perro actualizado exitosamente",
  "dog": { ...updated dog object... }
}
```

**Response (404 Not Found):**
```json
{
  "message": "Perro no encontrado"
}
```

---

### 5. PATCH /api/dogs/:id
Actualizar parcialmente un perro existente (solo los campos enviados).

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Parameters:**
- `id` (path parameter): ID del perro

**Body (Example - updating only educational fields):**
```json
{
  "alimentacion": {
    "tipoComida": { "value": "necesidades_especiales", "label": "Necesidades Especiales" },
    "porcionesDiarias": { "cantidad": "2 tazas", "frecuencia": "3 veces al día" },
    "restriccionesMedicas": {
      "tieneRestricciones": true,
      "detalles": "Problemas digestivos",
      "alimentosEvitar": ["Comida grasosa", "Lácteos"]
    },
    "tooltip": "Alimentación especial por condiciones digestivas..."
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Perro actualizado parcialmente",
  "dog": { ...updated dog object... }
}
```

**Response (404 Not Found):**
```json
{
  "message": "Perro no encontrado"
}
```

---

## Data Models

### Educational Fields Structure

#### Alimentación (Nutrition)
```javascript
{
  tipoComida: {
    value: 'cachorro' | 'adulto' | 'necesidades_especiales',
    label: String
  },
  porcionesDiarias: {
    cantidad: String,
    frecuencia: String
  },
  restriccionesMedicas: {
    tieneRestricciones: Boolean,
    detalles: String,
    alimentosEvitar: [String]
  },
  tooltip: String
}
```

#### Cuidados Básicos (Basic Care)
```javascript
{
  cepillado: {
    frecuencia: String,
    tipoPelo: String,
    herramientasRecomendadas: [String]
  },
  ejercicio: {
    nivel: 'bajo' | 'medio' | 'alto',
    minutosDiarios: Number,
    tipoActividad: String
  },
  salud: {
    vacunasAlDia: Boolean,
    desparasitacionesAlDia: Boolean,
    proximaVacuna: String,
    proximaDesparasitacion: String
  },
  aseo: {
    banioFrecuencia: String,
    corteUñas: String,
    limpiezaOidos: String,
    cuidadoDental: String
  },
  tooltip: String
}
```

#### Comportamiento (Behavior)
```javascript
{
  convivenciaNinos: {
    compatible: Boolean,
    edadMinima: String,
    observaciones: String
  },
  relacionPerros: {
    compatible: Boolean,
    preferencias: String,
    observaciones: String
  },
  relacionGatos: {
    compatible: Boolean,
    observaciones: String
  },
  nivelEnergia: {
    valor: 'bajo' | 'medio' | 'alto',
    descripcion: String
  },
  toleranciaSoledad: {
    horasMaximas: Number,
    recomendaciones: String
  },
  tooltip: String
}
```

#### Juegos Favoritos (Favorite Games)
```javascript
{
  actividadesPreferidas: [{
    nombre: String,
    descripcion: String,
    duracion: String
  }],
  juguetesRecomendados: [{
    tipo: String,
    razon: String,
    seguridad: String
  }],
  juegosEvitar: [String],
  tooltip: String
}
```

#### Recomendaciones Post-Adopción (Post-Adoption Recommendations)
```javascript
{
  primerosDias: {
    periodoAdaptacion: String,
    preparacionEspacio: [String],
    rutinasEstablecer: [String]
  },
  consejosSemana1: [String],
  consejosSemana2: [String],
  consejosSemana3: [String],
  senalesAdaptacion: [String],
  cuandoContactarVeterinario: String,
  tooltip: String
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Error de validación",
  "error": "Detalles del error de validación"
}
```

### 401 Unauthorized
```json
{
  "message": "Token no válido o expirado"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error al procesar la solicitud",
  "error": "Detalle del error"
}
```

---

## Migration Script

Para migrar perros existentes a la nueva estructura con campos educativos vacíos:

```bash
node scripts/migrate_educational_fields.js
```

Este script:
- Busca perros sin los nuevos campos educativos
- Agrega los campos con valores por defecto
- Mantiene la compatibilidad con datos existentes
- Reporta el progreso de la migración

---

## Notes

- Todos los campos educativos son **opcionales** para mantener backward compatibility
- Los valores por defecto se establecen automáticamente si no se proporcionan
- Las validaciones de enums aseguran que solo se acepten valores válidos
- Los arrays pueden estar vacíos si no hay información disponible
- Los campos de texto pueden ser strings vacíos si no hay datos

---

## Rate Limiting

- **Public endpoints** (GET): Limitado a X requests por minuto
- **Authenticated endpoints** (POST, PUT, PATCH): Limitado a Y requests por minuto

---

## Version

- API Version: 1.0.0
- Last Updated: January 2024
