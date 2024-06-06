import { typeExpense } from "../enum/typeExpense";
import { Colaborator } from "./colaborator";
import { Project } from "./project";
export class Expense {
    public ticketId?: number;
    public ticketDate?: Date;
    public createdDate?: Date;
    public cost?: number;
    public description?: string;
    public state: boolean | null = null;
    public project?: Project;
    public colaborator?: Colaborator;
    public typeExpense?: typeExpense;
    
    constructor(partial?: Partial<Expense>) {
        Object.assign(this, partial);
    }
}
