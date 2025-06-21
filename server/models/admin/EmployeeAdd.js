const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true }, // <-- your custom ID (e.g., nk001)
        name: { type: String, required: true },
        position: { type: String, required: true },
        accountno: { type: Number, required: true },
        photo: { type: String, required: true },
        email: {
            type: String,
            // required: true,
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
        experience: { type: String },
    },
    { timestamps: true }
);

// Optional: Remove Mongo _id and replace with `id` in JSON responses
EmployeeSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (_, ret) {
        delete ret._id;
    },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
