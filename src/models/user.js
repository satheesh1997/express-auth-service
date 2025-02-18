const bCrypt = require('bcrypt');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First Name field required'],
            trim: true
        },
        lastName: {
            type: String,
            required:  [true, 'Last Name field required'],
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
                    return /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(v);
                },
                message: () => 'Password must be atleast 8 chars in length with at least 1 upper case letter, at least 1 lower case letter, at least 1 number or special character'
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
    activate: function (cb) {
        this.isActive = true;
        this.save(cb);
    },
    updateLastLogin: function (cb) {
        this.lastLogin = new Date();
        this.save({ validateBeforeSave: false }, cb);
    },
    setPassword: function(newPassword, cb) {
        this.password = newPassword;
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
UserSchema.plugin(uniqueValidator, {message : '{PATH} already exists. Try different one.'});

// signals
UserSchema.pre('save', function(cb) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return cb();

    // skip password hash generation for new accounts without password
    if(!user.password && user.isNew){
        return cb();
    }

    // generate salt
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

module.exports = mongoose.model('User', UserSchema);
