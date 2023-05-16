onload = (event) => {
    console.log("Hola");
    document.getElementById("res_x_1").value = "257";
    document.getElementById("res_y_1").value = "450";
    document.getElementById("res_cons_1").value = "3600";
  
    document.getElementById("res_x_2").value = "61";
    document.getElementById("res_y_2").value = "73";
    document.getElementById("res_cons_2").value = "730";
  
    document.getElementById("res_x_3").value = "208";
    document.getElementById("res_y_3").value = "69";
    document.getElementById("res_cons_3").value = "1250";
  
  }; //∧
  let regionFactible = ""; 
  
  function graficar() {
    regionFactible ="a : (";
    let restri_bien = [];
    restri_bien = convertirIgual();
    let objetivo = document.getElementById("opc").value;
    let DOMaviso = document.getElementById("error");
    let coefX = document.getElementById("xFuncion").value;
    let coefY = document.getElementById("yFuncion").value;
    let minval;
    let maxval;
    let mincords;
    let maxcords;
    /*console.log(coefX);
    console.log(coefY);*/
    console.log(restri_bien);

    let resul = document.getElementById("resultadofinal");
    if(resul.childElementCount >= 1){
      last = resul.lastElementChild;
      resul.removeChild(last);
    }
    resul.style.display = "block";
    const frame = document.getElementById("tablasep");
    const tablares = document.createElement('table');
    if(frame.childElementCount >= 1){
        last = frame.lastElementChild;
        frame.removeChild(last);
    }
    tablares.classList.add('table');
    tablares.classList.add('table-striped');
    tablares.classList.add('table-bordered');
    tablares.style.border = "1px solid";
    
    const headgroup = document.createElement('thead');
    const head = document.createElement('tr');
    
    const rNombre = document.createElement('th');
    rNombre.textContent = 'Punto';

    const rCoords = document.createElement('th');
    rCoords.textContent = 'Coordenadas';

    const rResul = document.createElement('th');
    rResul.textContent = 'Resultado';

    head.appendChild(rNombre);
    head.appendChild(rCoords);
    head.appendChild(rResul);

    headgroup.appendChild(head);
    tablares.appendChild(headgroup);

    frame.appendChild(tablares);

    if (DOMaviso.childElementCount >= 1){
      last = DOMaviso.lastElementChild;
      DOMaviso.removeChild(last);
    }
    
    if(verifError() == false){
      document.getElementById("ggbApplet").style.display = "none";
      document.getElementById("tablasep").style.display = "none";
      document.getElementById("resultadofinal").style.display = "none";

      return errorMensaje("Error - Verifique los datos ingresados");
    }

    let ggbApp = new GGBApplet(
      {
        appName: "classic",
        width: 800,
        height: 800,
        showToolBar: false,
        showMenuBar: false,
        showAlgebraInput: false,
        enableShiftDragZoom: false,
        enableLabelDrags: false,
  
        appletOnLoad(api) {
        
          
         api.setRounding("2");
         api.setGridVisible(1);
          for (let i = 0; i < restri_bien.length; i++) {
            api.evalCommand("R" + (i + 1) + " = (" + restri_bien[i] + ")");
            api.setLabelVisible("R" + (i + 1), true);
          }
       
          api.evalCommand(regionFactible + " x >= 0 ∧ y >= 0 )");
          api.setColor('a',0,255,255);
          //console.log(api.evalCommandCAS("Vertex(a)"));
          let nombrePuntos = api.evalCommandGetLabels("Vertice = Vertex(a)").split(',');
          if(nombrePuntos.length <= 1){
            return errorMensaje("No se pudo calcular una region factible");
          }
         /* nombrePuntos.forEach((element, index, array) => {
            let cords1 = (api.getXcoord(array[index])+ "," + api.getYcoord(array[index]));
            console.log("Cords 1 " + index + " : " + cords1);
            let cords2;
            for(let i = 0; i<nombrePuntos.length; i++){
              if(i== index){
                console.log("skip");
              }else{
                cords2 = (api.getXcoord(array[i])+ "," + api.getYcoord(array[i]));
                console.log("Cords 2 " + i + " : " + cords2);
                if (cords1 == cords2){
                  api.setLabelVisible(element, false);
                  console.log("Antes: "+ nombrePuntos);
                  //delete array[i];
                  console.log("Despues: "+ nombrePuntos);
                }
              }
              
            }
            console.log(index);

          });*/
          console.log(nombrePuntos);
          //console.log(nombrePuntos);
          nombrePuntos.forEach((element,index) => {
            api.setLabelStyle(element,1);
            let xaux = parseFloat(api.getXcoord(element)).toFixed(2);
            let yaux = parseFloat(api.getYcoord(element)).toFixed(2);
            console.log(element+": "+ api.getXcoord(element)+", "+ api.getYcoord(element));
            let newname = String.fromCharCode(65+index);

            let testeo = tablares.insertRow(-1);
            let datospuntos = testeo.insertCell(0);
            let datoscoords = testeo.insertCell(1);
            let datoresultado = testeo.insertCell(2);

            datospuntos.innerHTML = (newname);
            datoscoords.innerHTML = (xaux+ ", "+ yaux);
            datoresultado.innerHTML = ((xaux*coefX)+(yaux*coefY)).toFixed(2);

            api.renameObject(element,newname);
            console.log(element);
          });
          //api.evalCommand(regionFactible + " x>0  ");
          let valoresMaximos = encontrarValoresMaximos(restri_bien);
          //void setCoordSystem(double xmin, double xmax, double ymin, double ymax)
          api.setCoordSystem(-1, valoresMaximos.max_x+1, -1, valoresMaximos.max_y+1);
          for(var i = 1; i<tablares.rows.length; i++){
            if(i == 1){
                minval = tablares.rows[i].cells[2].innerHTML;
                maxval = tablares.rows[i].cells[2].innerHTML;
                mincords = tablares.rows[i].cells[1].innerHTML;
                maxcords = tablares.rows[i].cells[1].innerHTML;
            }
            console.log(tablares.rows[i].cells[2].innerHTML)
            if(minval>tablares.rows[i].cells[2].innerHTML){
                minval = tablares.rows[i].cells[2].innerHTML;
                console.log(minval);
                mincords = tablares.rows[i].cells[1].innerHTML;

            }
            if(maxval<tablares.rows[i].cells[2].innerHTML){
                maxval = tablares.rows[i].cells[2].innerHTML;
                console.log(maxval);
                maxcords = tablares.rows[i].cells[1].innerHTML;
            }
          }
          if(objetivo == 'Maxi'){
            resul.innerHTML = `
            <p>
            El valor optimo de <b>Z</b> es: <b>${maxval} </b>  <br/>
            Con los valores (X,Y) : <b>${maxcords}</b>.
            </p>`;
          }else if(objetivo == 'Mini'){
            resul.innerHTML = `
            <p>
            El valor optimo de <b>Z</b> es: <b>${minval} </b>  <br/>
            Con los valores (X,Y) : <b>${mincords}</b>.
            </p>`;
          }else{
            resul.innerHTML = `
            <p>
            'ERROR'
            </p>`;
          }
          
          console.log("fin");
          api.evalCommand()
          console.log(nombrePuntos);
          console.log(regionFactible);
        },
      },//257 x+450 y<3600 ∧ 61 x+73 y<730 ∧ 208 x+69 y<1250 ∧ x>0 ∧ y>0
      "ggbApplet"
    );
    document.getElementById("ggbApplet").style.display = "block";
    document.getElementById("tablasep").style.display = "block";
    document.getElementById("resultadofinal").style.display = "block";
    ggbApp.inject("ggbApplet");

    
  }
  
  function convertirIgual() {
   
    //debugger;
    let rest_conca = [];
    rest_conca = obten_restric();
   // rest_aRG = obten_restric();
    let aux = "";
    for (let i = 0; i < rest_conca.length; i++) {
      aux = rest_conca[i];
      if (aux.includes("<=")) {
        aux = rest_conca[i].replace("<=", "=");
        
      } else if (aux.includes(">=")) {
        aux = rest_conca[i].replace(">=", "=");
     
        
      } else if (aux.includes("=")) {
        aux = rest_conca[i].replace("=", "=");
      }
      rest_conca[i] = aux;
    }
    return rest_conca;
  
  }
  function encontrarValoresMaximos(ecuaciones) {
    let max_x = -Infinity;
    let max_y = -Infinity;
  
    for (let i = 0; i < ecuaciones.length; i++) {
      const coeficientes = ecuaciones[i].match(/([-]?\d+)x\s*([-+]?\d+)y\s*=+\s*([-]?\d+)/);
  
      const x = coeficientes[1] ? coeficientes[3] / coeficientes[1] : 0;
      const y = coeficientes[2] ? coeficientes[3] / coeficientes[2] : 0;
  
      if (x > max_x && x!= Infinity ) {
        max_x = x;
      }
      else if(x==Infinity)
      {
        max_x+=max_x/5;
      }
      if (y > max_y && y!= Infinity) {
        max_y = y;
      }else if(y==Infinity)
      {
        max_y+=max_y/5;
      }
    }
  
    return { max_x, max_y };
  }
  var agregarRestriccion = 3;
  
  function agregar() {
  
    let rest = document.getElementById("restricciones_input");
    let num_rest = rest.childElementCount;
    num_rest++;
  
    let nueva_rest = document.createElement("div");
    nueva_rest.classList.add("restriccion");
  
    nueva_rest.innerHTML = `
      <p>
        <input type="text" id="res_x_${num_rest}" value="">
        X
        <select name="signo" id="signo_y_${num_rest}">
            <option value="mas">+</option>
            <option value="men"->-</option>
        </select>
        <input type="text" id="res_y_${num_rest}" value="">
        Y
        <select name="sign_cons" id="sign_cons_${num_rest}">
            <option value="mayorIgual">>=</option>
            <option value="menorIgual"-><=</option>
        </select>
        <input type="text" id="res_cons_${num_rest}" value="">
      </p>`;
    document.getElementById("restricciones_input").appendChild(nueva_rest);
  
  }

  errorMensaje = (mensaje = "") => {
    let aviso = document.createElement("div");
    aviso.role = "alert";
    aviso.classList.add("alert");
    aviso.classList.add("alert-danger");
  
    aviso.innerHTML = mensaje;
    let DOMaviso = document.getElementById("error");
    DOMaviso.innerHTML = '';
    DOMaviso.appendChild(aviso);
  }

  function quitar() {
    let rest = document.getElementById("restricciones_input");
    if(rest.childElementCount > 2){
        let last = rest.lastElementChild;
        restricciones_input.removeChild(last);
    }
  }
  function obten_restric() {
    //debugger
    let restri = [];
    let cant = document.getElementById("restricciones_input");
    let cant2 = cant.childElementCount;
    let aux = "";
    for (let i = 1; i <= cant2; i++) {
      aux = aux + document.getElementById(`res_x_${i}`).value;
      aux = aux + "x";
      aux =
        aux +
        document.getElementById(`signo_y_${i}`).options[
          document.getElementById(`signo_y_${i}`).selectedIndex
        ].text;
      aux = aux + document.getElementById(`res_y_${i}`).value;
      aux = aux + "y";
      aux =
        aux +
        document.getElementById(`sign_cons_${i}`).options[
          document.getElementById(`sign_cons_${i}`).selectedIndex
        ].text;
      aux = aux + document.getElementById(`res_cons_${i}`).value;
     let regionFactibleaux= aux + " ∧ ";
      //regionFactible= regionFactibleaux.replace("=","");
     if(regionFactibleaux.includes('<') || regionFactibleaux.includes('>')){
        regionFactible += regionFactibleaux;
     }else{
        regionFactible += regionFactibleaux.replace('=', '<=');
        regionFactible += regionFactibleaux.replace('=', '>=');
     }
      restri.push(aux);
      aux = "";
      console.log(regionFactible);
    }
    return restri;
  }

  limpiar = () => {
    document.getElementById("xFuncion").value = "";
    document.getElementById("yFuncion").value = "";
    for (let i = 1; i <= document.getElementById("restricciones_input").childElementCount; i++) {
      document.getElementById(`res_x_${i}`).value = "";
      document.getElementById(`res_y_${i}`).value = "";
      document.getElementById(`res_cons_${i}`).value = "";
    }
    document.getElementById("ggbApplet").style.display = "none";
    document.getElementById("tablasep").style.display = "none";
    document.getElementById("resultadofinal").style.display = "none";
  }

  function verifError(){
    if(document.getElementById("xFuncion").value == "" || document.getElementById("yFuncion").value == "" ){
      return false;
    }else{
      for (let i = 1; i <= document.getElementById("restricciones_input").childElementCount; i++) {
        if(document.getElementById(`res_x_${i}`).value == "" || document.getElementById(`res_y_${i}`).value == "" || document.getElementById(`res_cons_${i}`).value == ""){
          return false;
        }
      }
    }
    return true;
  }