$(document).ready(function(){


  $('select').material_select();
  
  var slider = $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: true,
    min: 0,
    max: 100000,
    from: 0,
    to: 100000,
    prefix: "$"
  });

 
  $.ajax({
    url: 'buscador.php?action=getOptions',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      var selectCiudad = $('#selectCiudad');
      var selectTipo = $('#selectTipo');

      response.ciudades.forEach(function(ciudad) {
        selectCiudad.append('<option value="' + ciudad + '">' + ciudad + '</option>');
      });

      response.tipos.forEach(function(tipo) {
        selectTipo.append('<option value="' + tipo + '">' + tipo + '</option>');
      });

      $('select').material_select();
    }
  });

  
  function renderizarPropiedades(propiedades) {
    var contenedor = $('.colContenido');
    contenedor.find('.card.item-propiedad').remove();

    if (propiedades.length === 0) {
      contenedor.append('<div class="card item-propiedad"><div class="card-content"><p>No se encontraron resultados.</p></div></div>');
      return;
    }

    propiedades.forEach(function(item) {
      var cardHTML = `
        <div class="card item-propiedad horizontal" style="margin: 15px 0; display: flex;">
          <div class="card-image" style="width: 40%; max-width: 250px;">
            <img src="img/home.jpg" alt="Propiedad" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="card-stacked" style="width: 60%;">
            <div class="card-content" style="padding: 20px;">
              <p><b>Dirección:</b> ${item.Direccion}</p>
              <p><b>Ciudad:</b> ${item.Ciudad}</p>
              <p><b>Teléfono:</b> ${item.Telefono}</p>
              <p><b>Código postal:</b> ${item.Codigo_Postal}</p>
              <p><b>Tipo:</b> ${item.Tipo}</p>
              <p><b>Precio:</b> <span style="color: #bc955c; font-weight: bold;">${item.Precio}</span></p>
            </div>
            <div class="card-action" style="text-align: right; padding: 10px 20px; border-top: 1px solid rgba(160,160,160,0.2);">
              <a href="#" class="btn-ver-mas" data-id="${item.Id}" style="color: #26a69a; font-weight: bold; text-transform: uppercase; cursor: pointer;">VER MÁS</a>
            </div>
          </div>
        </div>
      `;
      contenedor.append(cardHTML);
    });
  }

  // Botón "Mostrar Todos"
  $('#mostrarTodos').on('click', function(e) {
    e.preventDefault();
    $.ajax({
      url: 'buscador.php',
      type: 'POST',
      data: { action: 'buscar', mostrarTodos: 'true' },
      dataType: 'json',
      success: function(response) {
        renderizarPropiedades(response);
      }
    });
  });

  // Evento Submit del formulario de búsqueda personalizada
  $('#formulario').on('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue y quede en blanco

    var sliderData = $("#rangoPrecio").data("ionRangeSlider");
    var precioMin = sliderData.result.from;
    var precioMax = sliderData.result.to;
    var ciudad = $('#selectCiudad').val();
    var tipo = $('#selectTipo').val();

    $.ajax({
      url: 'buscador.php',
      type: 'POST',
      data: {
        action: 'buscar',
        mostrarTodos: 'false',
        ciudad: ciudad,
        tipo: tipo,
        precioMin: precioMin,
        precioMax: precioMax
      },
      dataType: 'json',
      success: function(response) {
        renderizarPropiedades(response);
      },
      error: function(err) {
        console.log("Error en la búsqueda:", err);
      }
    });
  });
  
});



/*
  Función que inicializa el elemento Slider
  function inicializarSlider(){
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 200,
    to: 80000,
    prefix: "$"
  });
}

inicializarSlider();
*/


/*
  Función que reproduce el video de fondo al hacer scroll, y deteiene la reproducción al detener el scroll
  function playVideoOnScroll(){
  var ultimoScroll = 0,
      intervalRewind;
  var video = document.getElementById('vidFondo');
  $(window)
    .scroll((event)=>{
      var scrollActual = $(window).scrollTop();
      if (scrollActual > ultimoScroll){
       video.play();
     } else {
        //this.rewind(1.0, video, intervalRewind);
        video.play();
     }
     ultimoScroll = scrollActual;
    })
    .scrollEnd(()=>{
      video.pause();
    }, 10)
}

playVideoOnScroll();
*/


