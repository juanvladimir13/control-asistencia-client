export interface IPlanilla {
  pk?: number;
  descripcion: string;
  ubicacion: string;
  fecha: string;
  hora_ingreso: string;
  hora_salida: string;
  min_tolerancia: number;
}

export interface ITutor {
  pk?: number;
  nombres: string;
  apellidos: string;
}

export interface IPersona {
  pk?: number;
  nombres: string;
  apellidos: string;
  hora_ingreso: string;
  hora_salida: string;
}