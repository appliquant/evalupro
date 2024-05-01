type DataLengthValidations = {
    minlength: number,
    maxlength: number,
    regex?: string
}

const dataLengthValidations: { [key: string]: DataLengthValidations } = {
    email: {
        minlength: 50,
        maxlength: 50,
        regex: "^(?=.*[A-Z])(?=.*\\d)(?=.*[#?!@$%^&*-]).{6,}$"
    },

    password: {
        minlength: 6,
        maxlength: 128
    },

    username: {
        minlength: 3,
        maxlength: 50,
        regex: `^[a-zA-Z- ]+$`
    }
}

export {dataLengthValidations}