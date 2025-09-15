import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { kml } from '@tmcw/togeojson';
import { forkJoin, map } from 'rxjs';
import { Actividad } from 'src/app/models/actividad.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
 Sheet_ID = '1EiJKCSHZ1X1S1kVrmdVj2cbnQqQc7SmXCRh-tLl_xc8'; 
 tipos: any[] = [];
 All: Actividad[] = [];
  constructor(public http: HttpClient) {
 
  //  
  }

  leerNoticias() {
  var data= this.http.get('https://cordoba.gob.ar/wp-json/wp/v2/posts?per_page=100');

    return data;
  }
    leerProgramas() {
  const req1 = this.http.get('https://cordoba.gob.ar/wp-json/wp/v2/media?per_page=100&page=1');
  const req2 = this.http.get('https://cordoba.gob.ar/wp-json/wp/v2/media?per_page=100&page=2');
  const req3 = this.http.get('https://cordoba.gob.ar/wp-json/wp/v2/media?per_page=100&page=3');
  const data = forkJoin([req1, req2, req3]).pipe(
    map((results: any[]) => [].concat(...results))
  );

    return data;
  }
     
  LeerActividades() {
    var URL = `https://docs.google.com/spreadsheets/d/${this.Sheet_ID}/gviz/tq?tqx=out:json`;
    return this.http.get(URL,{ responseType: 'text' })

  }
  
  filtrarProgramas(progr){
    
   return progr.filter((programa: any) => programa.title.rendered.includes('Destacada'));
  }

   async Leer() {
    // Default options are marked with *
    const response = await fetch('https://www.google.com/maps/d/kml?forcekml=1&mid=15yGpelzTUa667AIwz6ScsyMVpzg3puk');
   // console.log(response);
    
    return response.text().then(function (xml) {
      return (kml(new DOMParser().parseFromString(xml, "text/xml")).features);
    });// parses JSON response into native JavaScript objects
  }

  cortesTransito() {
    var data= this.http.get('https://cordoba.gob.ar/wp-json/wp/v2/pages/78619?nocache='+Math.random());

    return data;
  }


  formatData(ACT: any) {
   let data =JSON.parse(ACT.toString().substring(47, ACT.length - 2));
     data.table.rows.forEach((actividad, index)=> {
      
       let indexActividad = index;
       let fechaIni = this.process(actividad.c[0]?.f).toJSON().split("T")[0];

       let diasSiguientes: string[] = [];
      for (let i = 0; i < 7; i++) {
        let fecha = new Date();
        fecha.setDate(fecha.getDate() + i);
        diasSiguientes.push(fecha.toISOString().split("T")[0]);
      }

        diasSiguientes.forEach((dia, i) => {
          
          if (fechaIni == dia) {
            var estaSemana=  this.objActividad(actividad,indexActividad);
          }else{
            return;
          }
          this.All.push(estaSemana);
        });
      });
     console.log(this.All);
     
  return this.All;
  }


objActividad(actividad: any,id:any) {
           this.tipos =[];
           let temp= actividad.c[5]?.v.split(",");
           temp.forEach(tipo => {
             this.tipos.push(tipo.trim());
           });
           const actividades: Actividad= {
              id_evento: id,
              fecha_ini : actividad.c[0]?.f,
              hora_ini: actividad.c[1]?.f,
              fecha_fin: actividad.c[2]?.f,
              hora_fin: actividad.c[3]?.f,
              nombre: actividad.c[4]?.v,             
              tipo: this.tipos,
              descripcion: actividad.c[6]?.v,
              lugar: actividad.c[7]?.v,
              organizador: actividad.c[8]?.v,
              inscripcion: actividad.c[9]?.v,
              precio: actividad.c[10]?.v,
              activo: actividad.c[11]?.v,
              permanente: actividad.c[12]?.v,
              horapermanente: actividad.c[13]?.v,
              imagen: actividad.c[14]?.v
             };
             return actividades;
}

   process(date){
    var parts = date.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  
    getWeekNumber(d) {
    // Copia la fecha para no modificar la original
    const copyDate: Date = new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
    );
    // Establece al domingo como el primer día de la semana
    copyDate.setUTCDate(
      copyDate.getUTCDate() + 4 - (copyDate.getUTCDay() || 7)
    );
    // Obtiene el primer día del año
    const yearStart: Date = new Date(Date.UTC(copyDate.getUTCFullYear(), 0, 1));
    // Calcula la diferencia en días entre la fecha actual y el primer día del año
    const weekNo: number = Math.ceil(
      ((copyDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );

    return weekNo;
  }

  calcularGrupo() {
    const semana = this.getWeekNumber(new Date());
    const grupo = ((semana - 3) % 4) + 1;
    return grupo;
  }
}
