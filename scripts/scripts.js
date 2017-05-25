window.onload = function() {
	/*
		Se crea el listener para cuando salgamos del campo input
	*/
	document.getElementById("code_input").addEventListener("blur", searchInfo);
}

function searchInfo(){
	//Inlcuimos el valor del campo input dentro de una variable
	var codeCity = document.getElementById("code_input").value;
	/*
		Controlamos el primer error que se pide en el ejercicio
	*/
	if(isNaN(codeCity)){
		document.getElementById("information").innerHTML = "- Debes introducir un código numérico";
	}
	/*
	Llamamos al afunción que borrará toda la tabla por si tenemos 
	información de otras peticiones
	*/
	clearTable();
	//Llamamos a la funcion que prepara la peticion Ajax
	sendPetition(parseInt(codeCity));
	showInfo();
}

function sendPetition(codeCity){
	//Introducimos el código dentro de la variable que espera el php
	codigo = codeCity;
	petition = new XMLHttpRequest();//Obtenemos la instancia del objeto XMLHttpRequest
	petition.onreadystatechange = showInfo;//Preparamos la funcion de respuesta
	petition.open('POST', 'scripts/tuTiempo.php', true);//Preparamos la peticion HTTP
	petition.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");	
	petition.send("codigo="+codigo);//Realizamos la peticion HTTP

}

function showInfo (){
	/*
		readystate: es el estado de la petición, tiene varios códigos para guiarnos;
		0: petición no iniciada
		1: conexión con el servidor establecida
		2: solicitud recibida en el servidor
		3: procesando solicitud
		4: solicitud finalizada y resultado disponible
		Nosotros preguntaremos por el estado 4
	*/
	if(this.readyState == 4){				
		if(this.status == 200){			
			/*
				Cogemos la respuesta del servidor y la inlcuimos en una variable, esta vez 
				la respuesta es un xml
			*/
			xmlDoc = this.responseXML;
			/*
				Inlcuimos el nombre de la ciudad 
			*/
			nameCity = xmlDoc.getElementsByTagName("nombre")[0].childNodes[0].nodeValue;
			document.getElementById("information").innerHTML = nameCity;
			table = document.getElementsByTagName("tbody")[1];
			/*
				creamos las variables para mostrar la temperatura máxima y mínima de la última búsqueda
			*/
			var tempMin = 100;
			var tempMax = -100;
			for(i = 0 ; i < xmlDoc.getElementsByTagName("hora").length ; i++){
				/*Ahora dentro de la respuesta xml del servidor, tenemos que ir paso por paso y extrayendo
				la información, primero accedemos a los nodos hora, despues a sus hijos, que en este caso 
				el primero es el de fecha y luego vamos extrayendo el valor de cada uno de los nodos hijos
				*/
				date = xmlDoc.getElementsByTagName("hora")[i].childNodes[0].childNodes[0].nodeValue;			
				hourDates = xmlDoc.getElementsByTagName("hora")[i].childNodes[1].childNodes[0].nodeValue;						
				text = xmlDoc.getElementsByTagName("hora")[i].childNodes[3].childNodes[0].nodeValue;
				temp = parseInt(xmlDoc.getElementsByTagName("hora")[i].childNodes[2].childNodes[0].nodeValue);				
				/*
					Comparamos valore4s de mínimos u máximos
				*/
				if(temp > tempMax){
					tempMax = temp;
					sessionStorage.setItem("maxim", tempMax);
				}				

				if(temp < tempMin){
					tempMin = temp;
					sessionStorage.setItem("minim", tempMin);
				}				
				/*
					Mostramos los valores mínimos y máximos de la última búsqueda
				*/
				document.getElementById("maximLastSearch").innerHTML = tempMax + " º";
				document.getElementById("minimLastSearch").innerHTML = tempMin + " º";

				wind = xmlDoc.getElementsByTagName("hora")[i].childNodes[7].childNodes[0].nodeValue;
				iconWind = xmlDoc.getElementsByTagName("hora")[i].childNodes[9].childNodes[0].nodeValue;
				//Creamos una fila nueva
				newTr = document.createElement("tr");
				/*
					A continuación vamos creando elemento td, donde incluiremos la información y estos 
					los iremos agregando a la nueva fila que hemos creado
				*/
				newTd = document.createElement("td");
				newTd.appendChild(document.createTextNode(date));
				newTr.appendChild(newTd);
				newTd = document.createElement("td");
				newTd.appendChild(document.createTextNode(hourDates));
				newTr.appendChild(newTd);
				newTd = document.createElement("td");
				newTd.appendChild(document.createTextNode(text));
				newTr.appendChild(newTd);
				newTd = document.createElement("td");
				newTd.appendChild(document.createTextNode(temp+" º"));
				newTr.appendChild(newTd);
				newTd = document.createElement("td");
				newTd.appendChild(document.createTextNode(wind+" km/h"));
				newTr.appendChild(newTd);
				newTd = document.createElement("td");
				newTd.innerHTML = "<img src="+iconWind+">";
				//newTd.appendChild(document.createTextNode(iconWind));
				newTr.appendChild(newTd);
				/*
					Por ultimo agregaremos la fila entera a la tabla
				*/
				table.appendChild(newTr);
			}
			/*
				Ahora guardamos los valores en las variables de session y local y las mostramos
			*/
			var info = tempMax + " º " + nameCity + " - " +xmlDoc.getElementsByTagName("pais")[0].childNodes[0].nodeValue;
			sessionStorage.setItem("maximLocalStorage", JSON.stringify(info));
			info = tempMin +" º "+ nameCity + " - " + xmlDoc.getElementsByTagName("pais")[0].childNodes[0].nodeValue;;
			sessionStorage.setItem("minimLocalStorage", JSON.stringify(info));
			document.getElementById("minimLocal").innerHTML = JSON.parse(sessionStorage.getItem("minimLocalStorage"));
			document.getElementById("maximLocal").innerHTML = JSON.parse(sessionStorage.getItem("maximLocalStorage"));					
		}					
	}else{
		/*
			Si no hay resultado disponible mostramos mensaje de error
		*/
		document.getElementById("information").innerHTML = "No hay ninguna ciudad con el código indicado";
	}
}

function clearTable(){
	var list = document.getElementById("tbody");	
	if (list.hasChildNodes()) {
		var numberElements = list.childElementCount;
		for (var i = 0 ; i < numberElements ; i++){
			list.removeChild(list.children[0]);			
		}
	}
}