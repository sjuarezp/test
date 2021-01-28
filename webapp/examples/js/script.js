var csv_data;
var array_puntos = [];
var array_ll=[];
$('.csv-upload-form').submit(function (e) {
  e.preventDefault();
  handleUpload();
});

function handleUpload() {
  $('.csv-upload-form input[type="file"]').parse({
    config: {
      header: true,
      complete: uploadComplete
    }
  });
}
function min(a,b){
  return a<b?a:b
}
function max(a,b){
  return a>b?a:b
}
function project(p, a, b) {
  p.x=p.lat;
  p.y=p.lng;

  a.x=a.punto.lat;
  a.y=a.punto.lng;

  b.x=b.punto.lat;
  b.y=b.punto.lng;

  var atob = { x: b.x - a.x, y: b.y - a.y };
  var atop = { x: p.x - a.x, y: p.y - a.y };
  var len = atob.x * atob.x + atob.y * atob.y;
  var dot = atop.x * atob.x + atop.y * atob.y;
  var t = min(1, max(0, dot / len));

  dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

  return {
    point: {
      x: a.x + atob.x * t,
      y: a.y + atob.y * t
    },
    left: dot < 1,
    dot: dot,
    t: t
  };
}

function distance(a, b) {
  var x_d = b.lat - a.lat;
  var y_d = b.lng - a.lng;

  var h_d = Math.sqrt(x_d * x_d + y_d * y_d);
  console.info(h_d);
  return h_d;
}

function topPuntosCerca(r, puntos) {

  var arr_lista_puntos = [];


  if (Array.isArray(puntos)) {
    //calcular distancia entre el punto de referencia "r" y los puntos cargados desde el CSV
    puntos.forEach(punto => {
      console.info(r, punto);
      // calcular distancia
      arr_lista_puntos.push({ "punto": punto, "distancia": distance(r, punto) });
    });

    //ordernar los puntos por menor distancia
    arr_lista_puntos = sortByKey(arr_lista_puntos, "distancia", false);

    //retornar los 2 puntos más cercanos
    var arr_resp = arr_lista_puntos.slice(0, 2);
    console.info("Puntos cercanos:", arr_resp);
    return arr_resp;


  }
}

/**
    * Sort an array of Objects based on key
    * @param {Array} array
    * @param {String} key
    * @returns {Array}
    */
function sortByKey(array, key, inverso) {
  return array.sort(function (a, b) {
    var x = a[key],
      y = b[key];
    if (typeof x === 'string') {
      x = x.toLowerCase();
      y = y.toLowerCase();
      if (!isNaN(x) && !isNaN(y)) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);
      }
    }
    if (!inverso) {
      return (x < y ? -1 : (x > y ? 1 : 0));
    } else {
      return (x > y ? -1 : (x < y ? 1 : 0));
    }

  });
}

function uploadComplete(results, file) {

    csv_data = results;
    /*
    var select = $('<select><option value="">Elegir:</option></select');
    $.each(results.meta.fields, function (index, el) {
      select.append('<option value="' + el + '">' + el + '</option>');
    });
    */

    var arr=$('td.from-file');
    for(i=0;i<arr.length;i++){
      console.info(arr[i].dataset.csvColumn);
    }

    $('td.from-file').each(function(a,b){
        console.info(a);
        console.info(b);

        var select = $('<select><option value="">Elegir:</option></select');
        $.each(results.meta.fields, function (index, el) {
          console.info("Columna CSV",b.dataset.csvColumn.toLowerCase());
          console.info("Element",el.toLowerCase());
          if(b.dataset.csvColumn.toLowerCase()==el.toLowerCase()){
            select.append('<option value="' + el + '" selected>' + el + '</option>');
          }else{
            select.append('<option value="' + el + '">' + el + '</option>');
          }

        });
        $(this).append(select);
    });


    

    //$('td.from-file').append(select);
    $('.confirmation').show();
    regenerateResults();
    if(array_puntos[0].sur){
      $('#btn_procesar_puntos').prop('disabled', false);    
    }
}

$('.from-file').on('change', 'select', function (event) {
  regenerateResults();
});

$('.from-file-default').on('keyup', 'input', function (event) {
  regenerateResults();
  //console.info("regenerateResults();");
});

function regenerateResults() {
  var column_mapping = {};
  var results = [];
  var results_string = "";

  //$('.from-file :checked').each(function(index, el){
  $('.from-file :checked').each(function (index, el) {
    var from_file = $(el).val();
    var actual = $(el).parents('td').attr('data-csv-column');
    column_mapping[from_file] = actual;
  });

  $.each(csv_data.data, function (index, value) {
    var item = {};
    $.each(value, function (innerIndex, innerValue) {
      //buscar valor por default
      debugger;
      var f = column_mapping[innerIndex];
      if (f) {

        var default_val = $("input[name=default_" + f + "]").val();
        if (default_val) {
          item[column_mapping[innerIndex]] = default_val;
        } else {
          item[column_mapping[innerIndex]] = innerValue;
        }

      }else{
        //console.info("f:",f);
      }
    });
    console.info(value);
    item.all=value;
    results.push(item);
  });
  
  array_puntos = results;
  console.info("array_puntos:", array_puntos);
  //$('.output').html(JSON.stringify(results, null, 2));
  if(array_puntos[0].sur){
      $('#btn_procesar_puntos').prop('disabled', false);    
  }


}
//

$("#btn_ver_mi_ubicacion").on("click", function (evt) {
  console.info(evt);
  //debugger;
   //map.locate({ setView: true, maxZoom: 16 });
   try{
      levelZoom=map.getZoom();
    }catch(e){
      levelZoom=16;
    }

 
   map.setView(current_ll,levelZoom);
});


$("#btn_procesar_puntos").on("click", function (evt) {
  console.info(evt);
  debugger;
  $.each(array_puntos, function (id, item) {
    console.info(item);
    var utm = L.utm(parseFloat(item.x), parseFloat(item.y), item.zona, "", item.sur == 'true' ? true : false);
    var ll = utm.latLng();
    create(ll,item);
    array_ll.push(ll);
  });


  $('#btn_proyectar_mi_ubicacion').prop('disabled', false);
   
});

$("#btn_proyectar_mi_ubicacion").on("click", function (evt) {

  //map.locate({ setView: true, maxZoom: 16 });
  //map.setView(current_ll, 14);
    if(current_ll){
      var puntos_cercanos = topPuntosCerca(current_ll, array_ll);
      var punto_proyectado = project(current_ll, puntos_cercanos.pop(), puntos_cercanos.pop());
      //Pintar punto proyectado
      create({"lat":punto_proyectado.point.x,"lng":punto_proyectado.point.y});
    }else{
      //$(document).ready(function() {
                
        //$('.toast').toast({
       //     'autohide': false
       // });

       // });

      alert("No se puede obtener la ubicación actual, por favor revisar el GPS");
    }
});



