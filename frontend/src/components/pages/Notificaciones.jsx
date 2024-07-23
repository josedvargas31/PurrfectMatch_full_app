import React, { useContext, useEffect, useState, useCallback } from 'react';
/* import { Link } from 'react-router-dom'; */
import Swal from 'sweetalert2';
import axiosClient from '../axiosClient.js';
import MascotasContext from '../../context/MascotasContext.jsx';
import {
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, Image, Link} from "@nextui-org/react";

export function Notificaciones() {
    const statusColorMap = {
        adoptar: "success",
        adoptada: "default",
        'proceso adopcion': "warning",
        todos: "primary",
    };

    const [mascotas, setMascotas] = useState([]);

    useEffect(() => {
        peticionGet();
    }, []);

    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/mascota/listar');
            setMascotas(response.data.filter(mascota => mascota.estado === 'proceso adopcion'));
        } catch (error) {
            console.log('Error en el servidor ' + error);
        }
    };

    const handleAdoptar = async (id_mascota) => {
        try {
            const response = await axiosClient.post(`/mascota/administrar/${id_mascota}`, { accion: 'aceptar' });
            Swal.fire('Éxito', response.data.message, 'success');
            peticionGet();
        } catch (error) {
            console.error('Error en la adopción', error);
            Swal.fire('Error', 'No se pudo completar la adopción', 'error');
        }
    };

    const handleDenegar = async (id_mascota) => {
        try {
            const response = await axiosClient.post(`/mascota/administrar/${id_mascota}`, { accion: 'denegar' });
            Swal.fire('Éxito', response.data.message, 'success');
            peticionGet();
        } catch (error) {
            console.error('Error en la denegación', error);
            Swal.fire('Error', 'No se pudo denegar la adopción', 'error');
        }
    };

    const renderCard = useCallback((mascota) => {
        const isAdoptada = mascota.estado === 'proceso_adopcion';
        return (
            <Card className={`p-4 m-4 shadow-lg ${isAdoptada ? 'bg-gray-300' : ''}`}>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-xl mb-1">{mascota.nombre}</h4>
                    <small className="text-default-500 mb-2">{mascota.genero}</small>
                    <h4 className="font-bold text-lg mb-2">{mascota.raza}</h4>
                    <Chip className="capitalize" color={statusColorMap[mascota.estado]} size="sm" variant="flat">
                        {mascota.estado}
                    </Chip>
                </CardHeader>
                <CardBody className="py-4">
                    <div className="relative w-full h-52 mb-4 overflow-hidden">
                        <Image
                            alt="Card background"
                            className="object-cover w-full h-full"
                            src={mascota.img ? `${axiosClient.defaults.baseURL}/uploads/${mascota.img}` : "https://nextui.org/images/hero-card-complete.jpeg"}
                        />
                    </div>
                    <p className="text-tiny uppercase font-bold mb-4">{mascota.descripcion}</p>
                    <div className="flex justify-start gap-2">
                        {!isAdoptada && (
                            <>
                                <Button color="success" onClick={() => handleAdoptar(mascota.id_mascota)}>
                                    Aceptar
                                </Button>
                                <Button color="error" onClick={() => handleDenegar(mascota.id_mascota)}>
                                    Rechazar
                                </Button>
                            </>
                        )}
                    </div>
                </CardBody>
            </Card>
        );
    }, []);

    return (
        <div className="flex flex-col items-center p-4 w-full">
            <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-10 h-14 bg-white shadow-md">
                <h1 className="text-3xl font-semibold">Perrfect Match</h1>
                <nav className="flex-grow flex justify-center space-x-24">
                    <Link href="/mascotas" color="warning" className="mx-2 text-lg cursor-pointer">Registrar</Link>
                    <Link href="#" color="warning" className="mx-2 text-lg cursor-pointer">Notificaciones</Link>
                </nav>
              {/*   <span className="hover:text-[#c5296c] text-[#FA67A7] cursor-pointer">Notificaciones</span> */}
            </header>
            <div className="w-full sm:w-full lg:w-12/12 xl:w-11/12 mt-20">
                <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-4">
                    {mascotas.map(renderCard)}
                </div>
            </div>
        </div>
    );
}
