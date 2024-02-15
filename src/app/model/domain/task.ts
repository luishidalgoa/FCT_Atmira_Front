import { TypeOfService } from "../enum/type-of-service";
import { Colaborator } from "./colaborator";
import { Project } from "./project";

export interface Task {
    id_code?: string;
    description: string;
    objective: TypeOfService;
    closed: boolean;
    task: string | null;
    tasks?: Task[];
    ID_Code_Project: number;
    Project: Project;
    Asigned: Colaborator;
}
