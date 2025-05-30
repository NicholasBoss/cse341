
const { body, validationResult } = require('express-validator')
const validate = {}

validate.contactValidationRules = () => {
    console.log('Validating contact data');
    return [
        body('firstName')
        .notEmpty().withMessage('First name is required'),
        body('lastName')
        .notEmpty().withMessage('Last name is required'),
        body('email')
        .isEmail().withMessage('Invalid email address'),
        body('favoriteColor')
        .notEmpty().withMessage('Favorite color is required')
        .isLength({ max: 20 }).withMessage('Favorite color must be less than 20 characters'),
        body('birthday')
        .matches(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/).withMessage('Birthday must be in YYYY-MM-DD format')
        .isDate().withMessage('Invalid birthday date')
        .custom((value) => {
            const today = new Date();
            const birthday = new Date(value);
            if (birthday > today) {
                throw new Error('Birthday cannot be in the future');
            }
            return true;
        })
    ]
}

validate.validateContact = () => {
    return [
        ...validate.contactValidationRules(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ];
};

module.exports = validate;