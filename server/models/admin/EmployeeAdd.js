const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        position: { type: String, required: true },
        accountno: { type: Number, required: true },
        photo: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (v) {
                    return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email!`,
            },
        },
        phone: { type: String, required: true },
        degree: { type: String, default: "" },
        increment: { type: Date },
        joiningdate: { type: Date, required: true },
        experience: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
