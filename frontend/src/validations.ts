type DataLengthValidations = {
  minlength: number
  maxlength: number
  regex?: string
}

const dataLengthValidations: { [key: string]: DataLengthValidations } = {
  email: {
    minlength: 1,
    maxlength: 50,
    regex:
      '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
  },

  password: {
    minlength: 6,
    maxlength: 128,
    regex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'
  },

  username: {
    minlength: 3,
    maxlength: 50,
    regex: `^[a-zA-Z\\s\\-]+$`
  },

  categoryTitle: {
    minlength: 3,
    maxlength: 25
  },

  productName: {
    minlength: 3,
    maxlength: 25
  },

  productBrand: {
    minlength: 3,
    maxlength: 25
  },

  productDescription: {
    minlength: 3,
    maxlength: 200
  },

  productPrice: {
    minlength: 0,
    maxlength: Number.MAX_SAFE_INTEGER
  }
}

export { dataLengthValidations }
