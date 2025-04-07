class AggregateHelper{
    constructor(req){
        this.reqQuery = req.query;
        this.reqParams = req.params;
        this.pipeline = [];
    }


    paramsMatchStage(){
        console.log(this.reqParams)
        if(this.reqParams.rollNumber){
            console.log('parma executed')
            this.pipeline.push(
                {
                    $match: {
                        'userDetails.rollNumber': this.reqParams.rollNumber
                    }
                }
            )
        }
        
       if(this.reqParams.name){
        console.log('name got exec')
            this.pipeline.push(
                {
                    $match: {
                        'userDetails.name': this.reqParams.name
                    }
                }
            )
        }
        console.log('parmas not get executed')

        return this
    }

    paginateStage(){
        const limit = +this.reqQuery.limit || 10;
        const page = +this.reqQuery.page || 1;
        const skip = (+page -1 ) * limit;

        this.pipeline.push({$skip: skip})
        this.pipeline.push({$limit: limit})
        console.log(this.pipeline)

        return this;
    }

    objectBuilder(queryField, separator){
        const queryArray = queryField.split(separator)
        const obj = queryArray.reduce((acc, val)=>{
            const [key, order] = val.startsWith('-') ? [val.slice(1), 0] : [val, 1]
            acc[key] = order
            return acc  
        }, {})
        console.log(obj)
        return obj
    }

    sortStage(){
        if(this.reqQuery.sort){
            const sortBy = this.objectBuilder(this.reqQuery.sort, ',')

            this.pipeline.push(
                {
                    $sort: sortBy
                }
            )
        }
        console.log(this.pipeline)

        return this;
    }

    lookupStage(from, local , foreign, asWhat){
        this.pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: local,
                    foreignField: foreign,
                    as: asWhat
                }
            }
        )
        return this
    }

    selectStage(){
        if(this.reqQuery.fields){
            const selectBy = this.objectBuilder(this.reqQuery.fields, ',')
            this.pipeline.push(
                {
                    $project: selectBy
                }
            )
        }
        console.log(this.pipeline)
        return this;
    }

}

module.exports = AggregateHelper