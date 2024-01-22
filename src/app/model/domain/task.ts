import { Colaborator } from "./colaborator";
import { Project } from "./project";

export interface Task {
    ID_Code: number;
    Description: string;
    Objetive: string;
    isClosed: boolean;
    Task: Task[];
    ID_Code_Project: number;
    Project: Project;
    Asigned: Colaborator;
}
