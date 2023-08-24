const User = require("../models/user");
const Mentor = require("../models/model_mentor");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, birthDate, email, password, isMentor, isMentee, isAdmin, phone } = req.body;
        
        if (!name && !birthDate && !email && !password) {
            res.status(400).send("Necessario preencher todos os campos!");
        }
        
        const oldUser = await findNonDeletedUserByEmail(email);
        let user;
        if (oldUser) {
            if ((oldUser.isMentor && isMentor) || (oldUser.isMentee && isMentee)) {
                res.status(409).send("Usuario já existe!");
            }
            user = oldUser;
        } else {
            const encryptedPassword = await bycrypt.hash(password, 10);
            
            user = await User.create({
                name,
                birthDate,
                email: email.toLowerCase(),
                birthDate: new Date(birthDate),
                password: encryptedPassword,
                isMentor,
                isMentee,
                isAdmin,
                phone,
            });
        }
        
        if (isMentor) {
            const mentor = await Mentor.create({
                user: user._id,
                cargo: req.body.cargo,
                tags: req.body.tags,
            });
            user.mentor = mentor._id;
            user.isMentor = isMentor;
        }
        
        if (isMentee) {
            user.isMentee = isMentee;
        }
        
        if (isAdmin) {
            user.isAdmin = isAdmin;
        }
        
        user.save();
        const birD = formatDate(user.birthDate);
        user = {...user, birthDate: birD };
        
        authUser(user, email, res, 201);
    } catch (err) {
        console.log(err);
    }
};

function formatDate(date) {
    const yyyy = date.getFullYear();
    // JavaScript's getMonth() method returns month from 0 to 11, so we add 1.
        const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
}

exports.login = async (req, res) => {
    try {
        const { email, password, isMentor, isMentee, isAdmin } = req.body;
        if (!(email && password)) {
            res.status(400).send("Todo o login é necessario!");
        }
        
        let user = await findNonDeletedUserByEmail(email);
        
        if (!user) {
            res.status(404).send("User not found!");
        }
        
        if (user && (await bycrypt.compare(password, user.password))) {
            if (isMentor && user) {
                user = await findMentorByEmail(email);
            }
            if (
                (user.isMentor && isMentor) ||
                (user.isMentee && isMentee) ||
                (user.isAdmin && isAdmin)
            ) {
                authUser(user, email, res, 200);
            } else {
                res.status(401).send("Não possui a role!");
            }
        } else {
            res.status(400).send("Credenciais invalidas!");
        }
    } catch (err) {
        console.log(err);
    }
};

exports.delete = async (req, res) => {
    const { id } = req.body;
    const user = await findNonDeletedUserById(id);
    if (user) {
        user.isDeleted = true;
        user.save();
        res.status(200).send();
    } else {
        res.status(404).send("User Not Found!");
    }
};

exports.findAll = (req, res) => {
    findAllUsers()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: err.message || "Erro ocorreu durante fetch!" });
        });
};

exports.update = async (req, res) => {
    console.log('DBG5', req.body);
    const { email, name, birthDate, mentor, phone } = req.body;
    let user = await User.findOne({ email, isDeleted: { $ne: true } })
        .populate("mentor")
        .exec();
    
    if (!user) {
        res.status(404).send("User not found!");
    } else {
        user.name = name;
        user.email = email;
        user.birthDate = new Date(birthDate);
        user.phone = phone;
        if (user.isMentor) {
            user.mentor.cargo = mentor.cargo;
            user.mentor.tags = mentor.tags;
            await user.mentor.save();
        }
        await user.save();
        const birD = formatDate(user.birthDate);
        const res_user = {};
        for (const key of Object.keys(req.body)) {
            console.log('prop: ', key, '=', user[key]);
            res_user[key] = user[key];
        }
        res_user.birthDate = birD;
        console.log(res_user);
        res.status(200).json(res_user);
    }
};

// Foi necessario o uso de !=true ao invés ==false pois o mongoose aparentemente não salva os default nas tabelas
async function findNonDeletedUserByEmail(email) {
    return await User.findOne({ email, isDeleted: { $ne: true } });
}
async function findNonDeletedUserById(_id) {
    return await User.findOne({ _id, isDeleted: { $ne: true } });
}
async function findAllUsers() {
    return await User.find({ isDeleted: { $ne: true } });
}

async function findMentorByEmail(email) {
    return await User.findOne({ email, isDeleted: { $ne: true } })
        .populate("mentor")
        .exec();
}

function authUser(user, email, res, status) {
    const token = jwt.sign({ user_id: user._id, email }, "secret_key", {
        expiresIn: "2h",
    });

    user.token = token;
    user.birthDate = formatDate(new Date(user.birthDate));

    res.status(status).json(user);
}
