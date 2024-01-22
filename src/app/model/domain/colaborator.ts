import { WorkPlace } from "./work-place";

export interface Colaborator {
    ID_Alias: string;
    WorkPlace: WorkPlace;
    Email: string;
    isActive: boolean;
    relaseDate: Date;
    Hours: number;
    Guards: boolean;
    Expense: boolean;
    Name: string;
    Surname: string;
    Password: string;
    Responsible: boolean;
}
