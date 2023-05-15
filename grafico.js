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
    let coefX = document.getElementById("xFuncion").value;
    let coefY = document.getElementById("yFuncion").value;
    let minval;
    let maxval;
    /*console.log(coefX);
    console.log(coefY);*/
    console.log(restri_bien);

    const frame = document.getElementById("tablasep");
    const tablares = document.createElement('table');
    if(frame.childElementCount >= 1){
        last = frame.lastElementChild;
        frame.removeChild(last);
    }
    tablares.classList.add('table');
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
    
  
    let ggbApp = new GGBApplet(
      {
        appName: "classic",
        width: 500,
        height: 500,
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
       
          api.evalCommand(regionFactible + " x >0 ∧ y >0 )");
          api.setColor('a',0,255,255);
          //console.log(api.evalCommandCAS("Vertex(a)"));
          let nombrePuntos = api.evalCommandGetLabels("Vertice = Vertex(a)").split(',');
          /*nombrePuntos.forEach((element, index, array) => {
            let cords1 = (api.getXcoord(array[index])+ "," + api.getYcoord(array[index]));
            let cords2;
            console.log(index);
            console.log(cords1);
            if(index == nombrePuntos.length-1){
                cords2 = (api.getXcoord(array[1])+ "," + api.getYcoord(array[1]));
                console.log(cords2);
            }else{
                cords2 = (api.getXcoord(array[index+1])+ "," + api.getYcoord(array[index+1]));
                console.log(cords2);
            }
            if (cords1 == cords2){
                delete array[index+1];
            }
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
          let resul = document.getElementById("resultadofinal");
          for(var i = 1; i<tablares.rows.length; i++){
            if(i == 1){
                minval = tablares.rows[i].cells[2].innerHTML;
                maxval = tablares.rows[i].cells[2].innerHTML;
            }
            console.log(tablares.rows[i].cells[2].innerHTML)
            if(minval>tablares.rows[i].cells[2].innerHTML){
                minval = tablares.rows[i].cells[2].innerHTML;
                console.log(minval);
            }
            if(maxval<tablares.rows[i].cells[2].innerHTML){
                maxval = tablares.rows[i].cells[2].innerHTML;
                console.log(maxval);
            }
          }
          if(objetivo == 'Maxi'){
            resul.innerHTML = `
            <p>
            El valor optimo de Z es: ${maxval}
            </p>`;
          }else if(objetivo == 'Mini'){
            resul.innerHTML = `
            <p>
            El valor optimo de Z es: ${minval}
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

        },
      },//257 x+450 y<3600 ∧ 61 x+73 y<730 ∧ 208 x+69 y<1250 ∧ x>0 ∧ y>0
      "ggbApplet"
    );
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