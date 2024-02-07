import { Type } from "@angular/core";
import { Colaborator } from "./colaborator";
import { Project } from "./project";
import { TypeOfService } from "../enum/type-of-service";

export interface Task {
    id_code?: number;
    description: string;
    objective: TypeOfService;
    closed: boolean;
    task: number | null;
    ID_Code_Project: number;
    Project: Project;
    Asigned?: Colaborator;
}
