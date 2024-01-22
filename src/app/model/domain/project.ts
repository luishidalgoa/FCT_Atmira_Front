import { Colaborator } from "./colaborator";

export interface Project {
    ID_Code: number;
    TypeOfService: string;
    Name: string;
    InitialDate: Date;
    FinalDate: Date;
    isActive: boolean;
    Responsible: Colaborator[];
}
