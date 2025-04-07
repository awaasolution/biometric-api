class ApiFeature{
    constructor(reqQuery, query){
        this.reqQuery = reqQuery
        this.query = query
    }
    
    filter(){
        this.filteredReqQuery = {...this.reqQuery}
        const excludedFields = ['page','sort', 'limit', 'fields']
        excludedFields.forEach(el=>delete this.filteredReqQuery[el])
        return this
    }

    paginate(){
        const limit = this.reqQuery.limit ? this.reqQuery.limit : 10;
        const page = this.reqQuery.page ? this.reqQuery.page * 1 :  1; 
        const skip = (page -1 ) * limit;

        if(limit || page ){
            this.query = this.query.skip(skip).limit(limit);
        }
        return this
    }

    sortFrApi(){
        if(this.reqQuery.sort){
            console.log(this.reqQuery.sort)
            const sortBy = this.reqQuery.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        }
        return this;
    }

    selectFrApi(){

        if(this.reqQuery.fields){
            const fields = this.reqQuery.fields.split(',').join(' ')
            this.query = this.query.select(fields);
        }
        return this;
    }
    
}

module.exports = ApiFeature