$(document).ready(function () {
  // BOTON MANTENIMIENTO
  //const toggleMantenimiento = document.getElementById("mantenimiento-toggle");

  // 1. Obtener el estado actual del mantenimiento
  //fetch("src/php/obtener_estado_mantenimiento.php")
  //  .then((res) => res.json())
  //  .then((data) => {
      //if (data && toggleMantenimiento) {
      //  toggleMantenimiento.checked = data.activado == 1;
      //}
  //  })
  //  .catch((err) => console.error("Error al obtener estado:", err));

  // 2. Escuchar cambios y actualizar


  // Mostrar el modal al hacer clic en "Agregar Producto"
  $("#add-product-btn").click(function () {
    abrirModal("modalAgregar");
  });

  // Función para abrir el modal
  function abrirModal(id) {
    $("#" + id).css("display", "flex");
  }

  // Función para cerrar el modal
  function cerrarModal(id) {
    $("#" + id).css("display", "none");
  }

  // Cierra el modal si se hace clic fuera de él
  $(window).click(function (event) {
    $(".modal").each(function () {
      if (event.target == this) {
        $(this).css("display", "none");
      }
    });
  });

  // Función para cargar marcas desde el servidor y llenar los selects



  // Función para cargar categorias desde el servidor y llenar los selects


  // Agregar Producto
  const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dzfzqzdcu/upload";
  const cloudinaryPreset = "McaromasPics"; // Reemplaza con tu preset de Cloudinary

  $("#formAgregar").submit(async function (e) {
    e.preventDefault();
    let form = document.getElementById("formAgregar");
    let formData = new FormData(form);


    //let imagen = document.getElementById("imagenAgregar").files[0];
    //if (imagen) {
    //  let imageUrl = await subirImagenACloudinary(imagen);
    //  if (imageUrl) {
    //    formData.append("imagenUrl", imageUrl);
    //  }
    //}

    $.ajax({
      url: "src/php/agregar_producto.php",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        Swal.fire({
          icon: "success",
          title: "Producto Agregado correctamente",
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
        }).then(() => {
          location.reload();
        });
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          "❌ Error en la solicitud AJAX:",
          textStatus,
          errorThrown
        );
        alert("Error al agregar producto");
      });
  });

  //Codigo de subida de imagen
  async function subirImagenACloudinary(imagen) {
    let data = new FormData();
    data.append("file", imagen);
    data.append("upload_preset", cloudinaryPreset);

    try {
      let response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: data,
      });
      let result = await response.json();
      return result.secure_url; // ✅ Devuelve la URL de la imagen subida
    } catch (error) {
      console.error("❌ Error al subir imagen a Cloudinary:", error);
      return null;
    }
  }

  // Abrir modal de edición con datos del producto
  $(document).on("click", ".edit-btn", function () {
    let row = $(this).closest("tr");
    $("#idEditar").val(row.find("td:eq(0)").text().trim()); // ID
    $("#nombreEditar").val(row.find("td:eq(1)").text().trim()); // Nombre

    let descripcion = row.find("td:eq(2)").text().trim();
    $("#descripcionEditar").val(descripcion);


    let habilitado = row.find("td:eq(3) input[type='checkbox']").is(":checked")
      ? "1"
      : "0";
    $("#habilitadoEditar").val(habilitado);

    // 📌 NUEVO: Obtener la URL de la imagen actual desde un atributo data o columna oculta
    let imagenUrl = row.find("td:eq(8) img").attr("src"); // CORRECTO

    // Mostrar la imagen actual en el modal si existe
    if (imagenUrl) {
      $("#imagenActual").attr("src", imagenUrl).show();
      $("#imagenUrlActual").val(imagenUrl); // Asignar la URL al input oculto
    } else {
      $("#imagenActual").hide();
      $("#imagenUrlActual").val("");
    }

    abrirModal("modalEditar");
  });

  // Editar producto
  $("#formEditar").submit(async function (e) {
    debugger;
    e.preventDefault();
    let formData = new FormData();

    formData.append("id", $("#idEditar").val());
    formData.append("nombre", $("#nombreEditar").val());
    formData.append("descripcion", $("#descripcionEditar").val());
    formData.append("habilitado", $("#habilitadoEditar").val());

    // --- Imagen
    let imagenActual = $("#imagenUrlActual").val(); // La que ya tenía
    let imagen = document.getElementById("imagenEditar").files[0];

    if (imagen) {
      // Si se sube una nueva imagen, la agregamos al FormData
      formData.append("imagen", imagen);
    } else {
      // Mantener la imagen anterior
      formData.append("imagenUrlActual", imagenActual);
    }

    // --- Enviar solicitud AJAX
    $.ajax({
      url: "src/php/editar_producto.php",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (data) {
        Swal.fire({
          icon: "success",
          title: "Producto editado correctamente",
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
        }).then(() => {
          location.reload();
        });
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          "❌ Error en la solicitud AJAX:",
          textStatus,
          errorThrown
        );
        alert("Error al editar producto");
      });
  });

  // Abrir modal de confirmación de eliminación
  $(document).on("click", ".delete-btn", function () {
    let id = $(this).data("id");
    $("#confirmarEliminar").data("id", id);
    abrirModal("modalEliminar");
  });

  // Confirmar eliminación
  $("#confirmarEliminar").click(function () {
    let id = $(this).data("id");
    $.post("src/php/eliminar_producto.php", { id: id }, function (data) {
      location.reload();
    });
  });

  // Botones para cerrar los modales
  $(".close").click(function () {
    $(this).closest(".modal").css("display", "none");
  });



