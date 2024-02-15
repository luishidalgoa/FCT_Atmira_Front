import { Colaborator } from "./colaborator";
import { Project } from "./project";
import { TypeOfService } from "../enum/type-of-service";

export interface Task {
    id_code?: string;
    description: string;
    objective: TypeOfService;
    closed: boolean;
    task: string | null;
    tasks?: Task[];
    ID_Code_Project: number;
    Project: Project;
    Asigned?: Colaborator;
}
