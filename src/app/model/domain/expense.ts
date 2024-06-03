import { typeExpense } from "../enum/typeExpense";
import { Colaborator } from "./colaborator";
import { Project } from "./project";
export class Expense {
    private ticketId?: number;
    private ticketDate?: Date;
    private createdDate?: Date;
    private cost!: number;
    private description!: string;
    private state!: boolean;
    private project!: Project;
    private colaborator!: Colaborator;
    private typeExpense!: typeExpense;
    
    constructor(partial?: Partial<Expense>) {
        Object.assign(this, partial);
    }

    get getTicketId(): number | undefined {
        return this.ticketId;
    }

    set setTicketId(ticketId: number) {
        this.ticketId = ticketId;
    }

    get getTicketDate(): Date | undefined {
        return this.ticketDate;
    }

    set setTicketDate(ticketDate: Date) {
        this.ticketDate = ticketDate;
    }

    get getCreatedDate(): Date | undefined {
        return this.createdDate;
    }

    set setCreatedDate(createdDate: Date) {
        this.createdDate = createdDate;
    }

    get getCost(): number {
        return this.cost;
    }

    set setCost(cost: number) {
        this.cost = cost;
    }

    get getDescription(): string {
        return this.description;
    }

    set setDescription(description: string) {
        this.description = description;
    }

    get getState(): boolean {
        return this.state;
    }

    set setState(state: boolean) {
        this.state = state;
    }

    get getProject(): Project {
        return this.project;
    }

    set setProject(project: Project) {
        this.project = project;
    }

    get getColaborator(): Colaborator {
        return this.colaborator;
    }

    set setColaborator(colaborator: Colaborator) {
        this.colaborator = colaborator;
    }

    get getTypeExpense(): typeExpense {
        return this.typeExpense;
    }

    set setTypeExpense(typeExpense: typeExpense) {
        this.typeExpense = typeExpense;
    }
}
