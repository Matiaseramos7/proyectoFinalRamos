const $btnIniciarSesion = document.querySelector('#botonIniciarSesion');
const $logout = document.querySelector('#logout')

$btnIniciarSesion.addEventListener('click', () => {
    const correoIngresado = document.querySelector('#inputCorreo').value;
    const contraseñaIngresada = document.querySelector('#inputContraseña').value;


    Swal.fire({
        title: 'Ingresando',
        text: 'Por favor, espera...',
        icon: 'success',
        showConfirmButton: false,
        allowOutsideClick: false,
    });
    fetch('datos.json')
        .then(resp => resp.json())
        .then(datos => {
            const data = datos.usuarios;
            let usuarioEncontrado = false;

            data.forEach(users => {
                const correo = users.correo;
                const contraseña = users.contraseña;

                if (correoIngresado === correo && contraseñaIngresada === contraseña) {
                    usuarioEncontrado = true;
                }
            });

            if (usuarioEncontrado) {
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 3000);
            } else {
                console.log('Usuario no encontrado');
                Swal.fire({
                    icon: 'error',
                    title: 'Usuario no encontrado',
                    text: 'Por favor, verifica tus credenciales.',
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los datos. Por favor, inténtalo de nuevo.',
            });
        });
});
