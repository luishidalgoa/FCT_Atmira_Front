import { typeExpense } from "../enum/typeExpense";
import { Colaborator } from "./colaborator";
import { Project } from "./project";

export class Expense {
    public typeExpensive?: typeExpense;
    public ticketId?: number;
    public ticketDate?: Date;
    public createdDate?: Date;
    public cost?: number;
    public description?: string;
    public state: boolean | null = null;
    public project?: Project;
    public colaborator?: Colaborator;
    
    constructor(partial?: Partial<Expense>) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
}
