export interface IWriter<Insert, Update, Select, ID = string> {
    create(data: Insert): Promise<Select | undefined>;
    update(id: ID, data: Update): Promise<Select | undefined>;
    delete(id: ID): Promise<boolean | undefined>;
}
export interface IReader<Select, ID = string> {
    findById(id: ID): Promise<Select | undefined>;
    findAll(): Promise<Select[]>;
}
