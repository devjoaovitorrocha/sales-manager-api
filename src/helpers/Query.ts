import mysql from 'mysql2';


class Query{

    async select(columns: Array<string>, table: string, filters?: Array<string>, filtersType?: Array<string>) {
        const column = columns.length > 1 ? columns.join(', ') : columns[0]

        if (filters && filters.length > 1) {
          const filterConditions = filters.map((filter: string, index: number) => {

            const operator = index > 0 && filtersType && filtersType[index - 1] ? filtersType[index - 1] : ''; 

            return `${operator} ${filter}`.trim(); 
          }).join(' ');
      
          return `select ${column} from ${table} where ${filterConditions};`;

        } else if (filters && filters.length === 1) {

          return `select ${column} from ${table} where ${filters[0]};`;
        }
      
        return `select ${column} from ${table};`;
    }

    async insert(table: string, values: object){

        const formatedValues = Object.values(values).map(value => `${typeof(value) == 'string' ? `"${value}"` : value}`).join(',');
        const columns = Object.keys(values).join(', ');


        return `insert into ${table} (${columns}) values (${formatedValues});`
    }

    async update(table: string, updates: { [key: string]: any }, filters: Array<string>, filtersType?: Array<string> ){

      const setClause = Object.entries(updates).map(([column, value]) => `${column} = '${value}'`).join(', ');
    
      let whereClause = '';
      if (filters.length > 1) {
        whereClause = filters.map((filter: string, index: number) => {
          const operator = index > 0 && filtersType && filtersType[index - 1] ? filtersType[index - 1] : '';
          
          return `${operator} ${filter}`.trim();
        }).join(' ');
    
        whereClause = ` where ${whereClause}`;
      } else if (filters && filters.length === 1) {
        whereClause = ` where ${filters[0]}`; 
      }
    
      return `update ${table} set ${setClause}${whereClause};`;
    }
    
}

export default new Query()