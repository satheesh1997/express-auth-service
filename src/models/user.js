const bCrypt = require('bcrypt');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            index: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            validate: {
                validator: v => {
                  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        },
        password: {
            type: String,
            validate: {
                validator: v => {
                    return /^[A-Za-z]\w{7,14}$/.test(v);
                },
                message: () => 'password must be 7 to 15 characters which contain only characters, numeric digits, underscore and first character must be a letter'
            }
        },
        isActive: {
            type: Boolean,
            default: false
        },
        isTrashed: {
            type: Boolean,
            default: false
        },
        trashedOn: {
            type: Date
        },
        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// statics
UserSchema.statics = {
    create: function (data, cb) {
        let user = new this(data);
        user.save(cb);
    },
    findByEmail: function (userEmail, cb) {
        this.findOne({email: userEmail, isTrashed: false}, cb);
    }
}

//methods
UserSchema.methods = {
    updateLastLogin: function (cb) {
        this.lastLogin = new Date();
        this.save(cb);
    },
    toJson: function () {
        let userObj = this.toObject();

        // delete the secret fields
        delete userObj.password;
        return userObj;
    }
}

// plugins
UserSchema.plugin(uniqueValidator);

// signals
UserSchema.pre('save', function(cb) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return cb();

    // generate a salt
    bCrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return cb(err);

        // hash the password using our new salt
        bCrypt.hash(user.password, salt, (err, hash) => {
            if (err) return cb(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            cb();
        });
    });
});

module.exports = mongoose.model('Users', UserSchema);