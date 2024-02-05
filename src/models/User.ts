export interface User{
    _id:       string;
    email:     string;
    doc:       string;
    firstName: string;
    lastName:  string;
    roles:     string[];
    status:    number;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
    tienda:    string;
}