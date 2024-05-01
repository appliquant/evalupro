type DataLengthValidations = {
    minlength: number,
    maxlength: number,
    regex?: string
}

const dataLengthValidations: { [key: string]: DataLengthValidations } = {
    email: {
        minlength: 1,
        maxlength: 50,
    },

    password: {
        minlength: 6,
        maxlength: 128,
        regex: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"
    },

    username: {
        minlength: 3,
        maxlength: 50,
        regex: `^[a-zA-Z\\s\\-]+$`
    }
}

export {dataLengthValidations}