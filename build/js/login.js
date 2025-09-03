function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('src/php/verificar_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `usuario=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.text()) // recibimos texto para debug
    .then(text => {
        console.log('🟡 Respuesta RAW del servidor:', text); // log de lo que llega del PHP

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            console.error('❌ Error parseando JSON:', err);
            alert("Hubo un problema procesando la respuesta del servidor.");
            return;
        }

        if (data.success) {
            console.log("✅ Login correcto, redirigiendo...");
            window.location.href = "index.php";
        } else {
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = data.message || "Credenciales incorrectas";
            errorMessage.style.display = "block";
        }
    })
    .catch(error => {
        console.error('❌ Error en la solicitud:', error);
        alert("Error al contactar el servidor.");
    });
}

// Escuchar evento submit del formulario
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault(); // prevenimos envío tradicional
    login();
});
