const mongoose = require('mongoose')

let dietChartSchema = mongoose.Schema({
    weightRange: {
        min: Number,
        max: Number
    },
    // title : String,
    chartDetails: [
        {
            purpose: String,

            meals: [{
                time: String,
                meal: String
            }]
        }

    ]
})

module.exports = mongoose.model('dietChart', dietChartSchema)