import { Colaborator } from "./colaborator";
import { Task } from "./task";

export interface Project {
    id_code?: number;
    typeOfService: string;
    name: string;
    initialDate: Date;
    endDate: Date;
    active: boolean;
    colaboratorProjects?: Colaborator[],
    expenses?: boolean,
    tasks?: Task[],
}
