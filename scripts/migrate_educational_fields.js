import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dog from '../src/dogs/dog.model.js';

dotenv.config();

const defaultEducationalFields = {
    alimentacion: {
        tipoComida: {
            value: 'adulto',
            label: 'Adulto'
        },
        porcionesDiarias: {
            cantidad: '',
            frecuencia: ''
        },
        restriccionesMedicas: {
            tieneRestricciones: false,
            detalles: '',
            alimentosEvitar: []
        },
        tooltip: ''
    },
    cuidadosBasicos: {
        cepillado: {
            frecuencia: '',
            tipoPelo: '',
            herramientasRecomendadas: []
        },
        ejercicio: {
            nivel: 'medio',
            minutosDiarios: 30,
            tipoActividad: ''
        },
        salud: {
            vacunasAlDia: false,
            desparasitacionesAlDia: false,
            proximaVacuna: '',
            proximaDesparasitacion: ''
        },
        aseo: {
            banioFrecuencia: '',
            corteUñas: '',
            limpiezaOidos: '',
            cuidadoDental: ''
        },
        tooltip: ''
    },
    comportamiento: {
        convivenciaNinos: {
            compatible: false,
            edadMinima: '',
            observaciones: ''
        },
        relacionPerros: {
            compatible: false,
            preferencias: '',
            observaciones: ''
        },
        relacionGatos: {
            compatible: false,
            observaciones: ''
        },
        nivelEnergia: {
            valor: 'medio',
            descripcion: ''
        },
        toleranciaSoledad: {
            horasMaximas: 4,
            recomendaciones: ''
        },
        tooltip: ''
    },
    juegosFavoritos: {
        actividadesPreferidas: [],
        juguetesRecomendados: [],
        juegosEvitar: [],
        tooltip: ''
    },
    recomendacionesPostAdopcion: {
        primerosDias: {
            periodoAdaptacion: '',
            preparacionEspacio: [],
            rutinasEstablecer: []
        },
        consejosSemana1: [],
        consejosSemana2: [],
        consejosSemana3: [],
        senalesAdaptacion: [],
        cuandoContactarVeterinario: '',
        tooltip: ''
    }
};

const migrateDogs = async () => {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(process.env.URI_MONGODB);
        console.log('Conectado a MongoDB');

        console.log('Buscando perros sin campos educativos...');
        const dogsWithoutFields = await Dog.find({
            $or: [
                { alimentacion: { $exists: false } },
                { cuidadosBasicos: { $exists: false } },
                { comportamiento: { $exists: false } },
                { juegosFavoritos: { $exists: false } },
                { recomendacionesPostAdopcion: { $exists: false } }
            ]
        });

        console.log(`Encontrados ${dogsWithoutFields.length} perros para migrar`);

        if (dogsWithoutFields.length === 0) {
            console.log('No hay perros que migrar. Todos ya tienen los campos educativos.');
            process.exit(0);
        }

        let updatedCount = 0;
        for (const dog of dogsWithoutFields) {
            const updateData = {};
            
            if (!dog.alimentacion) {
                updateData.alimentacion = defaultEducationalFields.alimentacion;
            }
            if (!dog.cuidadosBasicos) {
                updateData.cuidadosBasicos = defaultEducationalFields.cuidadosBasicos;
            }
            if (!dog.comportamiento) {
                updateData.comportamiento = defaultEducationalFields.comportamiento;
            }
            if (!dog.juegosFavoritos) {
                updateData.juegosFavoritos = defaultEducationalFields.juegosFavoritos;
            }
            if (!dog.recomendacionesPostAdopcion) {
                updateData.recomendacionesPostAdopcion = defaultEducationalFields.recomendacionesPostAdopcion;
            }

            await Dog.findByIdAndUpdate(dog._id, updateData);
            updatedCount++;
            console.log(`Perro "${dog.name}" migrado (${updatedCount}/${dogsWithoutFields.length})`);
        }

        console.log(`\n✅ Migración completada: ${updatedCount} perros actualizados`);
        process.exit(0);
    } catch (error) {
        console.error('Error durante la migración:', error);
        process.exit(1);
    }
};

migrateDogs();
