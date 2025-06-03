 export class Actividad {
    id_evento:number;
    fecha_ini:Date;
    hora_ini?:Date;
    fecha_fin?:Date;
    hora_fin?:Date;
    nombre:string;
    tipo:any[];
    descripcion?:string;
    lugar:string;
    organizador:string;
    inscripcion:string;
    precio?:string;
    activo:boolean;
    permanente?:number;
    horapermanente?:string;
    imagen?:string;
}