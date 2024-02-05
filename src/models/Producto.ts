import { User } from "./User";

export interface UnidadMedida {
    _id:       string;
    name:      string;
    simbol:    string;
    status:    number;
    author:    string;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
}

export interface Producto {
    _id:           string;
    name:          string;
    codigoBalanza: string;
    unidadMedida:  UnidadMedida;
    precioVenta:   string;
    stock:         string;
    author:        User;
    status:        number;
    createdAt:     Date;
    updatedAt:     Date;
}

