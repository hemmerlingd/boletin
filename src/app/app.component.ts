import { Component } from '@angular/core';
import { DataService } from './services/shared/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    noticias: any[] = [];
    eventos: any[] = [];
    programas: any[] = [];
    cortesTransito: any[] = [];
    cpc: any[] = [];
    CPCExtendidos: any[] = [];
    mostrar:number=6;
    constructor(public DS: DataService) {
      this.DS.leerNoticias().subscribe((data: any) => {
        this.noticias = data;
       DS.cortesTransito().subscribe((data: any) => {
         let cortes = data.content.rendered.split('<hr />');
         cortes.forEach(corte => {
        
          
          this.cortesTransito.push(corte.split('<li>')[1].split('</li>')[0])
          
         });
    
        
        });
  
          this.noticias.sort((a, b) => {
          if (a.categories.includes(1178)&& !b.categories.includes(1178)) {
            return -1; // a va antes que b
          } else if (!a.categories.includes(1178)&& b.categories.includes(1178)) {
            return 1; // b va antes que a
          } else {
            return 0; // mantienen su orden original
          }
        });
      });
  
      this.DS.LeerActividades().subscribe((data: any) => {
      
        
        this.eventos = DS.formatData(data);
      });
  
      this.DS.leerProgramas().subscribe((data: any) => {
         this.programas=DS.filtrarProgramas(data);
         
      });
  
      this.DS.Leer().then((datos) => {
        this.cpc = datos.filter((elemento) => 'Grupo' in elemento.properties);
        this.cpc.forEach((elemento) => {
          if (
            elemento.properties.Grupo.split('.')[0].toString() ===
            DS.calcularGrupo().toString()
          ) {
            this.CPCExtendidos.push(elemento);
          }
        });
      });
    }
    esDestacada(noticia: any): boolean {
  
      return noticia.categories.includes(1178);
    }
    getURL(p){
      console.log(p);
  if(p.caption.rendered){
    let limpia =p.caption.rendered.split('<p>')[1];
    return limpia.substring(0,limpia.lastIndexOf('</p>'));
  }else{
    return p.guid.rendered
  }
  
    }
  
}
