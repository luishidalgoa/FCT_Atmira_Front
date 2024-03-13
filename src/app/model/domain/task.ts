import { Colaborator } from "./colaborator";
import { Project } from "./project";
import { TypeOfService } from "../enum/type-of-service";

export interface Task {
    idCode?: string;
    description: string;
    objective: TypeOfService;
    closed: boolean;
    task: Task | null;
    tasks?: Task[];
    ID_Code_Project: string;
    project: Project;
    colaborator?: Colaborator;
}
