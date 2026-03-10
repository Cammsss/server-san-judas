import Dog from './dog.model.js';

export const saveDog = async (req, res) => {
    try {
        const { name, age, breedName, history, category } = req.body;
        const image = req.files ? req.files[0].path : "";
        const dog = new Dog({ name, age, breedName, history, category, image });
        await dog.save();

        return res.status(201).json({ message: "Perro registrado exitosamente", dog });
    } catch (error) {
        return res.status(500).json({ message: "Error al registrar el perro", error: error.message });
    }
}

export const getDogs = async (req, res) => {
    try {
        const dogs = await Dog.find({});
        return res.json(dogs);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener perros", error: error.message });
    }
}
