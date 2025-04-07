const mongoose = require('mongoose')
const Record = require('../models/recordModel')
const catchAsync = require('../utils/catchAsync')
const ApiFeature = require('../utils/apiFeatures')
const AggregateHelper = require('../utils/aggregationHelper')
const User = require('../models/userModel')

exports.createRecordById = catchAsync(
    async (req, res, next) => {
        const { loggedUserId } = req.params;

        // Get the current local date on the server
        const now = new Date(); // Gets current date and time
        const date = now.toISOString().split("T")[0]; // Formats as YYYY-MM-DD

        // Check if a record with the same user ID and date already exists
        const existingRecord = await Record.findOne({ user: loggedUserId, date });

        if (existingRecord) {
            return res.status(304).json({
                status: "not modified",
                message: "Record already exists for this user on the specified date",
            });
        }

        // Create a new record if none exists
        const recordData = {
            user: loggedUserId,
            status: "present",
            date,
        };

        const newRecord = await Record.create(recordData);

        res.status(200).json({
            status: "success",
            message: "New record created",
            newRecord,
        });
    }
);


exports.getRecordsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const records = await Record.find({ user: userId }, '_id status date'); // Fetch only '_id', 'status', and 'date'
        if (!records || records.length === 0) {
            return res.status(404).json({ message: 'No records found for this user' });
        }
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// get al records in general



exports.getAllRecords = catchAsync(async (req, res, next) => {
    // Fetch users with records, excluding admin users
    const recordedUsers = await Record.distinct('user');

    // Fetch users without records (excluding admin users)
    const usersWithoutRecords = await User.find({
        _id: { $nin: recordedUsers },
        role: { $ne: 'admin' },
    }).lean();

    // Transform users without records
    const currentDate = new Date();
    const usersWithoutRecordsTransformed = usersWithoutRecords.map(user => ({
        _id: user._id,
        status: 'absent', // Default status
        date: currentDate, // Current date
        user: {
            name: user.name,
            rollNumber: user.rollNumber,
            profileImg: user.profileImg || 'defaultProfile.jpg',
        },
    }));

    // Query all records, excluding admin users
    let dbquery = Record.find({}).populate({
        path: 'user',
        match: { role: { $ne: 'admin' } }, // Exclude admin users
        select: 'name rollNumber profileImg',
    });

    const recordsWithPresence = await new ApiFeature(req.query, dbquery)
        .sortFrApi()
        .paginate()
        .selectFrApi()
        .query;

    // Combine both records and usersWithoutRecords
    const records = [
        ...recordsWithPresence.filter(record => record.user), // Ensure populated users are valid
        ...usersWithoutRecordsTransformed,
    ];

    res.status(200).json({
        status: 'success',
        counts: {
            total: records.length,
            withRecords: recordsWithPresence.length,
            withoutRecords: usersWithoutRecordsTransformed.length,
        },
        data: {
            records,
        },
    });
});


//get roll number by pipeline
exports.getAllRecordsByRollNumber = catchAsync(
    async (req, res, next)=>{
                
        const pipeline = new AggregateHelper(req).lookupStage('users', 'user', '_id', 'userDetails').paramsMatchStage().sortStage().selectStage().paginateStage().pipeline;
        const records = await Record.aggregate(pipeline)

        res.status(200).json(
            {
                status: 'success',
                counts: records.length,
                data: {
                    records
                }
            }
        )
    }
)




exports.getAllRecordsByName = catchAsync(
    async (req, res, next)=>{
        
        const pipeline = new AggregateHelper(req).lookupStage('users', 'user', '_id', 'userDetails').paramsMatchStage().pipeline;
        const records = await Record.aggregate(pipeline)

        res.status(200).json(
            {
                status: 'success',
                counts: records.length,
                data: {
                    records
                }
            }
        )
    }
)


