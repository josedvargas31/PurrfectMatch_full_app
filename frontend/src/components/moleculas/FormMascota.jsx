import React, { useEffect, useState, useContext, useRef } from 'react';
import { ModalFooter, Input, Textarea, Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { CameraIcon } from '../nextUI/CameraIcon.jsx';
import MascotasContext from '../../context/MascotasContext.jsx';


const FormMascotas = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [genero, setGenero] = useState([]);
    const [especie, setEspecie] = useState([]);
    const [esterilizacion, setEsterilizacion] = useState([]);
    const [nombre, setNombre] = useState('');
    const [generoOp, setGeneroOp] = useState('');
    const [especieOp, setEspecieOp] = useState('');
    const [esterilizacionOp, setEsterilizacionOp] = useState('');
    const [raza, setRaza] = useState('');
    const [edad, setEdad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('adoptar');
    const [foto, setFoto] = useState(null);
    const [fotoUrl, setFotoUrl] = useState(''); // URL de la imagen para mostrar
    const fileInputRef = useRef(null);

    const { idMascota } = useContext(MascotasContext);

    useEffect(() => {
        const enumDataGenero = [
            { value: 'Macho', label: 'Macho' },
            { value: 'Hembra', label: 'Hembra' },
        ];
        setGenero(enumDataGenero);
    }, []);

    useEffect(() => {
        const enumDataEsterilizacion = [
            { value: 'si', label: 'Si' },
            { value: 'no', label: 'No' },
            { value: 'no se', label: 'No se' },
        ];
        setEsterilizacion(enumDataEsterilizacion);
    }, []);

    useEffect(() => {
        const enumDataEspecie = [
            { value: 'Perro', label: 'Perro' },
            { value: 'Gato', label: 'Gato' },
            { value: 'Oveja', label: 'Oveja' },
            { value: 'Pato', label: 'Pato' },
            { value: 'Cerdo', label: 'Cerdo' },
            { value: 'Pajaro', label: 'Pajaro' },
            { value: 'Hamster', label: 'Hamster' },
            { value: 'Caballo', label: 'Caballo' },
            { value: 'Vaca', label: 'Vaca' },
        ];
        setEspecie(enumDataEspecie);
    }, []);

    useEffect(() => {
        if (mode === 'update' && idMascota) {
            setNombre(idMascota.nombre || '');
            setGeneroOp(idMascota.genero || '');
            setEspecieOp(idMascota.especie || '');
            setRaza(idMascota.raza || '');
            setEdad(idMascota.edad || '');
            setEsterilizacionOp(idMascota.esterilizacion || '');
            setDescripcion(idMascota.descripcion || '');
            setEstado(idMascota.estado || 'adoptar');
            setFotoUrl(idMascota.img || ''); // Establecer la URL de la imagen actual
            setFoto(null); // No cargar imagen en update
        } else {
            setNombre('');
            setGeneroOp('');
            setEspecieOp('');
            setRaza('');
            setEdad('');
            setEsterilizacionOp('');
            setDescripcion('');
            setEstado('adoptar');
            setFotoUrl(''); // Limpiar URL de imagen
            setFoto(null);
        }
    }, [mode, idMascota]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario del localStorage
        const fk_id_usuario = user ? user.id_usuario : null; // Obtener el id_usuario del usuario

        if (!fk_id_usuario) {
            console.error('Usuario no encontrado en localStorage');
            return;
        }

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('genero', generoOp);
        formData.append('especie', especieOp);
        formData.append('raza', raza);
        formData.append('edad', edad);
        formData.append('esterilizacion', esterilizacionOp);
        formData.append('descripcion', descripcion);
        formData.append('estado', estado);
        formData.append('fk_id_usuario', fk_id_usuario); // Añadir fk_id_usuario al formData
        if (foto) {
            formData.append('img', foto);
        }

        handleSubmit(formData, e);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFoto(file);
        if (file) {
            setFotoUrl(URL.createObjectURL(file)); // Actualizar la vista previa de la imagen
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const colors = ["warning"];

    return (
        <form method='post' onSubmit={handleFormSubmit} encType="multipart/form-data">
            <div className='flex flex-col items-center'>
                <Avatar
                    showFallback
                    className="w-24 h-24 cursor-pointer mb-4"
                    onClick={handleClick}
                    src={fotoUrl || 'https://images.unsplash.com/broken'}
                    fallback={
                        <CameraIcon className="animate-pulse w-12 h-12 text-default-500" fill="currentColor" size={20} />
                    }
                />
                <input
                    type="file"
                    accept="image/*"
                    name="img"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
            </div>
            <div className='flex justify-center'>
                <div className='flex flex-col mr-4'>
                    <div className='py-2'>
                        {colors.map((color) => (
                            <Input
                                type="text"
                                label="Nombre de la mascota"
                                className="w-80"
                                color={color}
                                key={color}
                                variant="bordered"
                                id='nombre'
                                name="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                pattern="^[a-zA-Z\s]{1,20}$"
                                title="El nombre de la mascota debe tener máximo 20 caracteres, y solo puede contener letras y espacios"
                            />
                        ))}
                    </div>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="id_mascota"
                            value={generoOp}
                            onChange={(e) => setGeneroOp(e.target.value)}
                            required
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Género
                            </option>
                            {genero.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="especie"
                            value={especieOp}
                            onChange={(e) => setEspecieOp(e.target.value)}
                            required
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Especie
                            </option>
                            {especie.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='py-2'>
                        {colors.map((color) => (
                            <Input
                                type="text"
                                label="Raza de la mascota"
                                className="w-80"
                                color={color}
                                key={color}
                                variant="bordered"
                                id='raza'
                                name="raza"
                                value={raza}
                                onChange={(e) => setRaza(e.target.value)}
                                required
                                pattern="^[a-zA-Z\s]{1,20}$"
                                title="La raza de la mascota debe tener máximo 20 caracteres, y solo puede contener letras y espacios"
                            />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className='py-2'>
                        {colors.map((color) => (
                            <Input
                                type="number"
                                label="Edad de la mascota"
                                className="w-80"
                                color={color}
                                key={color}
                                variant="bordered"
                                id='edad'
                                name="edad"
                                value={edad}
                                onChange={(e) => setEdad(e.target.value)}
                                required
                                min="0"
                                max="20"
                                title="La edad de la mascota debe ser un número entre 0 y 20"
                            />
                        ))}
                    </div>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="esterilizacion"
                            value={esterilizacionOp}
                            onChange={(e) => setEsterilizacionOp(e.target.value)}
                            required
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Esterilización
                            </option>
                            {esterilizacion.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='py-2'>
                        {colors.map((color) => (
                            <Textarea
                                label="Descripción de la mascota"
                                className="w-80"
                                color={color}
                                key={color}
                                variant="bordered"
                                id='descripcion'
                                name="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                                pattern="^[a-zA-Z\s]{1,300}$"
                                title="La descripción de la mascota debe tener máximo 300 caracteres, y solo puede contener letras y espacios"
                            />
                        ))}
                    </div>
                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            disabled={mode !== 'update'}
                        >
                            <option value="" hidden>
                                Seleccionar estado
                            </option>
                            <option value="adoptar">Adoptar</option>
                            <option value="adoptada">Adoptada</option>
                            <option value="proceso adopcion">En proceso de adopción</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='flex justify-end py-4'>
                <Button color="danger" onClick={onClose}>Cancelar</Button>
                <Button type="submit" className="bg-orange-400 text-white hover:bg-orange-500 ml-2">{actionLabel}</Button>
            </div>
        </form>
    );
};

export default FormMascotas;
