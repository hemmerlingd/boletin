import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss'],
})
export class NoticiasComponent {
  noticias: any[] = [];
  eventos: any[] = [];
  cpc: any[] = [];
  CPCExtendidos: any[] = [];
  constructor(public DS: DataService) {
    this.DS.leerNoticias().subscribe((data: any) => {
      this.noticias = data;

         let ordenadasPorDestacadas = this.noticias.sort((a, b) => {
        if (a.categories.includes(1178)&& !b.categories.includes(1178)) {
          return -1; // a va antes que b
        } else if (!a.categories.includes(1178)&& b.categories.includes(1178)) {
          return 1; // b va antes que a
        } else {
          return 0; // mantienen su orden original
        }
      });
      console.log(this.noticias);
    });

    this.DS.LeerActividades().subscribe((data: any) => {
      this.eventos = DS.formatData(data);
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
}
