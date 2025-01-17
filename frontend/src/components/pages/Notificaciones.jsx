import React, { useContext, useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import axiosClient from '../axiosClient.js';
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, Image, Link, Chip, Skeleton } from "@nextui-org/react";
import iconos from '../../styles/iconos';
import Icon from '../atomos/IconVolver';
import { Tooltip } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';

export function Notificaciones() {
    const navigate = useNavigate();
    const statusColorMap = {
        adoptar: "success",
        adoptada: "default",
        'proceso adopcion': "warning",
        todos: "primary",
    };

    const [mascotas, setMascotas] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true);
        }, 1500);
    }, []);

    useEffect(() => {
        peticionGet();
    }, []);

    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/mascota/listarMU');
            setMascotas(response.data);
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
            <Card className={`p-4 m-4 bg-gray-300 shadow-lg ${isAdoptada ? '' : ''}`}>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-2xl mb-1 text-gray-800">Nombre: {mascota.nombre}</h4>
                    <small className="text-gray-600 mb-2">Género: {mascota.genero}</small>
                    <h4 className="font-semibold text-lg mb-2 text-gray-700">Raza: {mascota.raza}</h4>
                    <Chip className="capitalize" color={statusColorMap[mascota.estado]} size="sm" variant="flat">
                        {mascota.estado}
                    </Chip>
                    <p className="text-sm text-gray-700 mt-2"><strong>Solicitante:</strong> {mascota.nombres} {mascota.apellidos}</p>
                    <p className="text-sm text-gray-700"><strong>Correo:</strong> {mascota.correo}</p>
                    <p className="text-sm text-gray-700"><strong>Numero:</strong> {mascota.numero_cel}</p>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <Skeleton isLoaded={isLoaded} className="rounded-lg">
                        <div className="relative w-full h-52 mb-4 overflow-hidden">
                            <Image
                                alt="Card background"
                                className="object-cover rounded-xl w-full h-full"
                                src={mascota.img ? `${axiosClient.defaults.baseURL}/uploads/${mascota.img}` : "https://nextui.org/images/hero-card-complete.jpeg"}
                            />
                        </div>
                    </Skeleton>
                    <p className="text-sm text-gray-700 font-medium mb-4">{mascota.descripcion}</p>
                    <div className="flex justify-start gap-2">
                        {!isAdoptada && (
                            <>
                                <Button color="warning" onClick={() => handleAdoptar(mascota.id_mascota)}>
                                    Aceptar
                                </Button>
                                <Button color="danger" onClick={() => handleDenegar(mascota.id_mascota)}>
                                    Rechazar
                                </Button>
                            </>
                        )}
                    </div>
                </CardBody>
            </Card>
        );
    }, [isLoaded]);

    const logout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center p-8 w-full">
            <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-10 h-14 bg-zinc-300 shadow-md max-w-screen-xxl flex-wrap mx-auto p-4">
                <h1 className="text-3xl font-semibold text-blue-400">Perrfect Match</h1>
                <nav className="flex-grow flex justify-center space-x-24">
                    <Link href="/mascotas" color="default" className="mx-2 text-lg cursor-pointer">Registrar</Link>
                    <Link href="/notificaciones" color="default" className="mx-2 text-lg cursor-pointer">Notificaciones</Link>
                    <Link href="/graficas" color="default" className="mx-2 text-lg cursor-pointer">Graficas</Link>
                </nav>
                <Tooltip content="Salir">
                    <div className="text-black shadow-xl flex items-center py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-green hover:text-white cursor-pointer" onClick={() => {
                        const swalWithBootstrapButtons = Swal.mixin({
                            customClass: {
                                confirmButton: "btn btn-success",
                                cancelButton: "btn btn-danger",
                                actions: "gap-5"
                            },
                            buttonsStyling: false
                        });

                        swalWithBootstrapButtons.fire({
                            title: "¿Estás Seguro que deseas Cerrar Sesión?",
                            text: "",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Salir",
                            cancelButtonText: "Cancelar",
                            reverseButtons: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                logout();
                            }
                        });
                    }}>
                        <Icon className="w-5 h-5" icon={iconos.iconoSalir} />
                    </div>
                </Tooltip>
            </header>
            <div className="z-0 w-full sm:w-full lg:w-12/12 xl:w-11/12 mt-20">
                <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xxl:grid-cols-4">
                    {mascotas.map(renderCard)}
                </div>
            </div>
        </div>
    );
}