function cargarProductos(query = "", habilitadoFiltro = null) {
  let data = { q: query };

  if (habilitadoFiltro !== null) {
    data.habilitado = habilitadoFiltro;
  }

  $.ajax({
    url: "src/php/get_productos.php",
    type: "GET",
    data: data,
    dataType: "json",
    success: function (respuesta) {
      console.log("✅ Productos recibidos:", respuesta); // <-- agregalo para depurar

      let tableBody = $("#product-table-body");
      tableBody.empty();

      if (respuesta.length > 0) {
        respuesta.forEach(function (producto) {
          let checked = producto.habilitado == 1 ? "checked" : "";

          let row = `<tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion}</td>
            <td>
              <input type="checkbox" class="toggle-habilitado" data-id="${producto.id}" ${checked}>
            </td>
            <td>
              <img src="${producto.imagen}" alt="Imagen del producto" width="50" height="50"
                   onerror="this.onerror=null;this.src='default.jpg';">
            </td>
            <td>
              <button class='edit-btn' data-id='${producto.id}'>✏️</button>
              <button class='delete-btn' data-id='${producto.id}'>🗑️</button>
            </td>
          </tr>`;

          tableBody.append(row);
        });
      } else {
        tableBody.append("<tr><td colspan='9'>No hay productos disponibles</td></tr>");
      }
    },
    error: function (xhr, status, error) {
      console.error("❌ Error al cargar productos:", error);
      $("#product-table-body").append("<tr><td colspan='9'>Error al cargar los productos</td></tr>");
    }
  });
}


  // 🟢 Estado inicial: intermedio (todos los productos)
  let filtroHabilitado = null;
  let filtroCheckbox = $("#filter-habilitado");
  filtroCheckbox.data("state", filtroHabilitado);
  filtroCheckbox.prop("indeterminate", true);

  // Cargar todos los productos al inicio
  cargarProductos();

  // 🔍 Filtrar productos en tiempo real (input de búsqueda)
  $("#search-input").on("input", function () {
    let query = $(this).val();
    cargarProductos(query, filtroCheckbox.data("state"));
  });

  // 🟢 Ciclo de estados para el filtro de habilitados
  $("#filter-habilitado").on("click", function () {
    let currentState = $(this).data("state");

    if (currentState === null || currentState === undefined) {
      $(this)
        .data("state", 1)
        .prop("checked", true)
        .prop("indeterminate", false);
    } else if (currentState === 1) {
      $(this)
        .data("state", 0)
        .prop("checked", false)
        .prop("indeterminate", false);
    } else {
      $(this)
        .data("state", null)
        .prop("checked", false)
        .prop("indeterminate", true);
    }

    let query = $("#search-input").val();
    let filtroEstado = $(this).data("state");
    cargarProductos(query, filtroEstado);
  });

  // 🔄 Controlar los checkboxes individuales para cada producto
  $(document).on("change", ".toggle-habilitado", function () {
    debugger;
    let productId = $(this).data("id");
    let nuevoEstado = $(this).is(":checked") ? 1 : 0;

    $.ajax({
      url: "src/php/actualizar_estado.php",
      type: "POST",
      data: { id: productId, habilitado: nuevoEstado },
      dataType: "json",
      success: function (response) {
        if (response.success) {
          let query = $("#search-input").val();
          let filtroEstado = $("#filter-habilitado").data("state");
          cargarProductos(query, filtroEstado); // Refrescar productos después del cambio
        } else {
          console.error("Error al actualizar producto:", response.error);
        }
      },
      error: function () {
        console.error("Error al intentar actualizar el producto.");
      },
    });
  });

  //Funcion Exportar Excel

  // Evento al hacer clic en el botón Excel
  $("#export-excel-btn").on("click", function () {
    exportToExcel();
  });

  function exportToExcel() {
    let table = $("#product-table-body");
    let rows = table.find("tr");
    let data = [];

    // Agregar encabezados (sin imagen)
    let headers = [
      "ID",
      "Nombre",
      "Descripción",
      "Habilitado",
    ];
    data.push(headers);

    // Recorrer las filas de la tabla
    rows.each(function () {
      let cells = $(this).find("td");
      if (cells.length > 0) {
        let habilitadoIcon = cells
          .eq(3)
          .find("input[type='checkbox']")
          .is(":checked")
          ? "✅ Sí"
          : "❌ No";

        let rowData = [
          cells.eq(0).text().trim(), // ID
          cells.eq(1).text().trim(), // Nombre
          cells.eq(2).text().trim(), // Descripción
          habilitadoIcon, // Habilitado con ícono de texto
        ];
        data.push(rowData);
      }
    });

    // Crear la hoja de Excel
    let ws = XLSX.utils.aoa_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");

    // Descargar el archivo
    XLSX.writeFile(wb, "productos.xlsx");
  }

  //FUNCION EDITAR PRECIOS VARIOS

  //Submit a PHP
  $("#formEditarPrecios").on("submit", function (e) {
    e.preventDefault(); // prevenir el envío normal

    const ids = $("#idsSeleccionados").val().split(",");
    const nuevoPrecio = $("input[name='precionuevo']").val();
    const nuevoPrecioMayorista = $("input[name='preciomayoristanuevo']").val();

    if (
      !nuevoPrecio ||
      !nuevoPrecioMayorista ||
      isNaN(nuevoPrecio) ||
      isNaN(nuevoPrecioMayorista)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Precios inválidos",
        text: "Ingresá precios válidos para ambos campos.",
        confirmButtonColor: "#d33",
        confirmButtonText: "Entendido",
      });
      return;
    }

    $.ajax({
      url: "src/php/editar_precios.php",
      method: "POST",
      data: {
        ids: ids,
        nuevoPrecio: nuevoPrecio,
        nuevoPrecioMayorista: nuevoPrecioMayorista,
      },
      success: function (respuesta) {
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "Los precios fueron actualizados correctamente.",
          timer: 1000, // 1 segundo
          showConfirmButton: false,
        }).then(() => {
          cerrarModal("modalEditarPrecios");
          cargarProductos(); // recargar la tabla
        });
      },
      error: function () {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un problema al actualizar los precios.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Cerrar",
        });
      },
    });
  });

  //MODAL
  function abrirModal(id) {
    $("#" + id).show();
  }
  function cerrarModal(id) {
    $("#" + id).hide();
  }

  $(document).on("click", ".edit-precio-btn", function () {
    // Obtener todos los checkboxes seleccionados
    const seleccionados = $(".checkProducto:checked")
      .map(function () {
        return $(this).val(); // devuelve el ID del producto
      })
      .get(); // convierte en array

    if (seleccionados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin productos seleccionados",
        text: "Por favor, seleccioná al menos un producto.",
        confirmButtonColor: "#f39c12",
        confirmButtonText: "Entendido",
      });
      return;
    }

    // Guardás los IDs en un input oculto o variable global
    $("#idsSeleccionados").val(seleccionados.join(",")); // si usás un input hidden

    // Abrís tu modal de edición de precio
    abrirModal("modalEditarPrecios");
  });
});
