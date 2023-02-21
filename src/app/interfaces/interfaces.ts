export interface menuOpts {
    icon: string;
    name: string;
    redirectTo: string;
}

export interface DaysConfig {
    date: Date; 
    subTitle: string;
    cssClass: String;
    marked: boolean; 
    disable: true;
}

export interface Apartamento {
    DESCRIPCION: string;
    DIRECCION: string;
    LAT: number;
    LON: number;
    IMG: string;
    ESTADO: string;
    IDKEY: string;
}

export interface Cerradura {
    ACTIVA: boolean;
    CODIGO: string;
}

export interface Alquiler {
    IDPROP: string;
    F_INICIO: Date;
    UID: string;
}
export interface Usuario {
   EMAIL: string;
   ROL: string;
   UID: string;
}