exports.getAllRecordsByDate = catchAsync(
    async (req, res, next)=>{
        const pipeline = new AggregateHelper(req).lookupStage().pipeline;
        const records = await Record.aggregate(pipeline)

        res.status(200).json(
            {
                status: 'success',
                counts: records.length,
                data: {
                    records
                }
            }
        )
        
    }
)

// exports.getRecords = catchAsync(
//     async (req, res, next)=>{
//         const pipeline = new AggregateHelper(req).lookupStage('users', 'user', '_id', 'userDetail').matchStage().sortStage().paginateStage().selectStage().pipeline;
//         const records = await Record.aggregate(pipeline)
//         res.status(200).json(
//             {
//                 status: 'success',
//                 count: records.length,
//                 data: {
//                     records
//                 }
//             }
//         )
//     }
// )

// exports.getRecords = catchAsync(
//     async (req, res, next)=>{
//     // const pipeline = new AggregateHelper(req).selectStage().paginateStage().pipeline;

//     const records = await Record.aggregate([
//                   {
//                 $lookup: {
//                     from: 'users',         // The collection you're joining with (in lowercase)
//                     localField: 'user',     // The field in the 'Record' collection
//                     foreignField: '_id',    // The field in the 'User' collection
//                     as: 'userDetails'       // The alias for the populated field
//                 }
//             },
//             {
//                 $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } // Optional: To keep documents without user
//             }
//     ]);


//         res.status(200).json(
//             {
//                 status: 'success',
//                 data: {
//                     records
//                 }
//             }
//         )
//     }
// )


// exports.getAllRecordsByName = const targetYear = 2023; // Replace with the desired year
// const targetMonth = 2;  // Replace with the desired month (1 = January, 2 = February, etc.)
// const targetDate = 15;  // Replace with the desired day

// Record.aggregate([
//   // Add fields for year, month, and day extracted from the date
//   {
//     $addFields: {
//       year: { $year: "$date" },
//       month: { $month: "$date" },
//       day: { $dayOfMonth: "$date" }
//     }
//   },
//   // Match documents with the specific year, month, and day
//   {
//     $match: {
//       year: targetYear,
//       month: targetMonth,
//       day: targetDate
//     }
//   },
//   // Group by the 'status' field (present/absent) and count the number of users
//   {
//     $group: {
//       _id: "$status", // Group by the status (present or absent)
//       count: { $sum: 1 }, // Count the number of users for each status
//       users: { $push: "$user" } // Push user details into an array
//     }
//   },
//   // Project the desired fields (total count, present count, absent count, and user details)
//   {
//     $project: {
//       total: { $sum: ["$count"] }, // Total number of users (present + absent)
//       present: {
//         $cond: {
//           if: { $eq: ["$_id", "present"] },
//           then: "$count",
//           else: 0
//         }
//       },
//       absent: {
//         $cond: {
//           if: { $eq: ["$_id", "absent"] },
//           then: "$count",
//           else: 0
//         }
//       },
//       userDetails: "$users" // Include user details in the result
//     }
//   }
// ])
//   .then(result => {
//     res.status(200).json(
//         {
//             data: {
//                 result
//             }
//         }
//     ) // Result will show total, present, absent counts, and user details
//   })
//   .catch(err => {
//     console.error(err);
//   });

// exports.getRecordByUserId = catchAsync(
//     async (req, res, next)=>{
        
//     }
// )












// apiFeature class implement trace code

        // const queryObj = {...req.query}
        // const excludedFields = ['page','sort', 'limit', 'fields']
        // excludedFields.forEach(el=>delete queryObj[el])


        // const limit = req.query.limit ? req.query.limit : 10;
        // const page = req.query.page ? req.query.page * 1 :  1; 
        // const skip = (page -1 ) * limit;

        // if(req.query.sort){
        //     console.log(req.query.sort)
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     console.log(sortBy)
        //     query = query.sort()
        // }

        // if(limit || page ){
        //     query = query.skip(skip).limit(limit);
        // }

        // if(req.query.fields){
        //     const fields = req.query.fields.split(',').join(' ')
        //     query = query.select(fields);
        // }