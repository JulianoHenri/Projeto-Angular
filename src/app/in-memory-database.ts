import{InMemoryDbService, httpClientInMemBackendServiceFactory} from "angular-in-memory-web-api";
import{Category} from "./pages/categories/shared/category.model"
import { Entry } from './pages/entries/shared/entry.model';


export class InMemoryDatabase implements InMemoryDbService{
 
    createDb(){
        const categories: Category [] = [
            {id: 1, name: "Moradia", description:"Pagamentos de Contas da Casa"},
            {id: 2, name: "Saúde", description:"Plano de Saúde e Remédios"},
            {id: 3, name: "Lazer", description:"Cinema, parques, praia, etc.."},
            {id: 4, name: "Salário", description:"Recebimento do Salário"},
            {id: 5, name: "Freelas", description:"Trabalhos como Frelancer"}
        ];

        const entries: Entry [] = [
            {id: 1, name: "Gas de Cozinha", categoryId: categories[0].id, category: categories[0], paid: true, date:"14/10/2018", amount:"70,80", type: "expense", description:"Qualquer descrição para essa depesa"} as Entry,
            {id: 2, name: "Agua", categoryId: categories[0].id, category: categories[0], paid: false, date:"14/10/2018", amount:"200,50", type: "revenue", description:"Qualquer descrição para essa depesa"} as Entry,
        ];
        return{ categories,entries}
    }
}

