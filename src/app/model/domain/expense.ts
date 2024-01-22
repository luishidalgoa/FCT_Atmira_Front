import { Colaborator } from "./colaborator";
import { Project } from "./project";
import { Task } from "./task";

export interface Expense {
    ID_id: number;
    User: Colaborator;
    Day: number;
    Month: number;
    Year: number;
    Hours: number;
    Project: Project;
    Task: Task;
    Cost: number;
    Description: string;
    State: boolean;
}
